import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { use, useEffect, useState } from 'react'
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
import { leadStore } from '../../../../Store/LeadStore/leads.js'
import { activityStore } from '../../../../Store/ActivityStore/activity.js'
import { dealsStore } from '../../../../Store/DealStore/deals.js'
import TimelineCard from '../../../../Components/TimelineCard/TimelineCard.js'
import SidePopup from '../../../../Components/SidePopup/SidePopup.js'
import Routes from '../../../../Navigation/Routes.js'

const LeadDetails = (props) => {
    const { t } = useTranslation() // Add this line
    const id = props?.route?.params?.id ?? null;
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const [data, setData] = useState()
    const { viewLeads } = leadStore()
    const { viewActivity } = activityStore()
    const [timeline, setTimeline] = useState([])
    const [filteredDeals, setFilteredDeals] = useState([])

    const fetch = () => {
        setIsLoading(true)
        viewLeads(id)
            .then(res => {
                setIsLoading(false)
                setData(res.data)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }
    const { getDeals, setDeals, deals } = dealsStore()

    const fetchDeals = () => {
        getDeals()
            .then(res => {
                setDeals(res.data)
            })
            .catch(err => {
                console.log(err);
                showToast('Error in fetching Activity.')
            })
    }

    const fetchTimeline = () => {
        setIsLoading(true)
        let u = `?related_to_type=Lead&related_to_id=${id}`
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
        fetchDeals()
    }, [])

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        if (data) {
            fetchTimeline()
        }
    }, [data])

    useEffect(() => {
        if (deals.length > 0) {
            const filteredDeals = deals.filter(deal => deal.related_entity_id === data?.id && deal.related_entity_type === 'Lead');
            setFilteredDeals(filteredDeals);
        }
    }, [deals])

    const [popup, setPopup] = useState({ type: '', isOpen: false, lead: null });
    const openPopup = (type, lead = null) => setPopup({ type, isOpen: true, lead });
    const closePopup = () => setPopup({ type: '', isOpen: false, lead: null });

    const findLeadStage = (type) => {
        switch (type) {
            case 'New':
                return 1.8;
            case 'Qualified':
                return 3.6;
            case 'Contacted':
                return 5.5;
            case 'Negotiated':
                return 7.5;
            case 'Closed':
                return 10;
            default:
                return 0;
        }
    }

    return (<>
        <Header back={true} title={t('leadDetails.title')} />
        <ScreenWrapper>
            <FlatList
                data={[...timeline]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <TimelineCard item={item} />}
                ListHeaderComponent={
                    <>
                        <SidePopup type={popup?.type} isOpen={popup?.isOpen} fetch={fetch} lead={popup?.lead} closePopup={closePopup} />

                        <Text allowFontScaling={false} style={[globalStyle?.leadName]}>{`${data?.firstName} ${data?.lastName}`}</Text>
                        <Text allowFontScaling={false} style={[globalStyle?.textDescription, { fontSize: hp(1.5) }]}>
                            {t('leadDetails.addedOn')} {moment(data?.createdAt).format("LLL")}
                        </Text>

                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle?.jsb, { marginVertical: hp(1.3) }]}>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={() => openPopup('edit', data)} buttonText={t('leadDetails.buttons.edit')} buttonStyle={{ width: '100%' }} />
                            </View>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={()=>openPopup('owner',data)} buttonText={t('leadDetails.buttons.changeOwner')} buttonStyle={{ width: '100%', backgroundColor: color.green }} />
                            </View>
                        </View>

                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle?.jsb]}>
                            {/* <View style={{ width: '49%' }}>
                                <IconButton onPress={() => openPopup('contact', data)} buttonText={t('leadDetails.buttons.convertToContact')} buttonStyle={{ width: '100%', backgroundColor: color.dangerRed }} />
                            </View> */}
                            <View style={{ width: '100%' }}>
                                <IconButton onPress={() => openPopup('customer', data)} buttonText={t('leadDetails.buttons.convertToAccount')} buttonStyle={{ width: '100%', backgroundColor: color.dangerRed }} />
                            </View>
                        </View>

                        <IconButton onPress={()=>navigation?.navigate(Routes.AddDeal, { edit: false, data: { relatedEntityType: 'Lead', relatedEntityId: data.id } })} buttonText={t('leadDetails.buttons.addDeal')} buttonStyle={{ width: '100%', marginVertical: hp(1.3) }} />

                        <View style={[{ marginBottom: hp(3), backgroundColor: color.offwhite, width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), paddingVertical: hp(2) }]}>
                            <Text allowFontScaling={false} style={[globalStyle.cardTitle, { fontSize: hp(1.8), marginVertical: hp(0.3) }]}>{t('leadDetails.leadStage')}</Text>
                            <View style={[globalStyle.progressBar, { marginBottom: hp(1), marginVertical: hp(1) }]}>
                                <View style={[globalStyle.progressSegment, { flex: findLeadStage(data?.status), backgroundColor: color.green }]} />
                                <View style={[globalStyle.progressSegment, { flex: 10 - findLeadStage(data?.status), backgroundColor: color.lightGrey }]} />
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle.alc, globalStyle.jsb, { flexWrap: 'nowrap' }]}>
                                <Text allowFontScaling={false} style={[globalStyle.timestamp2, { fontSize: hp(1.3), }]}>{t('leadDetails.stages.new')}</Text>
                                <Text allowFontScaling={false} style={[globalStyle.timestamp2, { fontSize: hp(1.3), }]}>{t('leadDetails.stages.qualified')}</Text>
                                <Text allowFontScaling={false} style={[globalStyle.timestamp2, { fontSize: hp(1.3), }]}>{t('leadDetails.stages.contacted')}</Text>
                                <Text allowFontScaling={false} style={[globalStyle.timestamp2, { fontSize: hp(1.3), }]}>{t('leadDetails.stages.negotiated')}</Text>
                                <Text allowFontScaling={false} style={[globalStyle.timestamp2, { fontSize: hp(1.3), }]}>{t('leadDetails.stages.closed')}</Text>
                            </View>
                        </View>

                        <View style={[globalStyle.rowFlex, globalStyle.alc, { flexWrap: 'nowrap', justifyContent: 'space-around', marginBottom: hp(3) }]}>
                            <ActivityTypeIcon type={'Call'} />
                            <ActivityTypeIcon type={'Email'} />
                            <ActivityTypeIcon type={'Meeting'} />
                            <ActivityTypeIcon type={'Whatsapp'} />
                        </View>

                        {/* Contact Detail Work */}
                        <View style={[globalStyle.card]}>
                            <Text allowFontScaling={false} style={[globalStyle.cardTitle, { fontSize: hp(1.8), marginBottom: hp(0.8) }]}>{t('leadDetails.contactDetail')}</Text>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('leadDetails.labels.mobile')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.phoneCountryCode ? data?.phoneCountryCode + ' ' : ''}{data?.phone}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('leadDetails.labels.email')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.email}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('leadDetails.labels.source')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.source_value || '-'}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('leadDetails.labels.status')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.status}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '100%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('leadDetails.labels.owner')}</Text>
                                    <Text style={[globalStyle.value, { color: color.primary }]} allowFontScaling={false}>{data?.ownerName}</Text>
                                </View>
                            </View>
                            <Text style={[globalStyle.timestamp2, { marginTop: hp(1) }]} allowFontScaling={false}>{t('leadDetails.updatedBy')}: {data?.ownerName}</Text>
                            <Text style={[globalStyle.timestamp2]} allowFontScaling={false}>{t('leadDetails.updatedAt')}: {moment(data?.updatedAt).format("LLL")}</Text>
                        </View>

                        {/* Additional Info Work */}
                        <View style={[{ marginBottom: hp(3) }, globalStyle.rowFlex, globalStyle.alc, globalStyle.jsb]}>
                            <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('leadDetails.additionalInfo')}</Text>

                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.company')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.company || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.title')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.title || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.leadScore')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.leadScore || 0}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.product')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.productName || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.lookingFor')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.lookingFor || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('leadDetails.labels.remark')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.remark || '-'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: hp(3) }}>
                            <Hr color={color.offwhite} />
                        </View>

                        {/* Deals Work */}
                        <View style={[{ marginBottom: hp(3) }, globalStyle.rowFlex, globalStyle.alc, globalStyle.jsb]}>
                            <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('leadDetails.deals')}</Text>
                            <Text onPress={() => navigation?.navigate(Routes.AddDeal, { edit: false, data: { relatedEntityType: 'Lead', relatedEntityId: data.id } })} allowFontScaling={false} style={[globalStyle?.lable, { marginBottom: hp(2), color: color.primary }]}>{t('leadDetails.addDeals')}</Text>

                            {filteredDeals.map((deal, index) => (
                                <>
                                    <View key={index} style={[globalStyle.rowFlex, globalStyle.alc, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{deal?.name}</Text>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.green }]}>{deal?.value}</Text>
                                    </View>
                                    <View style={[globalStyle.rowFlex, globalStyle.alc, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{deal?.stage || '-'}</Text>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark }]}>{t('leadDetails.closing')}: {moment(deal?.expected_close_date).format('ll')}</Text>
                                    </View>
                                    <View style={{ marginBottom: hp(3), width: '100%' }}>
                                        <Hr color={color.offwhite} />
                                    </View>
                                </>
                            ))}
                        </View>

                        {/* Interaction Timeline */}
                        <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('leadDetails.interactionTimeline')}</Text>
                    </>
                }
                contentContainerStyle={[globalStyle?.screen]}
            />
        </ScreenWrapper>
    </>
    )
}

export default LeadDetails