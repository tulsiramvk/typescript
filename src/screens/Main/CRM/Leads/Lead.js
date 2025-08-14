import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next' // Add this import
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
import { FilterBar } from '../../../../Components/Filter/Filter.js'

const Lead = () => {
  const { t } = useTranslation() // Add this line
  const { color } = useThemeStore()
  const globalStyle = globalStyles()
  const [isLoading, setIsLoading] = useState(false)
  const { fetchCustomField, getLeads, setLeads, leads } = leadStore()

  const [popup, setPopup] = useState({ type: '', isOpen: false, lead: null });
  const openPopup = (type, lead = null) => setPopup({ type, isOpen: true, lead });
  const closePopup = () => setPopup({ type: '', isOpen: false, lead: null });

  const fetch = () => {
    setIsLoading(true)
    getLeads()
      .then(res => {
        console.log('d ', res.data);
        setLeads(res?.data?.results)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetch()
    fetchCustomField('Lead')
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
    return leads.filter(lead => {
      const {
        status,
        source_id,
        owner_id,
        pipeline_id,
        stage_id,
        start_date,
        end_date
      } = filters;

      if (status && lead.status !== status) return false;
      if (source_id && lead.sourceId !== source_id) return false;
      if (owner_id && lead.ownerId !== owner_id) return false;
      if (pipeline_id && lead.pipelineId !== pipeline_id) return false;
      if (stage_id && lead.stageId !== stage_id) return false;
      if (start_date && new Date(lead.createdAt) < new Date(start_date)) return false;
      if (end_date && new Date(lead.createdAt) > new Date(end_date)) return false;

      return true;
    });
  }, [leads, filters]);

  return (
    <FlatList
      data={filteredLeads}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <View>
        <LeadCard from={'Lead'} index={index} item={item} openPopup={openPopup} />
      </View>
      }
      ListHeaderComponent={
        <>
          <View style={{ width: wp(100), marginLeft: wp(-4), paddingHorizontal: wp(4), marginBottom: hp(2) }}>
            <SidePopup type={popup?.type} isOpen={popup?.isOpen} fetch={fetch} lead={popup?.lead} closePopup={closePopup} />
            <Button
              buttonStyle={{ backgroundColor: color.dangerRed }}
              onPress={() => openPopup('add')}
              buttonText={t('leadList.addButton')}
            />
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

export default Lead