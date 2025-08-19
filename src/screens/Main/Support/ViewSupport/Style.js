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
    titleName: {
        fontSize: 14, color: colors.white, fontFamily: Fonts.medium, marginStart: 5
    },
    desc: {
        fontSize: 13, color: colors.white, fontFamily: Fonts.medium, margin: 5, lineHeight: 18
    },
    time: {
        fontSize: 13, color: colors.secondaryText, fontFamily: Fonts.regular, marginStart: 5
    },
    cardWrapper: {
        width: '80%',marginBottom:15
    },
    fileCard: {
        borderRadius: 4, borderWidth: 0.6, borderColor: colors.blue,marginVertical:8,marginTop:5,padding:5
    },
    card: {
        position:'absolute',backgroundColor:colors.secondaryBg,width:'100%',top:-25,margin:'auto',paddingHorizontal:'3%'
    },
    btnIcon: {
        flexDirection: 'row', backgroundColor: colors.blue, borderRadius: 3, padding: 4, justifyContent: 'center', paddingHorizontal: 10,alignItems:'center'
    },
    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12
    },


});