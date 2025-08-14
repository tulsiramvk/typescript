import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next' // Add this import
import Header from '../../../../Components/Header/Header.js'
import globalStyles from '../../../../helpers/globalStyles.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import TextInputWithIcon from '../../../../Components/Inputs/TextInputIcon.js'
import { Picker } from '@react-native-picker/picker'
import Button from '../../../../Components/Buttons/Button.js'
import { useNavigation } from '@react-navigation/native'
import { useThemeStore } from './../../../../Store/ThemeStore/ThemeStore';
import ScreenWrapper from './../../../../Components/ScreenWrapper/ScreenWrapper';
import IconButton from '../../../../Components/Buttons/IconButton.js'
import moment from 'moment'
import ActivityTypeIcon from '../../../../Components/ActivityIcon/ActivityIcon.js'
import StatusBadge from '../../../../Components/Statusbadge/StatusBadge.js'
import Hr from '../../../../Components/Hr/Hr.js'
import fonts from '../../../../helpers/fonts.js'
import IconProvider from '../../../../Components/IconProvider/IconProvider.js'
import { activityStore } from '../../../../Store/ActivityStore/activity.js'
import { leadStore } from '../../../../Store/LeadStore/leads.js'
import TimelineCard from '../../../../Components/TimelineCard/TimelineCard.js'
import ContactSidePopup from '../../../../Components/SidePopup/ContactSidePopup.js'
import Routes from '../../../../Navigation/Routes.js'

const ContactDetail = (props) => {
    const { t } = useTranslation() // Add this line
    const id = props?.route?.params?.id ?? null;
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const { viewContact } = leadStore()
    const { viewActivity } = activityStore()
    const [data, setData] = useState()
    const [timeline, setTimeline] = useState([])

    const fetch = () => {
        setIsLoading(true)
        viewContact(id)
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
        let u = `?related_to_type=Contact&related_to_id=${id}`
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
            fetchTimeline()
        }
    }, [data])

    const [popup, setPopup] = useState({ type: '', isOpen: false, lead: null });
    const openPopup = (type, lead = null) => setPopup({ type, isOpen: true, lead });
    const closePopup = () => setPopup({ type: '', isOpen: false, lead: null });

    return (<>
        <Header back={true} title={t('contactDetail.title')} />
        <ScreenWrapper>
            <FlatList
                data={[...timeline]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <TimelineCard item={item} />}
                ListHeaderComponent={
                    <>
                        <ContactSidePopup type={popup?.type} isOpen={popup?.isOpen} fetch={fetch} lead={popup?.lead} closePopup={closePopup} />
                        <Text allowFontScaling={false} style={[globalStyle?.leadName]}>{`${data?.firstName} ${data?.lastName}`}</Text>
                        
                        {/* Button Start */}
                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle?.jsb, { marginVertical: hp(1.3) }]}>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={()=>openPopup('edit',data)} buttonText={t('contactDetail.buttons.editContact')} buttonStyle={{ width: '100%' }} />
                            </View>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={()=>openPopup('owner',data)} buttonText={t('contactDetail.buttons.changeOwner')} buttonStyle={{ width: '100%', backgroundColor: color.green }} />
                            </View>
                        </View>

                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle?.jsb]}>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={()=>openPopup('lead',data)} buttonText={t('contactDetail.buttons.convertToLead')} buttonStyle={{ width: '100%', backgroundColor: color.dangerRed }} />
                            </View>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={()=>openPopup('customer',data)} buttonText={t('contactDetail.buttons.convertToAccount')} buttonStyle={{ width: '100%', backgroundColor: color.dangerRed }} />
                            </View>
                        </View>

                        <IconButton onPress={()=>navigation?.navigate(Routes.AddDeal, { edit: false, data: { relatedEntityType: 'Contact', relatedEntityId: data.id } })} buttonText={t('contactDetail.buttons.addDeal')} buttonStyle={{ width: '100%', marginVertical: hp(1.3) }} />
                        {/* Button End */}

                        <View style={[globalStyle.card]}>
                            <Text allowFontScaling={false} style={[globalStyle.cardTitle, { fontSize: hp(1.8), marginBottom: hp(0.8) }]}>{t('contactDetail.contactDetail')}</Text>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('contactDetail.labels.mobile')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.phoneCountryCode ? '+' + data?.phoneCountryCode + ' ' : ''}{data?.phone}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('contactDetail.labels.email')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.email}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('contactDetail.labels.title')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.title || '-'}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('contactDetail.labels.status')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.status}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '100%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('contactDetail.labels.owner')}</Text>
                                    <Text style={[globalStyle.value, { color: color.primary }]} allowFontScaling={false}>{data?.ownerName}</Text>
                                </View>
                            </View>
                            <Text style={[globalStyle.timestamp2, { marginTop: hp(1) }]} allowFontScaling={false}>{t('contactDetail.updatedBy')}: {data?.ownerName}</Text>
                            <Text style={[globalStyle.timestamp2]} allowFontScaling={false}>{t('contactDetail.updatedAt')}: {moment(data?.updatedAt).format("LLL")}</Text>
                        </View>

                        {/* <View style={[globalStyle?.card]}>
                            <Text allowFontScaling={false} style={[globalStyle?.textBold]}>{t('contactDetail.lastCommunication')}</Text>
                            <Text allowFontScaling={false} style={[globalStyle?.timestamp, { fontSize: hp(1.5), marginTop: hp(1) }]}>{t('contactDetail.lastActivity')}: Email on {moment().format("MMM D, YYYY")}</Text>
                            <View style={[globalStyle?.rowFlex, globalStyle?.alc, { justifyContent: 'space-around', marginTop: hp(1) }]}>
                                <View style={{ width: '31%', backgroundColor: "rgba(0, 196, 180, 0.1 )", paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                    <IconProvider provider='FontAwesome' name="whatsapp" color={color.green} size={hp(3)} />
                                </View>
                                <View style={{ width: '31%', backgroundColor: color.blueBg, paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                    <IconProvider provider='FontAwesome' name="envelope-o" color={color.primary} size={hp(2)} />
                                </View>
                                <View style={{ width: '31%', backgroundColor: "rgba(255, 98, 0, 0.1)", paddingHorizontal: '5%', paddingVertical: hp(1.5), alignItems: 'center', borderRadius: wp(3) }}>
                                    <IconProvider provider='FontAwesome' name="phone" color={color.dangerRed} size={hp(2)} />
                                </View>
                            </View>
                        </View> */}

                        <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('contactDetail.profileInteractions')}</Text>
                    </>
                }
                contentContainerStyle={[globalStyle?.screen]}
            />
        </ScreenWrapper>
    </>
    )
}

export default ContactDetail