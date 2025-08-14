import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import { Text } from 'react-native';

const iconLibraries = {
    MaterialIcons, Ionicons, FontAwesome, FontAwesome5, FontAwesome6, AntDesign, Entypo, EvilIcons, Feather, Fontisto, Foundation, MaterialCommunityIcons, Octicons, SimpleLineIcons, Zocial
};

const IconProvider = ({ name, provider = 'MaterialIcons', size = 20, color = 'black' }) => {
    const IconComponent = iconLibraries[provider];

    if (!IconComponent) {
        console.warn(`Icon provider "${provider}" is not supported.`);
        return null;
    }

    return <Text allowFontScaling={false}><IconComponent name={name} size={size} color={color} /></Text>;
};

export default IconProvider;
