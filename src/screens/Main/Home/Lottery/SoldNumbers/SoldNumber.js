import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../Style'
import styles2 from './Style.js'
import SoldCard from './SoldCard.js'
import { colors } from '../../../../../helpers/colors.js'
import PTRView from 'react-native-pull-to-refresh';
import TabDisable from '../../../../../helpers/TabDisable.js'
import { convertTo12Hour, isTimePast, tabs } from './../../../../../helpers/utils';
import { useHomeStore } from './../../../../../Store/HomeStore/HomeStore';
import { useAuthenticationStore } from './../../../../../Store/AuthenticationStore';

const SoldNumber = ({ lid, lotId }) => {
    const { fetchAllSold, fetchSoldNumbers, isEnabled } = useHomeStore()
    const { tabData, fetchTab } = useAuthenticationStore()
    const [showSoldout, setShowSoldout] = useState(false)
    const P = { A: "All", S: "Sold Out" }
    const [currentPage, setCurrentPage] = useState(P.A)
    const [arr, setArr] = useState([])
    const [arr2, setArr2] = useState([])
    const [currentTime, setCurrentTime] = useState()
    const [SoldNumbers, setSoldNumbers] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        fetchTab()
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
        let d = tabData.find(f => f.name === tabs.soldout)
        if (d) {
            setShowSoldout(d.status)
        }
    }, [tabData])

    useEffect(() => {
        if (currentTime) {
            if (currentPage === P.A) {
                fetchAllSold(lotId, currentTime)
                    .then(res => {
                        setArr(lid?.type === "Pick2" ? res.data.data.slice(0, 50) : res.data.data.slice(0, 18))
                        setArr2(lid?.type === "Pick2" ? res.data.data.slice(50, 100) : res.data.data.slice(18, 36))
                    })
                    .catch(err => {
                        setArr([])
                        setArr2([])

                    })

            } else if (currentPage === P.S) {
                fetchSoldNumbers(lotId, currentTime)
                    .then(res => {
                        setSoldNumbers(res.data.data)
                    })
                    .catch(err => {
                        setSoldNumbers([])
                    })
            }
        }
    }, [currentPage, currentTime, refreshing])

    useEffect(() => {
        fetchTab()
        if (lid.drawDetails.length > 0) {
            for (let i = 0; i < lid.drawDetails.length; i++) {
                const e = lid.drawDetails[i];
                if (!isTimePast(e.draw_time)) {
                    setCurrentTime(e.draw_time)
                    break
                }
            }
        }
    }, [lid])

    const [mremaining, setMremaining] = useState(0)

    useEffect(() => {
        if (currentTime) {
            setMremaining(lid?.drawDetails?.find(f => f?.draw_time === currentTime))
        }
    }, [currentTime])
    
    return (<>

        {showSoldout ? <>
            <View style={[styles.block]}>
                <View style={[styles.btnWrapper, { marginTop: 0 }]}>
                    < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        <TouchableOpacity style={[currentPage === P.A ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.A) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.A ? styles.btnTextActive : styles.btnTextInActive]}>{P.A}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[currentPage === P.S ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.S) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.S ? styles.btnTextActive : styles.btnTextInActive]}>{P.S}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View style={[styles.btnWrapper, { marginTop: 0 }]}>
                    < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        {lid.drawDetails.map((d, count) => {
                            return <TouchableOpacity key={count} style={[currentTime === d.draw_time ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentTime(d.draw_time) }}>
                                <Text allowFontScaling={false} style={[currentTime === d.draw_time ? styles.btnTextActive : styles.btnTextInActive, { fontSize: 11 }]}>{convertTo12Hour(isEnabled, d.draw_time)}</Text>
                            </TouchableOpacity>
                        })}

                    </ScrollView>
                </View>
            </View>

            {currentTime &&
                <View style={[styles.block, { paddingBottom: 320 }]}>
                    {currentPage === P.A &&
                        <View style={[styles2.card]}>
                            <PTRView onRefresh={onRefresh} >
                                <ScrollView>
                                    {lid?.type !== 'Pick2' &&
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <View style={{ width: "49%" }}>
                                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 11, marginBottom: 4 }]}>Megaball Remaining Limit</Text>
                                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13 }]}>$ {mremaining?.remaining_megaball_bet_limit || 0}</Text>
                                            </View>
                                            <View style={{ width: "49%" }}>
                                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 11, marginBottom: 4 }]}>Monstaball Remaining Limit</Text>
                                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13 }]}>$ {mremaining?.remaining_monstaball_bet_limit || 0}</Text>
                                            </View>
                                        </View>
                                    }
                                    <Text allowFontScaling={false} style={[styles2.title, { fontSize: 15 }]}>All {lid?.type==="Pick2"?'Pick 2' : 'Cashpot'} Numbers</Text>
                                    {currentTime && <Text allowFontScaling={false} style={[styles2.cardLabel, { fontSize: 13 }]}>{`Here are the remaining betting limits for all ${lid?.type === 'Pick2' ?'99 Pick 2' :'36 Cashpot'} numbers for today's ${convertTo12Hour(isEnabled, currentTime)} draw. The list will be updated after each ticket sale and will remain available until 12:00 AM. After that, the limits for the next day will be posted.`}</Text>}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <View style={{ width: '48%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 13 }}>
                                                <View style={{ width: 45 }}><Text allowFontScaling={false} style={[styles2.title, { fontSize: 11 }]}>Bet No.</Text></View>
                                                <View style={{ width: 100 }}><Text allowFontScaling={false} style={[styles2.title, { fontSize: 11 }]}>Remaining Limit</Text></View>
                                            </View>
                                            {arr.map((m, count) => {
                                                return <SoldCard key={count} data={m} />
                                            })}
                                        </View>
                                        <View style={{ width: '48%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 13 }}>
                                                <View style={{ width: 45 }}><Text allowFontScaling={false} style={[styles2.title, { fontSize: 11 }]}>Bet No.</Text></View>
                                                <View style={{ width: 100 }}><Text allowFontScaling={false} style={[styles2.title, { fontSize: 11 }]}>Remaining Limit</Text></View>
                                            </View>
                                            {arr2.map((m, count) => {
                                                return <SoldCard key={count} data={m} />
                                            })}
                                        </View>
                                    </View>
                                </ScrollView>
                            </PTRView>
                        </View>
                    }
                    {currentPage === P.S &&
                        <View style={[styles2.card]}>
                            <PTRView onRefresh={onRefresh} >
                                <ScrollView>
                                    <Text allowFontScaling={false} style={[styles2.title, { fontSize: 15 }]}>Sold Out number</Text>
                                    {currentTime && <Text allowFontScaling={false} style={[styles2.cardLabel, { fontSize: 13 }]}>{`These ${lid?.type==="Pick2"?'Pick 2':'Cashpot'} numbers are no longer available for betting as they have reached their limit for today's ${convertTo12Hour(isEnabled, currentTime)} draw. They will become available again starting with the next day's draws after 12:00 AM.`}</Text>}
                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        {SoldNumbers.map((m, c) => {
                                            return <View key={c} style={{ width: 40, height: 40, marginRight: '5%', marginBottom: '4%' }}>
                                                <View style={{ borderWidth: 1, borderColor: colors.white, borderRadius: 8, width: '90%', height: '90%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                                                    <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>{m}</Text>
                                                </View>
                                            </View>
                                        })}

                                        {SoldNumbers.length === 0 && <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13 }]}>{`There are no sold out numbers right now.`}</Text>}

                                    </View>
                                </ScrollView>
                            </PTRView>
                        </View>
                    }

                </View>
            }
        </>
            :
            <TabDisable onRefresh={onRefresh} />
        }
    </>

    )
}

export default SoldNumber