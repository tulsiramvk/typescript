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
        width: '100%', backgroundColor: "#101319", borderRadius: 6, marginBottom: 0
    },
    cardLabel: {
        fontSize: 11, color: colors.thirdText, fontFamily: Fonts.regular
    },
    title: {
        fontSize: 18, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },

});