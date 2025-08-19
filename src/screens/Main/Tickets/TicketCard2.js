import Title from '../../../Components/Title/Title'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Style'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import fonts from '../../../helpers/fonts'
import { useNavigation } from '@react-navigation/native'
import Yellow from '../../../static/images/yellow.svg'
import Red from '../../../static/images/red.svg'
import moment from 'moment-timezone';
import globalStyles from '../../../helpers/globalStyles'
import CustomModal from '../../../Components/CustomModal/CustomModal'
import QRCode from 'react-native-qrcode-svg';
import {colors} from './../../../helpers/colors';
import { useTicketStore } from './../../../Store/TicketStore/TicketStore';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';
import { formatToTwoDecimalPlaces } from './../../../helpers/utils';

const Fonts = fonts;
const TicketCard2 = (props) => {
    const purchaseModal = useRef();
    const navigation = useNavigation()
    const { isEnabled } = useHomeStore()
    const { data, count } = props
    const { voidTicket } = useTicketStore()

    const getAmount = () => {
        let t = 0
        for (let i = 0; i < data.games.length; i++) {
            const element = data.games[i];
            t = t + Number(element.bet_amount)
        }
        return t
    }

    const handlePress = () => {
        purchaseModal.current.open()
    }

    return (<>
        <TouchableOpacity onPress={handlePress} style={[count % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow]}>
            <View style={{ width: '12%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText]}>{count}</Text>
            </View>
            <View style={{ width: '20%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText, { color: data?.status.toLowerCase() === 'void' ? colors.red : colors.white }]}>{data?.order_no || '-'}</Text>
            </View>
            <View style={{ width: '13%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText]}>{data?.pick_type==='Pick 3'?'P3':'P4'}</Text>
            </View>
            <View style={{ width: '20%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText, { color: data?.status.toLowerCase() === 'void' ? colors.red : colors.white }]}>$ {data?.status.toLowerCase() === 'void' ? "-" : "+"}{formatToTwoDecimalPlaces(getAmount())}</Text>
            </View>
            <View style={{ width: '35%', paddingHorizontal: 8 }}>
                <Text
                    allowFontScaling={false}
                    style={[globalStyles.rowText, { fontSize: 13, color: data?.status.toLowerCase() === 'void' ? colors.red : colors.white }]}
                >
                    {moment
                        .utc(data.utc_created_at)
                        .tz(moment.tz.guess())
                        .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}
                </Text>
            </View>
        </TouchableOpacity>

        {/* ---------------------------------------------------Transaction Modal------------------------------------------------------- */}
        <CustomModal
            modalContent={
                <ScrollView>
                    <View style={{ width: 100, height: 100, borderWidth: 1.4, borderColor: colors.blue, borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                        <QRCode
                            value={String(data.order_no)}
                            size={80}
                            color="white"
                            backgroundColor="black"
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <View style={[globalStyles.textCard]}>
                            <Text allowFontScaling={false} style={[globalStyles.rowText, { fontFamily: Fonts.regular }]}>Reason : </Text>
                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>{data?.status.toLowerCase() === 'void' ? "Ticket Void" : "Ticket Purchase"}</Text>
                        </View>
                    </View>

                    <View style={[globalStyles.card, { marginVertical: 10 }]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Order ID</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <View style={[globalStyles.textCard, { marginLeft: 0 }]}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{data.order_no || ''}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Date & Time</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {moment
                                        .utc(data.utc_created_at)
                                        .tz(moment.tz.guess())
                                        .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}
                                </Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Lottery</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {data?.lottery_name || '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Draw Time</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {moment
                                        .utc(data.utc_drawDateTime)
                                        .tz(moment.tz.guess())
                                        .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}
                                </Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Customer</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {data?.customer_name || '-'}, {data?.customer_contact}
                                </Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                            <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Lottery Type</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {data?.pick_type}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={[globalStyles.headerRow, { backgroundColor: colors.blue2 }]}>
                        <View style={{ width: '30%', }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Bet</Text>
                        </View>
                        <View style={{ width: '35%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Game</Text>
                        </View>
                        <View style={{ width: '35%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                        </View>
                    </View>
                    {data.games.map((t, c) => {
                        return (
                            <View key={c} style={[(c + 1) % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow, { marginTop: 0 }]}>
                                <View style={{ width: '30%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>
                                        {t.game_name.toLowerCase() === 'straight' || t.game_name.toLowerCase() === 'box' ? t.ticket_number?.toString().length===1?'0'+t.ticket_number?.toString():t.ticket_number : ''}
                                        {t.game_name.toLowerCase() === 'megaball' && 'Gold'}
                                        {t.game_name.toLowerCase() === 'monstaball' && 'Red'}
                                    </Text>
                                </View>
                                <View style={{ width: '35%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{t.game_name}</Text>
                                </View>
                                <View style={{ width: '35%', paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>$ {t?.bet_amount}</Text>
                                </View>
                            </View>
                        )
                    })}
                    <Text style={[styles.title2, { textAlign: 'right', marginTop: 10 }]}>Total Amount ${formatToTwoDecimalPlaces(getAmount())}</Text>
                </ScrollView >
            }
            ref={purchaseModal}
            height={data?.games?.length === 3 ? 620 : data?.games?.length === 2 ? 590 : 550}
            headerTitle={'Purchase Detail'}
        />
    </>)
}

export default TicketCard2