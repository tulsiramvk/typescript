import { View, Text } from 'react-native'
import React from 'react'
import styles2 from './Style.js'
import { colors } from '../../../../../helpers/colors.js'

const SoldCard = ({ data }) => {    
        
    return (<>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
            <View style={{ width: 40, height: 40 }}>
                <View style={{ borderWidth: 1, borderColor: colors.blue, borderRadius: 8, width: '90%', height: '90%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                    <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>{data['ticket_number']?.toString().length===1?'0'+data['ticket_number']?.toString():data['ticket_number']}</Text>
                </View>
            </View>
            <View style={{ width: 100 }}><Text allowFontScaling={false} style={[styles2.title,{fontSize:13}]}> $ {data['remaining_bet']}</Text></View>
        </View>
    </>)
}

export default SoldCard