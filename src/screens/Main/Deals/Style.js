import { StyleSheet } from "react-native";
import { useThemeStore } from "../../../Store/ThemeStore/ThemeStore";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import fonts from "../../../helpers/fonts";

const styles = () => {
    const { color } = useThemeStore();
    return StyleSheet.create({
        card: {
            paddingHorizontal: wp(4), paddingVertical: hp(1.5), boxShadow: "0px 2px 7px 0px rgba(0,0,0,0.3)", marginBottom: hp(2),
            borderRadius: wp(2)
        },
        cardTitle: {
            fontSize: hp(2), fontFamily: fonts.bold, color: color.textDark
        },
        cardValue: {
            fontFamily: fonts.extraBold,
            fontSize: hp(2.5),
            color: '#00C4B4',
            marginVertical: hp(1),
        },
        desc: {
            fontSize: hp(1.7), fontFamily: fonts.medium, color: color.textDark, lineHeight: hp(2.4)
        },
        breakdownText: {
            fontSize: hp(1.6), fontFamily: fonts.medium, color: color.textDark,marginBottom:hp(0.5)
        },
        timestamp: {
            fontSize: hp(1.6), fontFamily: fonts.medium, color: color.textLight,marginBottom:hp(0.5)
        },
        timestamp2: {
            fontSize: hp(1.4), fontFamily: fonts.medium, color: color.textLight,marginBottom:hp(0.5)
        },
        filterToggle: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp(1.5),
        },
        filterToggleText: {
            fontFamily: fonts.semiBold,
            fontSize: hp(1.9),
            color: color.primary,
            marginLeft: wp(3),
        },
        progressBar: {
            flexDirection: 'row',
            height: hp(1),
            borderRadius: wp(1),
            overflow: 'hidden',
            marginBottom: hp(1.5),
        },
        progressSegment: {
            height: '100%',
        },

        value: {
            fontSize: hp(1.6), fontFamily: fonts.medium, marginBottom: hp(0), color: color.textDark
        },
        lable: {
            fontSize: hp(1.4), fontFamily: fonts.medium, color: color.textLight
        },

        dealName: {
            fontFamily: fonts.bold,
            fontSize: hp(1.85),
            color: color.textDark,
            
        },
        dealLink: {
            fontFamily: fonts.medium,
            fontSize: hp(1.6),
            color: color.primary,
            
        },
        
        cardActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(2),
        },
        bulkActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderColor: '#D3D8DE',
            position: 'absolute',
            bottom: 0,
            width: '100%',
        },
        bulkButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        bulkButtonText: {
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
            color: '#FFFFFF',
        },
        bulkDropdown: {
            borderWidth: 1,
            borderColor: '#D3D8DE',
            borderRadius: 8,
            padding: 8,
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
        },
    });
};

export default styles;