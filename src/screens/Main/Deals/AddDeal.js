import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { showToast } from '../../../Components/Modal/showToasts.js'
import { leadStore } from '../../../Store/LeadStore/leads.js'
import { authStore } from '../../../Store/AuthStore/auth.js'
import moment from 'moment'
import { dealsStore } from '../../../Store/DealStore/deals.js'
import { useTranslation } from 'react-i18next'

const AddDeal = (props) => {
    const { t } = useTranslation();
    const data = props?.route?.params?.data ?? null;
    const edit = props?.route?.params?.edit ?? false;
    const navigation = useNavigation()
    const { addDeals, getDeals, setDeals, updateDeals } = dealsStore()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const { userInfo } = authStore()    
    const { leads, contacts, customers, stages, pipelines, products, sources, departments, stage, getLeads, setLeads, getContacts, setContacts, getCustomers, setCustomers } = leadStore()
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: data?.name || '',
        value: data?.value || '',
        expected_close_date: data?.expectedCloseDate || moment().format('YYYY-MM-DD'),
        pipeline_id: data?.pipelineId || '',
        stage_id: data?.stageId || '',
        company_name: data?.companyName || '',
        probability: data?.probability?.toString() || '0',
        related_entity_type: data?.relatedEntityType || '',
        related_entity_id: data?.relatedEntityId || '',
        related_entity_name: data?.relatedEntityName || '',
        product_id: data?.productId || '',
        product_name: data?.productName || '',
        source_id: data?.sourceId || '',
        source_name: data?.sourceName || '',
        custom_fields: data?.customFields || {},
    });

    const fetchLead = () => {
        setIsLoading(true)
        getLeads()
            .then(res => {
                setLeads(res?.data?.results)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }
    const fetchContacts = () => {
        setIsLoading(true)
        getContacts()
            .then(res => {
                setContacts(res?.data)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }
    const fetchCustomers = () => {
        setIsLoading(true)
        getCustomers()
            .then(res => {
                setCustomers(res?.data)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }

    const handleChange = (e) => {
        if (e === 'Contact') {
            fetchContacts()
            setFormData({ ...formData, related_entity_type: e })
        }
        if (e === 'Lead') {
            fetchLead()
            setFormData({ ...formData, related_entity_type: e })
        }
        if (e === 'Customer') {
            fetchCustomers()
            setFormData({ ...formData, related_entity_type: e })
        }
    }
    const [currentEntries, setCurrentEntries] = useState([])

    useEffect(() => {
        const e = formData?.related_entity_type
        if (e === 'Contact' && contacts?.length < 1) {
            fetchContacts()
        }
        if (e === 'Lead' && leads?.length < 1) {
            fetchLead()
        }
        if (e === 'Customer' && customers?.length < 1) {
            fetchCustomers()
        }
    }, [formData?.related_entity_type,])


    useEffect(() => {
        if (formData?.related_entity_type === 'Contact') {
            setCurrentEntries([...contacts])
        }
        if (formData?.related_entity_type === 'Lead') {
            setCurrentEntries([...leads])
        }
        if (formData?.related_entity_type === 'Customer') {
            setCurrentEntries([...customers])
        }
    }, [formData?.related_entity_type, contacts, leads, customers])

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

    const handleSave = () => {
        let payload = { ...formData }       
        if (payload?.name?.length > 0 && payload?.related_entity_id?.length > 0 && payload?.related_entity_type?.length > 0 && payload?.expected_close_date?.length > 0 && payload?.pipeline_id?.length > 0 && payload?.stage_id?.length > 0 && payload?.value?.length > 0) {
            if (edit) {
                setIsLoading(true)
                updateDeals(payload, data?.id)
                    .then(res => {
                        fetch()
                        showToast(t("success"))
                        navigation?.goBack()
                    })
                    .catch(err => {
                        console.log(err);
                        showToast(t("error"))
                    })
            } else {
                setIsLoading(true)
                addDeals(payload)
                    .then(res => {
                        fetch()
                        showToast(t("success"))
                        navigation?.goBack()
                    })
                    .catch(err => {
                        console.log(err);
                        showToast(t("error"))
                    })
            }
        } else {
            showToast(t("fillRequiredFields"))
        }
    }

    return (<>
        <Header back={true} title={edit ? t("editDeal") : t("addDeal")} />
        <ScreenWrapper>
            <ScrollView>
                <View style={globalStyle.screen}>
                    <TextInputWithIcon
                        placeholder={t("dealName") + " *"}
                        value={formData.name}
                        onChangeText={text => setFormData({ ...formData, name: text })}
                    />
                    <TextInputWithIcon
                        placeholder={t("dealValue") + " *"}
                        value={formData.value}
                        onChangeText={text => setFormData({ ...formData, value: text })}
                    />

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.related_entity_type}
                            style={globalStyle.pickerText}
                            onValueChange={value => handleChange(value)}
                            placeholder=''
                        >
                            <Picker.Item label={t("selectRelatedType") + " *"} value="" />
                            {["Contact", "Lead", "Customer"].map(type => (
                                <Picker.Item key={type} label={t(type.toLowerCase())} value={type} />
                            ))}
                        </Picker>
                    </View>

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.related_entity_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, related_entity_id: value })}
                            placeholder=''
                        >
                            <Picker.Item label={t("selectRelatedRecord") + "*"} value="" />
                            {currentEntries?.map((type, i) => (
                                <Picker.Item key={i} label={type?.firstName || type?.first_name} value={type?.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.source_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, source_id: value })}
                        >
                            <Picker.Item label={t("selectSource")} value={''} />
                            {sources?.map(type => (
                                <Picker.Item key={type.id} label={type?.name} value={type?.id} />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity
                        style={[globalStyle.picker, { paddingVertical: hp(1.5) }]}
                        onPress={() => setShowDatePicker(true)}
                        accessible
                        accessibilityLabel={t("expectedCloseDatePicker")}
                        accessibilityRole="button"
                    >
                        <Text style={globalStyle.pickerText}>
                            {formData?.expected_close_date || t("expectedCloseDate") + " *"}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={formData?.expected_close_date ? new Date(formData?.expected_close_date) : new Date()}
                            mode="date"
                            is24Hour={true}
                            onChange={(event, date) => {
                                if (date === undefined) {
                                    setShowDatePicker(false);
                                    return;
                                }
                                if (event.type === 'dismissed') {
                                    setShowDatePicker(false);
                                    return;
                                }
                                if (date < new Date()) {
                                    showToast(t("selectValidDate"));
                                    setShowDatePicker(false);
                                    return;
                                }
                                date = moment(date).format('YYYY-MM-DD');
                                setShowDatePicker(false);
                                setFormData({ ...formData, expected_close_date: date });
                            }}
                        />
                    )}

                    <View style={globalStyle.picker}>
                        <Picker
                            selectedValue={formData.pipeline_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, pipeline_id: value })}
                        >
                            <Picker.Item label={t("selectPipeline") + " *"} value="" />
                            {pipelines?.map(pipeline => (
                                <Picker.Item key={pipeline.id} label={pipeline.name} value={pipeline.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={globalStyle.picker}>
                        <Picker
                            selectedValue={formData.stage_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, stage_id: value })}
                        >
                            <Picker.Item label={t("selectStage") + " *"} value="" />
                            {stages?.map(stage => (
                                <Picker.Item key={stage.id} label={stage.name} value={stage.id} />
                            ))}
                        </Picker>
                    </View>

                    <TextInputWithIcon
                        placeholder={t("companyName")}
                        multiline={true}
                        value={formData.company_name}
                        onChangeText={text => setFormData({ ...formData, company_name: text })}
                    />

                    <View style={globalStyle.picker}>
                        <Picker
                            selectedValue={formData.product_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, product_id: value })}
                        >
                            <Picker.Item label={t("selectProduct")} value="" />
                            {products?.map(product => (
                                <Picker.Item key={product.id} label={product.name} value={product.id} />
                            ))}
                        </Picker>
                    </View>

                    <TextInputWithIcon
                        placeholder={t("probability") + " %"}
                        multiline={true}
                        value={formData.probability}
                        onChangeText={text => setFormData({ ...formData, probability: text })}
                    />

                    <View style={globalStyle.buttonRow}>
                        <View style={{ width: '49%' }}>
                            <Button variant={"danger"} onPress={handleSave} buttonText={t("save")} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <Button variant={"secondary"} onPress={() => navigation?.goBack()} buttonText={t("cancel")} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    </>
    )
}

export default AddDeal