import { View, Text, ImageBackground, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import bgImage from '../../static/images/main_background.jpg'

const MainBackground = ({ children }) => {
    const styles = StyleSheet.create({
        scene: {
            flex: 1, width: '100%'
        },
    });
    return (
        <ImageBackground source={bgImage} resizeMode="stretch" style={[styles.scene,{paddingTop:25}]}>
            {children}
        </ImageBackground>
    )
}

export default MainBackground