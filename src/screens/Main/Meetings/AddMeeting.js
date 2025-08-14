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
import { activityStore } from '../../../Store/ActivityStore/activity.js'
import { showToast } from '../../../Components/Modal/showToasts.js'
import { leadStore } from '../../../Store/LeadStore/leads.js'
import { authStore } from '../../../Store/AuthStore/auth.js'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const AddMeeting = (props) => {
    const { t } = useTranslation()
    const data = props?.route?.params?.data ?? null;
    const edit = props?.route?.params?.edit ?? false;
    const navigation = useNavigation()
    const { addActivity, getActivity, setActivity, updateActivity } = activityStore()
    const globalStyle = globalStyles()
    const { color } = useThemeStore()
    const style = styles()
    const { userInfo } = authStore()
    const { leads, contacts, customers, branches, pipelines, products, sources, departments, stage, getLeads, setLeads, getContacts, setContacts, getCustomers, setCustomers } = leadStore()
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'Meeting', subject: data?.subject || '', date: data?.date || new Date(), related_to: data?.relatedToType || "", related_id: data?.relatedToId || '', status: '', notes: data?.notes || '', completed: data?.completed || false
    })

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
            setFormData({ ...formData, related_to: e })
        }
        if (e === 'Lead') {
            fetchLead()
            setFormData({ ...formData, related_to: e })
        }
        if (e === 'Customer') {
            fetchCustomers()
            setFormData({ ...formData, related_to: e })
        }
    }
    const [currentEntries, setCurrentEntries] = useState([])

    useEffect(() => {
        const e = formData?.related_to
        if (e === 'Contact' && contacts?.length < 1) {
            fetchContacts()
        }
        if (e === 'Lead' && leads?.length < 1) {
            fetchLead()
        }
        if (e === 'Customer' && customers?.length < 1) {
            fetchCustomers()
        }
    }, [formData?.related_to,])


    useEffect(() => {
        if (formData?.related_to === 'Contact') {
            setCurrentEntries([...contacts])
        }
        if (formData?.related_to === 'Lead') {
            setCurrentEntries([...leads])
        }
        if (formData?.related_to === 'Customer') {
            setCurrentEntries([...customers])
        }
    }, [formData?.related_to, contacts, leads, customers])

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

    const handleSave = () => {
        let payload = {
            completed
                :
                formData?.completed,
            date
                :
                moment(formData?.date).format(),
            entity_id
                :
                formData?.related_id,
            entity_type
                :
                formData?.related_to,
            notes
                :
                formData.notes,
            relatedToId
                :
                formData?.related_id,
            relatedToType
                :
                formData?.related_to,
            related_to_id
                :
                formData?.related_id,
            related_to_type
                :
                formData?.related_to,
            subject
                :
                formData?.subject,
            type
                :
                formData.type,
            userId
                :
                userInfo?.user?.id,
            userName
                :
                userInfo?.user?.user?.name,
        }

        if (payload?.subject?.length > 0 && payload?.type?.length > 0 && payload?.date?.length > 0 && payload?.entity_id?.length > 0 && payload?.entity_type?.length > 0) {
            if (edit) {
                setIsLoading(true)
                updateActivity(payload, data?.id)
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
                addActivity(payload)
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
        <Header back={true} title={edit ? t("editMeeting") : t("addMeeting")} />
        <ScreenWrapper>
            <ScrollView>
                <View style={globalStyle.screen}>

                    <TextInputWithIcon
                        placeholder={t("subject")}
                        value={formData.subject}
                        onChangeText={text => setFormData({ ...formData, subject: text })}
                    />

                    <TouchableOpacity
                        style={[globalStyle.picker, { paddingVertical: hp(1.5) }]}
                        onPress={() => setShowDatePicker(true)}
                        accessible
                        accessibilityLabel={t("datePickerLabel")}
                        accessibilityRole="button"
                    >
                        <Text style={globalStyle.pickerText}>
                            {formData?.followUpDate?.toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                            }) || new Date().toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={formData?.followUpDate ? new Date(formData?.followUpDate) : new Date()}
                            mode="date"
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
                                setFormData({ ...formData, followUpDate: date });
                            }}
                        />
                    )}

                    <TextInputWithIcon
                        placeholder={t("notes")}
                        multiline={true}
                        value={formData.notes}
                        onChangeText={text => setFormData({ ...formData, notes: text })}
                    />

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.related_to}
                            style={globalStyle.pickerText}
                            onValueChange={value => handleChange(value)}
                            placeholder=''
                        >
                            <Picker.Item label={t("selectEntityType")} value="" />

                            {["Contact", "Lead", "Customer", "Deal"].map(type => (
                                <Picker.Item key={type} label={t(type.toLowerCase())} value={type} />
                            ))}

                        </Picker>
                    </View>

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.related_id}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, related_id: value })}
                            placeholder=''
                        >
                            <Picker.Item label={t("selectEntityRecord")} value="" />
                            {currentEntries?.map((type, i) => (
                                <Picker.Item key={i} label={type?.firstName || type?.first_name} value={type?.id} />
                            ))}

                        </Picker>
                    </View>

                    <View style={[globalStyle.picker]}>
                        <Picker
                            selectedValue={formData.completed}
                            style={globalStyle.pickerText}
                            onValueChange={value => setFormData({ ...formData, completed: value })}
                        >
                            <Picker.Item label={t("pending")} value={false} />
                            <Picker.Item label={t("completed")} value={true} />
                        </Picker>
                    </View>


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

        </ScreenWrapper >
    </>
    )
}

export default AddMeeting