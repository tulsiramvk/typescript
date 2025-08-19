import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from './Style'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import fonts from '../../../helpers/fonts'
import moment from 'moment-timezone'
import { useNavigation } from '@react-navigation/native'
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'
import {colors} from './../../../helpers/colors';

const Fonts = fonts;
const SupportList = (props) => {
    const navigation = useNavigation()
    const {isEnabled} = useHomeStore()
    const { P, currentPage, data, count } = props
    return (
        <View style={[styles.card]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingVertical: 8, alignItems: 'center' }}>
                <View style={{ backgroundColor: colors.blue2, borderRadius: 3, padding: 3, paddingHorizontal: 8 }}><Text allowFontScaling={false} style={{ fontSize: 11, color: colors.white, fontFamily: Fonts.bold }}>{count + 1}</Text></View>
                <View><Text allowFontScaling={false} style={[styles.cardLabel]}>Last Reply: <Text allowFontScaling={false} style={[{ color: colors.white }]}>{moment.utc(data.utc_last_reply).tz(moment.tz.guess()).format(isEnabled?'lll':'MMM DD, YYYY HH:mm A')}</Text></Text></View>
            </View>
            <View style={{ backgroundColor: colors.blue3, padding: 10, paddingVertical: 8 }}>
                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 12 }]}>Subject : <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 14 }}> [Ticket# {data.ticket_number}] {data.subject}</Text></Text>
                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 12, marginVertical: 6 }]}>Status : <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 15 }}> {data.status}</Text></Text>
                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 12 }]}>Priority : <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 14 }}> {data.priority}</Text></Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end',paddingVertical:5,marginHorizontal:10}}>
                <TouchableOpacity onPress={()=>navigation.navigate('ViewSupport',{id:data.ticket_number,subject:data.subject})} style={[styles.btnIcon, { paddingVertical: 2 }]}>
                    <View><IoniconsIcon name={"eye"} color={colors.white} size={16} /></View>
                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> View</Text></View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default SupportList