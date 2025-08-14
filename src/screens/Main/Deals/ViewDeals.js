import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import styles from './Style.js'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon.js'
import { Picker } from '@react-native-picker/picker'
import Button from '../../../Components/Buttons/Button.js'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker';
import IconButton from '../../../Components/Buttons/IconButton.js'
import IconProvider from '../../../Components/IconProvider/IconProvider.js'
import moment from 'moment'
import StatusBadge from '../../../Components/Statusbadge/StatusBadge.js'
import ActivityTypeIcon from '../../../Components/ActivityIcon/ActivityIcon.js'
import { dealsStore } from '../../../Store/DealStore/deals.js'
import { activityStore } from '../../../Store/ActivityStore/activity.js'
import TimelineCard from '../../../Components/TimelineCard/TimelineCard.js'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Hr from '../../../Components/Hr/Hr'
import { showToast } from '../../../Components/Modal/showToasts.js'
import { leadStore } from '../../../Store/LeadStore/leads.js'
import { authStore } from '../../../Store/AuthStore/auth.js'
import { useTranslation } from 'react-i18next'

const ViewDeals = (props) => {
    const { t } = useTranslation();
    const id = props?.route?.params?.id ?? null;
    const [isLoading, setIsLoading] = useState(false)
    const { changeOwner } = leadStore()
    const [data, setData] = useState()
    const { users } = authStore()
    const [timeline, setTimeline] = useState([])
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const { viewDeals, closeDeals } = dealsStore()
    const { viewActivity } = activityStore()
    const [leadOwner, setLeadOwner] = useState("");
    const [status, setStatus] = useState('Open')

    const fetch = () => {
        setIsLoading(true)
        viewDeals(id)
            .then(res => {
                setIsLoading(false)
                setData(res.data)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }

    const fetchTimeline = () => {
        setIsLoading(true)
        let u = `?related_to_type=Deal&related_to_id=${data?.id}`
        viewActivity(u)
            .then(res => {
                setIsLoading(false)
                setTimeline(res.data)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        if (data) {
            setLeadOwner(data?.ownerId || "");
            setStatus(data?.status || "Open");
            fetchTimeline()
        }
    }, [data])

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');

    const handleDealClose = () => {
        setIsLoading(true)
        closeDeals(data?.id)
            .then(res => {
                setIsLoading(false)
                showToast(t('dealClosedSuccess'))
                fetch()
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                showToast(t('closeDealError'))
            })
    }

    const handleChangeOwner = () => {
        setIsLoading(true)
        let NdATA = { "entity_type": "deal", "entity_id": data?.id, "owner_id": leadOwner }
        changeOwner(NdATA)
            .then(res => {
                setIsLoading(false)
                console.log(res.data);
                showToast(t('ownerChangedSuccess'))
                fetch()
                closePopup()
            })
            .catch(err => {
                setIsLoading(false)
                showToast(t('error'))
                console.log(err);
            })
    }

    const closePopup = () => {
        setModalVisible(false)
    }

    const renderModal = () => (
        <Modal visible={modalVisible} animationType="slide" backdropColor={"rgba(0,0,0,0.01)"}>
            <View style={globalStyle.popup}>
                <View style={[globalStyle.padding, { justifyContent: "flex-end" }]}>
                    {modalType === t("markAsClosed") ? (
                        <>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

                                <Text allowFontScaling={false} style={[globalStyle.popupTitle]}>
                                    {t("markAsClosed")}
                                </Text>

                                <TouchableOpacity
                                    style={globalStyle.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon name="close" size={24} color={color.darkGrey} />
                                </TouchableOpacity>
                            </View>
                            <Hr />
                            <View style={{ height: hp(2) }} />

                            <View style={[globalStyle.picker, { height: hp(6.5) }]}>
                                <Picker
                                    selectedValue={status}
                                    style={[globalStyle.pickerText]}
                                    onValueChange={value => setStatus(value)}
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
                                        handleDealClose()
                                    }} buttonText={t("submit")} />
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"secondary"} onPress={() => setModalVisible(false)} buttonText={t("cancel")} />
                                </View>
                            </View>
                        </>
                    ) : modalType === t("changeOwner") ? (
                        <>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }]}>

                                <Text allowFontScaling={false} style={[globalStyle.popupTitle]} accessible accessibilityLabel={t("changeOwner")}>
                                    {t("changeOwner")}
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
                                    selectedValue={leadOwner}
                                    style={[globalStyle.pickerText]}
                                    onValueChange={value => setLeadOwner(value)}
                                    placeholder={t("selectOwner")}
                                >
                                    <Picker.Item label={t("selectOwner")} value="" />
                                    {users?.map(owner => (
                                        <Picker.Item key={owner?.id} label={owner?.name} value={owner?.id} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={{ height: hp(2) }} />
                            <View style={globalStyle.buttonRow}>
                                <View style={{ width: '49%' }}>
                                    <Button variant={"primary"} onPress={() => {
                                        handleChangeOwner(); setModalVisible(false)
                                    }} buttonText={t("submit")} />
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

    return (<>
        <Header back={true} title={data?.name || t("viewDeal")} />
        <ScreenWrapper>
            <ScrollView>
                <View style={globalStyle.screen}>
                    <IconButton
                        onPress={() => { navigation?.navigate(Routes.AddDeal, { edit: true, data: data }) }}
                        buttonStyle={{ width: '100%', marginBottom: hp(1) }}
                        icon={<IconProvider provider='Feather' name="edit" color={color.screenBg} size={hp(2.5)} />}
                        buttonText={t("editDeal")}
                    />
                    {data?.status !== 'Won' &&
                        <IconButton
                            onPress={() => { setModalType(t("markAsClosed")); setModalVisible(true) }}
                            buttonStyle={{ width: '100%', marginBottom: hp(1), backgroundColor: color?.green }}
                            icon={<IconProvider provider='Feather' name="user-check" color={color.screenBg} size={hp(2.5)} />}
                            buttonText={t("markAsWon")}
                        />
                    }
                    <IconButton
                        onPress={() => { setModalType(t("changeOwner")); setModalVisible(true) }}
                        buttonStyle={{ width: '100%', marginBottom: hp(1), backgroundColor: color?.green }}
                        icon={<IconProvider provider='Feather' name="arrow-right" color={color.screenBg} size={hp(2.5)} />}
                        buttonText={t("changeOwner")}
                    />

                    <View style={[style.card]}>
                        <View>
                            {[
                                { label: t("name"), value: data?.name },
                                { label: t("value"), value: `$${data?.value}` },
                                { label: t("dealStatus"), value: data?.status },
                                { label: t("pipeline"), value: data?.pipeline_value },
                                { label: t("stage"), value: data?.stage_value },
                                { label: t("expectedCloseDate"), value: moment(data?.expectedCloseDate).format('ll') },
                                { label: t("company"), value: data?.companyName },
                                { label: t("relatedTo"), value: data?.relatedEntityName || data?.relatedEntityType },
                                { label: t("product"), value: data?.product_value },
                                { label: t("source"), value: data?.source_value },
                                { label: t("owner"), value: data?.ownerName },
                                { label: t("probability"), value: data?.probability },
                                { label: t("created"), value: moment(data?.created_at).format('lll') },
                            ].map((item, index) => (
                                <View key={index} style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginBottom: hp(0.7) }]}>
                                    <View style={{ width: '40%' }}>
                                        <Text allowFontScaling={false} style={style.breakdownText}>{item.label}:</Text>
                                    </View>
                                    <View style={{ width: '59%' }}>
                                        <Text allowFontScaling={false} style={style.breakdownText}>{item.value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Text allowFontScaling={false} style={[style.timestamp, {}]}>{t("lastUpdated")}: {moment(data?.updated_at).format('lll')}</Text>
                    </View>
                    
                    {/* <View style={[style.card]}>
                        <Text allowFontScaling={false} style={[globalStyle?.textBold]}>{t("lastCommunication")}</Text>
                        <Text allowFontScaling={false} style={[style.timestamp, { fontSize: hp(1.5), marginTop: hp(1) }]}>{t("lastActivity")}: Email on {moment().format('MMM D, YYYY')}</Text>
                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, { justifyContent: 'space-around', marginTop: hp(1) }]}>
                            <View style={{ width: '31%', backgroundColor: "rgba(0, 196, 180, 0.1 )", paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                <IconProvider provider='FontAwesome' name="whatsapp" color={color.green} size={hp(3)} />
                            </View>
                            <View style={{ width: '31%', backgroundColor: color.blueBg, paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                <IconProvider provider='FontAwesome' name="envelope-o" color={color.primary} size={hp(3)} />
                            </View>
                            <View style={{ width: '31%', backgroundColor: "rgba(255, 98, 0, 0.1)", paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                <IconProvider provider='FontAwesome' name="phone" color={color.dangerRed} size={hp(3)} />
                            </View>
                        </View>
                    </View> */}

                    <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t("dealTimeline")}</Text>

                    {timeline?.map((item, index) => (
                        <TimelineCard item={item} key={index} />
                    ))}

                </View>

                {renderModal()}

            </ScrollView>

        </ScreenWrapper>
    </>
    )
}

export default ViewDeals