import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../helpers/fonts';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from './../../helpers/colors';

const Fonts = fonts

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: colors.blue,
    width: '100%',
    // borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    paddingVertical: 5.5
  },
  input: {
    flex: 0.95,
    marginLeft: 5,
    fontSize: 13,
    fontFamily: Fonts.regular, letterSpacing: 0.4,
    color: colors.white, paddingVertical: 6
  },
});

const InputIcon = ({ iconName, placeholder, value, iconColor,onChange, ...rest }) => {
  const handleOnChange = (value) => {
    onChange && onChange(value);
  };

  const color = colors
  // background: linear-gradient(128.01deg, rgba(0, 103, 224, 0.4) 20.39%, rgba(0, 103, 224, 0.1) 99.7%);

  return (
    <View style={[styles.container, { borderRadius: 6 }]} >
      {iconName.length>0 && <Icon name={iconName} size={22} color={iconColor?iconColor:color.white} />}
      <TextInput
        allowFontScaling={false}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        style={[styles.input]}
        value={value}
        onChangeText={handleOnChange}
        {...rest}
      />

    </View>
  );
}

export default InputIcon;