import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Style'
import Loader from '../../../helpers/Loader'
import LotteryCard from './LotteryCard'
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'
import { FlashList } from '@shopify/flash-list'
import { colors } from '../../../helpers/colors'
import { useLotteryPurchaseStore } from '../../../Store/LotteryPurchaseStore/LotteryPurchaseStore'

const Lotteries = () => {
    const [spinning, setSpinning] = useState(false)
    const { fetchLotteries, setLotteries, lotteries } = useLotteryPurchaseStore()
    const { setHomeData, fetchHomeData } = useHomeStore()
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
        fetchLotteries()
            .then(res => {
                setLotteries(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                setSpinning(false)
                setLotteries([])
            })
    }, [refreshing])

    const refresh = () => {
        fetchLotteries()
            .then(res => {
                setLotteries(res.data.data)
            })
            .catch(err => {
            })
        fetchHomeData()
            .then(res => {
                setHomeData(res.data.data)
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}>
                <Title name={'Lotteries'} />
            </View>
            <View style={[styles.block,{flex:1,marginVertical:20}]}>
                <View style={{flex:1}}>
                {lotteries.length > 0 ?
                    <FlashList
                        data={lotteries}
                        onRefresh={() => setRefreshing(!refreshing)}
                        refreshing={spinning}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => { return <LotteryCard refresh={refresh} d={item} key={item.id} /> }}
                        estimatedItemSize={100}
                        decelerationRate={'fast'}
                    />
                    :
                    <View>
                        <Text allowFontScaling={false} style={[styles.title, { marginTop: 15, color: colors.secondaryText, fontSize: 13 }]}>No lotteries found.</Text>
                    </View>
                }
            </View>
            </View>
        </MainBackground>
    )
}

export default Lotteries