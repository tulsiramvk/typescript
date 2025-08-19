import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainBackground from '../../../../Components/MainBackground/MainBackground'
import styles from './Style'
import styles2 from './Buy/Style'
import Title from '../../../../Components/Title/Title'
import RecentDraws from './RecentDraws/RecentDraws'
import SoldNumber from './SoldNumbers/SoldNumber'
import HowPlay from './HowPlay/HowPlay'
import Prize from './Prize/Prize'
import Buy from './Buy/Buy'
import Loader from '../../../../helpers/Loader'
import moment from 'moment-timezone'
import { useHomeStore } from '../../../../Store/HomeStore/HomeStore'
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message'
import {colors} from './../../../../helpers/colors';
import { useLotteryPurchaseStore } from './../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';
import { convertTo12Hour,isTimePast } from './../../../../helpers/utils';

const Lottery = ({ route }) => {
    const { setHomeData, fetchHomeData, isEnabled } = useHomeStore()
    const [spinning, setSpinning] = useState(false)
    const [totalBets, setTotalBets] = useState([])
    const [reTestBets, setReTestBets] = useState(false)
    const { params } = route
    const P = {
        B: "Buy", P: "Prize", H: "How to Play Game", S: "Sold Out Number", R: "Winning Results"
    }
    const [currentPage, setCurrentPage] = useState(P.B)

    const { lotteryDetail, setLotteryDetail, fetchLotteryDetail } = useLotteryPurchaseStore()
    const [canRefresh, setCanRefresh] = useState(true)

    const [isModalVisibleRe, setModalVisibleRe] = useState(false);
    const CheckBets = () => {
        for (let i = 0; i < totalBets.length; i++) {
            const e = totalBets[i];
            for (let j = 0; j < e.draw_time.length; j++) {
                const element = e.draw_time[j];
                if (isTimePast(element)) {
                    setModalVisibleRe(true)
                    Toast.show({
                        type: 'error',
                        text2: convertTo12Hour(isEnabled, element) + " draw time for your selected bets has passed, so it is removed from your bets.",
                    });
                }
            }
        }
    }
    const refresh = () => {
        if (canRefresh) {
            setCanRefresh(false)
            fetchLotteryDetail(params.id)
                .then(res => {
                    outerLoop: // Label for the outer loop
                    for (let i = 0; i < totalBets.length; i++) {
                        const e = totalBets[i];
                        for (let j = 0; j < e.draw_time.length; j++) {
                            const element = e.draw_time[j];
                            if (isTimePast(element)) {
                                setModalVisibleRe(true);
                                Toast.show({
                                    type: 'error',
                                    text2: convertTo12Hour(isEnabled, element) + " draw time for your selected bets has passed, so it is removed from your bets.",
                                });
                                break outerLoop; // Breaks out of both loops
                            }
                        }
                    }
                    setCanRefresh(true)
                    setLotteryDetail(res.data.data)
                    CheckBets()
                })
                .catch(err => {
                    setCanRefresh(true)
                    console.log(err);
                })
            fetchHomeData()
                .then(res => {
                    setHomeData(res.data.data)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setSpinning(true)
        fetchLotteryDetail(params.id)
            .then(res => {
                setLotteryDetail(res.data.data)
                setSpinning(false)
                setTotalBets([])
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [params.id, refreshing])

    // -------------------Time Caluclation---------------------------

    const [cdt, setCdt] = useState(null);
    const [timeLeft, setTimeLeft] = useState();

    const calculateTimeLeft = () => {
        if (lotteryDetail) {
            // let targetDate = moment.utc(lotteryDetail.currentDraw).tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm:ss')
            let targetDate = moment
                .tz(lotteryDetail.currentDrawUtc, 'America/New_York')
            targetDate = targetDate.clone().tz(moment.tz.guess()).toDate()
            let now = new Date()
            const difference = new Date(targetDate) - now;
            let timeLeft1 = {};
            if (difference > 0) {
                timeLeft1 = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                if (lotteryDetail.status !== 1 && canRefresh) {
                    console.log("Refreshed In Inner Lottery.");
                    refresh()
                }
                timeLeft1 = {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };
            }
            return timeLeft1;
        }
    };

    useEffect(() => {
        if (lotteryDetail) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [lotteryDetail]);

    if (lotteryDetail) {
        return (
            <MainBackground>
                <Loader spinning={spinning} />
                <View style={[styles.block]}>
                    <Title name="Lotteries" totalBets={totalBets} />
                </View>

                <View style={[styles.block, { marginVertical: 10 }]}>
                    <View style={[styles.btnWrapper]}>
                        < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >

                            <TouchableOpacity style={[currentPage === P.B ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.B) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.B ? styles.btnTextActive : styles.btnTextInActive]}>{P.B}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.P ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.P) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.P ? styles.btnTextActive : styles.btnTextInActive]}>{P.P}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.H ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.H) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.H ? styles.btnTextActive : styles.btnTextInActive]}>{P.H}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.S ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.S) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.S ? styles.btnTextActive : styles.btnTextInActive]}>{P.S}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.R ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.R) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.R ? styles.btnTextActive : styles.btnTextInActive]}>{P.R}</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
                {/* --------------------------This will go to component--------------------------- */}
                <View style={[styles.block]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
                        <View style={{}}>
                            <Image resizeMode='cover' resizeMethod='cover' style={{ width: 70, height: 70, borderRadius: 50, objectFit: 'cover' }} source={{ uri: lotteryDetail.image }} />
                        </View>
                        <View style={{ width: "75%" }}>
                            <Text allowFontScaling={false} style={[styles.title, { fontSize: 15 }]}>{lotteryDetail.name}</Text>

                            <Text allowFontScaling={false} style={[styles.cardLabel, { marginTop: 7 }]}>
                                {lotteryDetail.status === 0 && "Waiting For Start"}
                                {lotteryDetail.status === 2 && "Next Draw In"}
                                {lotteryDetail.status === 1 && "Lottery Expired"}
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>

                                <View style={{ width: '20%', marginEnd: '3%' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 3, marginBottom: 2 }}>
                                        <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.days : 0}</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 11, textAlign: 'center', marginBottom: 0, color: colors.white }]} >Day</Text>
                                </View>
                                <View style={{ width: '20%', marginEnd: '3%' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 3, marginBottom: 2 }}>
                                        <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.hours : 0}</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 11, textAlign: 'center', marginBottom: 0, color: colors.white }]} >Hour</Text>
                                </View>
                                <View style={{ width: '20%', marginEnd: '3%' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 3, marginBottom: 2 }}>
                                        <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.minutes : 0}</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 11, textAlign: 'center', marginBottom: 0, color: colors.white }]} >Minute</Text>
                                </View>
                                <View style={{ width: '20%' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 3, marginBottom: 2 }}>
                                        <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.seconds : 0}</Text>
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 11, textAlign: 'center', marginBottom: 0, color: colors.white }]} >Second</Text>
                                </View>

                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 1, backgroundColor: colors.blue, marginVertical: 15 }}></View>
                </View>
                {/* --------------------------This will go to component--------------------------- */}
                {currentPage === P.R && <RecentDraws lid={params.id} />}
                {currentPage === P.S && <SoldNumber lid={lotteryDetail} lotId={params.id} />}
                {currentPage === P.H && <HowPlay lid={params.id} />}
                {currentPage === P.P && <Prize lid={params.id} />}
                {currentPage === P.B && <Buy lotteryDetails={lotteryDetail} totalBets={totalBets} reTestBet={reTestBets} setTotalBets={setTotalBets} refreshing={refreshing} setRefreshing={setRefreshing} />}

                {/* --------------------Ask Refresh Modal-------------------------------- */}

                <Modal onBackButtonPress={() => { setModalVisibleRe(false); setTotalBets([]) }} isVisible={isModalVisibleRe} style={{ padding: 0, margin: 0, marginTop: "-10%" }}>
                    <View style={styles2.modalWrapper}>
                        <Text allowFontScaling={false} style={[styles2.modalTitle]}>Confirm</Text>

                        <Text allowFontScaling={false} style={[styles2.modalDesc, { marginVertical: 20 }]}>
                            <Text allowFontScaling={false}>One of the draw times for your selected bets has passed. Do you want to continue without that draw, or would you like to reset all bets?</Text>
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 5 }}>
                            <TouchableOpacity onPress={() => { setModalVisibleRe(false); setTotalBets([]) }} style={[styles2.btn_outline2, { width: '35%', marginEnd: 10 }]}>
                                <Text allowFontScaling={false} style={styles2.btnText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setReTestBets(!reTestBets); setModalVisibleRe(false) }} style={[styles2.btn2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles2.btnText}>Continue</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
            </MainBackground>
        )
    } else {
        return (
            <MainBackground>
                <Loader spinning={true} />
            </MainBackground>
        )
    }
}

export default Lottery