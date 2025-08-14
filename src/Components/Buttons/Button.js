import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import colors from '../../helpers/colors';
import { useThemeStore } from '../../Store/ThemeStore/ThemeStore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../helpers/fonts';

const Button = props => {
  const { outline } = props
  const { color } = useThemeStore()
  const variant = props?.variant || 'primary'
  const [bg, setBg] = useState(variant === "primary" ? color.primary : variant==="secondary"? color.lightGrey : color?.dangerRed)
  return (
    <Pressable
      rippleColor={color.rippleColor}
      disabled={props?.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [outline ? styles.outline : styles.button, { opacity: pressed || props?.disabled ? 0.7 : 1, backgroundColor: bg },props.buttonStyle,]}
    >
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={[styles.text, { color: outline ? variant==="secondary"? color.textDark : colors.dark.primary : variant==="secondary"? color.textDark : '#fff' }, props.titleStyle]}>
        {props?.disabled ? "Please wait..." : props.buttonText}
      </Text>

      {props?.icon}

    </Pressable>
  );
};
export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: hp(5.2),
    borderRadius: wp(2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.light.primary,
  },
  outline: {
    width: '100%',
    height: hp(5.2),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderWidth: hp(0.13),
    borderColor: colors.light.primary,
  },
  text: {
    fontSize: hp(1.8),
    color: '#FFF',
    fontFamily: fonts.semiBold
  },
});
