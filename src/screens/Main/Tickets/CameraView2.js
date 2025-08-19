import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import styles from './Style'
import {
    Camera,
    CameraRuntimeError,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';

const CameraView2 = ({ setShow, show, hasPermission, setHasPermission }) => {
    const navigation = useNavigation()
    // --------------------------Scanner Work---------------------------------------
    const devices = useCameraDevice('back');

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            setShow(false)
            navigation.navigate('VoidResult', { id: codes })
        }
    })

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized' || status === "granted" ? true : false);
        })();
    }, []);

    return (
        <View style={styles.fullScreenCamera}>
            <View style={[styles.camera]}>
                <View style={{ width: '80%', height: '60%' }}>
                    {hasPermission && <Camera device={devices} isActive={true} style={{ width: '100%', height: '100%' }} codeScanner={codeScanner} />}
                    {!hasPermission && <Text allowFontScaling={false} style={[styles.title, { fontSize: 14, margin: 'auto', textAlign: 'center', marginTop: 10 }]}>Camera permission denied. Please grant camera permission from setting.</Text>}
                </View>
                <View style={{ width: '81%', marginTop: 15 }}>
                    <TouchableOpacity onPress={() => setShow(false)} style={[styles.btnIcon, { paddingVertical: 3 }]}>
                        <View><Text allowFontScaling={false} style={[styles.btnTextIcon, { padding: 5, fontSize: 16 }]}> Close Scanner </Text></View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CameraView2