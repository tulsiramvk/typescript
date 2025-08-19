import { View, Text, Image } from 'react-native'
import React from 'react'
import styles2 from './Style.js'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import { colors } from './../../../../../helpers/colors';
import fonts from './../../../../../helpers/fonts';

const Fonts = fonts;
const PrizeCard = ({ data, lotteryDetail, i }) => {
    return (
        <>
            <View style={[styles2.card]}>
                
                <View style={{ backgroundColor: colors.blue3, padding: 10, paddingVertical: 8 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '25%', flexDirection: 'row' }}>
                            <View>
                            <View style={{ backgroundColor: colors.blue2, borderRadius: 3, padding: 5, paddingHorizontal: 8 }}><Text allowFontScaling={false} style={{ fontSize: 12, color: colors.white, fontFamily: Fonts.regular }}>0 {lotteryDetail?.type === "Pick2" ? i + 1 : data.game_id}</Text></View>
                            </View>
                        </View>
                        <View style={{ width: '33%', flexDirection: 'row',  justifyContent: 'space-between' }}>
                            <View style={{ width: '100%' }}>
                                <Text allowFontScaling={false} style={[styles2.cardLabel, { marginBottom: 5 }]}>Game</Text>
                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13 }]}>{data.game_name}</Text>
                            </View>
                        </View>
                        <View style={{ width: '37%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '100%' }}>
                                <Text allowFontScaling={false} style={[styles2.cardLabel, { marginBottom: 5 }]}>Prize</Text>

                                {/* Case 1: Normal games */}
                                {data?.bet_amount && (
                                    <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13 }]}>
                                        Bet Amount x {data.bet_amount}
                                    </Text>
                                )}

                                {/* Case 2: Box game with multiple bet_amounts */}
                                {data?.bet_amounts && Object.entries(data.bet_amounts).map(([key, value], idx) => (

                                    <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13,marginBottom:3  }]}>
                                        Bet Amount x ${value} <Text style={{textTransform: 'capitalize'}}>({key.replace(/_/g, ' ')})</Text>
                                    </Text>

                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, alignItems: 'center' }}>

                </View>

            </View>

        </>
    )
}

export default PrizeCard