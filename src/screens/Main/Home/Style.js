import { StyleSheet } from "react-native";
import fonts from "../../../helpers/fonts";
import { colors } from "../../../helpers/colors";

const Fonts = fonts;
export default styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: '130%', // Adjust based on your layout
        left: '-140%', // Adjust based on your layout
        zIndex: 1000, // Ensure it appears above everything
        backgroundColor: colors.darkBg,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: '#000',
        elevation: 5,

        borderWidth: 0.8, borderColor: colors.blue, borderRadius: 6
    },
    dropdownItem: {
        fontSize: 15,
        color: colors.white, fontFamily: Fonts.regular
    },
    qrButton: {
        marginEnd: 20,
        width: 35, // Set width
        height: 35,
        borderRadius: 40, // Rounded corners
        backgroundColor: 'transparent', // Background color of the button
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#f9f9f9', // Shadow color (for iOS)
        shadowOffset: { width: 0, height: 3 }, // Shadow offset (for iOS)
        shadowOpacity: 0.3, // Shadow opacity (for iOS)
        shadowRadius: 4, // Shadow blur radius (for iOS)
        elevation: 12, // Shadow elevation (for Android)
    },

    scene: {
        flex: 1, width: '100%'
    },
    block: {
        width: '95%', marginHorizontal: 'auto'
    },
    title: {
        fontSize: 16, textAlign: 'center', width: '100%', color: colors.white, fontFamily: Fonts.medium
    },
    card: {
        width: '32%'
    },
    cardLabel: {
        fontSize: 11, color: colors.secondaryText, fontFamily: Fonts.medium
    },
    container: {
        borderWidth: 0.5, borderColor: colors.blue, height: 38, flexDirection: 'column', justifyContent: 'center'
    },
    block1: {
        width: '100%', overflow: 'hidden', position: 'absolute', top: '-62%', height: '125%'
    },
    block2: {
        width: '60%', marginLeft: '-10%'
    },
    cardText: { textAlign: 'right', color: colors.white, fontFamily: Fonts.medium, fontSize: 13, marginBottom: 10, width: '90%', marginLeft: 'auto' },

    btn: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 4, margin: 'auto', width: '100%',
        marginTop: 10, paddingVertical: 8
    },
    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 4, paddingVertical: 5
    },
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
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, paddingVertical: 8, borderWidth: 1, borderColor: colors.blue
    },
    entryStyle: { backgroundColor: colors.blue2, borderRadius: 3, padding: 3, paddingHorizontal: 8 },
    // ---------------------------------------------------------------------------

    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        // paddingVertical: '6%',
        borderRadius: 12,
        marginHorizontal: '4%', borderWidth: 1, borderColor: colors.modalBorder
    },
    modalTitle: {
        color: colors.white, fontFamily: Fonts.bold, fontSize: 20, textAlign: 'center'
    },
    modalDesc: {
        color: colors.white, fontFamily: Fonts.regular, fontSize: 15, textAlign: 'center', width: '90%', marginHorizontal: 'auto', lineHeight: 24
    },


});