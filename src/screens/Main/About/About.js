import MainBackground from '../../../Components/MainBackground/MainBackground.js';
import Title from '../../../Components/Title/Title.js';
import { View, Text, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview';
import styles from './Style.js'
import PTRView from 'react-native-pull-to-refresh';
import { useOtherStore } from '../../../Store/OtherStore/OtherStore.js';

const About = () => {
    const { fetchAbout, setAbout, about } = useOtherStore()
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
        fetchAbout()
            .then(res => {
                setAbout(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing])


    return (
        <MainBackground>
            <View style={[styles.block]}>
                <Title name="About Us" />
            </View>
            <PTRView onRefresh={onRefresh} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {about ?
                        <View style={[styles.block]}>
                            <View style={{ width: '100%', height: 150, marginTop: 10 }}>
                                <Image style={{ width: '100%', height: '100%', objectFit: 'cover' }} source={{ uri: about.image }} />
                            </View>
                            <Text allowFontScaling={false} style={[styles.title, { paddingVertical: 20 }]}>{about.title}</Text>
                            <View style={{ minHeight: 400 }}>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{
                                        html: `
                                        <style>p,span,div,font{font-size:35px !important;
                                        background-color:transparent !important;
                                        color:white !important;                       
                                        }</style>
                                        <div style="color: white; font-size:35px;">
                                            ${about.content}
                                        </div>
                                    `
                                    }}
                                    style={{ backgroundColor: 'transparent', minHeight: 300 }}
                                    scrollEnabled={true}
                                    javaScriptEnabled={true}
                                />
                            </View>
                        </View>

                        : null}
                </ScrollView>
            </PTRView>
        </MainBackground>
    )
}

export default About