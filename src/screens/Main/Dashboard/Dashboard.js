import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import { leadStore } from '../../../Store/LeadStore/leads'
import { authStore } from '../../../Store/AuthStore/auth'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import fonts from '../../../helpers/fonts'
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { color } = useThemeStore()
    const { t } = useTranslation()
    const { fetchBranches, fetchDepartments, fetchSources, fetchProducts, fetchPipelines, fetchStages } = leadStore()
    const { fetchAllUsers, fetchDashboard, setDashboard, dashboardData } = authStore()

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(20)).current
    const [data, setData] = useState(dashboardData)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchBranches()
        fetchDepartments()
        fetchSources()
        fetchProducts()
        fetchPipelines()
        fetchStages()
        fetchAllUsers()
    }, [])

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                const response = await fetchDashboard()
                setDashboard(response?.data?.data)
            } catch (err) {
                console.log(err);
                setError('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    useEffect(() => {
        setData(dashboardData)
    }, [dashboardData])

    console.log({ dashboardData });


    const MetricBox = ({ label, value, colors, icon }) => (
        <Animated.View style={[styles.metricBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient colors={colors} style={styles.gradient}>
                <MaterialCommunityIcons name={icon} size={28} color="#fff" />
                <Text allowFontScaling={false} style={styles.metricValue}>{value}</Text>
                <Text allowFontScaling={false} style={styles.metricLabel}>{label}</Text>
            </LinearGradient>
        </Animated.View>
    )

    const ProgressBar = ({ percentage }) => (
        <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
    )

    return (
        <ScreenWrapper>
            <Header title={t('dashboard.title')} />
            {loading ? (
                <Text allowFontScaling={false} style={styles.cardSubtitle}>{t('dashboard.loading')}</Text>
            ) : error ? (
                <Text allowFontScaling={false} style={[styles.cardSubtitle, { color: 'red', textAlign: 'center' }]}>{error}</Text>
            ) : data ? (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Quick Metrics */}
                    <View style={styles.metricsRow}>
                        <MetricBox
                            label={t('dashboard.deals')}
                            value={data?.deals?.total_counts?.total}
                            colors={!color.primary ? ['#3498db', color.primary] : ['#3498db', '#1abc9c']}
                            icon="handshake"
                        />
                        <MetricBox
                            label={t('dashboard.leads')}
                            value={data?.leads?.total_counts?.total}
                            colors={!color.dangerRed ? ['#e74c3c', color.dangerRed] : ['#e74c3c', '#e67e22']}
                            icon="account-multiple-plus"
                        />
                    </View>
                    <View style={styles.metricsRow}>
                        <MetricBox
                            label={t('dashboard.contacts')}
                            value={data?.contacts?.total_counts?.total}
                            colors={['#2980b9', '#3498db']}
                            icon="account-box"
                        />
                        <MetricBox
                            label={t('dashboard.customers')}
                            value={data?.customers?.total_counts?.total}
                            colors={!color.green ? ['#53beb5', color.green] : ['#53beb5', '#2ecc71']}
                            icon="account-star"
                        />
                    </View>

                    {/* Meetings */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="video" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('meeting')}</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>
                            {t('dashboard.total')}: {data?.meetings?.total_counts?.count || 0}
                        </Text>
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>
                            {t('upcoming')}: {data?.meetings?.upcoming_meetings?.length || 0}
                        </Text>
                    </Animated.View>

                    {/* Conversion Rate */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="bullseye-arrow" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('dashboard.conversionRate')}</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.cardValue}>{data?.leads?.conversion_rate?.rate || 0}%</Text>
                        {data?.leads?.conversion_rate?.rate > 0 ? (
                            <ProgressBar percentage={data?.leads?.conversion_rate?.rate || 0} />
                        ) : (
                            <Text allowFontScaling={false} style={styles.cardSubtitle}>{t('dashboard.noConversionData')}</Text>
                        )}
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>
                            {t('dashboard.leadsLabel')}: {data?.leads?.conversion_rate?.leads_count || 0} → {t('dashboard.customersLabel')}:{' '}
                            {data?.leads?.conversion_rate?.customers_converted || 0}
                        </Text>
                    </Animated.View>

                    {/* Pipeline */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="chart-bar" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('dashboard.pipeline')}</Text>
                        </View>
                        {data?.leads?.pipeline_counts?.length > 0 ? (
                            data.leads.pipeline_counts.map((pipe, idx) => (
                                <View key={idx}>
                                    <Text allowFontScaling={false} style={styles.stageTitle}>{pipe.pipeline}</Text>
                                    {pipe.stages.map((stage, sIdx) => (
                                        <Text allowFontScaling={false} key={sIdx} style={styles.stageText}>
                                            • {stage.stage}: {stage.count}
                                        </Text>
                                    ))}
                                </View>
                            ))
                        ) : (
                            <Text allowFontScaling={false} style={styles.cardSubtitle}>{t('dashboard.noPipelineData')}</Text>
                        )}
                    </Animated.View>

                    {/* Funnel */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <IconProvider provider='Entypo' name="funnel" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('dashboard.funnel')}</Text>
                        </View>
                        {data?.leads?.funnel?.length > 0 ? (
                            data.leads.funnel.map((f, idx) => (
                                <Text allowFontScaling={false} key={idx} style={styles.stageText}>
                                    • {f.stage}: {f.count}
                                </Text>
                            ))
                        ) : (
                            <Text allowFontScaling={false} style={styles.cardSubtitle}>{t('dashboard.noFunnelData')}</Text>
                        )}
                    </Animated.View>

                    {/* Activities */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="calendar" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('dashboard.activities')}</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>
                            {t('dashboard.total')}: {data?.activities?.total_counts?.total}
                        </Text>
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>{t('dashboard.overdue')}: {data?.activities?.overdue_activities?.count || 0}</Text>
                        <Text allowFontScaling={false} style={styles.cardSubtitle}>
                            {t('dashboard.completionRate')}: {data?.activities?.completion_rate?.rate || 0}%
                        </Text>
                    </Animated.View>

                    {/* Top Performer */}
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="trophy" size={hp(3)} color="#3498db" />
                            <Text allowFontScaling={false} style={styles.cardTitle}>{t('dashboard.topPerformer')}</Text>
                        </View>
                        {data?.top_performers?.map((user, idx) => (
                            <Text allowFontScaling={false} key={idx} style={styles.stageText}>
                                {user.user_name} - {t('dashboard.deals')}: {user.count}, {t('dashboard.value')}: ₹{user.value}
                            </Text>
                        ))}
                    </Animated.View>
                </ScrollView>
            ) : (
                <Text allowFontScaling={false} style={[styles.cardSubtitle, { textAlign: 'center' }]}>{t('dashboard.noData')}</Text>
            )}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: wp(4),
        backgroundColor: '#f5f7fa',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(1.5),
    },
    metricBox: {
        width: '49%',
        borderRadius: wp(3),
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gradient: {
        padding: wp(5),
        alignItems: 'center',
        borderRadius: wp(3),
    },
    metricValue: {
        fontSize: hp(2.7),
        fontFamily: fonts.extraBold,
        color: '#fff',
        marginTop: hp(0.5),
    },
    metricLabel: {
        fontSize: hp(1.7),
        color: '#fff',
        fontFamily: fonts.medium
    },
    card: {
        backgroundColor: '#fff',
        padding: wp(4),
        borderRadius: wp(3),
        marginBottom: hp(1.5),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    cardTitle: {
        fontSize: hp(2),
        fontFamily: fonts.bold,
        color: '#2c3e50',
        marginLeft: 8,
    },
    cardValue: {
        fontSize: hp(2.5),
        fontFamily: fonts.bold,
        color: '#2c3e50',
        marginBottom: hp(0.8),
    },
    cardSubtitle: {
        fontSize: hp(1.5),
        color: '#6c757d',
        marginTop: hp(0.6),
        fontFamily: fonts.medium
    },
    stageTitle: {
        fontFamily: fonts.semiBold,
        color: '#2c3e50',
        marginTop: hp(0.8),
        fontSize: hp(1.6),
    },
    stageText: {
        marginLeft: wp(4),
        color: '#34495e',
        fontSize: hp(1.6),
        marginTop: hp(0.6),
        fontFamily: fonts.medium
    },
    progressContainer: {
        height: hp(0.7),
        backgroundColor: '#e9ecef',
        borderRadius: wp(1),
        marginVertical: hp(1),
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 4,
    },
})

export default Dashboard