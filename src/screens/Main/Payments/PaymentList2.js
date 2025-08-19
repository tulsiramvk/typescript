import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../../helpers/globalStyles';
import moment from 'moment';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import fonts from '../../../helpers/fonts';
import {colors} from './../../../helpers/colors';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';

const Fonts = fonts;
const PaymentList2 = (props) => {
    const transactionModal = useRef();
    const depositModal = useRef();
    const withdrawalaModal = useRef();
    const { P, currentPage, data, count } = props;
    const { isEnabled } = useHomeStore();
    const handlePress = () => {
        if (currentPage === P.T) {
            transactionModal.current.open()
        }
        else if (currentPage === P.D) {
            depositModal.current.open()
        }
        else if (currentPage === P.W) {
            withdrawalaModal.current.open()
        }
    }

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={[count % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow]}>
                <View style={{ width: '14%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{count}</Text>
                </View>
                <View style={{ width: '21%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{currentPage === P.D || currentPage === P.W ? data?.trx : data?.order_no || '-'}</Text>
                </View>
                <View style={{ width: '21%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                    <Text allowFontScaling={false} style={[globalStyles.rowText, { color: data.trx_type === "-" ? colors.red : colors.white }]}>{data.trx_type}{data?.amount}</Text>
                </View>
                <View style={{ width: '43%', paddingHorizontal: 8 }}>
                    <Text
                        allowFontScaling={false}
                        style={[globalStyles.rowText, { fontSize: 13 }]}
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
                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                        <Text allowFontScaling={false} style={[globalStyles.amountTitle, { marginTop: 2, color: data.trx_type === "-" ? colors.red : colors.green2 }]}>{data.trx_type}$ {data?.amount}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <View style={[globalStyles.textCard]}>
                                <Text allowFontScaling={false} style={[globalStyles.rowText, { fontFamily: Fonts.regular }]}>Reason :</Text>
                                <Text allowFontScaling={false} style={[globalStyles.rowText]}>{data.details}</Text>
                            </View>
                        </View>

                        <View style={[globalStyles.card, { marginVertical: 10 }]}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Transaction ID</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText, { textAlign: 'left' }]}>
                                        {data?.trx}
                                    </Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Order ID</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        {data?.order_no || '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Post Balance</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        $ {data?.post_balance}
                                    </Text>
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
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Customer</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        {data?.customerDetails?.customer_name || '-'}, {data?.customerDetails?.customer_contact || '-'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[globalStyles.headerRow, { backgroundColor: colors.blue2 }]}>
                            <View style={{ width: '14%', }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Bet</Text>
                            </View>
                            <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Game</Text>
                            </View>
                            <View style={{ width: '43%', paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Draw Time</Text>
                            </View>
                            <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                            </View>
                        </View>
                        {currentPage === P.T && data?.bet?.map((m, cc) => {
                            return <View style={{ marginBottom: 8 }} key={cc}>
                                {m?.games.map((t, c) => {
                                    return <View key={c} style={[(c + 1) % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow, { marginTop: 0 }]}>
                                        <View style={{ width: '12%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>
                                                {t.game_name.toLowerCase() === 'box' ?  t.ticket_number?.toString().length===1?'0'+t.ticket_number?.toString():t.ticket_number : ''}
                                                {t.game_name.toLowerCase() === 'straight' ?  t.ticket_number?.toString().length===1?'0'+t.ticket_number?.toString():t.ticket_number :''}
                                                {t.game_name.toLowerCase() === 'megaball' && 'Gold'}
                                                {t.game_name.toLowerCase() === 'monstaball' && 'Red'}
                                            </Text>
                                        </View>
                                        <View style={{ width: '23%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>{t.game_name}</Text>
                                        </View>
                                        <View style={{ width: '43%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                            <Text
                                                allowFontScaling={false}
                                                style={[globalStyles.rowText, { fontSize: 13 }]}
                                            >
                                                {moment
                                                    .utc(m.utc_drawDateTime)
                                                    .tz(moment.tz.guess())
                                                    .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}
                                            </Text>
                                        </View>
                                        <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>$ {t?.bet_amount}</Text>
                                        </View>
                                    </View>
                                })}

                            </View>

                        })}
                    </ScrollView>
                }
                ref={transactionModal}
                height={550}
                headerTitle={'Transaction Detail'}
            />
            {/* ---------------------------------------------------Deposit Modal------------------------------------------------------- */}
            <CustomModal
                modalContent={
                    <>
                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                        <Text allowFontScaling={false} style={[globalStyles.amountTitle, { marginTop: 2 }]}>+$ {data?.amount}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <View style={[globalStyles.textCard]}>
                                <Text allowFontScaling={false} style={[globalStyles.rowText, { fontFamily: Fonts.regular }]}>Reason :</Text>
                                <Text allowFontScaling={false} style={[globalStyles.rowText]}> Deposit by {data.deposit_by || 'Admin'}</Text>
                            </View>
                        </View>

                        <View style={[globalStyles.card, { marginVertical: 10 }]}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Transaction ID</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText, { textAlign: 'left' }]}>
                                        {data?.trx}
                                    </Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Post Balance</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        $ {data?.post_amount}
                                    </Text>
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
                        </View>
                    </>
                }
                ref={depositModal}
                height={300}
                headerTitle={'Deposit Detail'}
            />
            {/* ---------------------------------------------------Withdrawal Modal------------------------------------------------------- */}
            <CustomModal
                modalContent={
                    <>
                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                        <Text allowFontScaling={false} style={[globalStyles.amountTitle, { marginTop: 2, color: colors.red }]}>-$ {data?.amount}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <View style={[globalStyles.textCard]}>
                                <Text allowFontScaling={false} style={[globalStyles.rowText, { fontFamily: Fonts.regular }]}>Reason :</Text>
                                <Text allowFontScaling={false} style={[globalStyles.rowText]}> Withdrawal by {data.withdraw_by || 'Admin'}</Text>
                            </View>
                        </View>

                        <View style={[globalStyles.card, { marginVertical: 10 }]}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Transaction ID</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText, { textAlign: 'left' }]}>
                                        {data?.trx}
                                    </Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Post Balance</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        $ {data?.post_amount}
                                    </Text>
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
                        </View>
                    </>
                }
                ref={withdrawalaModal}
                height={300}
                headerTitle={'Withdrawal Detail'}
            />
        </>
    );
};

export default PaymentList2;
