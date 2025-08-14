import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../Utils/Fonts';
import { colors } from '../../Utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown'

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
        paddingVertical: 0
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        fontFamily: Fonts.regular, letterSpacing: 0.4,
        color: colors.white, paddingVertical: 10
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        backgroundColor: colors.darkBg,
        alignItems: 'center',
        paddingVertical: 8,
    },
});

const SelectInputIcon = ({ iconName, placeholder, options, value, onChangeText }) => {
    const handleOnChange = (value) => {
        onChange && onChange(value);
    };

    const color = colors

    const findValue = (val) => {
        let f = options.find((f) => Number(val) === Number(f.id))
        if (f) {
            return f.name
        } else {
            return val
        }
    }


    return (
        <View style={[styles.container, { borderRadius: 6 }]} >
            {iconName.length > 0 &&
                <Icon name={iconName} size={22} color={color.white} />}
            <SelectDropdown
                search={true}
                searchInputTxtColor={colors.white}
                searchPlaceHolderColor={colors.secondaryText}
                searchPlaceHolder='Search'
                renderSearchInputLeftIcon={() => <Icon name="magnify" color={colors.white} size={15} />}
                searchInputTxtStyle={{ width: '100%' }}
                searchInputStyle={{ backgroundColor: colors.darkBg, width: '100%', borderWidth: 0.4, borderRadius: 6, borderColor: colors.blue, paddingVertical: 0, marginTop: 5, marginHorizontal: 10, height: 35 }}
                data={options}
                onSelect={(selectedItem, index) => {
                    onChangeText(selectedItem.id);
                }}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.input}>
                            <Text allowFontScaling={false} style={[styles.dropdownButtonTxtStyle, { color: value ? colors.white : colors.secondaryText, fontSize: 13 }]}>
                                {value ? findValue(value) : placeholder}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected || item.id === value && { backgroundColor: colors.secondaryBg }) }}>
                            <Text allowFontScaling={false} style={{ color: colors.thirdText }}>{item.name}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{ width: '90%', marginLeft: '-14%', marginTop: '-5%', borderRadius: 4, overflow: 'hidden', backgroundColor: colors.darkBg }}
            />

            <View style={{ position: 'absolute', right: 0, marginTop: 40, marginRight: 15 }}>
                <Icon name={'chevron-down'} size={22} color={colors.white} />
            </View>

        </View>
    );
}

export default SelectInputIcon;