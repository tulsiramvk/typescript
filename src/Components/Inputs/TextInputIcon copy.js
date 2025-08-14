import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Utils/Fonts';
import { colors } from '../../Utils/Colors';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.blue,
    // borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    paddingVertical: 1
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.white,
    paddingVertical:6
  },
});

const TextInputWithIcon = ({ iconName, placeholder, value, onChange, ...rest }) => {
  const handleOnChange = (value) => {
    onChange && onChange(value);
  };

  const color = colors
  // background: linear-gradient(128.01deg, rgba(0, 103, 224, 0.4) 20.39%, rgba(0, 103, 224, 0.1) 99.7%);

  return (
    <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0}} colors={["#0C213C","#0A274B","#083B79"]} style={[styles.container,{borderRadius:5}]} >
        <Icon name={iconName} size={20} color={color.white} />
        <TextInput
        allowFontScaling={false}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          style={[styles.input]}
          value={value}
          onChangeText={handleOnChange}
          {...rest}
        />
      
    </LinearGradient>
  );
}

export default TextInputWithIcon;