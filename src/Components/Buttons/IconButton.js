import React from 'react';
import {
    Text,
    StyleSheet,TouchableOpacity
} from 'react-native';
import colors from '../../helpers/colors';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import fonts from '../../helpers/fonts';

const IconButton = props => {
    const { outline } = props
    const styles = StyleSheet.create({
        button: {
            height: heightPercentageToDP(5),
            borderRadius: widthPercentageToDP(2),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: colors.light.primary,
            paddingHorizontal: widthPercentageToDP(2)
        },
        outline: {
            height: heightPercentageToDP(5),
            borderRadius: widthPercentageToDP(2),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'transparent',
            borderWidth: widthPercentageToDP(0.1),
            borderColor: colors.light.primary,
            paddingHorizontal: widthPercentageToDP(2)
        },
        text: {
            fontSize: heightPercentageToDP(1.7),
            color: '#FFF',
            fontFamily:fonts.semiBold, marginStart: props.icon ? 5 : 0,textAlign:'center'
        },
    });
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={props?.disabled}
            onPress={props.onPress}
            style={[outline ? styles.outline : styles.button, props.buttonStyle]}
        >
            {props.icon}
            <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.text, { color: outline ? colors.dark.primary : '#fff' }, props.titleStyle]}>
                {props.buttonText}
            </Text>

        </TouchableOpacity>
    );
};
export default IconButton;


