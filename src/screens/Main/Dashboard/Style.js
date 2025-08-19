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
        fontSize: 16, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },
    card: {
        width: '100%', backgroundColor: "#101319", borderWidth: 0.2, borderColor: colors.blue, borderRadius: 6, marginBottom: 12
    },
    cardLabel: {
        fontSize: 11, color: colors.secondaryText, fontFamily: Fonts.medium
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
    cardText: { textAlign: 'right', color: colors.white, fontFamily: Fonts.medium, fontSize: 11, marginBottom: 10, width: '90%', marginLeft: 'auto' },

    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, margin: 'auto', width: '100%',
        marginTop: 20, paddingVertical: 8
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 8,alignItems:'center'
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
    },


    // -------

    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15,marginBottom:5
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 25,
        paddingVertical: 5, borderRadius: 16, marginRight: 10,paddingBottom:6
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 25,
        paddingVertical: 5, borderRadius: 16, marginRight: 10
    },
    btnTextActive: { fontSize: 13, color: "#fff" },
    btnTextInActive: { fontSize: 13, color: colors.white },

    // ----------------------------

    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        paddingVertical: '6%',
        borderRadius: 12,
        marginHorizontal: '4%', borderWidth: 1, borderColor: colors.modalBorder
    },
    btn3: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',
         paddingVertical: 8
    },
    btn_outline3: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',borderWidth:1,borderColor:colors.blue
        , paddingVertical: 8
    },


});