import { StyleSheet } from "react-native";
import fonts from "../../../../../helpers/fonts";
import { colors } from "../../../../../helpers/colors";

const Fonts = fonts;
export default styles2 = StyleSheet.create({
    card: {
        width: '100%', backgroundColor: "#101319", borderRadius: 6, marginBottom: 15,padding:10
    },
    cardLabel: {
        fontSize: 11, color: colors.thirdText, fontFamily: Fonts.regular
    },
    title: {
        fontSize: 15, width: '100%', color: colors.white, fontFamily: Fonts.medium
    },

});