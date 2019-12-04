import { StyleSheet } from 'react-native'

const Style = StyleSheet.create({

    Content: {
        flex: 1,
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 5,
        backgroundColor: '#F2F2F2',
        position: "relative",
        paddingTop: 40,
    },
    Row: {
        backgroundColor: '#fff',
        height: 2,
        width: '100%',
        borderRadius: 5,
    },
    TextInput: {
        height: 30,
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    TextDesc: {
        color: '#222',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 10
    },
    ViewInfo: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: "#444",
        shadowOffset: {
            width: 0.5,
            height: 1,
        },
        padding: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ViewCard: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingLeft: 3,
        height: 22
    },
    ViewCardDate: {
        height: 25,
    },
    ViewCardKey: {
        position: "absolute",
        right: 10,
        top: 10
    },
    TextInfoCardDate: {
        color: "#111",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 2,
    },
    TextInfoCard: {
        color: "#333",
        fontSize: 13,
        marginLeft: 10,
        marginTop: 2,
    },
    TextWarningCard: {
        color: "#FF0000",
        fontSize: 13,
        marginLeft: 10,
        marginTop: 2,
    },
    ViewItem: {
        position: "relative",
        backgroundColor: "#222",
        justifyContent: "space-between",
        height: 40,
        paddingTop: 7,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        marginTop: -25,
    },
    ViewIcon: {
        width: 40,
        height: 40,
        paddingTop: 7,
        backgroundColor: "#0A8A05",
        borderRadius: 100,
        shadowColor: "#000",
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
    TextItem: {
        color: '#0A8A05',
        fontSize: 15,
        fontWeight: "bold",
        position: "absolute",
        top: 15,
        left: 40
    },
    ViewServicos: {
        height: 175,
        paddingLeft: 5,
        paddingRight: 5
    }
})

export default Style