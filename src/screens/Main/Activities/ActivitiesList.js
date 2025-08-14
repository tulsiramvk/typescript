import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IconButton from '../../../Components/Buttons/IconButton'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import styles from './Style'
import { Avatar } from '@kolking/react-native-avatar'
import ActivityTypeIcon from '../../../Components/ActivityIcon/ActivityIcon'
import moment from 'moment'
import StatusBadge from '../../../Components/Statusbadge/StatusBadge'
import Button from '../../../Components/Buttons/Button'
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Hr from '../../../Components/Hr/Hr'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes'
import { useTranslation } from 'react-i18next'

const ActivitiesList = (props) => {
    const { t } = useTranslation();
    const { item, handleDelete } = props
    const globalStyle = globalStyles()
    const style = styles()
    const { color } = useThemeStore()
    const navigation = useNavigation()

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [formData, setFormData] = useState({
        title: '', lead: '', date: new Date(), time: new Date(), attendees: [], location: '',
        type: 'Site Visit', visitAmount: 0, customFields: {}, attachments: [],
    });

    const renderModal = () => (
        <Modal visible={modalVisible} animationType="slide" backdropColor={"rgba(0,0,0,0.01)"}>
            <View style={globalStyle.popup}>
                <View style={[globalStyle.padding, { justifyContent: "flex-end" }]}>
                    {modalType === 'delete' && (
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
                                {t("deleteActivityConfirmation")}
                            </Text>
                            <View style={{ height: hp(2) }} />
                            <View style={globalStyle.buttonRow}>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"danger"} onPress={() => {
                                        handleDelete(item?.id); setModalVisible(false); setModalType('actions')
                                    }} buttonText={t("delete")} />
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("cancel")} />
                                </View>
                            </View>
                        </>
                    )}
                    {modalType === 'reschedule' && (
                        <>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

                                <Text allowFontScaling={false} style={[globalStyle.popupTitle]} accessible accessibilityLabel={t("editActivity")}>
                                    {t("editActivity")}
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

                            <TouchableOpacity
                                style={[globalStyle.picker, { paddingVertical: hp(1.5) }]}
                                onPress={() => setShowDatePicker(true)}
                                accessible
                                accessibilityLabel={t("datePickerLabel")}
                                accessibilityRole="button"
                            >
                                <Text allowFontScaling={false} style={globalStyle.pickerText}>
                                    {formData?.followUpDate?.toLocaleString('en-IN', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    }) || new Date().toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData?.followUpDate ? new Date(formData?.followUpDate) : new Date()}
                                    mode="date"
                                    onChange={(event, date) => {
                                        if (date === undefined) {
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        if (event.type === 'dismissed') {
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        if (date < new Date()) {
                                            showToast(t("selectValidDate"));
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        date = moment(date).format('YYYY-MM-DD');
                                        setShowDatePicker(false);
                                        setFormData({ ...formData, followUpDate: date });
                                    }}
                                />
                            )}

                            <TouchableOpacity
                                style={[globalStyle.picker, { paddingVertical: hp(1.5) }]}
                                onPress={() => setShowDatePicker(true)}
                                accessible
                                accessibilityLabel={t("timePickerLabel")}
                                accessibilityRole="button"
                            >
                                <Text allowFontScaling={false} style={globalStyle.pickerText}>
                                    {formData?.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData?.followUpDate ? new Date(formData?.followUpDate) : new Date()}
                                    mode="date"
                                    onChange={(event, date) => {
                                        if (date === undefined) {
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        if (event.type === 'dismissed') {
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        if (date < new Date()) {
                                            showToast(t("selectValidDate"));
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        date = moment(date).format('YYYY-MM-DD');
                                        setShowDatePicker(false);
                                        setFormData({ ...formData, followUpDate: date });
                                    }}
                                />
                            )}

                            <TextInputWithIcon
                                placeholder={t("notes")}
                                value={formData.name}
                                onChangeText={text => setFormData({ ...formData, name: text })}
                            />

                            <View style={globalStyle.buttonRow}>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"danger"} onPress={'handleSave'} buttonText={t("save")} />
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("cancel")} />
                                </View>
                            </View>
                        </>
                    )}
                    {modalType === 'actions' && (
                        <>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

                                <Text allowFontScaling={false} style={[globalStyle.popupTitle]} accessible accessibilityLabel={t("activityActions")}>
                                    {t("activityActions")}
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

                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                                navigation?.navigate(Routes?.AddActivity, { data: item, edit: true })
                            }}>
                                <Text allowFontScaling={false} style={globalStyle.actionOption}>{t("edit")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                setModalVisible(false);
                                navigation?.navigate(Routes?.ViewActivity, { data: item })
                            }}>
                                <Text allowFontScaling={false} style={[globalStyle.actionOption, { color: color.green }]}>{t("view")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                setModalType('delete')
                            }}>
                                <Text allowFontScaling={false} style={[globalStyle.actionOption, { color: color.dangerRed }]}>{t("delete")}</Text>
                            </TouchableOpacity>
                            <View style={{ height: hp(2) }} />
                            <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("close")} />
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[style.activityCard]}>
            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, globalStyle?.alc]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <ActivityTypeIcon
                        type={
                            item?.type
                                ? item?.type.charAt(0).toUpperCase() + item?.type.slice(1)
                                : 'Note'
                        }
                    />
                    <View style={{ marginStart: wp(2), flex: 1 }}>
                        <Text allowFontScaling={false} style={style?.title}>
                            {item?.subject}
                        </Text>
                        <Text allowFontScaling={false} style={style?.title2}>
                            {moment(item?.date).format('LL')}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{ paddingHorizontal: wp(2), justifyContent: 'center' }}
                    onPress={() => {
                        setModalType('actions');
                        setModalVisible(true);
                    }}
                >
                    <IconProvider
                        provider="Entypo"
                        name="dots-three-vertical"
                        color={color.textDark}
                        size={hp(2)}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: hp(-1) }}>
                <Text allowFontScaling={false} style={[style?.title3]}>{t(item?.related_to_type?.toLowerCase())}</Text>
                <View style={[globalStyle?.rowFlex, globalStyle.alc, { marginVertical: hp(0.8) }]}>
                    <Avatar
                        size={wp(8)}
                        name={item?.relatedToName || item?.relatedToType}
                        colorize={true}
                        radius={wp(50)}
                    />
                    <Text style={[style?.desc, { marginStart: wp(2) }]} allowFontScaling={false}>{item?.relatedToName || item?.relatedToType}</Text>
                </View>
            </View>
            <View style={{ marginTop: hp(1) }}>
                <Text allowFontScaling={false} style={[style?.title3]}>{t("notes")}</Text>
                <Text allowFontScaling={false} style={[style?.desc]}>{item?.notes || '-'}</Text>
            </View>
            <View style={{ marginTop: hp(2) }}>
                <View style={[globalStyle?.rowFlex, globalStyle?.jsb, globalStyle.alc]}>
                    <StatusBadge status={item?.completed ? "Completed" : "Pending"} />
                    <View style={[globalStyle?.rowFlex, globalStyle.alc, {}]}>
                        <Avatar
                            size={wp(6)}
                            name={item?.userName}
                            colorize={true}
                            radius={wp(50)}
                        />
                        <Text allowFontScaling={false} style={[style?.desc, { marginStart: wp(1), fontSize: hp(1.4) }]}>{item?.userName}</Text>
                    </View>
                </View>
            </View>

            {renderModal()}
        </View>
    )
}

export default ActivitiesList