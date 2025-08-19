import { StyleSheet } from "react-native";
import fonts from "../../../../helpers/fonts";
import { colors } from "../../../../helpers/colors";

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
    cardLabel: {
        fontSize: 11, color: "#777", fontFamily: Fonts.medium
    },

    // --------------------------------------------
    renderContainer: { flexDirection: 'row', marginVertical: 8, justifyContent: 'space-between', alignItems: 'center' },
    renderContainer2: { flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-between' },
    renderContainer3: { borderBottomWidth: 0.5, borderBottomColor: colors.black, paddingBottom: 10 },
    entryStyle: { backgroundColor: colors.blue2, borderRadius: 3, padding: 3, paddingHorizontal: 8 },
    entryStyle2: { fontSize: 11, color: colors.black, fontFamily: Fonts.regular },
    entryStyle3: { backgroundColor: colors.blackBg, borderRadius: 3, padding: 5, paddingHorizontal: 8 },
    entryStyle4: { fontSize: 11, color: colors.black, fontFamily: Fonts.medium },
    entryStyle5: { fontSize: 11, color: colors.black, fontFamily: Fonts.bold },

    betContainer: { borderWidth: 0.5, borderRadius: 8, borderColor: colors.blue, borderStyle: 'dashed', marginBottom: 10, overflow: 'hidden', paddingBottom: 5 },
    deleteWrapper: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 10, paddingVertical: 4 },
    cashpotContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, paddingHorizontal: 10, backgroundColor: colors.blue3 },
    cashpotContainer2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, backgroundColor: colors.blackBg, padding: 6, marginTop: 5, borderRadius: 4 },
    megaContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, paddingHorizontal: 10, backgroundColor: colors.blue4, marginTop: 5 },
    megaContainer2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.23)", padding: 6, marginTop: 5, borderRadius: 4 },
    monstaContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, paddingHorizontal: 10, backgroundColor: colors.blue3, marginTop: 5 },
    monstaContainer2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, backgroundColor: colors.blackBg, padding: 6, marginTop: 5, borderRadius: 4 },

    col1: { width: '13%', borderRightWidth: 0.5, borderRightColor: colors.blue2 },
    col11: { width: '13%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder },
    col111: { width: '12%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder },
    col2: { width: '30%', borderRightWidth: 0.5, borderRightColor: colors.blue2, paddingHorizontal: 8 },
    col22: { width: '30%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder, paddingHorizontal: 6 },
    col222: { width: '30%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder, paddingStart: 8, paddingEnd: 3 },
    col3: { width: '29%', borderRightWidth: 0.5, borderRightColor: colors.blue2, paddingHorizontal: 8 },
    col33: { width: '29%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder, paddingHorizontal: 6 },
    col333: { width: '34%', borderRightWidth: 0.4, borderRightColor: colors.modalBorder, paddingStart: 8, paddingEnd: 3 },
    col4: { width: '28%', paddingHorizontal: 8 },
    col44: { width: '28%', paddingHorizontal: 6 },
    col444: { width: '24%', paddingStart: 8, paddingEnd: 3 },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 4,

        backgroundColor: colors.blue2,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    drawTimeContainer: {
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: colors.blue,
        borderStyle: 'dashed',
        overflow: 'hidden',
        paddingBottom: 5,
        marginBottom: 10,
    },
    drawTimeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        paddingHorizontal: 10,
        backgroundColor: colors.blue3,
    },
    additionalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        paddingHorizontal: 10,
        marginTop: 5,
    },
    //   --------------------------------------
    cardText: { textAlign: 'right', color: colors.white, fontFamily: Fonts.bold, fontSize: 13, marginBottom: 10, width: '90%', marginLeft: 'auto' },
    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 20,
        paddingVertical: 4, borderRadius: 16, marginRight: 10
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 20,
        paddingVertical: 4, borderRadius: 16, marginRight: 10
    },
    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, paddingVertical: 8
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: colors.blue
        , paddingVertical: 8
    },
    btnTextActive: { fontSize: 13, color: "#fff" },
    btnTextInActive: { fontSize: 13, color: colors.white },

    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 13
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center'
    },
    btnIconOutline: {
        flexDirection: 'row', borderWidth: 0.5, borderColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center'
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
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
        zIndex: 100,
    },
});