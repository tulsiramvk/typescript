import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import styles from './Style'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Hr from '../../../Components/Hr/Hr'
import StatusBadge from '../../../Components/Statusbadge/StatusBadge'
import moment from 'moment'
import Button from '../../../Components/Buttons/Button'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes'
import { useTranslation } from 'react-i18next'

const MeetingList = ({ item, handleDelete }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const globalStyle = globalStyles()
  const { color } = useThemeStore()
  const style = styles()

  const [modalVisible, setModalVisible] = useState(false);

  const renderModal = () => (
    <Modal visible={modalVisible} animationType="slide" backdropColor={"rgba(0,0,0,0.01)"}>
      <View style={globalStyle.popup}>
        <View style={[globalStyle.padding, { justifyContent: "flex-end" }]}>
          <>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

              <Text allowFontScaling={false} style={[globalStyle.popupTitle]} accessible accessibilityLabel={t("delete")}>
                {t("delete")}
              </Text>

              <TouchableOpacity
                style={globalStyle.closeButton}
                onPress={() => setModalVisible(false)}
                accessible
                accessibilityLabel={t("closePopup")}
                accessibilityRole="button"
              >
                <Icon name="close" size={24} color={color.darkGrey} />
              </TouchableOpacity>
            </View>
            <Hr />
            <View style={{ height: hp(2) }} />
            <Text allowFontScaling={false} style={[globalStyle?.textSecondary]}>
              {t("deleteMeetingConfirmation")}
            </Text>
            <View style={{ height: hp(2) }} />
            <View style={globalStyle.buttonRow}>
              <View style={{ width: '49%' }}>
                <Button variant={"danger"} onPress={() => {
                  handleDelete(item?.id); setModalVisible(false)
                }} buttonText={t("delete")} />
              </View>
              <View style={{ width: '49%' }}>
                <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("cancel")} />
              </View>
            </View>
          </>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[style.card, { borderLeftColor: item?.completed ? color.green : color.dangerRed, borderLeftWidth: wp(1) }]}>
      <View style={[globalStyle?.rowFlex, globalStyle.jsb]}>
        <View>
          <Text allowFontScaling={false} style={[style.dealName, { flex: 1, }]}>{item?.subject}</Text>
          <Text allowFontScaling={false} style={style.dealLink}>{item?.notes || '-'}</Text>
        </View>
        <StatusBadge status={item?.completed ? "Completed" : "Pending"} />
      </View>

      <View style={[globalStyle?.rowFlex, globalStyle.alc, { marginTop: hp(1.5) }]}>
        <View style={[globalStyle?.rowFlex, globalStyle.alc, { marginEnd: wp(4) }]}>
          <IconProvider provider='FontAwesome' name={"calendar-o"} color={color.textLight} size={hp(2)} />
          <Text allowFontScaling={false} style={style.dealLink}>{"  "}{moment(item?.date).format('LL')}</Text>
        </View>
        <View style={[globalStyle?.rowFlex, globalStyle.alc]}>
          <IconProvider provider='Feather' name={"clock"} color={color.textLight} size={hp(2)} />
          <Text allowFontScaling={false} style={style.dealLink}>{"  "}{moment(item?.date).format('LT')}</Text>
        </View>
      </View>

      <View style={[globalStyle?.rowFlex, globalStyle.jsb, globalStyle?.alc, { marginTop: hp(1.5) }]}>
        <View style={[globalStyle?.rowFlex, globalStyle?.alc, { width: '60%' }]}>
          <IconProvider name={'user'} provider='FontAwesome' color={color.green} size={hp(2.3)} />
          <Text allowFontScaling={false} style={style.meetingMode}>{" " + item?.userName}</Text>
        </View>

        <View style={[globalStyle?.rowFlex, globalStyle?.alc, { width: '35%', justifyContent: 'flex-end' }]}>
          <TouchableOpacity onPress={() => navigation?.navigate(Routes?.AddMeeting, { data: item, edit: true })} style={[{ marginHorizontal: wp(4) }]}>
            <IconProvider provider='FontAwesome' name={"edit"} size={hp(2.2)} color={color.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setModalVisible(true);
          }}>
            <IconProvider provider='Feather' name={"trash-2"} size={hp(2.2)} color={color.dangerRed} />
          </TouchableOpacity>
        </View>
      </View>

      {renderModal()}
    </View>
  )
}

export default MeetingList