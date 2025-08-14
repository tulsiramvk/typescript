import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import styles from './Style.js'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon.js'
import { Picker } from '@react-native-picker/picker'
import Button from '../../../Components/Buttons/Button.js'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const ViewActivity = (props) => {
    const { t } = useTranslation();
    const data = props?.route?.params?.data ?? null;
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()

    return (<>
        <Header back={true} title={t("viewActivity")} />
        <ScreenWrapper>
            <ScrollView>
                <View style={globalStyle.screen}>
                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t("activityType")}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary]}>
                            {t(data?.type?.toLowerCase())}
                        </Text>
                    </View>

                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t(data?.relatedToType?.toLowerCase())}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary, { color: color.primary }]}>
                            {data?.relatedToName || '-'}
                        </Text>
                    </View>

                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t("dateTime")}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary]}>
                            {moment(data?.date).format("LLL")}
                        </Text>
                    </View>

                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t("notes")}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary]}>
                           {data?.notes || '-'}
                        </Text>
                    </View>

                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t("status")}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary, { color: data?.completed ? color.green : color.dangerRed }]}>
                            {data?.completed ? t("completed") : t("pending")}
                        </Text>
                    </View>

                    <View style={{ paddingBottom: hp(2) }}>
                        <Text allowFontScaling={false} style={[globalStyle.textRegular, { marginBottom: hp(0.7) }]}>
                            {t("owner")}
                        </Text>
                        <Text allowFontScaling={false} style={[globalStyle.textSecondary]}>
                            {data?.userName}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    </>
    )
}

export default ViewActivity