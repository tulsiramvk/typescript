import { View, Text } from 'react-native'
import React from 'react'
import PTRView from 'react-native-pull-to-refresh';
import { StyleSheet } from "react-native";
import fonts from './fonts';
import {colors} from './colors';

const TabDisable = ({ onRefresh }) => {
    const styles = StyleSheet.create({
        block: {
            width: '95%', marginHorizontal: 'auto'
        },
        cardLabel: {
            fontSize: 11, color: colors.thirdText, fontFamily: fonts.regular
        },
    })
    return (
        <PTRView onRefresh={onRefresh}>
            <View style={[styles.block]}>
                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>The Information is disabled by Management for all the Agents.</Text>
            </View>
        </PTRView>
    )
}

export default TabDisable

