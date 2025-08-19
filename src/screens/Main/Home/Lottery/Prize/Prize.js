import { View, ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PrizeCard from './PrizeCard'
import styles from '../Style'
import PTRView from 'react-native-pull-to-refresh';
import { useLotteryPurchaseStore } from './../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';

const Prize = ({ lid }) => {
    const { lotteryDetail, fetchLotteryPrize } = useLotteryPurchaseStore()
    const [spinning, setSpinning] = useState(false)
    const [prize, setPrize] = useState()
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
        fetchLotteryPrize(lid)
            .then(res => {
                setPrize(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err.response.data);
                setSpinning(false)
            })
    }, [lid, refreshing])

    return (
        <View style={[styles.block, { marginBottom: 300 }]}>
            <PTRView onRefresh={onRefresh} >
                <ScrollView>
                    <Text allowFontScaling={false} style={[styles.title, { fontSize: 13, marginBottom: 7 }]}>Pick 3 Prize</Text>
                    {prize ?
                        prize?.gameDetails?.['3']?.map?.((m, i) => {
                            return <PrizeCard key={m.game_id} i={i} lotteryDetail={lotteryDetail} data={m} />
                        })
                        : null}
                    <View style={{ height: 15 }}></View>
                    <Text allowFontScaling={false} style={[styles.title, { fontSize: 13, marginBottom: 7 }]}>Pick 4 Prize</Text>
                    {prize ?
                        prize?.gameDetails?.['4']?.map?.((m, i) => {
                            return <PrizeCard key={m.game_id} i={i} lotteryDetail={lotteryDetail} data={m} />
                        })
                        : null}
                </ScrollView>
            </PTRView>
        </View>
    )
}

export default Prize