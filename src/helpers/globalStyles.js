import { StyleSheet } from "react-native";
import { useThemeStore } from "../Store/ThemeStore/ThemeStore";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import fonts from "./fonts";

const globalStyles = () => {

  const { color } = useThemeStore();

  return StyleSheet.create({
    screen: { paddingHorizontal: wp(4), paddingVertical: hp(2) },
    rowFlex: { flexDirection: 'row', flexWrap: 'wrap' },
    jsb: { justifyContent: 'space-between' },
    alc: { alignItems: 'center' },
    centerItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    activeTab: {
      padding: hp(1.2),
      borderRadius: wp(2),
      backgroundColor: color.primary,
      alignItems: 'center',
    },
    disableTab: {
      padding: hp(1.2),
      borderRadius: wp(2),
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    activeTabTxt: {
      color: "#fff", fontFamily: fonts?.semiBold, fontSize: hp(1.8)
    },
    disaleTabTxt: {
      color: color.textDark, fontFamily: fonts?.semiBold, fontSize: hp(1.8)
    },
    textInput: {
      fontSize: hp(1.8), color: color.textDark, flex: 1, fontFamily: fonts.medium
    },
    // ========Modal csss===========
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      width: '90%',
      height: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      padding: 16,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2D333F',
      marginBottom: 16,
    },

    padding: {
      paddingHorizontal: wp(4), paddingVertical: hp(2)
    },
    popup: {
      flex: 1,
      paddingTop: hp(2),
      backgroundColor: color.screenBg,
      width: wp(100), // 90% width for mobile
      borderTopLeftRadius: hp(4),
      borderTopRightRadius: hp(4),

    },
    popupTitle: {
      fontSize: hp(2),
      fontFamily: fonts.bold,
      color: color.textDark,
    },

    actionOption: {
      fontSize: hp(1.8),
      color: color.primary,
      paddingVertical: hp(1),
      fontFamily: fonts.semiBold
    },
    // ========popup csss===========
    picker: {
      width:'100%',
      borderWidth: wp(0.1),
      borderColor: color.borderColor,
      borderRadius: wp(2),
      paddingHorizontal: '4%',
      marginBottom: hp(1.5),
      paddingVertical: hp(0),
    },
    pickerText: {
      fontSize: hp(1.8), color: color.textDark, flex: 1, fontFamily: fonts.medium
    },
    pickerText: {
      fontSize: hp(1.8), color: color.textDark, flex: 1, fontFamily: fonts.medium
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    checkboxText: {
      fontSize: hp(1.5),
      color: color.textDark,
    },
    // ========Text CSS====
    textRegular: {
      fontSize: hp(1.7), color: color.textDark, fontFamily: fonts.semiBold
    },
    textSecondary: {
      fontSize: hp(1.7), color: color.textLight, fontFamily: fonts.semiBold, lineHeight: hp(2.5)
    },

    // -------------------------------------------------------------------------------------
    textDark: {
      fontSize: hp(1.8), color: color.textDark, fontFamily: fonts.semiBold
    },
    textTitle: {
      fontSize: hp(1.7), color: color.textDark, fontFamily: fonts.bold
    },
    leadName: {
      fontSize: hp(2.2), color: color.textDark, fontFamily: fonts.bold
    },
    
    textDescription: {
      fontSize: hp(1.7), color: color.textDark, fontFamily: fonts.regular
    },

    textBold: {
      fontSize: hp(1.9), color: color.textDark, fontFamily: fonts.bold
    },

    // ------------------------------------------------------------------------------------------------
    // ----------OTP Input Styles-----------------------
    underlineStyleBase: {
      borderRadius: hp(1.3),
      borderWidth: wp(0.3),
      color: color.primary,
      borderBottomWidth: wp(0.3), justifyContent: 'center', alignContent: 'center'
    },
    textInputContainer: {
      // marginHorizontal:wp(0)
    },

    headerWrapper: {
      minHeight: hp(7.5),
      paddingHorizontal: wp(4),
      justifyContent: 'center',
      zIndex: 999,
      backgroundColor: color.screenBg,
      borderBottomColor: color.primary,
      borderBottomWidth: wp(0.1)
    },

    // =============================New==============

    card: {
      paddingHorizontal: wp(4), paddingVertical: hp(1.5), boxShadow: "0px 2px 7px 0px rgba(0,0,0,0.2)", marginBottom: hp(2),
      borderRadius: wp(2)
    },
    cardTitle: {
      fontSize: hp(2.2), fontFamily: fonts.bold, color: color.textDark
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
      fontSize: hp(1.6), fontFamily: fonts.medium, color: color.textDark, marginBottom: hp(0.5)
    },
    timestamp: {
      fontSize: hp(1.6), fontFamily: fonts.medium, color: color.textLight, marginBottom: hp(0.5)
    },
    timestamp2: {
      fontSize: hp(1.5), fontFamily: fonts.medium, color: color.textLight, marginBottom: hp(0.5)
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
      fontSize: hp(1.7), fontFamily: fonts.medium, marginBottom: hp(0), color: color.textDark
    },
    lable: {
      fontSize: hp(1.5), fontFamily: fonts.medium, color: color.textLight
    },

    dealName: {
      fontFamily: fonts.bold,
      fontSize: hp(2),
      color: color.textDark,

    },
    dealLink: {
      fontFamily: fonts.medium,
      fontSize: hp(1.7),
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

export default globalStyles;