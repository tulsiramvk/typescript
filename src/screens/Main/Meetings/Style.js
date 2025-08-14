import { StyleSheet } from "react-native";
import { useThemeStore } from "../../../Store/ThemeStore/ThemeStore";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import fonts from "../../../helpers/fonts";

const styles = () => {
    const { color } = useThemeStore();
    return StyleSheet.create({
        topCard: {
            paddingHorizontal: wp(4), paddingVertical: hp(1.5), boxShadow: "0px 2px 7px 0px rgba(0,0,0,0.2)", marginBottom: hp(2),
            borderRadius: wp(2), width: '49%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
        },
        card: {
            paddingHorizontal: wp(4), paddingVertical: hp(1.5), boxShadow: "0px 2px 7px 0px rgba(0,0,0,0.2)", marginBottom: hp(2),
            borderRadius: wp(2)
        },
        filterToggle: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp(1.5),
        },
        filterToggleText: {
            fontFamily: fonts.semiBold,
            fontSize: hp(1.8),
            color: color.primary,
            marginLeft: wp(3),
        },
        dealName: {
            fontFamily: fonts.bold,
            fontSize: hp(1.8),
            color: color.textDark,
        },
        dealLink: {
            fontFamily: fonts.medium,
            fontSize: hp(1.5),
            color: color.textDark,

        },
        meetingMode: {
            fontSize: hp(1.6), fontFamily: fonts.semiBold, color: color.textDark
        },
        lable: {
            fontSize: hp(1.4), fontFamily: fonts.medium, color: color.textLight
        },

        

    });
};

export default styles;