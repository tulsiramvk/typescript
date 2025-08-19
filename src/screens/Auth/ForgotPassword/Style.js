import { StyleSheet } from "react-native";
import fonts from "../../../helpers/fonts";
import { colors } from "../../../helpers/colors";

const Fonts = fonts
export default styles = StyleSheet.create({
    scene: {
        flex: 1, width: '100%'
    },
    block: {
        flexDirection: 'column', flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.09)'
    },
    blue_desc: {
        fontSize: 15, textAlign: 'center', width: '100%', marginVertical: 15, color: colors.white, fontFamily: Fonts.regular
    },
    label: {
        fontSize: 22, color: colors.white, fontFamily: Fonts.bold, textAlign: 'center'
    },
    inputWrapper: {
        marginVertical: 5
    },
    inputLabel: {
        fontSize: 13, color: colors.secondaryText, fontFamily: Fonts.medium,marginVertical:5
    },
    container: {
        width: '14%',borderWidth: 0.5,
        borderColor: colors.blue,paddingVertical:2
    },
    input: {
        fontSize: 26,
        width: "100%", textAlign: 'center', color: colors.white, fontFamily: Fonts.bold
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
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 8, width: '100%',
        marginTop: 30, paddingVertical: 10, borderWidth: 1, borderColor: colors.blue
    },
    btn_outline: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 8, width: '100%',
        marginTop: 30, paddingVertical: 12, borderWidth: 1, borderColor: colors.blue
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.bold, fontSize: 15
    },


});