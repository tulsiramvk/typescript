import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../helpers/colors';
import IconProvider from '../IconProvider/IconProvider';
import globalStyles from '../../helpers/globalStyles';
import fonts from '../../helpers/fonts';
import { useColorStore } from '../../Store/ThemeStore/ThemeStore';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const RadioButton = props => {
    const { color } = useColorStore()
    const { value, onPress } = props
    const globalStyle = globalStyles()
    return (
        <TouchableOpacity onPress={onPress} disabled={props?.disabled} activeOpacity={0.8} style={[styles.button, { backgroundColor: value ? color.lightPrimary : color.lightBg }, props.buttonStyle]}>
            <Text allowFontScaling={false} numberOfLines={1} style={[globalStyle.textDark, { flex: 1 }, props.titleStyle]}>
                {props.buttonText}
            </Text>
            <IconProvider provider={value ? 'MaterialCommunityIcons' : 'Entypo'} name={value ? 'circle-slice-8' : 'circle'} color={value ? color.primary : color.textDark} size={16} />
        </TouchableOpacity>
    );
};
export default RadioButton;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: heightPercentageToDP(6),
        borderRadius: widthPercentageToDP(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: '10%',
        backgroundColor: colors.light.primary,
    }
});
