import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import fonts from '../../../helpers/fonts'
import moment from 'moment-timezone'
import globalStyles from '../../../helpers/globalStyles'
import CustomModal from '../../../Components/CustomModal/CustomModal'
import {colors} from './../../../helpers/colors';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';
import { formatToTwoDecimalPlaces } from './../../../helpers/utils';

const Fonts = fonts;
const MyCommissionList2 = (props) => {
    const commissionModal = useRef()
    const { data, count } = props
    const { isEnabled } = useHomeStore()
    const handlePress = () => {
        commissionModal.current.open()
    }
    return (
        <>
            <TouchableOpacity onPress={handlePress} style={[count % 2 == 0 ? globalStyles.evenRow : globalStyles.oddRow]}>
                <View style={{ width: '20%', borderRightWidth: 0.4, borderRightColor: colors.blue }}>
                    <Text allowFontScaling={false} style={[globalStyles.rowText]}>{count}</Text>
                </View>
                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                    <Text allowFontScaling={false} style={[globalStyles.rowText, { color: data.commission_type !== 'Buy' ? colors.red : colors.white }]}>{data.commission_type !== 'Buy' ? '-' : '+'}{formatToTwoDecimalPlaces(data?.commission_amount)}</Text>
                </View>
                <View style={{ width: '48%', paddingHorizontal: 8 }}>
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
                        <Text allowFontScaling={false} style={[globalStyles.amountTitle, { marginTop: 2, color: data.commission_type !== "Buy" ? colors.red : colors.green2 }]}>{data.commission_type !== 'Buy' ? '-' : '+'}$ {formatToTwoDecimalPlaces(data?.commission_amount)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <View style={[globalStyles.textCard]}>
                                <Text allowFontScaling={false} style={[globalStyles.rowText, { fontFamily: Fonts.regular }]}>Reason :</Text>
                                <Text allowFontScaling={false} style={[globalStyles.rowText]}> {data.commission_type !== "Buy" ? 'Ticket Void' : "Ticket Purchase"}</Text>
                            </View>
                        </View>

                        <View style={[globalStyles.card, { marginVertical: 10 }]}>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Lottery Name</Text>
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
                                        {data?.commission_from || '-'}
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
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Commission %</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.rowText, { textAlign: 'left' }]}>
                                        {data?.commission_per+'%' }
                                    </Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }]}>
                                <View style={{ width: '32%', borderRightWidth: 0.4, borderRightColor: colors.blue, paddingHorizontal: 8 }}>
                                    <Text allowFontScaling={false} style={[globalStyles.headerText, { textAlign: 'left' }]}>Purchase Amount</Text>
                                </View>
                                <View style={{ width: '68%', paddingHorizontal: 8, paddingLeft: 15 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[globalStyles.rowText, { textAlign: 'left' }]}
                                    >
                                        $ {data?.ticket_amount}
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

                    </ScrollView>
                }
                ref={commissionModal}
                height={450}
                headerTitle={'Commission Details'}
            />
        </>
    )
}

export default MyCommissionList2