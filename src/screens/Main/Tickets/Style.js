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
    title2: {
        fontSize: 14, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },
    card: {
        width: '100%', backgroundColor: "#101319", borderRadius: 8, marginBottom: 15
    },
    cardLabel: {
        fontSize: 11, color: colors.thirdText, fontFamily: Fonts.regular
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
    cardText: { textAlign: 'right', color: colors.white, fontFamily: Fonts.regular, fontSize: 13, marginBottom: 10, width: '90%', marginLeft: 'auto' },

    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',
        paddingVertical: 8
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, width: '100%', borderWidth: 1, borderColor: colors.blue
        , paddingVertical: 8
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center'
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
    },

    // -----------------------------------------------------------------------------

    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 20,
        paddingVertical: 7, borderRadius: 16, marginRight: 10, paddingBottom: 8
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 20,
        paddingVertical: 7, borderRadius: 16, marginRight: 10, paddingBottom: 8
    },
    btnTextActive: { fontSize: 13, color: "#fff" },
    btnTextInActive: { fontSize: 13, color: colors.white },

    btnIconOutline: {
        flexDirection: 'row', borderWidth: 0.5, borderColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center'
    },
    // ---------------------------------------------------------------------------

    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        paddingVertical: '6%',
        borderRadius: 12,
        marginHorizontal: '4%', borderWidth: 1, borderColor: colors.modalBorder
    },
    modalTitle: {
        color: colors.white, fontFamily: Fonts.bold, fontSize: 20, textAlign: 'center'
    },
    modalDesc: {
        color: colors.white, fontFamily: Fonts.regular, fontSize: 15, textAlign: 'center', width: '90%', marginHorizontal: 'auto', lineHeight: 24
    },

    fullScreenCamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    camera: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center'
    }


});