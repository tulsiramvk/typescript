import { StyleSheet } from "react-native";
import fonts from "../../../helpers/fonts";
import { colors } from "../../../helpers/colors";

const Fonts = fonts;
export default styles = StyleSheet.create({
    scene: {
        flex: 1, width: '100%'
    },
    block: {
        width: '95%', marginHorizontal: 'auto'
    },
    title: {
        fontSize: 16, color: colors.white, fontFamily: Fonts.medium
    },
    card: {
        width: '100%', backgroundColor: "#101319", borderRadius: 5, marginBottom: 15, paddingVertical: 15
    },
    cardLabel: {
        fontSize: 13, color: colors.secondaryText, fontFamily: Fonts.regular
    },
    container: {
        borderWidth: 0.4, borderColor: colors.blue, padding: 10
    },
    block1: {
        width: '100%', transform: [{ rotate: '4deg' }, { rotateX: '0.23rad' }], overflow: 'hidden', position: 'absolute', top: -115, height: '130%'
    },
    block2: {
        width: '60%'
    },
    cardText: { color: colors.white, fontFamily: Fonts.medium, fontSize: 13 },
    inputWrapper: {
        marginVertical: 3, width: '100%'
    },
    inputLabel: {
        fontSize: 13, color: colors.white, fontFamily: Fonts.medium, marginVertical: 3
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

    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',
        paddingVertical: 8
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, paddingVertical: 8, borderWidth: 1, borderColor: colors.blue
    },
    btnIcon: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blue, borderRadius: 3, padding: 6, justifyContent: 'center', paddingHorizontal: 10
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 13
    },

    // --------------------------------------------------------------------------------------------------------------------------------------

    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 25,
        paddingVertical: 4, borderRadius: 16, marginRight: 10
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 25,
        paddingVertical: 4, borderRadius: 16, marginRight: 10
    },
    btnTextActive: { fontSize: 14, color: "#fff" },
    btnTextInActive: { fontSize: 14, color: colors.white },

// -----------------------------------------------
    faqItem: {
        marginBottom: 10,
        backgroundColor:colors.blue4,
        paddingVertical: 10,
        paddingHorizontal:8,
        borderRadius:4
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


});