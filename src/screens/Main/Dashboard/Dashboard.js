import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Style'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Loader from '../../../helpers/Loader'
import PTRView from 'react-native-pull-to-refresh';
import { formatNumberWithCommas } from '../../../helpers/utils'
import { colors } from './../../../helpers/colors';
import { useDashboardStore } from './../../../Store/DashboardStore/DashboardStore';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';

const Dashboard = () => {
    const navigation = useNavigation()
    const [spinning, setSpinning] = useState(false)
    const { fetchBalance2 } = useHomeStore()
    const { fetchDashboardDetail, dashboardDetail, setDashboardDetail } = useDashboardStore()
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };
    useEffect(() => {
        setSpinning(true)
        fetchBalance2()
        fetchDashboardDetail()
            .then(res => {
                setSpinning(false)
                setDashboardDetail(res.data.data)
            })
            .catch(err => {
                setSpinning(false)
                console.log(err)
                setDashboardDetail({})
            })
    }, [refreshing])

    useFocusEffect(
        React.useCallback(() => {
            fetchBalance2()
        }, [])
    );

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}>
                <Title name="Dashboard" />
            </View>
            <PTRView onRefresh={onRefresh} >
                <View style={[styles.block, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, marginTop: 30 }]}>
                    <View style={{ width: '48%' }}>
                        <LinearGradient start={{ x: 1, y: 0.8 }} end={{ x: 0.3, y: 0.4 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[styles.container, { borderRadius: 5 }]} >
                            <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Total Balance</Text>
                            <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.total_balance) : 0}</Text>
                        </LinearGradient>
                    </View>

                    <View style={{ width: '48%' }}>
                        <LinearGradient start={{ x: 1, y: 0.8 }} end={{ x: 0.3, y: 0.4 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[styles.container, { borderRadius: 5 }]} >
                            <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Net Balance</Text>
                            <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.net_balance) : 0}</Text>
                        </LinearGradient>
                    </View>

                </View>

                <View style={[styles.block, { marginVertical: 10 }]}>

                    <View style={[styles.card]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 10 }]}>
                            <View>
                                <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Sales</Text>
                                <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.sales) : 0}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.card]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 10 }]}>
                            <View>
                                <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Void</Text>
                                <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.void) : 0}</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('Void', { status: 'Void' })} style={[styles.btnIcon, { alignItems: 'center' }]}>
                                <View><IoniconsIcon name={"eye"} color={colors.white} size={16} /></View>
                                <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> View</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.card]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 10 }]}>
                            <View>
                                <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Paid</Text>
                                <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.paid) : 0}</Text>
                            </View>

                            <TouchableOpacity style={[styles.btnIcon]} onPress={() => navigation.navigate('Void', { status: 'Paid' })}>
                                <View><IoniconsIcon name={"eye"} color={colors.white} size={16} /></View>
                                <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> View</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.card]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 10 }]}>
                            <View>
                                <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 5 }]}>Commission</Text>
                                <Text allowFontScaling={false} style={[styles.title, { width: '100%' }]}>$ {dashboardDetail ? formatNumberWithCommas(dashboardDetail.commission) : 0}</Text>
                            </View>

                            <TouchableOpacity style={[styles.btnIcon]} onPress={() => navigation.navigate('Void', { status: 'Commission' })}>
                                <View><IoniconsIcon name={"eye"} color={colors.white} size={16} /></View>
                                <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> View</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </PTRView>
        </MainBackground>
    )
}

export default Dashboard