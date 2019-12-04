import { StyleSheet } from 'react-native'

const Style = StyleSheet.create({

    Content: {
        height: 110,
        marginTop: 10,
        width: 80,
        marginRight: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    Image: {
        flex: 3,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
    },
    ViewText: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderTopColor: "#ddd",
        paddingTop: 5
    },
    Text: {
        fontSize: 11.5,
        paddingLeft: 1,
        paddingRight: 1,
        overflow: "hidden",
        color: '#333'
    }

})

export default Style