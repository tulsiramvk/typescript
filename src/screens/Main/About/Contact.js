import MainBackground from '../../../Components/MainBackground/MainBackground.js'
import Title from '../../../Components/Title/Title.js'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Style.js'
import fonts from '../../../helpers/fonts.js'
import PTRView from 'react-native-pull-to-refresh';
import {colors} from './../../../helpers/colors';
import { useOtherStore } from './../../../Store/OtherStore/OtherStore';

const Fonts = fonts;
const Contact = () => {
    const { fetchContact, setContact, contact } = useOtherStore()
    const [spinning, setSpinning] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };

    useEffect(() => {
        setSpinning(true)
        fetchContact()
            .then(res => {
                setContact(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing])

    console.log(contact);
    

    return (
        <MainBackground>
            <View style={[styles.block]}>
                <Title name="Contact Us" />
            </View>
            <PTRView onRefresh={onRefresh} >
                <ScrollView>
                    {contact &&
                        <View style={[styles.block, { marginTop: 30 }]}>
                            <View style={[styles.card, { padding: 10 }]}>
                                <Text allowFontScaling={false} style={[styles.title, { marginBottom: 5 }]}>{contact.title}</Text>
                                <Text allowFontScaling={false} style={[styles.cardLabel]}>{contact.content}</Text>
                                <View style={{ height: 0.4, backgroundColor: colors.thirdText, width: '100%', marginTop: 10, marginBottom: 5 }}></View>
                                <View style={{ marginVertical: 5 }}>
                                    <Text allowFontScaling={false} style={[styles.cardLabel]}>Phone</Text>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { color: colors.white, fontFamily: Fonts.medium }]}>{contact.phone}</Text>
                                </View>
                                <View style={{ marginVertical: 5 }}>
                                    <Text allowFontScaling={false} style={[styles.cardLabel]}>Email</Text>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { color: colors.white, fontFamily: Fonts.medium }]}>{contact.email}</Text>
                                </View>
                                <View style={{ marginVertical: 5 }}>
                                    <Text allowFontScaling={false} style={[styles.cardLabel]}>Address</Text>
                                    <Text allowFontScaling={false} style={[styles.cardLabel, { color: colors.white, fontFamily: Fonts.medium }]}>{contact.address}</Text>
                                </View>
                            </View>
                            
                        </View>
                    }
                </ScrollView>
            </PTRView>

        </MainBackground>
    )
}

export default Contact