import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Style from './style'
import Icons from 'react-native-vector-icons/MaterialIcons'

class Window extends Component {
    render() {
        return (
            <TouchableOpacity style={Style.Content} onPress={this.props.onPress}>

                <View style={Style.Image}>
                    <Icons name={this.props.nameIcon} size={50} color="#222" />
                </View>

                <View style={Style.ViewText}>
                    <Text style={Style.Text} numberOfLines={1} ellipsizeMode='tail'> {this.props.nameText}  </Text>
                </View>

            </TouchableOpacity>
        )
    }
}

export default Window