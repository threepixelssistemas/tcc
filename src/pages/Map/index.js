import React, { Component } from 'react'
import { View, Alert, Animated, FlatList, Easing, Image, Text, Dimensions, TouchableOpacity } from 'react-native'
import { VibrancyView } from "@react-native-community/blur";
import MapView, { Marker, Polyline, AnimatedRegion, Polygon, ProviderPropType } from 'react-native-maps'
import Style from './style'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import AsyncStorage from '@react-native-community/async-storage';

import Icons from 'react-native-vector-icons/MaterialIcons'
import Login from '../../components/Login';
import Menu from '../../components/Menu';

import io from 'socket.io-client'

import imageTruck2 from '../../assets/truck2.png'
import getUser from '../../service/Usuario'

import { DEFAULT_URL_SOCKET, DEFAULT_URL, DEFAULT_USER_STRUCT } from '../../config/helper'

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = -27.096848
const LONGITUDE = -52.621541
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

class Map extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modalAnimated: new Animated.Value(height - 80 - getBottomSpace()),
            warningAnimated: new Animated.Value(width),
            notificationAnimated: new Animated.Value(-65),
            boardNotification: "",
            usuario: DEFAULT_USER_STRUCT,
            vehicles: [],
            globalBounds: [],
            selectedVehicle: false,
            warningVehicles: [],
            polyline: false,
            coordinatePolyline: [],
            polylineAnimated: new Animated.Value(-65),
            polygons: [],
            icon: "extension",
            blur: true,
            login: false,
            menu: false
        }

    }

    componentDidMount() {
        this.findUser()
    }

    async findUser() {

        const user = await getUser()
        this.setState({ usuario: user })
        console.log('here')
        console.log(user)

        if (user.id == 0) {
            this.showModal("login")
            return
        }

        this.validateLogin()
    }

    logout = async () => {

        this.hideModal()

        let user = DEFAULT_USER_STRUCT
        await AsyncStorage.setItem('user', JSON.stringify(user))

        this.socket.disconnect()

        setTimeout(() => {

            this.setState({
                usuario: user,
                vehicles: [],
                globalBounds: [],
                selectedVehicle: false,
                warningVehicles: [],
                polyline: false,
                coordinatePolyline: [],
            })

            this.showModal("login")

        }, 1000)

    }

    validateLogin = async () => {

        let { usuario } = this.state

        try {

            let response = await fetch(DEFAULT_URL + 'auth/authenticate', {
                method: 'POST',
                headers: {
                    Accept: 'application/json', 'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: usuario.email,
                    password: usuario.password,
                }),
            });

            let responseJson = await response.json();
            console.log(responseJson)

            if (responseJson.success) {

                let { data } = responseJson

                let user = {
                    id: data.user._id,
                    auth: data.token,
                    name: data.user.name,
                    email: data.user.email,
                    password: usuario.password,
                }

                await AsyncStorage.setItem('user', JSON.stringify(user))
                this.setState({ icon: "find-in-page" })
                this.findLastPositions()
            }

        } catch (error) {
            console.error(error);
        }
    }

    findLastPositions = async () => {

        let { usuario } = this.state

        try {

            let response = await fetch(DEFAULT_URL + 'lastPositions', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + usuario.auth
                }
            });

            let responseJson = await response.json();
            console.log(responseJson)

            if (responseJson.success) {

                var vei = []
                var arrLatng = []
                var arrWarning = []

                responseJson.data.map(function (item, key) {
                    item.coordinate = new AnimatedRegion({
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.lng),
                        latitudeDelta: 0,
                        longitudeDelta: 0,
                    })

                    arrLatng.push({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lng) })

                    if (item.input2 != 1) {
                        arrWarning.push(item)
                    }

                    vei.push(item)
                })

                vei.sort((a, b) => a.date.localeCompare(b.date));

                await this.setState({ warningVehicles: arrWarning, globalBounds: arrLatng, icon: "extension", blur: false, vehicles: vei, showVehicles: true })

                this.mapView.fitToCoordinates(arrLatng, {
                    edgePadding: {
                        right: 100,
                        left: 100,
                        top: 100,
                        bottom: 100
                    }
                })

                this.socketConnection()
            }

        } catch (error) {
            console.error(error);
        }

    }

    socketConnection() {

        this.socket = io.connect(DEFAULT_URL_SOCKET, {
            autoConnect: true,
            transports: ['websocket'],
            forceNew: false,
            secure: false
        })

        this.socket.on('connect', msg => {
            console.log('con')
            console.log(msg)
        })

        this.socket.on('connect_error', msg => {
            console.log(msg)
        })

        this.socket.on('disconnect', msg => {
            console.log('dis')
            console.log(msg)
        })

        this.socket.on('updatePosition', position => {

            console.log('new position reciver')
            console.log(position)

            let { vehicles, warningVehicles } = this.state

            var newPos = []
            var k = -1
            var newVei = []
            var arrWarning = []
            var arrLatng = []
            var showNotify = false

            vehicles.map(function (item, key) {

                if (item.tracker == position.tracker) {

                    position.vehicle = item.vehicle
                    k = key
                    position.coordinate = {
                        latitude: parseFloat(position.lat),
                        longitude: parseFloat(position.lng),
                    }

                    newPos[k] = position
                    arrLatng.push({ latitude: parseFloat(position.lat), longitude: parseFloat(position.lng) })

                    // entrou no flag
                    if (position.input2 != 1) {
                        var has = false
                        arrWarning = warningVehicles
                        warningVehicles.map(itemWar => {
                            if (itemWar.tracker == item.tracker) {
                                has = true
                            }
                        })

                        if (!has) {
                            showNotify = true
                            arrWarning.push(position)
                        }
                        // alert
                    }

                    // saiu do flag
                    else if (position.input2 == 1) {
                        warningVehicles.map(itemWar => {
                            if (itemWar.tracker != item.tracker) {
                                arrWarning.push(itemWar)
                            }

                        })
                    }

                } else {
                    newVei.push(item)
                    arrLatng.push({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lng) })
                }

            })

            if (k != -1) {

                if (showNotify) {
                    this.showNotification(newPos[k].vehicle[0].board)
                }

                this.setState({ warningVehicles: arrWarning, globalBounds: arrLatng })

                vehicles[k].coordinate.timing(newPos[k].coordinate).start()

                setTimeout(() => {

                    newPos[k].coordinate = new AnimatedRegion({
                        latitude: parseFloat(newPos[k].lat),
                        longitude: parseFloat(newPos[k].lng),
                        latitudeDelta: 0,
                        longitudeDelta: 0,
                    })

                    newVei.push(newPos[k])
                    //newVei.sort((a, b) => a.date.localeCompare(b.date));

                    this.setState({
                        vehicles: newVei
                    })

                }, 1000)

            }

        })

    }

    findRoute = async () => {

        let { usuario, selectedVehicle, polylineAnimated } = this.state

        try {

            let response = await fetch(DEFAULT_URL + 'positions/' + selectedVehicle.tracker, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + usuario.auth
                }
            });

            let responseJson = await response.json();
            console.log(responseJson)

            if (responseJson.success) {

                this.hideModal()

                Animated.timing(
                    polylineAnimated,
                    {
                        toValue: 40,
                        duration: 300,
                        easing: Easing.linear
                    }
                ).start()

                var arrLatng = []
                responseJson.data.map(function (item, key) {
                    arrLatng.push({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lng) })
                })

                this.mapView.fitToCoordinates(arrLatng, {
                    edgePadding: {
                        right: 100,
                        left: 100,
                        top: 100,
                        bottom: 100
                    }
                })

                this.setState({
                    polyline: true,
                    coordinatePolyline: arrLatng
                })
            }

        } catch (error) {
            console.error(error);
        }

    }

    findCercas = async () => {

        let { polygons, globalBounds } = this.state

        if (polygons.length > 0) {

            this.mapView.fitToCoordinates(globalBounds, {
                edgePadding: {
                    right: 100,
                    left: 100,
                    top: 100,
                    bottom: 100
                }
            })

            this.setState({
                polygons: [],
            })

            this.hideModal()

            return;
        }

        this.hideModal()

        try {

            this.setState({ blur: true })

            let url = 'android_app/mekablock/cerca_virtual.php?id_usuario=1&cliente=1'
            // console.error(url)

            let response = await fetch("https://threepixels.com.br/octsat/" + url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json', 'Content-Type': 'application/json',
                },
            });

            let responseJson = await response.json();
            this.setState({ blur: false })

            if (responseJson.json.length > 0) {

                var aux = []
                var arrAll = []
                var i = 0;
                responseJson.json.map(item => {

                    var arrLatng = []
                    item.coordenadas.map(coord => {
                        arrLatng.push({ latitude: parseFloat(coord.latitude), longitude: parseFloat(coord.longitude) })
                        arrAll.push({ latitude: parseFloat(coord.latitude), longitude: parseFloat(coord.longitude) })
                    })

                    var polygon = {
                        coordinates: arrLatng,
                        name: item.nome,
                        id: i
                    }

                    aux.push(polygon)
                    i++;
                })

                this.mapView.fitToCoordinates(arrAll, {
                    edgePadding: { right: 100, left: 100, top: 100, bottom: 100 }
                })

                this.setState({
                    polygons: aux,
                })

                return
            }

        } catch (error) {
            console.error(error);
        }

    }

    markerClick = (marker) => {

        let { selectedVehicle, globalBounds } = this.state

        console.log(marker)
        console.log(selectedVehicle)

        if (selectedVehicle == marker) {

            this.mapView.fitToCoordinates(globalBounds, {
                edgePadding: {
                    right: 100,
                    left: 100,
                    top: 100,
                    bottom: 100
                }
            })

            this.setState({ selectedVehicle: false })
            return
        }

        this.mapView.fitToCoordinates([{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.lng) }], {
            edgePadding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
            }
        })

        this.setState({ selectedVehicle: marker })

    }

    renderWarningVehicles = ({ item }) => (
        <TouchableOpacity key={item._id} onPress={() => {
            this.hideWarningVehicle()
            this.markerClick(item)
        }}>
            <View style={Style.ViewInWarning} >
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 15 }}>{item.vehicle[0].board}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    showWarningVehicle = () => {

        const { warningAnimated } = this.state

        Animated.timing(
            warningAnimated,
            {
                toValue: 10,
                duration: 300,
                easing: Easing.linear
            }
        ).start()

        setTimeout(() => {
            this.setState({
                warningAnimated: new Animated.Value(10)
            })
        }, 300)

    }

    hideWarningVehicle = () => {

        const { warningAnimated } = this.state

        Animated.timing(
            warningAnimated,
            {
                toValue: width,
                duration: 300,
                easing: Easing.linear
            }
        ).start()

        setTimeout(() => {
            this.setState({
                warningAnimated: new Animated.Value(width)
            })
        }, 300)

    }

    showNotification = (board) => {

        this.setState({
            boardNotification: board
        })

        const { notificationAnimated } = this.state
        Animated.timing(
            notificationAnimated,
            {
                toValue: 40,
                duration: 300,
                easing: Easing.linear
            }
        ).start()
    }

    hideNotification() {

        const { notificationAnimated } = this.state
        Animated.timing(
            notificationAnimated,
            {
                toValue: -65,
                duration: 300,
                easing: Easing.linear
            }
        ).start()

    }

    hidePolyline() {

        const { polylineAnimated, selectedVehicle } = this.state
        Animated.timing(
            polylineAnimated,
            {
                toValue: -65,
                duration: 300,
                easing: Easing.linear
            }
        ).start()

        setTimeout(() => {

            this.mapView.fitToCoordinates([{ latitude: parseFloat(selectedVehicle.lat), longitude: parseFloat(selectedVehicle.lng) }], {
                edgePadding: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50,
                }
            })

            this.setState({
                polyline: false,
                coordinatePolyline: [],
            })

        }, 300)

    }

    hideModal = () => {

        const { modalAnimated } = this.state
        Animated.timing(
            modalAnimated,
            {
                toValue: height - 80 - getBottomSpace(),
                duration: 300,
                easing: Easing.linear,
            }
        ).start()

        setTimeout(() => {

            this.setState({
                blur: false,
                login: false,
                menu: false,
                icon: "extension"
            })

        }, 300)

    }

    showModal = (who) => {

        const { modalAnimated } = this.state

        if (who == "login") {
            this.setState({ login: true })
        }

        if (who == "menu") {
            this.setState({ menu: true })
        }

        this.setState({
            blur: true, icon: "play-for-work"
        })

        Animated.timing(
            modalAnimated,
            {
                toValue: 0,
                duration: 300,
                easing: Easing.linear
            }
        ).start()
    }

    modal = () => {

        const { blur } = this.state

        if (!blur) {
            this.showModal("menu")
            return
        }

        this.hideModal()

    }

    render() {

        const { usuario, boardNotification, notificationAnimated, warningAnimated, warningVehicles, selectedVehicle, vehicles, modalAnimated, icon, blur, menu, login } = this.state

        return (

            <View style={Style.Container}>

                <MapView
                    provider={this.props.provider}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }}
                    ref={el => this.mapView = el}>

                    {vehicles.map(marker => (
                        <Marker.Animated
                            key={marker._id}
                            coordinate={marker.coordinate}
                            anchor={{ x: 0.5, y: 0.5 }}
                            onPress={() => this.markerClick(marker)}>
                            <Image source={imageTruck2} style={{ height: 50, width: 20 }} />
                        </Marker.Animated>
                    ))
                    }

                    {this.state.polyline && <Polyline
                        coordinates={this.state.coordinatePolyline}
                        strokeColor="#0A8A05"
                        strokeWidth={6}
                    />}

                    {this.state.polygons.map(p => (

                        <Polygon
                            key={p.id}
                            coordinates={p.coordinates}
                            strokeColor="#b50e0e"
                            strokeWidth={3}
                            fillColor="#DA717F"
                            onPress={() => {
                                Alert.alert("TCC", "Cerca Virtual: " + p.name)
                            }}
                        />
                    ))
                    }

                </MapView>

                {this.state.polyline &&
                    <Animated.View style={{ ...Style.ViewPolyline, top: this.state.polylineAnimated }}>
                        <View>
                            <TouchableOpacity onPress={() => this.hideNotification()} style={{ position: "absolute", left: 5, top: 5, }}>
                                <Icons name="memory" size={40} color="#24A10C" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.hideNotification()} style={{ position: "absolute", left: 55, top: 5, }}>
                                <Icons name="memory" size={40} color="#65a2f4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.hideNotification()} style={{ position: "absolute", left: 105, top: 5, }}>
                                <Icons name="memory" size={40} color="#000000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.hideNotification()} style={{ position: "absolute", left: 155, top: 5, }}>
                                <Icons name="memory" size={40} color="#FF0000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.hidePolyline()} style={{ position: "absolute", right: 5, top: 5, }}>
                                <Icons name="close" size={40} color="#222" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                }

                <Animated.View style={{ ...Style.ViewNotification, top: notificationAnimated }}>
                    <TouchableOpacity onPress={() => this.hideNotification()}>
                        <View>
                            <Text style={Style.TextBoardNotification}>{boardNotification}</Text>
                            <Text style={Style.TextInfoNotification}>Descarte em local não identificado!</Text>
                            <Icons name="close" size={40} color="#222" style={{ position: "absolute", right: 5, top: 5, }} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {selectedVehicle == false &&
                    <>
                        <Animated.View style={{ ...Style.ViewWarningVehicles, left: warningAnimated }}>

                            <FlatList
                                style={{ width: '100%', paddingLeft: 20, paddingRight: 20 }}
                                horizontal={true}
                                data={warningVehicles}
                                renderItem={this.renderWarningVehicles}
                                keyExtractor={item => item._id}
                            />

                        </Animated.View>

                        {warningAnimated._value != 10 &&
                            <TouchableOpacity style={Style.ViewIconNiple}
                                onPress={() => {
                                    if (warningVehicles.length == 0) {
                                        Alert.alert("TCC", "Nenhum veículo com Niple violado.")
                                    } else {
                                        this.showWarningVehicle()
                                    }
                                }}>

                                {warningVehicles.length != 0 &&
                                    <View style={Style.ViewBadge}>
                                        <Text style={Style.TextBadge}>{warningVehicles.length}</Text>
                                    </View>
                                }

                                <Icons name="memory" size={30} color="#222" />

                            </TouchableOpacity>
                        }
                    </>
                }

                {blur && <VibrancyView
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%"
                    }}
                    blurType="light"
                    blurAmount={5}
                />}

                {/* MODAL */}
                <Animated.View style={{ ...Style.ViewModal, marginTop: modalAnimated }}>

                    <View style={Style.ModalInfo}>
                        {login && <Login onPress={() => {
                            this.findUser()
                            this.hideModal()
                        }} />}

                        {menu && <Menu
                            user={this.state.usuario}
                            selectedVehicle={this.state.selectedVehicle}
                            vehicles={this.state.vehicles}
                            onClick={(mark) => {
                                this.markerClick(mark)
                            }}
                            findRoute={() => this.findRoute()}
                            findCercas={() => this.findCercas()}
                            logout={() => this.logout()}
                        />
                        }

                    </View>
                    {usuario.id != 0 && !this.state.polyline &&
                        <TouchableOpacity style={{ ...Style.ViewIconMenu }} onPress={() => this.modal()}>
                            <Icons name={icon} size={30} color="#0A8A05" />
                        </TouchableOpacity>
                    }

                </Animated.View>

            </View>
        )
    }

}

Map.propTypes = {
    provider: ProviderPropType,
};

export default Map
