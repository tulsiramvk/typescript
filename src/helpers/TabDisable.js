import { View, Text } from 'react-native'
import React from 'react'
import PTRView from 'react-native-pull-to-refresh';
import { StyleSheet } from "react-native";
import { colors } from './Colors';
import Fonts from './Fonts';

const TabDisable = ({ onRefresh }) => {
    const styles = StyleSheet.create({
        block: {
            width: '95%', marginHorizontal: 'auto'
        },
        cardLabel: {
            fontSize: 11, color: colors.thirdText, fontFamily: Fonts.regular
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

