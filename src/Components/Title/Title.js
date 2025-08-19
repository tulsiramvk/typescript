import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import FetherIcon from 'react-native-vector-icons/Feather'
import fonts from '../../helpers/fonts'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import {colors} from './../../helpers/colors';

const Title = ({ name, totalBets }) => {
    const navigation = useNavigation()
    const [isModalVisibleRe, setModalVisibleRe] = useState(false);
    const handleBack = () => {
        if (name === 'Lotteries') {
            if (totalBets && totalBets.length > 0) {
                setModalVisibleRe(true)
            } else {
                navigation.goBack()
            }
        } else {
            navigation.goBack()
        }
    }
    return (<>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 0 }}>
            <TouchableOpacity onPress={handleBack}><FetherIcon name={"chevron-left"} size={22} color={colors.white} /></TouchableOpacity>
            <View><Text allowFontScaling={false} style={[{ marginStart: 5, color: colors.white, fontFamily: fonts.medium, fontSize: 16 }]}>{name}</Text></View>
        </View>

        <Modal onBackButtonPress={() => { setModalVisibleRe(false) }} isVisible={isModalVisibleRe} style={{ padding: 0, margin: 0, marginTop: "-10%" }}>
            <View style={styles2.modalWrapper}>
                <Text allowFontScaling={false} style={[styles2.modalTitle]}>Confirm</Text>

                <Text allowFontScaling={false} style={[styles2.modalDesc, { marginVertical: 20 }]}>
                    <Text allowFontScaling={false}>If you go back all your saved bets will be reset.</Text>
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 5 }}>
                    <TouchableOpacity onPress={() => { setModalVisibleRe(false); }} style={[styles2.btn_outline2, { width: '35%', marginEnd: 10 }]}>
                        <Text allowFontScaling={false} style={styles2.btnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setModalVisibleRe(false); navigation.goBack() }} style={[styles2.btn2, { width: '35%' }]}>
                        <Text allowFontScaling={false} style={styles2.btnText}>Reset</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    </>)
}

export default Title

const styles2 = StyleSheet.create({

    btn2: {
        backgroundColor: colors.blue, textAlign: 'center', padding: 10, borderRadius: 6, width: '100%',
        paddingVertical: 8
    },
    btn_outline2: {
        backgroundColor: 'transparent', textAlign: 'center', padding: 10, borderRadius: 6, width: '100%', borderWidth: 1, borderColor: colors.blue
        , paddingVertical: 8
    },

    btnText: {
        color: colors.white, textAlign: 'center', fontFamily: fonts.medium, fontSize: 14
    },
    btnTextIcon: {
        color: colors.white, textAlign: 'center', fontFamily: fonts.medium, fontSize: 12
    },

    btnTextActive: { fontSize: 14, color: "#fff" },
    btnTextInActive: { fontSize: 14, color: colors.white },

    // ---------------------------------------------------------------------------

    modalWrapper: {
        backgroundColor: colors.darkBg,
        padding: '4%',
        paddingVertical: '6%',
        borderRadius: 12,
        marginHorizontal: '4%', borderWidth: 1, borderColor: colors.modalBorder
    },
    modalTitle: {
        color: colors.white, fontFamily: fonts.bold, fontSize: 18
    },
    modalDesc: {
        color: colors.white, fontFamily: fonts.regular, fontSize: 15, width: '90%', marginHorizontal: 'auto', lineHeight: 24
    },
});