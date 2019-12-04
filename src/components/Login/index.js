import React, { Component } from 'react'
import { Alert, Animated, Easing, View, Text, TextInput, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage';
import Style from './style'
import { DEFAULT_TITLE, DEFAULT_URL } from '../../config/helper'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: "lock",
            inputEmail: "",
            inputPassword: "",
            spinValue: new Animated.Value(0)
        }
    }

    // BA0BD5

    rotate() {

        const { spinValue, icon } = this.state

        if (icon == "sync") {
            spinValue.setValue(0);
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => this.rotate());
        }

    }

    handlerLogin = async () => {

        const { spinValue, inputEmail, inputPassword } = this.state

        if (inputEmail.trim() == "") {
            Alert.alert(DEFAULT_TITLE, "Por favor, informe seu email.")
            return
        }

        if (inputPassword.trim() == "") {
            Alert.alert(DEFAULT_TITLE, "Por favor, informe sua senha.")
            return
        }

        await this.setState({ icon: "sync" })
        this.rotate()

        try {

            let response = await fetch(DEFAULT_URL + 'auth/authenticate', {
                method: 'POST',
                headers: {
                    Accept: 'application/json', 'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword,
                }),
            });

            let responseJson = await response.json();

            console.log(responseJson)

            if (responseJson.success) {

                await this.setState({ icon: "lock-open" })
                await spinValue.setValue(0);

                let { data } = responseJson

                let user = {
                    id: data.user._id,
                    auth: data.token,
                    name: data.user.name,
                    email: data.user.email,
                    password: inputPassword,
                }

                await AsyncStorage.setItem('user', JSON.stringify(user))
                this.props.onPress()

                return
            }

            this.setState({ icon: "lock" })

            if (responseJson.error == "NoUser") {
                Alert.alert(DEFAULT_TITLE, "Nenhum usuário encontrado.")
                return
            }

            if (responseJson.error == "InvalidPassword") {
                Alert.alert(DEFAULT_TITLE, "Senha incorreta.")
                return
            }

        } catch (error) {
            console.error(error);
        }

    }

    render() {

        let { icon, spinValue, inputEmail, inputPassword } = this.state

        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (

            <View style={Style.Content}>

                <View style={Style.ViewLogo}>
                    <Icons name="local-florist" size={90} color="#0A8A05" />
                </View>

                <View style={Style.Row} />

                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, color: '#000', marginBottom: 5 }}>Bem-vindo.</Text>
                    <Text style={Style.TextWho}>TCC é um sistema de uso exclusivo, é necessária a autenticação.</Text>
                </View>

                <Text style={Style.TextDesc}>Email</Text>
                <TextInput
                    autoCorrect={false}
                    autoFocus={false}
                    keyboardType={"email-address"}
                    style={Style.TextInput}
                    value={inputEmail}
                    onChangeText={(text) => {
                        this.setState(() => {
                            return {
                                inputEmail: text
                            }
                        })
                    }} />

                <View style={Style.Row} />

                <Text style={Style.TextDesc}>Senha</Text>
                <TextInput
                    autoCorrect={false}
                    autoFocus={false}
                    secureTextEntry={true}
                    style={Style.TextInput}
                    value={inputPassword}
                    onChangeText={(text) => {
                        this.setState(() => {
                            return {
                                inputPassword: text
                            }
                        })
                    }} />

                <View style={Style.Row} />

                <Animated.View style={{ ...Style.ViewSolicitar, transform: [{ rotate: spin }] }}>
                    <TouchableOpacity onPress={() => this.handlerLogin()} style={{ flex: 1 }} activeOpacity={0.8}>
                        <Icons name={icon} size={30} color="#0A8A05" />
                    </TouchableOpacity>
                </Animated.View>

            </View >

        )
    }
}


export default Login