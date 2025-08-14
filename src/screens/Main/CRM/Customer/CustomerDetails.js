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
import { leadStore } from '../../../../Store/LeadStore/leads.js'
import { activityStore } from '../../../../Store/ActivityStore/activity.js'
import { dealsStore } from '../../../../Store/DealStore/deals.js'
import TimelineCard from '../../../../Components/TimelineCard/TimelineCard.js'
import SidePopup from '../../../../Components/SidePopup/SidePopup.js'
import Routes from '../../../../Navigation/Routes.js'
import CustomerSidePopup from '../../../../Components/SidePopup/CustomerSidePopup.js'

const CustomerDetails = (props) => {
    const { t } = useTranslation() // Add this line
    const id = props?.route?.params?.id ?? null;
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const [data, setData] = useState()
    const { viewCustomers } = leadStore()
    const { viewActivity } = activityStore()
    const [timeline, setTimeline] = useState([])
    const [filteredDeals, setFilteredDeals] = useState([])

    const fetch = () => {
        setIsLoading(true)
        viewCustomers(id)
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
                showToast(t('customerDetails.toasts.errorFetching'))
            })
    }

    const fetchTimeline = () => {
        setIsLoading(true)
        let u = `?related_to_type=Customer&related_to_id=${id}`
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
            const filteredDeals = deals.filter(deal => deal.relatedEntityId === data?.id && deal.relatedEntityType === 'Customer');
            setFilteredDeals(filteredDeals);
        }
    }, [deals])

    const [popup, setPopup] = useState({ type: '', isOpen: false, lead: null });
    const openPopup = (type, lead = null) => setPopup({ type, isOpen: true, lead });
    const closePopup = () => setPopup({ type: '', isOpen: false, lead: null });

    return (<>
        <Header back={true} title={t('customerDetails.title')} />
        <ScreenWrapper>
            <FlatList
                data={[...timeline]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <TimelineCard item={item} />}
                ListHeaderComponent={
                    <>
                        <CustomerSidePopup type={popup?.type} isOpen={popup?.isOpen} fetch={fetch} lead={popup?.lead} closePopup={closePopup} />

                        <Text allowFontScaling={false} style={[globalStyle?.leadName]}>{`${data?.firstName} ${data?.lastName}`}</Text>
                        <Text allowFontScaling={false} style={[globalStyle?.textDescription, { fontSize: hp(1.5) }]}>
                            {t('customerDetails.addedOn')} {moment(data?.createdAt).format("LLL")}
                        </Text>

                        <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle?.jsb, { marginTop: hp(1.3) }]}>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={() => openPopup('edit', data)} buttonText={t('customerDetails.buttons.editCustomer')} buttonStyle={{ width: '100%' }} />
                            </View>
                            <View style={{ width: '49%' }}>
                                <IconButton onPress={() => openPopup('owner', data)} buttonText={t('customerDetails.buttons.changeOwner')} buttonStyle={{ width: '100%', backgroundColor: color.green }} />
                            </View>
                        </View>

                        <IconButton onPress={() => navigation?.navigate(Routes.AddDeal, { edit: false, data: { relatedEntityType: 'Customer', relatedEntityId: data.id } })} 
                            buttonText={t('customerDetails.buttons.addDeal')} 
                            buttonStyle={{ width: '100%', marginVertical: hp(1.3) }} />

                        <View style={[globalStyle.rowFlex, globalStyle.alc, { flexWrap: 'nowrap', justifyContent: 'space-around', marginBottom: hp(3), marginTop: hp(2) }]}>
                            <ActivityTypeIcon type={'Call'} />
                            <ActivityTypeIcon type={'Email'} />
                            <ActivityTypeIcon type={'Meeting'} />
                            <ActivityTypeIcon type={'Whatsapp'} />
                        </View>

                        {/* Customer Detail Work */}
                        <View style={[globalStyle.card]}>
                            <Text allowFontScaling={false} style={[globalStyle.cardTitle, { fontSize: hp(1.8), marginBottom: hp(0.8) }]}>{t('customerDetails.customerDetail')}</Text>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('customerDetails.labels.mobile')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.phoneCountryCode ? data?.phoneCountryCode + ' ' : ''}{data?.phone}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('customerDetails.labels.email')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.email}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('customerDetails.labels.source')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.source_value || data?.sourceName || data?.sourceValue || '-'}</Text>
                                </View>
                                <View style={{ width: '49%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('customerDetails.labels.subscriptionStatus')}</Text>
                                    <Text style={[globalStyle.value,]} allowFontScaling={false}>{data?.subscriptionStatus}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle?.rowFlex, globalStyle?.jsb, { marginTop: hp(1.5) }]}>
                                <View style={{ width: '100%' }}>
                                    <Text style={[globalStyle.lable]} allowFontScaling={false}>{t('customerDetails.labels.owner')}</Text>
                                    <Text style={[globalStyle.value, { color: color.primary }]} allowFontScaling={false}>{data?.ownerName}</Text>
                                </View>
                            </View>
                            <Text style={[globalStyle.timestamp2, { marginTop: hp(1) }]} allowFontScaling={false}>{t('customerDetails.updatedBy')}: {data?.ownerName}</Text>
                            <Text style={[globalStyle.timestamp2]} allowFontScaling={false}>{t('customerDetails.updatedAt')}: {moment(data?.updatedAt).format("LLL")}</Text>
                        </View>

                        {/* Additional Info Work */}
                        <View style={[{ marginBottom: hp(3) }, globalStyle.rowFlex, globalStyle.alc, globalStyle.jsb]}>
                            <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('customerDetails.additionalInfo')}</Text>

                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.company')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.company || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.branch')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.branch_value || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.department')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.department_value || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.title')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.title || '-'}</Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.hasDeals')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>
                                        {data?.has_deals ? t('customerDetails.yes') : t('customerDetails.no')}
                                    </Text>
                                </View>
                            </View>
                            <View style={[globalStyle.rowFlex, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                <View style={{ width: '40%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{t('customerDetails.labels.product')}</Text>
                                </View>
                                <View style={{ width: '59%' }}>
                                    <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark, textAlign: 'right' }]}>{data?.productName || '-'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: hp(3) }}>
                            <Hr color={color.offwhite} />
                        </View>

                        {/* Deals Work */}
                        <View style={[{ marginBottom: hp(3) }, globalStyle.rowFlex, globalStyle.alc, globalStyle.jsb]}>
                            <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('customerDetails.deals')}</Text>
                            <Text onPress={() => navigation?.navigate(Routes.AddDeal, { edit: false, data: { relatedEntityType: 'Customer', relatedEntityId: data.id } })} 
                                allowFontScaling={false} 
                                style={[globalStyle?.lable, { marginBottom: hp(2), color: color.primary }]}>
                                {t('customerDetails.buttons.addDeals')}
                            </Text>

                            {filteredDeals.map((deal, index) => (
                                <>
                                    <View key={index} style={[globalStyle.rowFlex, globalStyle.alc, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{deal?.name}</Text>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.green }]}>{deal?.value}</Text>
                                    </View>
                                    <View style={[globalStyle.rowFlex, globalStyle.alc, globalStyle?.jsb, { width: '100%', marginBottom: hp(0.5) }]}>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable,]}>{deal?.stage_value || '-'}</Text>
                                        <Text allowFontScaling={false} style={[globalStyle?.lable, { color: color.textDark }]}>
                                            {t('customerDetails.closing')}: {moment(deal?.expectedCloseDate).format('ll')}
                                        </Text>
                                    </View>
                                    <View style={{ marginBottom: hp(3), width: '100%' }}>
                                        <Hr color={color.offwhite} />
                                    </View>
                                </>
                            ))}
                        </View>

                        {/* Interaction Timeline */}
                        <Text allowFontScaling={false} style={[globalStyle?.textBold, { marginBottom: hp(2) }]}>{t('customerDetails.interactionTimeline')}</Text>
                    </>
                }
                contentContainerStyle={[globalStyle?.screen]}
            />
        </ScreenWrapper>
    </>
    )
}

export default CustomerDetails