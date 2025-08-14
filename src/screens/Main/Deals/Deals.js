import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IconButton from '../../../Components/Buttons/IconButton'
import { useThemeStore } from '../../../Store/ThemeStore/ThemeStore'
import IconProvider from '../../../Components/IconProvider/IconProvider'
import styles from './Style'
import DealList from './DealList'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../../Navigation/Routes'
import { dealsStore } from '../../../Store/DealStore/deals'
import { showToast } from '../../../Components/Modal/showToasts'
import Hr from '../../../Components/Hr/Hr'
import { FilterBar } from '../../../Components/Filter/Filter'
import { useTranslation } from 'react-i18next'

const Deals = () => {
    const { t } = useTranslation();
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const [isLoading, setIsLoading] = React.useState(false)
    const { getDeals, setDeals, deals, deleteDeals, closeDeals } = dealsStore()

    const fetch = () => {
        getDeals()
            .then(res => {
                setDeals(res.data)
            })
            .catch(err => {
                console.log(err);
                showToast(t('fetchDealsError'))
            })
    }

    const handleDealClose = (id) => {
        setIsLoading(true)
        closeDeals(id)
            .then(res => {
                setIsLoading(false)
                showToast(t('dealClosedSuccess'))
                fetch()
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                showToast(t('closeDealError'))
            })
    }

    const handleDelete = (id) => {
        setIsLoading(true)
        deleteDeals(id)
            .then(res => {
                setIsLoading(false)
                showToast(t('dealDeletedSuccess'))
                fetch()
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                showToast(t('deleteDealError'))
            })
    }

    useEffect(() => {
        fetch()
    }, [])

    // Filter Work
    const [filters, setFilters] = useState({
        status: '',
        source_id: '',
        owner_id: '',
        pipeline_id: '',
        stage_id: '',
        start_date: null,
        end_date: null,
    });

    const filteredLeads = useMemo(() => {
        return deals.filter(lead => {
            const {
                status,
                source_id,
                owner_id,
                pipeline_id,
                stage_id,
                start_date,
                end_date
            } = filters;

            // Match status
            if (status && lead.status !== status) return false;

            // Match source_id (lead.sourceId may be null)
            if (source_id && lead.sourceId !== source_id) return false;

            // Match owner_id
            if (owner_id && lead.ownerId !== owner_id) return false;

            // Match pipeline_id
            if (pipeline_id && lead.pipelineId !== pipeline_id) return false;

            // Match stage_id
            if (stage_id && lead.stageId !== stage_id) return false;

            // Match start_date (createdAt >= start_date)
            if (start_date && new Date(lead.createdAt) < new Date(start_date)) return false;

            // Match end_date (createdAt <= end_date)
            if (end_date && new Date(lead.createdAt) > new Date(end_date)) return false;

            return true;
        });
    }, [deals, filters]);

    return (
        <ScreenWrapper>
            <Header title={t("deals")} />

            <FlatList
                data={filteredLeads}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <DealList fetch={fetch} handleDelete={handleDelete} handleDealClose={handleDealClose} item={item} />}
                ListHeaderComponent={
                    <>
                        <View style={{ width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), marginBottom: hp(2) }}>
                            <IconButton 
                                onPress={() => navigation?.navigate(Routes?.AddDeal)} 
                                buttonStyle={{ width: '100%' }} 
                                icon={<IconProvider provider='Entypo' name="plus" color={color.screenBg} size={hp(2.5)} />} 
                                buttonText={t("addDeals")} 
                            />
                            <FilterBar from={'deals'} filters={filters} setFilters={setFilters} />
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

export default Deals