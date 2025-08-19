import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, {  useRef, useState } from 'react'
import styles from './Style'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import fonts from '../../../helpers/fonts'
import Tick from '../../../static/images/right-tick.svg';
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import moment from 'moment-timezone'
import globalStyles from '../../../helpers/globalStyles'
import CustomModal from '../../../Components/CustomModal/CustomModal'
import {colors} from './../../../helpers/colors';
import { useTicketStore } from './../../../Store/TicketStore/TicketStore';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';
import { formatToTwoDecimalPlaces } from './../../../helpers/utils';

const Fonts = fonts;
const WinningCard2 = (props) => {
    const winningModal = useRef();
    const navigation = useNavigation()
    const { data, currentPage, count, setReload2, reload2 } = props
    const { payOut } = useTicketStore()
    const { isEnabled } = useHomeStore()
    const [gameName, setGameName] = useState('')
    const [isModalVisible, setModalVisible] = useState(false);
    const [spinning, setSpinning] = useState(false)

    const handlePress = () => {
        winningModal.current.open()
    }    

    return (<>
        <TouchableOpacity onPress={handlePress} style={[count % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow]}>
            <View style={{ width: '12%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText]}>{count}</Text>
            </View>
            <View style={{ width: '23%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                <Text allowFontScaling={false} numberOfLines={1} style={[globalStyles.rowText]}>{data?.customer_name || '-'}</Text>
            </View>
            <View style={{ width: '19%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                <Text allowFontScaling={false} style={[globalStyles.rowText]}>$ {formatToTwoDecimalPlaces(data?.total_bet)}</Text>
            </View>
            <View style={{ width: '25%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                <Text
                    allowFontScaling={false}
                    style={[globalStyles.rowText, { fontSize: 12 }]}
                >
                    {moment
                        .utc(data.utc_created_at)
                        .tz(moment.tz.guess())
                        .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}
                </Text>
            </View>
            <View style={{ width: '20%', paddingHorizontal: 6 }}>
                {data.status === 'paid' ?
                    <TouchableOpacity disabled={true} style={[styles.btnIcon, { paddingVertical: 3, backgroundColor: colors.green }]}>
                        <View><IoniconsIcon name={"checkmark"} color={colors.white} size={12} /></View>
                        <View><Text allowFontScaling={false} style={[styles.btnTextIcon, { color: colors.white }]}> Paid</Text></View>
                    </TouchableOpacity> :
                    <TouchableOpacity disabled={true} style={[styles.btnIcon, { paddingVertical: 3, backgroundColor: colors.red }]}>
                        <View><Text allowFontScaling={false} style={[styles.btnTextIcon, { color: colors.white }]}>Unpaid</Text></View>
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>

        {/* ---------------------------------------------------Transaction Modal------------------------------------------------------- */}
        <CustomModal
            modalContent={
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {data?.status === 'paid' && <Tick />}
                            <Text allowFontScaling={false} style={[globalStyles.amountTitle, { marginStart: 5, fontSize: 16, color: data?.status === 'paid' ? colors.green : colors.red }]}>{data?.status === 'paid' ? 'Paid' : 'Unpaid'}</Text>
                        </View>
                        <View>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>{data?.status === 'paid' ? 'Payout By : ' : null}{data?.paid_by}</Text>
                        </View>
                    </View>

                    <View style={[globalStyles.card, { marginVertical: 10 }]}>
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
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Agent</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {data?.agent_name || '-'}
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
                                <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Draw No</Text>
                            </View>
                            <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[globalStyles.rowText, { textAlign: 'left' }]}
                                >
                                    {data?.draw_no}
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
                                    {data?.customer_name}, {data?.customer_contact}
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
                    <Text allowFontScaling={false} style={[globalStyles.rowText, { textAlign: 'left', marginBottom: 10 }]}>Won Games: </Text>
                    <View style={[globalStyles.headerRow, { backgroundColor: colors.blue2 }]}>
                        <View style={{ width: '24%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Game</Text>
                        </View>
                        <View style={{ width: '13%', }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Bet</Text>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Result</Text>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 0 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Bet Amount</Text>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.headerText]}>Win Amt</Text>
                        </View>
                    </View>
                    {data.games.map((t, c) => {
                        return (
                            <View key={c} style={[(c + 1) % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow, { marginTop: 0 }]}>
                                <View style={{ width: '24%', paddingHorizontal: 8, borderRightWidth: 0.4, borderRightColor: colors.blue, }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{t.game_name}</Text>
                                </View>
                                <View style={{ width: '13%', borderRightWidth: 0.4, borderRightColor: colors.blue, }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{t?.bet?.toString().length===1?'0'+t?.bet?.toString():t?.bet}</Text>
                                </View>
                                <View style={{ width: '21%', paddingHorizontal: 8, borderRightWidth: 0.4, borderRightColor: colors.blue, }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{t.result?.toString().length===1?'0'+t.result?.toString():t.result}</Text>
                                </View>
                                <View style={{ width: '21%', paddingHorizontal: 8, borderRightWidth: 0.4, borderRightColor: colors.blue, }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>${formatToTwoDecimalPlaces(t.bet_amount)}</Text>
                                </View>
                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>${formatToTwoDecimalPlaces(t.win_amount)}</Text>
                                </View>
                            </View>
                        )
                    })}

                    <View style={[globalStyles.headerRow, { backgroundColor: null }]}>
                        <View style={{ width: '24%', paddingHorizontal: 8 }}>
                        </View>
                        <View style={{ width: '13%', }}>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 8 }}>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 0 }}>
                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Bet: ${data.total_bet}</Text>
                        </View>
                        <View style={{ width: '21%', paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Win: ${data.total_won}</Text>
                        </View>
                    </View>
                </ScrollView >
            }
            ref={winningModal}
            height={data?.games?.length > 1 ? 550 : 490}
            headerTitle={'Winning Detail'}
        />
    </>)
}

export default WinningCard2