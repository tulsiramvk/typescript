import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import { colors } from '../../../helpers/colors'
import { useNavigation } from '@react-navigation/native'
import styles from './Style'
import Loader from '../../../helpers/Loader'
import PTRView from 'react-native-pull-to-refresh';
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'
import { useProfileStore } from './../../../Store/ProfileStore/ProfileStore';

const Profile = () => {
    const viewShotRef = useRef();
    const navigation = useNavigation()
    const [spinning, setSpinning] = useState(false)
    const { userProfile, fetchUserProfile, setUserProfile } = useProfileStore()
    const { fetchBalance2 } = useHomeStore()
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 2000);

                return !prevRefreshing; // Toggle state
            });
        });
    };
    useEffect(() => {
        setSpinning(true)
        fetchBalance2()
        fetchUserProfile()
            .then(res => {
                setUserProfile(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing])

    return (
        <MainBackground>
            <View style={[styles.block]}>
                <Title name="My Profile" />
            </View>
            <PTRView onRefresh={onRefresh} >
                {userProfile &&
                    <View style={[styles.block, { marginTop: 30 }]}>

                        <View style={[styles.card]}>

                            <Image style={{ width: 80, height: 80, borderRadius: 50, objectFit: 'cover' }} source={{ uri: userProfile.image }} />
                            <View style={{ marginVertical: 5, marginTop: 15 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.firstName + ' ' + userProfile.lastName}</Text></View>
                            <View><Text allowFontScaling={false} style={[styles.cardLabel]}>{userProfile.email}</Text></View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>

                                <View style={{ width: '42%', paddingLeft: '8%', flexDirection: 'column' }}>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>Phone Number</Text></View>
                                        <View style={{ marginVertical: 1 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.phoneNumber}</Text></View>
                                    </View>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>Address</Text></View>
                                        <View style={{ marginVertical: 1, width: '100%' }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.address}</Text></View>
                                    </View>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>Zipcode</Text></View>
                                        <View style={{ marginVertical: 1 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.zipcode}</Text></View>
                                    </View>
                                </View>
                                <View style={{ width: '40%', paddingLeft: '10%', flexDirection: 'column' }}>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>Country</Text></View>
                                        <View style={{ marginVertical: 1 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.country}</Text></View>
                                    </View>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>City</Text></View>
                                        <View style={{ marginVertical: 1 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.city}</Text></View>
                                    </View>
                                    <View style={{ marginVertical: 8 }}>
                                        <View><Text allowFontScaling={false} style={[styles.cardLabel]}>State</Text></View>
                                        <View style={{ marginVertical: 1 }}><Text allowFontScaling={false} style={[styles.cardText]}>{userProfile.state}</Text></View>
                                    </View>
                                </View>

                            </View>

                            <View style={{ height: 0.4, backgroundColor: colors.blue, width: '95%', margin: 'auto', marginVertical: 5, marginTop: 7 }}></View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>

                                <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { data: userProfile })} style={[styles.btnIcon, { marginEnd: 10 }]}>
                                    <View><IoniconsIcon name={"pencil"} color={colors.white} size={13} /></View>
                                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Edit</Text></View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={[styles.btnIcon]}>
                                    <View><IoniconsIcon name={"lock-closed"} color={colors.white} size={13} /></View>
                                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Change Password</Text></View>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                }
            </PTRView>
            {spinning && <Loader spinning={spinning} />}
        </MainBackground>
    )
}

export default Profile