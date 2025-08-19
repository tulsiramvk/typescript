import {
    View,
    Text,
    TouchableOpacity,
    BackHandler,
    Vibration
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from '../Style';
import styles2 from './Style.js';
import fonts from '../../../../../helpers/fonts.js';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInputWithIcon from '../../../../../Components/Inputs/TextInputIcon.js';
import { convertTo12Hour, countryCodes, formatToTwoDecimalPlaces } from './../../../../../helpers/utils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Yellow from '../../../../../static/images/yellow.svg';
import Red from '../../../../../static/images/red.svg';
import SelectDropdown from 'react-native-select-dropdown';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import Loader from '../../../../../helpers/Loader.js';
import { useHomeStore } from '../../../../../Store/HomeStore/HomeStore.js';
import { colors } from './../../../../../helpers/colors';
import { useLotteryPurchaseStore } from './../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';

const Fonts = fonts;
const ViewDetails = (props) => {
    const { buyLottery } = useLotteryPurchaseStore();
    const { fetchBalance, setBalance, isEnabled } = useHomeStore();

    const fetchBalan = useCallback(() => {
        fetchBalance()
            .then(res => {
                setBalance(res.data.data);
            })
            .catch(err => {
                // Handle error if necessary
            });
    }, [fetchBalance, setBalance]);
    const [spinning, setSpinning] = useState(false);
    const navigation = useNavigation();

    const {
        totalBets,
        viewTotals,
        setViewTotals,
        setTotalBets,
        lotteryDetail,
        setLotteryDetail, payload, setPayload
    } = props;

    const [checked, setChecked] = useState(true);

    // Calculate Grand Total Amount
    const getGrandTotalAmount = useCallback((data) => {
        return data.reduce((total, bet) => {
            const betTotal = bet.amount.reduce((sum, amt) => sum + (Number(amt) * bet.draw_time.length), 0);
            return total + betTotal;
        }, 0);
    }, []);

    // Handle Payment Navigation
    const handlePay = useCallback(() => {
        Toast.hide()
        const paymentData = {
            result: totalBets,
            customer_name: payload.name,
            customer_contact: payload.contact.length > 0 ? `${payload.country}${payload.contact}` : '',
            send_sms: checked ? "1" : "0"
        };
        // navigation.navigate("OrderDetails", { arr: paymentData });
        setSpinning(true);
        buyLottery(paymentData, lotteryDetail.id)
            .then(res => {
                setSpinning(false);
                fetchBalan();
                if (res.data.status === 'success') {
                    navigation.navigate("TransactionComplete", { data: res.data });
                } else {
                    Toast.show({
                        type: 'error',
                        text2: res.data.message,
                    });
                }
            })
            .catch(err => {
                setSpinning(false);
                console.log({ err });
                if (err.response && err.response.data) {
                    Toast.show({
                        type: 'error',
                        text2: err?.response?.data?.message ? err?.response?.data?.message?.toString() : "Error in purchasing a lottery ticket. You may have insufficient funds.",
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text2: "Error! Something went wrong.",
                    });
                }
            });
    }, [checked, lotteryDetail.id, navigation, payload, totalBets, fetchBalan]);

    // Effect to manage viewTotals based on totalBets
    useEffect(() => {
        if (totalBets.length === 0) {
            setViewTotals(false);
        }
    }, [totalBets, setViewTotals]);

    // Handle Deleting a Bet Entry
    const handleDelete = useCallback((sectionIndex) => {
        Vibration.vibrate(100)
        const updatedLotteryDetail = { ...lotteryDetail };
        const betToDelete = totalBets[sectionIndex];

        betToDelete.draw_time.forEach((drawTime) => {
            // Update remainingBetLimit
            updatedLotteryDetail.remainingBetLimit = updatedLotteryDetail.remainingBetLimit.map((limit) => {
                if (String(limit.draw_time) === String(drawTime) && String(limit.ticket_number) === String(betToDelete.number)) {
                    return {
                        ...limit,
                        remaining_bet: Number(limit.remaining_bet) + Number(betToDelete.amount[0])
                    };
                }
                return limit;
            });

            // Update drawDetails
            updatedLotteryDetail.drawDetails = updatedLotteryDetail.drawDetails.map((detail) => {
                if (String(detail.draw_time) === String(drawTime)) {
                    return {
                        ...detail,
                        remaining_megaball_bet_limit: Number(detail.remaining_megaball_bet_limit) + Number(betToDelete.amount[1]),
                        remaining_monstaball_bet_limit: Number(detail.remaining_monstaball_bet_limit) + Number(betToDelete.amount[2])
                    };
                }
                return detail;
            });
        });

        setLotteryDetail(updatedLotteryDetail);

        // Remove the bet entry from totalBets
        const updatedTotalBets = [...totalBets];
        updatedTotalBets.splice(sectionIndex, 1);
        setTotalBets(updatedTotalBets);
    }, [lotteryDetail, setLotteryDetail, setTotalBets, totalBets]);

    // Handle Deleting a Draw Time within a Bet Entry
    const handleDeleteTime = useCallback((sectionIndex, drawTime) => {
        Vibration.vibrate(100)
        const updatedTotalBets = [...totalBets];
        const bet = updatedTotalBets[sectionIndex];

        if (bet.draw_time.length === 1) {
            // If only one draw time, delete the entire bet entry
            handleDelete(sectionIndex);
        } else {
            // Update remainingBetLimit and drawDetails
            const updatedLotteryDetail = { ...lotteryDetail };
            updatedLotteryDetail.remainingBetLimit = updatedLotteryDetail.remainingBetLimit.map((limit) => {
                if (String(limit.draw_time) === String(drawTime) && String(limit.ticket_number) === String(bet.number)) {
                    return {
                        ...limit,
                        remaining_bet: Number(limit.remaining_bet) + Number(bet.amount[0])
                    };
                }
                return limit;
            });

            updatedLotteryDetail.drawDetails = updatedLotteryDetail.drawDetails.map((detail) => {
                if (String(detail.draw_time) === String(drawTime)) {
                    return {
                        ...detail,
                        remaining_megaball_bet_limit: Number(detail.remaining_megaball_bet_limit) + Number(bet.amount[1]),
                        remaining_monstaball_bet_limit: Number(detail.remaining_monstaball_bet_limit) + Number(bet.amount[2])
                    };
                }
                return detail;
            });

            setLotteryDetail(updatedLotteryDetail);

            // Remove the specific draw time from the bet entry
            bet.draw_time = bet.draw_time.filter(time => time !== drawTime);
            setTotalBets(updatedTotalBets);
        }
    }, [handleDelete, lotteryDetail, setLotteryDetail, setTotalBets, totalBets]);

    // Override Back Button Behavior
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                setViewTotals(!viewTotals);
                return true; // Prevent default behavior
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            // Cleanup on unfocus
            return () => backHandler.remove();
        }, [setViewTotals, viewTotals])
    );

    // Transform totalBets into sections for SectionList
    const flatData = useMemo(() => {
        return totalBets.flatMap((bet, index) => [
            // Insert entry row for each section
            { type: 'entryRow', entry: index, gameType: bet?.number?.toString()?.length === 3 ? 'Pick 3' : 'Pick 4' },
            // Map over the draw_time array to generate bet rows
            ...bet.draw_time.map((drawTime, drawIndex) => ({
                sectionIndex: index,
                drawTime,
                drawIndex,
                number: bet.number,
                amount: bet.amount,
                type: 'betRow'
            }))
        ]);
    }, [totalBets]);

    // Render Section Header
    const renderSectionHeader = useCallback(({ section }) => (
        <View style={{ marginBottom: 8 }}>
            <View style={styles.renderContainer}>
                <View style={styles.entryStyle}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontSize: 10, color: colors.white, fontFamily: Fonts.regular }}
                    >
                        {section.title}
                    </Text>
                </View>
                <MaterialCommunityIcon
                    onPress={() => handleDelete(section.sectionIndex)}
                    name="trash-can"
                    size={18}
                    color={colors.thirdText}
                />
            </View>
        </View>
    ), [handleDelete]);

    // Render Each Draw Time Item
    const renderSectionItem = useCallback(({ item }) => (
        item.type === 'betRow' ?
            <View style={styles.betContainer}>
                <View style={styles.deleteWrapper}>
                    <TouchableOpacity onPress={() => handleDeleteTime(item.sectionIndex, item.drawTime)}>
                        <MaterialCommunityIcon
                            name="trash-can"
                            size={15}
                            color={colors.thirdText}
                        />
                    </TouchableOpacity>
                </View>
                {Number(item.amount[0]) > 0 && (
                    <View style={styles.cashpotContainer}>
                        <View style={styles.col1}>
                            <Text allowFontScaling={false} style={[styles2.title, styles2.cashpotNumber]}>
                                {item.number?.toString().length === 1 ? '0' + item.number?.toString() : item.number}
                            </Text>
                        </View>
                        <View style={styles.col2}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                {'Straight'}
                            </Text>
                        </View>
                        <View style={styles.col3}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                {convertTo12Hour(isEnabled, item.drawTime)}
                            </Text>
                        </View>
                        <View style={styles.col4}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                $ {formatToTwoDecimalPlaces(item.amount[0])}
                            </Text>
                        </View>
                    </View>
                )}
                {Number(item.amount[1]) > 0 && (
                    <View style={styles.cashpotContainer}>
                        <View style={styles.col1}>
                            <Text allowFontScaling={false} style={[styles2.title, styles2.cashpotNumber]}>
                                {item.number?.toString().length === 1 ? '0' + item.number?.toString() : item.number}
                            </Text>
                        </View>
                        <View style={styles.col2}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                {'Box'}
                            </Text>
                        </View>
                        <View style={styles.col3}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                {convertTo12Hour(isEnabled, item.drawTime)}
                            </Text>
                        </View>
                        <View style={styles.col4}>
                            <Text allowFontScaling={false} style={[styles2.title2]}>
                                $ {formatToTwoDecimalPlaces(item.amount[1])}
                            </Text>
                        </View>
                    </View>
                )}
                {
                    Number(item.amount[2]) > 0 && (
                        <View style={styles.megaContainer}>
                            <View style={styles.col1}>
                                <Yellow style={{ width: 15, height: 15 }} />
                            </View>
                            <View style={styles.col2}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    Megaball
                                </Text>
                            </View>
                            <View style={styles.col3}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    {convertTo12Hour(isEnabled, item.drawTime)}
                                </Text>
                            </View>
                            <View style={styles.col4}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    $ {formatToTwoDecimalPlaces(item.amount[2])}
                                </Text>
                            </View>
                        </View>
                    )
                }
                {
                    Number(item.amount[3]) > 0 && (
                        <View style={styles.monstaContainer}>
                            <View style={styles.col1}>
                                <Red style={{ width: 15, height: 15 }} />
                            </View>
                            <View style={styles.col2}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    Monstaball
                                </Text>
                            </View>
                            <View style={styles.col3}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    {convertTo12Hour(isEnabled, item.drawTime)}
                                </Text>
                            </View>
                            <View style={styles.col4}>
                                <Text allowFontScaling={false} style={[styles2.title2]}>
                                    $ {formatToTwoDecimalPlaces(item.amount[3])}
                                </Text>
                            </View>
                        </View>
                    )
                }
            </View >
            :
            <View style={styles.renderContainer}>
                <View style={styles.entryStyle}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontSize: 10, color: colors.white, fontFamily: Fonts.regular }}
                    >
                        Entry {item.entry + 1}
                    </Text>
                </View>
                <View style={[styles.entryStyle,{marginRight:'auto',marginStart:10}]}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontSize: 10, color: colors.white, fontFamily: Fonts.regular }}
                    >
                        {item?.gameType}
                    </Text>
                </View>
                <MaterialCommunityIcon
                    onPress={() => handleDelete(item.entry)}
                    name="trash-can"
                    size={18}
                    color={colors.thirdText}
                />
            </View>


    ), [handleDeleteTime]);

    // Render the header component
    const renderHeader = useMemo(() => (
        <View style={{ padding: 0 }}>
            <View style={{ marginVertical: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                    allowFontScaling={false}
                    style={[styles2.title, { width: 'auto' }]}
                >
                    View Details
                </Text>
                <TouchableOpacity onPress={() => { setTotalBets([]); Vibration.vibrate(100) }} style={[styles2.numBtn, { width: 'auto', paddingHorizontal: 15, marginBottom: 0 }]}>
                    <Text allowFontScaling={false} style={[styles2.title2, { textAlign: 'center', width: 'auto' }]}>Clear All</Text>
                </TouchableOpacity>
            </View>
            {/* Header Row */}
            <View
                style={[
                    styles.headerRow,
                    { backgroundColor: colors.blue2 },
                ]}
            >
                <View style={{ width: '13%' }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles2.cardLabel, { color: colors.white, fontSize: 12 }]}
                    >
                        Bet #
                    </Text>
                </View>
                <View style={{ width: '30%' }}>
                    <Text
                        allowFontScaling={false}
                        style={[
                            styles2.cardLabel,
                            { color: colors.white, fontSize: 12, paddingHorizontal: 8 },
                        ]}
                    >
                        Game
                    </Text>
                </View>
                <View style={{ width: '29%' }}>
                    <Text
                        allowFontScaling={false}
                        style={[
                            styles2.cardLabel,
                            { color: colors.white, fontSize: 12, paddingHorizontal: 8 },
                        ]}
                    >
                        Drawtime
                    </Text>
                </View>
                <View style={{ width: '28%' }}>
                    <Text
                        allowFontScaling={false}
                        style={[
                            styles2.cardLabel,
                            { color: colors.white, fontSize: 12, paddingHorizontal: 8 },
                        ]}
                    >
                        Amount
                    </Text>
                </View>
            </View>
        </View>
    ), []);

    // Render the footer component
    const renderFooter = useMemo(() => (
        <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
            <Text
                allowFontScaling={false}
                style={[styles2.title, { textAlign: 'right', fontSize: 13 }]}
            >
                Grand Total Amount ${formatToTwoDecimalPlaces(getGrandTotalAmount(totalBets))}
            </Text>
        </View>
    ), [totalBets, getGrandTotalAmount]);
    
    return (
        <>
            <Loader spinning={spinning} />
            <FlashList
                data={flatData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSectionItem}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles2.card}
                estimatedItemSize={140}
                decelerationRate={'fast'}
            />
            {/* Customer Details and Payment Section */}
            <View>
                <View style={[styles2.card, { marginTop: 8, paddingTop: 10 }]}>
                    <Text allowFontScaling={false} style={[styles2.title, { marginBottom: 10, }]}>Enter Customer Details</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[{ width: '46%' }]}>
                            <Text allowFontScaling={false} style={[styles2.inputLabel]}><Text style={{ color: colors.white }}>Name</Text> (Optional)</Text>
                            <TextInputWithIcon
                                iconName="person"
                                placeholder="Enter name"
                                value={payload.name}
                                onChangeText={(e) => setPayload({ ...payload, name: e })}
                            />
                        </View>
                        <View style={[{ width: '53%' }]}>
                            <Text allowFontScaling={false} style={[styles2.inputLabel]}><Text style={{ color: colors.white }}>Contact</Text> (Optional)</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={[styles2.container2, { width: '25%' }]}>
                                    <SelectDropdown
                                        data={countryCodes}
                                        onSelect={(selectedItem, index) => {
                                            setPayload({ ...payload, country: selectedItem.id })
                                        }}
                                        renderButton={(selectedItem, isOpened) => {
                                            return (
                                                <View style={styles2.input}>
                                                    <Text allowFontScaling={false} style={[styles2.dropdownButtonTxtStyle, { color: colors.secondaryText, fontSize: 12, paddingVertical: 0 }]}>
                                                        {payload.country}
                                                    </Text>
                                                </View>
                                            );
                                        }}
                                        renderItem={(item, index, isSelected) => {
                                            return (
                                                <View style={{ ...styles2.dropdownItemStyle, ...(isSelected || item.id === payload.country && { backgroundColor: colors.secondaryBg }) }}>
                                                    <Text allowFontScaling={false} style={{ color: colors.thirdText }}>{item.name}({item.id})</Text>
                                                </View>
                                            );
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        dropdownStyle={{ width: '90%', marginLeft: '-45%', marginTop: '-5%', borderRadius: 4, overflow: 'hidden', backgroundColor: colors.darkBg }}
                                    />
                                </View>
                                <View style={{ width: '74%' }}>
                                    <TextInputWithIcon
                                        iconName="phone-android"
                                        placeholder="Enter No. "
                                        value={payload.contact}
                                        keyboardType='numeric'
                                        onChangeText={(e) => setPayload({ ...payload, contact: e })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, paddingVertical: 8 }}>
                    <MaterialCommunityIcon onPress={() => setChecked(!checked)} name={checked ? "checkbox-marked" : "checkbox-blank-outline"} color={colors.blue} size={20} />
                    <Text allowFontScaling={false} style={[styles2.inputLabel, { marginStart: 5, color: colors.thirdText }]}>Send confirmation via SMS?</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10 }}>

                    <TouchableOpacity onPress={() => setViewTotals(false)} style={{ backgroundColor: colors.blue, paddingVertical: 10, borderRadius: 4, marginVertical: 10, marginTop: 5, width: '48%', flexDirection: 'row', justifyContent: 'center' }}>
                        <MaterialCommunityIcon name={"plus"} color={colors.white} size={20} />
                        <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, textAlign: 'center' }}> Add More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePay} style={{ backgroundColor: colors.blue, paddingVertical: 10, borderRadius: 4, marginVertical: 10, marginTop: 5, width: '48%' }}>
                        <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, textAlign: 'center' }}>Pay ${formatToTwoDecimalPlaces(getGrandTotalAmount(totalBets))} & Print</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </>
    );
};

export default ViewDetails;
