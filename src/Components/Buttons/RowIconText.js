import React from 'react';
import {
    Text,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useColorStore } from '../../Store/ThemeStore/ThemeStore';
import fonts from '../../Utils/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler'

const RowIconText = props => {
    const { color } = useColorStore()
    const styles = StyleSheet.create({
        button: {
            width: '100%',
            height: 50,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: color.secondaryBg,
            paddingHorizontal:'5%',marginBottom:'5%'
        },
        menutext: {
            fontWeight: '500', marginLeft: 15, fontFamily: fonts.mediump, color: color.primaryFontColor,fontSize:15
        },
    });
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={props?.disabled}
            onPress={props.onPress}
            style={[styles.button, props.buttonStyle]}
        >
            {props.icon}
            <Text allowFontScaling={false} style={[styles.menutext,props.titleStyle]}>{props.buttonText}</Text>
        </TouchableOpacity>
    );
};
export default RowIconText;
