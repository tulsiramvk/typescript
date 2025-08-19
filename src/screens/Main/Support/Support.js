import MainBackground from '../../../Components/MainBackground/MainBackground.js'
import Title from '../../../Components/Title/Title.js'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import styles from './Style.js'
import Loader from '../../../helpers/Loader.js'
import SupportList from './SupportList.js'
import InputIcon from '../../../Components/Inputs/InputIcon.js'
import SelectInputIcon from '../../../Components/Inputs/SelectInputIcon.js'
import PTRView from 'react-native-pull-to-refresh';
import Toast from 'react-native-toast-message'
import { pick } from '@react-native-documents/picker';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import { localTimezone } from './../../../helpers/utils';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '../../../helpers/colors.js'
import { useSupportStore } from '../../../Store/SupportStore/SupportStore.js'
import { useProfileStore } from '../../../Store/ProfileStore/ProfileStore.js'


const Support = () => {
    const { userProfile, fetchUserProfile, setUserProfile } = useProfileStore()
    const [reload, setReload] = useState(false)
    const [page, setPage] = useState(1)
    const [pageData, setPageData] = useState()
    const [spinning, setSpinning] = useState(false)
    const P = {
        S: "Support Tickets", C: "Create Support Ticket"
    }
    const [currentPage, setCurrentPage] = useState(P.S)
    const { fetchSupportList, supportList, setSupportList, createSupport, uploadSupportAttachments } = useSupportStore()
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };
    useEffect(() => {
        setSpinning(true)
        let u = `?page=${page}&per_page=10&timezone=${localTimezone}`
        fetchSupportList(u)
            .then(res => {
                setSupportList(res.data.data)
                setPageData(res.data.pagination)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing])

    useEffect(() => {
        if (!userProfile) {
            fetchUserProfile()
                .then(res => {
                    setUserProfile(res.data.data)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [])   

    const [payload, setPayload] = useState({
        name: '', email: '', subject: '', priority: 1, message: ''
    })

    useEffect(() => {
        if(userProfile){
            setPayload({...payload,name:userProfile.firstName+' '+userProfile.lastName,email:userProfile.email})
        }
    }, [userProfile])
    

    const [attatchments, setAttatchments] = useState([])

    const priorities = [
        { id: 1, name: 'Low' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'High' }
    ]

    const handleSubmit = async () => {
        if (payload.name.length > 0 && payload.email.length > 0 && payload.subject.length > 0 && payload.message.length > 0) {
            let token = await AsyncStorage.getItem('userInfo')
            token = JSON.parse(token);
            setSpinning(true)
            createSupport(payload)
                .then(res => {
                    if (attatchments.length > 0) {
                        const formData = new FormData()
                        for (let i = 0; i < attatchments.length; i++) {
                            const e = attatchments[i];
                            formData.append('attachments[]', {
                                uri: e.uri, type: e.type, name: e.name
                            }, e.name)
                        }
                        uploadSupportAttachments(formData, res.data.data.message_id)
                            .then(res => {
                                setSpinning(false)
                                setPayload({ ...payload,  subject: '', priority: 1, message: '', fileName: [] })
                                setAttatchments([])
                                setRefreshing(!refreshing)
                                Toast.show({
                                    type: 'success',
                                    text1: 'Support ticked created successfully.'
                                });
                            })
                            .catch(err => {
                                console.log({ err });
                                setSpinning(false)
                                Toast.show({
                                    type: 'error',
                                    text1: 'Attachment Error.'
                                });
                            })
                    } else {
                        setSpinning(false)
                        setPayload({ ...payload,  subject: '', priority: 1, message: '', fileName: [] })
                        setAttatchments([])
                        setRefreshing(!refreshing)
                        Toast.show({
                            type: 'success',
                            text1: 'Support ticked created successfully.'
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    setSpinning(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Error.'
                    });
                })
        } else {
            Toast.show({
                type: 'error',
                text1: 'All fields required.'
            });
        }
    }

    const fileHandle = async () => {
        try {
            const pickResult = await pick({ allowMultiSelection: true, mode: 'import' })
            setAttatchments(pickResult)


        } catch (err) {
            console.log(err)
        }
    }

    return (
        <MainBackground>
            <View style={[styles.block]}><Title name="Support" /></View>

            <View style={[styles.block, { marginTop: 5 }]}>
                <View style={[styles.btnWrapper, { marginBottom: 25 }]}>
                    < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >

                        <TouchableOpacity style={[currentPage === P.S ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.S) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.S ? styles.btnTextActive : styles.btnTextInActive]}>{P.S}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[currentPage === P.C ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.C) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.C ? styles.btnTextActive : styles.btnTextInActive]}>{P.C}</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>
            {currentPage === P.S && pageData ? <>
                <PTRView onRefresh={onRefresh} >
                    <View style={[styles.block, { marginTop: 5 }]}>
                        <ScrollView contentContainerStyle={{}}>
                            {supportList.map((m, c) => {
                                const globalCount = pageData.total - ((page - 1) * 10 + c);
                                return <SupportList count={globalCount} key={m.id} data={m} currentPage={currentPage} P={P} />
                            })}
                        </ScrollView>
                    </View>
                </PTRView>
                <View>
                    {pageData ?
                        pageData.total > pageData.per_page ?
                            <Pagination
                                showLastPagesButtons
                                totalItems={pageData.total}
                                pageSize={10}
                                pagesToDisplay={3}
                                currentPage={pageData.current_page}
                                onPageChange={(e) => { setPage(e); setRefreshing(!refreshing) }}
                                containerStyle={{ paddingVertical: 8, marginTop: 10,marginBottom:0 }}
                                btnStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 4, paddingHorizontal: 10 }}
                                activeBtnStyle={{ backgroundColor: colors.blue2, borderWidth: 0, borderRadius: 90, padding: 5, paddingHorizontal: 10 }}
                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 13 }}
                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 13 }}
                            />
                            : null
                        : null
                    }
                </View>
            </>
            :null
            }
            {currentPage === P.C &&
                <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                    <View style={[styles.block, { marginTop: 5 }]}>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Name</Text>
                            <InputIcon
                                iconName="account"
                                placeholder="Enter Your Name"
                                value={payload.name}
                                editable={false}                                 
                                // onChangeText={(e) => setPayload({ ...payload, name: e })}
                            />
                        </View>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Email</Text>
                            <InputIcon
                                iconName="email"
                                placeholder="Enter Your Email"
                                value={payload.email}
                                editable={false}                                 // onChangeText={(e) => setPayload({ ...payload, email: e })}
                            />
                        </View>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Subject</Text>
                            <InputIcon
                                iconName="ticket"
                                placeholder="Subject"
                                value={payload.subject}
                                onChangeText={(e) => setPayload({ ...payload, subject: e })}
                            />
                        </View>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Priority</Text>
                            <SelectInputIcon
                                options={priorities}
                                iconName="flag"
                                placeholder="Select"
                                value={payload.priority}
                                onChangeText={(e) => setPayload({ ...payload, priority: e })}
                            />
                        </View>

                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Attachments</Text>
                            <InputIcon
                                readOnly
                                iconName="file"
                                placeholder={attatchments.length > 0 ? attatchments.length + "files selected." : 'Choose File'}
                                value={attatchments.length > 0 ? attatchments.length + "file selected." : ''}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                                {attatchments.length > 0 && <TouchableOpacity onPress={() => setAttatchments([])} style={[styles.btnIcon, { paddingVertical: 4, marginEnd: 5, backgroundColor: colors.redBg }]}>
                                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Remove</Text></View>
                                </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={fileHandle} style={[styles.btnIcon, { paddingVertical: 4 }]}>
                                    <View><IoniconsIcon name={"add"} color={colors.white} size={16} /></View>
                                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Choose File</Text></View>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Message</Text>
                                <InputIcon
                                    style={{ minHeight: 60, color: colors.white }}
                                    multiline={true}
                                    iconName=""
                                    placeholder="Start Typing"
                                    value={payload.message}
                                    onChangeText={(e) => setPayload({ ...payload, message: e })}
                                />
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
                            <TouchableOpacity onPress={handleSubmit} style={[styles.btn2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }



            {spinning && <Loader spinning={spinning} />}
        </MainBackground>
    )
}

export default Support