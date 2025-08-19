import { StyleSheet } from "react-native";
import fonts from "./fonts";
import { colors } from "./colors";

const Fonts = fonts;

export default globalStyles = StyleSheet.create({
  tableWrapper: { backgroundColor: colors.darkBg, borderTopRightRadius: 8, borderTopLeftRadius: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: colors.headerBlue, padding: 5, borderTopRightRadius: 8, borderTopLeftRadius: 8 },
  headerText: { fontSize: 13, color: colors.thirdText, fontFamily: Fonts.regular, fontWeight: '300', textAlign: 'center' },
  oddRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: colors.oddBlue, padding: 5, marginTop: 5, borderRadius: 4 },
  rowText: { fontSize: 13, color: colors.white, fontFamily: Fonts.medium, fontWeight: '500', textAlign: 'center' },
  evenRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: colors.evenBlue, padding: 5, marginTop: 5, borderRadius: 4 },
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  modalHeaderTitle: { fontSize: 15, color: colors.white, fontFamily: Fonts.bold },
  amountTitle: { fontSize: 25, color: colors.green2, textAlign: 'center', fontFamily: Fonts.black, fontWeight: '900' },
  card: { width: '100%', backgroundColor: "#0A0A0A", borderRadius: 8, borderWidth: 1, borderColor: colors.modalBorder, paddingHorizontal: 8, paddingVertical: 10 },
  textCard: { flexDirection: 'row', alignItems: 'center', margin: 'auto', backgroundColor: colors.blue2, borderRadius: 3, padding: 5, paddingHorizontal: 10 },
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  dropdown: {
    position: 'absolute',
    bottom: '-220%',
    zIndex: 1000,
    right: 0, // Adjust based on your layout
    borderWidth: 0.7, borderColor: colors.blue,
    backgroundColor: colors.darkBg,
    width: '30%',
    borderRadius: 4
  },
  dropdownElement: {
    paddingVertical: 7, paddingHorizontal: 10
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
});

export const darkThemeStyles = {
  container: {
    backgroundColor: colors.darkBg, // Dark background
  },
  headerWrapper: {
    backgroundColor: colors.darkBg, // Dark header background
  },
  monthTitle: {
    color: '#ffffff', // White text for month title
  },
  yearTitle: {
    color: '#ffffff', // White text for year title
  },
  dayLabelsWrapper: {
    backgroundColor: colors.darkBg, // Dark background for day labels
  },
  dayLabel: {
    color: '#ffffff', // White text for day labels
  },
  selectedDayColor: colors.blue, // Accent color for selected day
  selectedDayTextColor: '#ffffff', // White text for selected day
  todayBackgroundColor: '#f9f9f9', // Accent color for today
  todayTextStyle: {
    color: '#000000', // Black text for today
  },
  textStyle: {
    color: '#fff', // White text for days
  },
};