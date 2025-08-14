import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import styles from './Style'
import Button from '../../../Components/Buttons/Button'
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Hr from '../../../Components/Hr/Hr'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes'
import moment from 'moment'
import { Picker } from '@react-native-picker/picker'
import { showToast } from '../../../Components/Modal/showToasts'
import { dealsStore } from '../../../Store/DealStore/deals'
import { useTranslation } from 'react-i18next'

const DealList = ({ item, handleDelete, handleDealClose, fetch }) => {
    const { t } = useTranslation();
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const navigation = useNavigation()
    const { updateDeals } = dealsStore()
    
    const [status, setStatus] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: item?.name,
        value: item?.value,
        status: item?.status,
        expected_close_date: item?.expectedCloseDate,
        pipeline_id: item?.pipelineId,
        stage_id: item?.stageId,
        company_name: item?.companyName,
        probability: item?.probability,
        related_entity_type: item?.relatedEntityType,
        related_entity_id: item?.relatedEntityId,
        related_entity_name: item?.relatedEntityName,
        product_id: item?.productId,
        product_name: item?.productName,
        source_id: item?.sourceId,
        source_name: item?.sourceName,
        custom_fields: item?.customFields,
    })

    useEffect(() => {
        setFormData({
            ...formData,
            name: item?.name,
            value: item?.value,
            status: item?.status,
            expected_close_date: item?.expectedCloseDate,
            pipeline_id: item?.pipelineId,
            stage_id: item?.stageId,
            company_name: item?.companyName,
            probability: item?.probability,
            related_entity_type: item?.relatedEntityType,
            related_entity_id: item?.relatedEntityId,
            related_entity_name: item?.relatedEntityName,
            product_id: item?.productId,
            product_name: item?.productName,
            source_id: item?.sourceId,
            source_name: item?.sourceName,
            custom_fields: item?.customFields,
        })
    }, [item])

    const handleDealStatus = () => {
        setIsLoading(true)
        updateDeals(formData, item?.id)
            .then(res => {
                fetch()
                showToast(t("success"))
                setModalVisible(false)
            })
            .catch(err => {
                console.log(err);
                showToast(t("error"))
            })
    }

    const renderModal = () => (
        <Modal visible={modalVisible} animationType="slide" backdropColor={"rgba(0,0,0,0.01)"}>
            <View style={globalStyle.popup}>
                <View style={[globalStyle.padding, { justifyContent: "flex-end" }]}>
                    {modalType === t("changeStatus") ? (
                        <>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

                                <Text allowFontScaling={false} style={[globalStyle.popupTitle]}>
                                    {t("changeStatus")}
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

                            <View style={[globalStyle.picker, { height: hp(6.5) }]}>
                                <Picker
                                    selectedValue={formData?.status}
                                    style={[globalStyle.pickerText]}
                                    onValueChange={value => setFormData({...formData,status:value})}
                                    placeholder={t("changeStatus")}
                                >
                                    <Picker.Item label={t("selectStatus")} value="" />
                                    {['Open', 'Negotiation', 'Won', 'Lost'].map(status => (
                                        <Picker.Item key={status} label={t(status.toLowerCase())} value={status} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View style={globalStyle.buttonRow}>
                                <View style={{ width: '49%' }}>
                                    <Button onPress={() => {
                                        handleDealStatus();
                                    }} buttonText={t("submit")} />
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("cancel")} />
                                </View>
                            </View>
                        </>
                    ) : modalType === t("delete") ? (
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
                                {t("deleteDealConfirmation")}
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
                    ) : null}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={style.card}>
            <Text allowFontScaling={false} style={style.dealName}>{item?.name}</Text>
            <Text allowFontScaling={false} style={style.dealLink}>
                {t("linkedTo")} {t(item?.relatedEntityType?.toLowerCase())}
            </Text>
            <View style={{ marginBottom: hp(2) }}>
                <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                    <View style={{ width: '49%' }}>
                        <Text style={[style?.lable]} allowFontScaling={false}>{t("value")}</Text>
                        <Text style={[style?.value, { color: color.green }]} allowFontScaling={false}>{item?.value}</Text>
                    </View>
                    <View style={{ width: '49%' }}>
                        <Text style={[style?.lable]} allowFontScaling={false}>{t("stage")}</Text>
                        <Text style={[style?.value, { color: color.textDark }]} allowFontScaling={false}>{item?.stage_value || '-'}</Text>
                    </View>
                </View>
                <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                    <View style={{ width: '49%' }}>
                        <Text style={[style?.lable]} allowFontScaling={false}>{t("closeDate")}</Text>
                        <Text style={[style?.value]} allowFontScaling={false}>{moment(item?.expectedCloseDate).format('ll')}</Text>
                    </View>
                    <View style={{ width: '49%' }}>
                        <Text style={[style?.lable]} allowFontScaling={false}>{t("owner")}</Text>
                        <Text style={[style?.value]} allowFontScaling={false}>{item?.ownerName}</Text>
                    </View>
                </View>
            </View>
            <Hr />
            <View style={style.cardActions}>
                <TouchableOpacity onPress={() => {
                    setModalType(t("changeStatus"))
                    setModalVisible(true)
                }}>
                    <IconProvider provider='Feather' name="user-check" size={hp(2.5)} color={color.green} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation?.navigate(Routes.ViewDeal, { id: item?.id })
                }}>
                    <IconProvider provider='MaterialIcons' name="visibility" size={hp(2.5)} color={color.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation?.navigate(Routes.AddDeal, { edit: true, data: item })
                }}>
                    <IconProvider provider='MaterialIcons' name="edit" size={hp(2.5)} color={color.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setModalType(t("delete"))
                    setModalVisible(true)
                }}>
                    <IconProvider provider='MaterialIcons' name="delete" size={hp(2.5)} color={color.dangerRed} />
                </TouchableOpacity>
            </View>

            {renderModal()}
        </View>
    )
}

export default DealList