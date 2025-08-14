import { StyleSheet } from "react-native";
import { useThemeStore } from "../../../Store/ThemeStore/ThemeStore";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import fonts from "../../../helpers/fonts";

const styles = () => {
    const { color } = useThemeStore();
    return StyleSheet.create({
        activityCard: {
            paddingHorizontal: wp(4), paddingVertical: hp(1.5),boxShadow:"0px 0px 7px 0px rgba(0,0,0,0.2)",marginBottom:hp(2),
            borderRadius:wp(2)
        },
        title:{
            fontSize:hp(1.9),fontFamily:fonts.semiBold,color:color.textDark
        },
        title2:{
            fontSize:hp(1.6),fontFamily:fonts.medium,color:color.textLight
        },
        title3:{
            fontSize:hp(1.8),fontFamily:fonts.semiBold,color:color.textDark
        },
        desc:{
            fontSize:hp(1.7),fontFamily:fonts.medium,color:color.textDark,lineHeight:hp(2.4)
        },
        value:{
            fontSize:hp(1.6),fontFamily:fonts.medium,color:color.textDark
        },
        lable:{
            fontSize:hp(1.4),fontFamily:fonts.medium,color:color.textLight
        },
    });
};

export default styles;