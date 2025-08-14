import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IconButton from '../../../Components/Buttons/IconButton'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import styles from './Style.js'
import MeetingList from './MeetingList'
import ActivityTypeIcon from '../../../Components/ActivityIcon/ActivityIcon.js'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes.js'
import { activityStore } from '../../../Store/ActivityStore/activity.js'
import { showToast } from '../../../Components/Modal/showToasts.js'
import Hr from '../../../Components/Hr/Hr.js'
import { FilterBar } from '../../../Components/Filter/Filter.js'
import { ActivityFilter } from '../../../Components/Filter/ActivityFilter.js'
import { useTranslation } from 'react-i18next'

const Meetings = () => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const { getActivity, setActivity, activities, deleteActivities } = activityStore()
    const [meetings, setMeetings] = useState([])
    const [pending, setPending] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const fetch = () => {
        getActivity()
            .then(res => {
                setActivity(res.data)
            })
            .catch(err => {
                console.log(err);
                showToast(t('fetchActivityError'))
            })
    }

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        if (activities?.length > 0) {
            setMeetings(activities.filter(activity => activity.type === 'Meeting'))
        }
    }, [activities])

    useEffect(() => {
        if (meetings?.length > 0) {
            setPending(meetings.filter(activity => activity.completed === false).length)
            setCompleted(meetings.filter(activity => activity.completed === true).length)
        }
    }, [meetings])

    const handleDelete = (id) => {
        setIsLoading(true)
        deleteActivities(id)
            .then(res => {
                setIsLoading(false)
                showToast(t('meetingDeletedSuccess'))
                fetch()
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                showToast(t('deleteMeetingError'))
            })
    }

    // Filter Work

    const [filters, setFilters] = useState({
        status: '',
        type: '',
    });

    const filteredLeads = useMemo(() => {
        return meetings.filter(lead => {
            const {
                status,
                type
            } = filters;

            // Match status
            if (status && lead.status !== status) return false;

            // Match source_id
            if (type && lead.type !== type) return false;

            return true;
        });
    }, [meetings, filters]);

    return (
        <>
            <Header title={t("meetings")} />
            <ScreenWrapper>

                <FlatList
                    data={filteredLeads}
                    // data={[...meetings]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => <MeetingList item={item} handleDelete={handleDelete} />}
                    ListHeaderComponent={
                        <>
                            <IconButton
                                onPress={() => navigation?.navigate(Routes.AddMeeting)}
                                buttonStyle={{ width: '100%' }}
                                icon={<IconProvider provider='Entypo' name="plus" color={color.screenBg} size={hp(2.5)} />}
                                buttonText={t("addMeetings")}
                            />

                            <View style={[globalStyle?.rowFlex, globalStyle?.alc, globalStyle.jsb, { marginTop: hp(2) }]}>
                                <View style={[style.topCard]}>
                                    <View>
                                        <Text style={[style?.value]} allowFontScaling={false}>{t("pending")}</Text>
                                        <Text style={[style?.dealName]} allowFontScaling={false}>{pending}</Text>
                                    </View>
                                    <ActivityTypeIcon type={"Meeting"} />
                                </View>
                                <View style={[style.topCard]}>
                                    <View>
                                        <Text style={[style?.value]} allowFontScaling={false}>{t("completed")}</Text>
                                        <Text style={[style?.dealName]} allowFontScaling={false}>{completed}</Text>
                                    </View>
                                    <ActivityTypeIcon type={"Complete"} />
                                </View>
                            </View>

                            <View style={{ width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), marginBottom: hp(2) }}>
                                <ActivityFilter from={'meetings'} filters={filters} setFilters={setFilters} />
                            </View>
                            <View style={{ marginBottom: hp(3) }}>
                                <Hr />
                            </View>
                        </>
                    }
                    contentContainerStyle={[globalStyle?.screen]}
                />

            </ScreenWrapper>
        </>
    )
}

export default Meetings