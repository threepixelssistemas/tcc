import React, { Component } from 'react'
import { Alert, Animated, Easing, View, Text, TextInput, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'
import Moment from 'moment';

import AsyncStorage from '@react-native-community/async-storage';
import Style from './style'
import { DEFAULT_TITLE, DEFAULT_URL } from '../../config/helper'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Window from '../Window'

class Menu extends Component {

    constructor(props) {

        super(props)
        this.state = {
            positionsView: true,
            profileView: false,
        }
    }

    componentDidMount() {
        Moment.locale('br');
    }

    menu(who) {

        if (who == "posicoes") {
            this.state = {
                positionsView: true,
                profileView: false,
            }
        }
        else if (who == "historico") {

            if (this.props.selectedVehicle == false) {
                Alert.alert("TCC", "Selecione um veículo para gerar seu histórico de posições")
                return
            }
            this.props.findRoute()
        }
        else if (who == "cercas") {
            this.props.findCercas()
        }
        else if (who == "logout") {
            this.props.logout()
        }

    }

    renderInfoPostitions = ({ item }) => (
        <TouchableOpacity key={item._id} onPress={() => this.props.onClick(item)}>

            {this.props.selectedVehicle == false &&
                <View style={Style.ViewInfo}>

                    <View style={Style.ViewCardDate}>
                        <Text style={Style.TextInfoCardDate}>{Moment(item.date).format('DD/MM/YYYY hh:mm:ss')}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="business" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].client}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="local-shipping" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].board}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="track-changes" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.tracker}</Text>
                    </View>

                    <View style={Style.ViewCardKey}>
                        <Icons name="vpn-key" color={item.ignition == 0 ? "#FF0000" : "#24A10C"} size={20} />
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="slow-motion-video" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.speed} Km/h</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="memory" color="#555" size={20} />
                        {item.input2 == 0 && <Text style={Style.TextWarningCard}>Violado</Text>}
                        {item.input2 == 1 && item.input1 == 1 && <Text style={Style.TextInfoCard}>Carregando</Text>}
                        {item.input2 == 1 && item.input3 == 1 && <Text style={Style.TextInfoCard}>Descarregando</Text>}
                        {item.input2 == 1 && item.input1 == 0 && item.input3 == 0 && <Text style={Style.TextInfoCard}>Fechado</Text>}
                    </View>

                </View>
            }

            {this.props.selectedVehicle == item &&

                <View style={Style.ViewInfo}>

                    <View style={Style.ViewCardDate}>
                        <Text style={Style.TextInfoCardDate}>{Moment(item.date).format('DD/MM/YYYY hh:mm:ss')}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="business" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].client}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="local-shipping" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].board}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="track-changes" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.tracker}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="dashboard" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].mark}/{item.vehicle[0].model}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="date-range" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].year}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="color-lens" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.vehicle[0].color.toUpperCase()}</Text>
                    </View>

                    <View style={Style.ViewCardKey}>
                        <Icons name="vpn-key" color={item.ignition == 0 ? "#FF0000" : "#24A10C"} size={20} />
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="slow-motion-video" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.speed} Km/h</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="memory" color="#555" size={20} />
                        {item.input2 == 0 && <Text style={Style.TextWarningCard}>Violado</Text>}
                        {item.input2 == 1 && item.input1 == 1 && <Text style={Style.TextInfoCard}>Carregando</Text>}
                        {item.input2 == 1 && item.input3 == 1 && <Text style={Style.TextInfoCard}>Descarregando</Text>}
                        {item.input2 == 1 && item.input1 == 0 && item.input3 == 0 && <Text style={Style.TextInfoCard}>Fechado</Text>}
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="dialpad" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.hodometer} Km</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="perm-scan-wifi" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.panic == 1 ? "Ativo" : "Inativo"}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="signal-cellular-4-bar" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.gps_signal == 1 ? "GRPS" : "Sem sinal"}</Text>
                    </View>

                    <View style={Style.ViewCard}>
                        <Icons name="signal-cellular-off" color="#555" size={20} />
                        <Text style={Style.TextInfoCard}>{item.gps_jamming == 1 ? "Detectado" : "Não detectado"}</Text>
                    </View>

                </View>

            }

        </TouchableOpacity>
    )

    render() {

        let { user, vehicles } = this.props
        let { positionsView, profileView } = this.state

        return (

            <View style={Style.Content}>

                <View style={Style.Row} />

                {positionsView &&
                    <>
                        <Text style={Style.TextDesc}>Posições</Text>
                        <View style={{ flex: 3, paddingLeft: 10, paddingTop: 5, paddingRight: 10 }}>
                            <FlatList
                                data={vehicles}
                                keyExtractor={item => item._id}
                                renderItem={this.renderInfoPostitions}
                            />
                        </View>
                    </>
                }

                <View style={{ flex: 1 }}>

                    <View style={Style.Row} />
                    <Text style={Style.TextDesc}>Menu</Text>

                    <View style={Style.ViewServicos}>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingLeft: 5, marginBottom: 5 }}>

                            <Window nameIcon="gps-fixed" nameText="Posições" onPress={() => {
                                this.menu("posicoes")
                            }} />

                            <Window nameIcon="directions" nameText="Histórico de posições" onPress={() => {
                                this.menu("historico")
                            }} />

                            <Window nameIcon="import-contacts" nameText="Relatórios" />
                            <Window nameIcon="layers" nameText="Cercas virtuais" onPress={() => {
                                this.menu("cercas")
                            }} />
                            <Window nameIcon="notifications-active" nameText="Notificações" />
                            <Window nameIcon="security" nameText="Política de privacidade" />
                            <Window nameIcon="account-circle" nameText="Perfil" />
                            <Window nameIcon="lock-open" nameText="Logout" onPress={() => {
                                this.menu("logout")
                            }} />
                        </ScrollView>

                    </View>

                </View>

            </View >

        )
    }
}


export default Menu