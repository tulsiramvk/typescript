import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IconButton from '../../../Components/Buttons/IconButton'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import ActivitiesList from './ActivitiesList'
import styles from './Style'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes'
import { activityStore } from '../../../Store/ActivityStore/activity'
import { showToast } from '../../../Components/Modal/showToasts'
import Hr from '../../../Components/Hr/Hr'
import { FilterBar } from '../../../Components/Filter/Filter'
import { ActivityFilter } from '../../../Components/Filter/ActivityFilter'
import { useTranslation } from 'react-i18next'

const Activities = () => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const [isLoading, setIsLoading] = useState(false)
    const { getActivity, setActivity, activities, deleteActivities } = activityStore()

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

    const handleDelete = (id) => {
        setIsLoading(true)
        deleteActivities(id)
            .then(res => {
                setIsLoading(false)
                showToast(t('activityDeletedSuccess'))
                fetch()
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                showToast(t('deleteActivityError'))
            })
    }

    // Filter Work
    const [filters, setFilters] = useState({
        status: '',
        type: '',
    });

    const filteredLeads = useMemo(() => {
        return activities.filter(lead => {
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
    }, [activities, filters]);

    return (
        <ScreenWrapper>
            <Header title={t("activities")} />

            <FlatList
                data={filteredLeads}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <ActivitiesList item={item} handleDelete={handleDelete} />}
                ListHeaderComponent={
                    <>
                        <View style={{ width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), marginBottom: hp(2) }}>
                            <IconButton 
                                onPress={() => navigation?.navigate(Routes?.AddActivity)} 
                                buttonStyle={{ width: '100%' }} 
                                icon={<IconProvider provider='Entypo' name="plus" color={color.screenBg} size={hp(2.5)} />} 
                                buttonText={t("addActivity")} 
                            />

                            <ActivityFilter filters={filters} setFilters={setFilters} />
                        </View>
                        <View style={{ marginBottom: hp(3) }}>
                            <Hr />
                        </View>
                    </>
                }
                contentContainerStyle={[globalStyle?.screen]}
            />
        </ScreenWrapper>
    )
}

export default Activities