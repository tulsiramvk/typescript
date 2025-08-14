import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import globalStyles from '../../../../helpers/globalStyles'
import styles from '../Styles.js'
import Button from '../../../../Components/Buttons/Button.js'
import Hr from '../../../../Components/Hr/Hr.js'
import IconProvider from '../../../../Components/IconProvider/IconProvider.js'
import { useThemeStore } from '../../../../Store/ThemeStore/ThemeStore.js'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LeadCard from '../../../../Components/LeadCard/LeadCard.js'
import SidePopup from '../../../../Components/SidePopup/SidePopup.js'
import ContactSidePopup from '../../../../Components/SidePopup/ContactSidePopup.js'
import { leadStore } from '../../../../Store/LeadStore/leads.js'
import CustomerSidePopup from '../../../../Components/SidePopup/CustomerSidePopup.js'
import { FilterBar } from '../../../../Components/Filter/Filter.js'
import { useTranslation } from 'react-i18next'

const Customer = () => {
  const { color } = useThemeStore()
  const globalStyle = globalStyles()
  const [isLoading, setIsLoading] = useState(false)
  const { fetchCustomField, getCustomers, setCustomers, customers } = leadStore()
  const [popup, setPopup] = useState({ type: '', isOpen: false, lead: null });
  const openPopup = (type, lead = null) => setPopup({ type, isOpen: true, lead });
  const closePopup = () => setPopup({ type: '', isOpen: false, lead: null });

  const fetch = () => {
    setIsLoading(true)
    getCustomers()
      .then(res => {
        console.log('d ', res.data);

        setCustomers(res?.data || [])
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetch()
    fetchCustomField('Customer')
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
    return customers.filter(lead => {
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

      // Match source_id
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
  }, [customers, filters]);

  const {t} = useTranslation()

  return (
    <FlatList
      // data={[...customers]}
      data={filteredLeads}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <View>
        <LeadCard from={'Customer'} index={index} item={item} openPopup={openPopup} />
      </View>
      }
      ListHeaderComponent={
        <>
          <View style={{ width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), marginBottom: hp(2) }}>
            <CustomerSidePopup type={popup?.type} isOpen={popup?.isOpen} fetch={fetch} lead={popup?.lead} closePopup={closePopup} />
            <Button buttonStyle={{ backgroundColor: color.green }} onPress={() => openPopup('add')} buttonText={t('customerList.addButton')} />

            <FilterBar filters={filters} setFilters={setFilters} />

          </View>
          <View style={{ marginBottom: hp(3) }}>
            <Hr />
          </View>
        </>
      }
      contentContainerStyle={[globalStyle?.screen]}
    />

  )
}

export default Customer