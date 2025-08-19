import { StyleSheet } from "react-native";
import fonts from "../../../../../helpers/fonts";
import { colors } from "../../../../../helpers/colors";

const Fonts = fonts;
export default styles2 = StyleSheet.create({
    scene: {
        flex: 1, width: '100%'
    },
    block: {
        width: '95%', marginHorizontal: 'auto'
    },
    card: {
        width: '100%', backgroundColor: "#101319", borderRadius: 6, marginBottom: 5, padding: 10, paddingVertical: 5
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: colors.blue2,
        marginHorizontal: 8,
    },
    cardLabel: {
        fontSize: 11, color: colors.thirdText, fontFamily: Fonts.regular
    },
    title: {
        fontSize: 15, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },
    title2: {
        fontSize: 13, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },
    cashpotNumber:{ fontSize: 11.5, borderRadius: 100,  backgroundColor: colors.white, color: colors.black, textAlign: 'center', paddingTop: 1,width:'90%' },
    button: {
        width: '23.5%', borderRadius: 4, paddingVertical: 5, borderRadius: 6, marginBottom: '1.5%', marginRight: '1.5%'
    },
    button2: {
        width: '23%', paddingVertical: 7, borderRadius: 2, marginBottom: 10
    },
    inputLabel: {
        fontSize: 12, color: colors.secondaryText, fontFamily: Fonts.regular
    },
    container: {
        padding: 10, paddingHorizontal: 15, marginVertical: 10
    },

    // -----------------------------------------------------------------------------
    numBtn: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 40, borderWidth: 1, borderColor: colors.blue, width: '31%',
        borderRadius: 6, marginBottom: 10
    },
    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',
        paddingVertical: 8
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, width: '100%', borderWidth: 1, borderColor: colors.blue
        , paddingVertical: 8
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
    },

    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 25,
        paddingVertical: 5, borderRadius: 16, marginRight: 10
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 25,
        paddingVertical: 5, borderRadius: 16, marginRight: 10
    },
    btnTextActive: { fontSize: 14, color: "#fff" },
    btnTextInActive: { fontSize: 14, color: colors.white },

    // ---------------------------------------------------------------------------

    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        paddingVertical: '6%',
        borderRadius: 12,
        marginHorizontal: '4%', borderWidth: 1, borderColor: colors.modalBorder
    },
    modalTitle: {
        color: colors.white, fontFamily: Fonts.bold, fontSize: 18
    },
    modalDesc: {
        color: colors.white, fontFamily: Fonts.regular, fontSize: 15, width: '90%', marginHorizontal: 'auto', lineHeight: 24
    },

    // -----------------------------------------------------------------------------

    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.4,
        borderColor: colors.blue,
        width: '100%',
        alignContent: 'center',
        paddingHorizontal: 3,
        marginVertical: 8,
        paddingVertical: 0,
        marginRight: 0, borderRadius: 6
    },
    input: {
        // marginLeft: 10,
        fontSize: 11,
        fontFamily: Fonts.regular, letterSpacing: 0.4,
        color: colors.white, paddingVertical: 0, margin: 'auto'
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        backgroundColor: colors.darkBg,
        alignItems: 'center',
        paddingVertical: 6,
    },

});