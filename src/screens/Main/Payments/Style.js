import { StyleSheet } from "react-native";
import fonts from "../../../helpers/fonts";
import { colors } from "../../../helpers/colors";

const Fonts = fonts;
export default styles = StyleSheet.create({
    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        paddingVertical: '6%',
        borderRadius: 12,
       borderWidth: 1, borderColor: colors.modalBorder
    },
    modalTitle: {
        color: colors.white, fontFamily: Fonts.bold, fontSize: 20,textAlign:'center'
    },
    modalDesc: {
        color: colors.white, fontFamily: Fonts.regular, fontSize: 15,textAlign:'center',width:'90%',marginHorizontal:'auto',lineHeight:24
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1000
    },
    dropdown: {
        position: 'absolute',
        bottom:'-220%',
        zIndex: 1000,
        right: 0, // Adjust based on your layout
        borderWidth: 0.7, borderColor: colors.blue,
        backgroundColor: colors.darkBg,
        width:'30%',
        borderRadius:4
      },
    dropdownElement: {
        paddingVertical:7,paddingHorizontal:10
      },
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
        width: '100%', backgroundColor: "#101319", borderRadius: 8, marginBottom: 15
    },
    cardLabel: {
        fontSize: 11, color: colors.thirdText, fontFamily: Fonts.medium
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
    cardText: { textAlign: 'right', color: colors.white, fontFamily: Fonts.medium, fontSize: 13, marginBottom: 10, width: '90%', marginLeft: 'auto' },

    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6,
        marginTop: 20, paddingVertical: 8
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 8
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
    },


    // -------

    btnWrapper: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15
    },
    btn: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: colors.blueActive, paddingHorizontal: 22,
        paddingVertical: 6, borderRadius: 16, marginRight: 10,paddingBottom:7
    },
    btn_outline: {
        fontFamily: Fonts.medium, borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent", paddingHorizontal: 25,
        paddingVertical: 6, borderRadius: 16, marginRight: 10,paddingBottom:7
    },
    btn_outline2: {
        borderWidth: 0.5, borderColor: colors.blue, backgroundColor: "transparent",marginEnd:20, textAlign: 'center', padding: 10, borderRadius: 6,  marginTop: 20, paddingVertical: 8
    },
    btnTextActive: { fontSize: 14, color: "#fff" },
    btnTextInActive: { fontSize: 14, color: colors.white },

});