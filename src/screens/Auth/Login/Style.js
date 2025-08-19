import { StyleSheet } from "react-native";
import fonts from "../../../helpers/fonts";
import { colors } from "../../../helpers/colors";

const Fonts = fonts
export default styles = StyleSheet.create({
    scene: {
        flex: 1, width: '100%'
    },
    block: {
        flexDirection: 'column', flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.01)'
    },
    blue_desc: {
        fontSize: 17, textAlign: 'center', width: '100%', color: colors.blue, fontFamily: Fonts.medium
    },
    label: {
        fontSize: 28, color: colors.white, fontFamily: Fonts.bold, textAlign: 'center'
    },
    inputWrapper: {
        marginVertical: 5
    },
    inputLabel: {
        fontSize: 13, color: colors.secondaryText, fontFamily: Fonts.medium,marginVertical:5
    },
    input: {
        fontSize: 14,
        borderWidth: 1.5,
        borderColor: '#FF4545',
        borderRadius: 12,
        width: "100%",
        paddingHorizontal: 15,
        marginBottom: 12,
        paddingVertical: 7, fontFamily: Fonts.regular, color: "#000", backgroundColor: "#fff"
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 1,
        shadowColor: '#777',
    },
    btn: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius:8, margin: 'auto', width: '100%',
        marginTop: 30, paddingVertical: 15
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.bold, fontSize: 15
    },


});