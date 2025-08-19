import { View, Text } from 'react-native'
import React from 'react'
import styles2 from './Style.js'
import fonts from '../../../../../helpers/fonts.js'
import White from '../../../../../static/images/white.svg'
import Yellow from '../../../../../static/images/yellow.svg'
import Red from '../../../../../static/images/red.svg'
import moment from 'moment-timezone'
import { useHomeStore } from '../../../../../Store/HomeStore/HomeStore.js'
import {colors} from './../../../../../helpers/colors';

const Fonts = fonts;
const RecentDrawList = ({ data, count, lid }) => {
    const { isEnabled } = useHomeStore()
        
    return (
        <>
            <View style={[styles2.card]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingVertical: 10, alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.blue2, borderRadius: 3, padding: 5, paddingHorizontal: 8 }}><Text allowFontScaling={false} style={{ fontSize: 12, color: colors.white, fontFamily: Fonts.regular }}>{count + 1}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text allowFontScaling={false} style={[styles2.cardLabel, { fontFamily: Fonts.medium }]}>Draw Time : </Text><Text allowFontScaling={false} style={[styles2.cardLabel, { color: colors.white }]}>{moment.utc(data.utc_draw_time).tz(moment.tz.guess()).format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}</Text></View>
                </View>

                <View style={{ backgroundColor: colors.blue3, padding: 10, paddingVertical: 8 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '48%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={[styles2.cardLabel, { fontSize: 12 }]}>Draw No : </Text>
                                <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 14 }}>{data.draw_no}</Text>
                            </View>
                            <Text allowFontScaling={false} style={[styles2.title, { marginVertical: 5, fontSize: 12 }]}>{'Pick 3'} : <Text allowFontScaling={false} style={{ fontSize: 14 }}>{data?.pick3 ?? '-'}</Text></Text>
                            <Text allowFontScaling={false} style={[styles2.title, { marginVertical: 5, fontSize: 12 }]}>{'Pick 4'} : <Text allowFontScaling={false} style={{ fontSize: 14 }}>{data?.pick4 ?? '-'}</Text></Text>
                        </View>
                        {lid?.type !=="Pick2" ?
                        <View style={{ width: '49%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: '48%' }}>
                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, textAlign: 'center' }]}>Megaball</Text>
                                {data.megaball === 'red' && <Red style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                                {data.megaball === 'white' && <White style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                                {data.megaball === 'yellow' && <Yellow style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                            </View>
                            <View style={{ width: '48%' }}>
                                <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, textAlign: 'center' }]}>Monstaball</Text>
                                {data.monstaball === 'red' && <Red style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                                {data.monstaball === 'white' && <White style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                                {data.monstaball === 'yellow' && <Yellow style={{ width: 15, height: 15, marginHorizontal: 'auto', marginVertical: 8 }} />}
                            </View>
                        </View>
                        :null}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, alignItems: 'center' }}>

                </View>

            </View>
        </>
    )
}

export default RecentDrawList