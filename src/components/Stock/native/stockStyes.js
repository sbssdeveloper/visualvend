import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 5,
        borderRadius: 5
    },
    header: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "black"
    },
    editedCell: {
        fontSize: 3,
        height: 30,
        width: 28,
        backgroundColor: "#F2F6FD",
        borderRadius: 3,
        justifyContent: "center",
    },
    listHeader: {
        marginVertical: 3,
        borderRadius: 5, marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2",
        paddingBottom: 20,
        flex: 1,
    },
    rowStyle: {
        backgroundColor: "white",
        borderBottomColor: "#E2E2E2",
        marginTop: 1,
        alignItems: "center",
        justifyContent: "center", flex: 1

    },
    boxUpprLines: {
        backgroundColor: "#E2E2E2",
        height: 1,
        width: "95%",
        top: 10,
        marginHorizontal: 10,
        //  alignSelf: "center",
        marginVertical: 2
    }
});
