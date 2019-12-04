import { StyleSheet } from 'react-native'

const Style = StyleSheet.create({

    Content: {
        flex: 1,
        height: '100%',
        marginTop: 20,
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 5,
        backgroundColor: '#fff',
        position: "relative",
        padding: 20,
    },
    Row: {
        backgroundColor: '#f1f1f1',
        height: 2,
        width: '100%',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
    },
    ViewLogo: {
        height: 150,
        width: 150,
        borderRadius: 100,
        marginBottom: 10,
        backgroundColor: "#111",
        borderRadius: 100,
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        alignSelf: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    TextTCC: {
        fontSize: 45,
        color: '#fff',
    },
    TextInput: {
        height: 30,
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    TextDesc: {
        fontSize: 15,
        marginTop: 5,
        color: '#666'
    },
    ViewSolicitar: {
        marginTop: 10,
        marginBottom: 20,
        height: 50,
        width: 50,
        paddingTop: 10,
        backgroundColor: "#111",
        borderRadius: 100,
        shadowColor: "#000",
        position: "relative",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        alignSelf: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }

})

export default Style