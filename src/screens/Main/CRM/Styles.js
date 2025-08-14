import { StyleSheet } from "react-native";

const COLORS = {
  WHITE: '#FFFFFF',
  GREEN: '#00C4B4',
  BLUE: '#0078D4',
  ORANGE: '#FF6200',
  RED: '#D14343',
  DARK_GRAY: '#2D333F',
  LIGHT_GRAY: '#D3D8DE',
  TABLE_ALT: '#F5F7FA',
};

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.GREEN,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 56,
    padding: 16,
  },
  sidebarItem: {
    paddingVertical: 8,
  },
  sidebarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK_GRAY,
  },
  activeText: {
    color: COLORS.GREEN,
  },
  subMenu: {
    paddingLeft: 16,
  },
  subMenuText: {
    fontSize: 14,
    paddingVertical: 4,
    color: COLORS.DARK_GRAY,
  },
  closeButton: {
    marginBottom: 16,
  },
  mainContent: {
    padding: 16,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.GREEN,
  },
  addButton: {
    backgroundColor: COLORS.ORANGE,
    padding: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    padding: 8,
  },
  picker: {
    width: 150,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: 8,
  },
  pickerText: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
  },
  tableRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  tableRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leadDetails: {
    flex: 1,
  },
  leadName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.DARK_GRAY,
  },
  leadInfo: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  bulkButton: {
    padding: 8,
    borderRadius: 8,
  },
  bulkButtonText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  popup: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  popupContent: {
    gap: 8,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK_GRAY,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkboxText: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
  },
});