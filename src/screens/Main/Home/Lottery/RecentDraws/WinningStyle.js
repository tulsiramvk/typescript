import { StyleSheet } from "react-native";
import fonts from "../../../../../helpers/fonts";
import { colors } from "../../../../../helpers/colors";

const Fonts = fonts;
export default styles = StyleSheet.create({
    scene: {
        flex: 1, width: '100%'
    },
    block: {
        width: '95%', marginHorizontal: 'auto'
    },
    card: {
        width: '100%', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 4, padding: 8,flexDirection:'row',justifyContent:'space-between'
    },
    cardLabel: {
        fontSize: 13, color: "#777", fontFamily: Fonts.medium,textTransform:'capitalize'
    },
    cardLabel2: {
        fontSize: 11, color: "#777", fontFamily: Fonts.medium
    },
    title: {
        fontSize: 15, width: '100%', color: "#111", fontFamily: Fonts.medium
    },
    button: {
        width: '23.5%', borderRadius: 4, paddingVertical: 5, borderRadius: 6, marginBottom: '1.5%', marginRight: '1.5%'
    },
    button2: {
        width: '23%', paddingVertical: 7, borderRadius: 2, marginBottom: 10
    },
    inputLabel: {
        fontSize: 13, color: colors.secondaryText, fontFamily: Fonts.medium
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
        backgroundColor: colors.blue, textAlign: 'center', paddingHorizontal: 10, borderRadius: 4, width: '100%',paddingVertical:5,
    },
    btn3: {
        backgroundColor: colors.blue, textAlign: 'center', paddingHorizontal: 10, borderRadius: 6,paddingVertical:6,
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', paddingHorizontal: 10,paddingVertical:5, borderRadius: 4, width: '100%', borderWidth: 1, borderColor: colors.blue
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

    btnIconOutline: {
        flexDirection: 'row', borderWidth:0.5,borderColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10,alignItems:'center'
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
        color: colors.white, fontFamily: Fonts.bold, fontSize: 16,textAlign:'center'
    },
    modalDesc: {
        color: colors.white, fontFamily: Fonts.medium, fontSize: 15,textAlign:'center',width:'90%',marginHorizontal:'auto',lineHeight:24
    },
    
    
});