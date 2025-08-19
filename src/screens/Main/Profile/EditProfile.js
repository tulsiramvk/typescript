import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import cameraSvg from '../../../static/images/cameraSvg.png'
import { useNavigation } from '@react-navigation/native'
import styles from './Style'
import InputIcon from '../../../Components/Inputs/InputIcon'
import SelectInputIcon from '../../../Components/Inputs/SelectInputIcon'
import Toast from 'react-native-toast-message'
import Loader from '../../../helpers/Loader'
import { pick, types } from '@react-native-documents/picker'
import { useProfileStore } from './../../../Store/ProfileStore/ProfileStore';

const EditProfile = ({ route }) => {
    const navigation = useNavigation()
    const [spinning, setSpinning] = useState(false)
    const [img, setImg] = useState()
    const { fetchCountries, countries, fetchState, state, fetchCity, cities, updateProfile, updateProfilePic, fetchUserProfile, setUserProfile, fetchUpdateView } = useProfileStore()
    const { params } = route
    const [payload, setPayload] = useState({
        firstname: params.data.firstName || '', lastname: params.data.lastName || '', mobile: params.data.phoneNumber || '', email: params.data.email || '', address: params.data.address ? params.data.address : '',
        zip: params.data.zipcode || '', country: '', state: '', city: '', image: null
    })
    useEffect(() => {
        fetchUpdateView()
            .then(res => {
                if (res.data.status === 'success') {
                    setPayload({
                        ...payload, firstname: res.data.data.firstName, lastname: res.data.data.lastName, mobile: res.data.data.phoneNumber, email: res.data.data.email, address: res.data.data.address,
                        zip: res.data.data.zipCode, country: res.data.data.country ? res.data.data.country.countryId : '', state: res.data.data.state ? res.data.data.state.stateId : '', city: res.data.data.city ? res.data.data.city.cityId : '', image: ''
                    })
                    setImg(res.data.data.image)
                }
            })
    }, [])

    useEffect(() => {
        fetchCountries()
    }, [])

    useEffect(() => {
        if (payload.country) {
            fetchState(payload.country)
        }
    }, [payload.country])

    useEffect(() => {
        if (payload.state) {
            fetchCity(payload.state)
        }
    }, [payload.state])

    const handleUpdate = () => {
        if (payload?.firstname?.length < 1) {
            Toast.show({
                type: 'error',
                text1: 'First Name Required.'
            });
            return
        }
        if (payload?.lastname?.length < 1) {
            Toast.show({
                type: 'error',
                text1: 'Last Name Required.'
            });
            return
        }
        if (payload?.email?.length < 1) {
            Toast.show({
                type: 'error',
                text1: 'Email Required.'
            });
            return
        }
        if (payload?.mobile?.length < 1) {
            Toast.show({
                type: 'error',
                text1: 'Mobile Number Required.'
            });
            return
        }
        setSpinning(true)
        updateProfile(payload)
            .then(res => {
                setSpinning(false)
                if (res.data.status === 'success') {
                    navigation.goBack()
                    setSpinning(true)
                    fetchUserProfile()
                        .then(res => {
                            setUserProfile(res.data.data)
                            setSpinning(false)
                            Toast.show({
                                type: 'success',
                                text1: 'Success.'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            setSpinning(false)
                        })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: res.data?.message?.toString() || 'Server Error'
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
    }

    const onPress = async () => {
        try {
            const res = await pick({
                type: types.images,
                allowMultiSelection:false,
            });
            let formData = new FormData()
            formData.append('image', res[0])
            console.log(res[0]);

            setSpinning(true)
            updateProfilePic(formData)
                .then(res => {
                    setSpinning(false)
                    fetchUpdateView()
                        .then(res => {
                            setImg(res.data.data.image)
                        })
                    Toast.show({
                        type: 'success',
                        text1: '"Profile picture updated.'
                    });
                })
                .catch(err => {
                    setSpinning(false)
                    console.log(err);

                })
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}>
                <Title name="Edit Profile" />
            </View>

            <View style={[styles.block, { marginTop: 25 }]}>
                <View style={[styles.card]}>
                    <View style={{ marginVertical: 10 }}>
                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: img ? img : params.data.image }} />
                        <TouchableOpacity onPress={onPress}><Image style={{ width: 25, height: 25, borderRadius: 50, position: 'absolute', right: 0, bottom: 0 }} source={cameraSvg} /></TouchableOpacity>
                    </View>

                    <ScrollView style={{ width: '100%', marginBottom: 130 }}>
                        <View style={{ padding: 10 }}>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>First Name <Text allowFontScaling={false} style={{ color: 'red' }}>*</Text></Text>
                                <InputIcon
                                    iconName="account"
                                    placeholder="Enter Your First Name"
                                    value={payload.firstname}
                                    onChangeText={(e) => setPayload({ ...payload, firstname: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Last Name <Text allowFontScaling={false} style={{ color: 'red' }}>*</Text></Text>
                                <InputIcon
                                    iconName="account"
                                    placeholder="Enter Your Last Name"
                                    value={payload.lastname}
                                    onChangeText={(e) => setPayload({ ...payload, lastname: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Email <Text allowFontScaling={false} style={{ color: 'red' }}>*</Text></Text>
                                <InputIcon
                                    iconName="email-check"
                                    iconColor={"#32DE84"}
                                    placeholder="Enter Your Email"
                                    value={payload.email}
                                    editable={false}
                                    onChangeText={(e) => setPayload({ ...payload, email: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Mobile Number <Text allowFontScaling={false} style={{ color: 'red' }}>*</Text></Text>
                                <InputIcon
                                    maxLength={10}
                                    inputMode={'numeric'}
                                    keyboardType={'numeric'}
                                    iconName="cellphone"
                                    placeholder="Enter Your Mobile Number"
                                    value={payload.mobile}
                                    onChangeText={(e) => setPayload({ ...payload, mobile: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Address</Text>
                                <InputIcon
                                    iconName="map-marker"
                                    placeholder="Enter Your Address"
                                    value={payload.address}
                                    onChangeText={(e) => setPayload({ ...payload, address: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Country</Text>
                                <SelectInputIcon
                                    options={countries}
                                    iconName="web"
                                    placeholder="Enter Your Country"
                                    value={payload.country}
                                    onChangeText={(e) => setPayload({ ...payload, country: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>State</Text>
                                <SelectInputIcon
                                    options={state}
                                    iconName="map-marker"
                                    placeholder="Enter Your State"
                                    value={payload.state}
                                    onChangeText={(e) => setPayload({ ...payload, state: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>City</Text>
                                <SelectInputIcon
                                    options={cities}
                                    iconName="map-marker"
                                    placeholder="Enter Your City"
                                    value={payload.city}
                                    onChangeText={(e) => setPayload({ ...payload, city: e })}
                                />
                            </View>
                            <View style={[styles.inputWrapper]}>
                                <Text allowFontScaling={false} style={[styles.inputLabel]}>Zipcode</Text>
                                <InputIcon
                                    iconName="ray-start-vertex-end"
                                    placeholder="Enter Your Zipcode"
                                    value={payload.zip}
                                    onChangeText={(e) => setPayload({ ...payload, zip: e })}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn_outline2, { width: '35%', marginRight: 10 }]}>
                                    <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleUpdate} style={[styles.btn2, { width: '35%' }]}>
                                    <Text allowFontScaling={false} style={styles.btnText}>Change</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>

                </View>
            </View>


        </MainBackground>
    )
}

export default EditProfile