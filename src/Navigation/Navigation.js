import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, ImageBackground, StatusBar, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import bgImage from '../Static/Images/Union.png'
import HomeIcon from '../Static/Images/tab/home.svg'
import TicketIcon from '../Static/Images/tab/ticket.svg'
import DashboardIcon from '../Static/Images/tab/dashboard.svg'
import CardIcon from '../Static/Images/tab/card.svg'
import ProfileIcon from '../Static/Images/tab/profile.svg'
import HomeIcon2 from '../Static/Images/tab/home2.svg'
import TicketIcon2 from '../Static/Images/tab/ticket2.svg'
import DashboardIcon2 from '../Static/Images/tab/dashboard2.svg'
import CardIcon2 from '../Static/Images/tab/card2.svg'
import ProfileIcon2 from '../Static/Images/tab/profile2.svg'

import { useHomeStore } from '../Store/HomeStore/HomeStore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainBackground from '../Components/MainBackground/MainBackground';
import logo from '../Static/Images/logo.png';
import VersionInfo from 'react-native-version-info';
import fonts from '../helpers/fonts';
import colors from './../helpers/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const color = "#fff"
const blueColor = "#fff"

const CustomTabBarIcon = ({ focused, icon }) => {
    
    const { route } = icon;
    if (route.name === 'Home') {
        return (
            <View style={{
                width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center'
            }}>
                {focused ? <HomeIcon2 width={20} height={20} style={[{ width: 50, shadowColor: colors.blue, height: 50, borderRadius: 10, shadowOpacity: 0.8, elevation: 1, marginTop: 13 }]} /> : <HomeIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{route.name}</Text>
            </View>
        );
    }
    else if (route.name === 'Ticket') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                {focused ? <TicketIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <TicketIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: fonts.medium, paddingTop: 2 }} allowFontScaling={false}>My {route.name}s</Text>
            </View>
        );
    }
    else if (route.name === 'Dashboard') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                {focused ? <DashboardIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <DashboardIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{route.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: -23 }}>
                    <Icon name={"wallet"} size={14} color={colors.white} />
                    <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 11, fontFamily: fonts.medium }}> Your Balance</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: -8 }}>
                    <Text allowFontScaling={false} style={{ color: colors.green2, fontSize: 11, fontFamily: fonts.bold }}> ${formatNumberWithCommas(balance)}</Text>
                </View>
            </View>
        );
    }
    else if (route.name === 'Card') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                {focused ? <CardIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <CardIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{'Transactions'}</Text>
            </View>
        );
    }
    else if (route.name === 'Profile') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                {focused ? <ProfileIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <ProfileIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{route.name}</Text>
            </View>
        );
    }

};

const Home = ()=>{
    return <Text>Home</Text>
}
const Tickets = ()=>{
    return <Text>Tickets</Text>
}
const Dashboard = ()=>{
    return <Text>Dashboard</Text>
}
const Payments = ()=>{
    return <Text>Payments</Text>
}
const Profile = ()=>{
    return <Text>Profile</Text>
}


const OtherScreens = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarLabelStyle: { color: blueColor, fontFamily: fonts.semiBold, fontSize: 9, },
                tabBarStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                    height: 65, borderTopWidth: 0,
                    backgroundColor: '#010101'
                },
                tabBarBackground: () => (
                    <ImageBackground source={bgImage} resizeMode="cover" style={{ marginTop: 'auto', height: 85, backgroundColor: "#010101" }}></ImageBackground>
                )
            }}
        >

            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabBarIcon focused={focused} icon={{ route: { name: 'Home' } }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ticket"
                component={Tickets}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabBarIcon focused={focused} icon={{ route: { name: 'Ticket' } }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabBarIcon focused={focused} icon={{ route: { name: 'Dashboard' } }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Card"
                component={Payments}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabBarIcon focused={focused} icon={{ route: { name: 'Card' } }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabBarIcon focused={focused} icon={{ route: { name: 'Profile' } }} />
                    ),
                }}
            />
        </Tab.Navigator>

    )
}

const Navigation = () => {
    // const { setUserInfo, userInfo, fetchTab } = useAuthenticationStore()
    // const handleLogout = async () => {
    //     await AsyncStorage.removeItem('userInfo');
    //     setUserInfo(null)
    // }
    // const { authenticateUser } = useHomeStore()
    // const [splashLoading, setSplashLoading] = useState(true)

    // useEffect(() => {
    //     fetchTab()
    //     const timer = setInterval(() => {
    //         authenticateUser()
    //             .then(res => {
    //                 if (res.data.data.status === "Inactive") {
    //                     Toast.show({
    //                         type: 'error',
    //                         text1: 'Your acount is deactivated, Please contact Admin for more details.'
    //                     });
    //                     handleLogout()
    //                 }
    //             })
    //             .catch(err => {
    //                 if (err.response && err.response.status === 401) {
    //                     Toast.show({
    //                         type: 'error',
    //                         text1: 'Token expire, Please login again.'
    //                     });
    //                     handleLogout()
    //                 }
    //             })
    //     }, 10000);
    //     return () => clearInterval(timer);
    // }, []);

    // useEffect(() => {
    //     authenticateUser()
    //         .then(res => {
    //             setSplashLoading(false)
    //             if (res.data.data.status === "Inactive") {
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Your acount is deactivated, Please contact Admin for more details.'
    //                 });
    //                 handleLogout()
    //             }
    //         })
    //         .catch(err => {
    //             setSplashLoading(false)
    //             if (err.response && err.response.status === 401) {
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: 'Token expire, Please login again.'
    //                 });
    //                 handleLogout()
    //             }
    //         })
    // }, []);

    // let r = [{ "id": 1, "name": "Purchased", "status": true }, { "id": 2, "name": "Winnings", "status": false }, { "id": 3, "name": "Void", "status": false }, { "id": 4, "name": "Paid", "status": true }, { "id": 5, "name": "Commission", "status": false }, { "id": 6, "name": "Deposit", "status": true }, { "id": 7, "name": "Withdrawal", "status": true }, { "id": 8, "name": "Transaction", "status": false }]

    const SplashScreen = () => {
        return (
            <>
                <MainBackground>
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                        <Image
                            source={logo}
                            style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 10 }}
                        />
                        <Text allowFontScaling={false} style={[{ fontSize: 11, color: colors.white, fontFamily: fonts.bold, textAlign: 'center' }]}>App Version : v{VersionInfo?.appVersion || '1.1'}</Text>
                    </View>
                </MainBackground>
            </>
        )
    }

    return (
        <NavigationContainer>
            
            {!splashLoading ?
                <Stack.Navigator
                    initialRouteName="OtherScreen"
                    headerMode="none"
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        statusBarAnimation: 'slide'
                    }}>
                    <Stack.Screen name="OtherScreen" component={OtherScreens} />
                    {/* <Stack.Screen name="Void" component={Void} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} />
                    <Stack.Screen name="Lottery" component={Lottery} />
                    <Stack.Screen name="OrderDetails" component={OrderDetails} />
                    <Stack.Screen name="TransactionComplete" component={TransactionComplete} />
                    <Stack.Screen name="WinnersList" component={Winner} />
                    <Stack.Screen name="VoidResult" component={VoidResult} />
                    <Stack.Screen name="About" component={About} />
                    <Stack.Screen name="Contact" component={Contact} />
                    <Stack.Screen name="Faq" component={Faq} />
                    <Stack.Screen name="Support" component={Support} />
                    <Stack.Screen name="ViewSupport" component={ViewSupport} />
                    <Stack.Screen name="Lotteries" component={Lotteries} />
                    <Stack.Screen name="WinningResults" component={WinningResults} /> */}
                </Stack.Navigator>
                :
                <Stack.Navigator
                    headerMode="none"
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        statusBarAnimation: 'slide'
                    }}>
                    <Stack.Screen name="SplashScreen" component={SplashScreen} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    )
}

export default Navigation