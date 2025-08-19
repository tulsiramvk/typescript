import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { useLotteryPurchaseStore } from '../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';

const HowPlay = ({ lid }) => {
    const [spinning, setSpinning] = useState(false)
    const { fetchHowtoPlay, setHowtoPlay, howtoplayData } = useLotteryPurchaseStore()
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
        fetchHowtoPlay(lid)
            .then(res => {
                setHowtoPlay(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [lid,refreshing])

    return (
        <View style={{ width: '95%', marginHorizontal: 'auto', paddingBottom: 290, height: '100%' }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: howtoplayData ? `<style>p,span,div,font{font-size:35px !important;
                        background-color:transparent !important;
                        color:white !important;                       
                        }</style><div style="color: white;font-size:40px !important;">' ${howtoplayData.howToPlay} </div>` : '' }}
                    style={{ backgroundColor: 'transparent', color: 'white' }}
                />
        </View>
    )
}

export default HowPlay