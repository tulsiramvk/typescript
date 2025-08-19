import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, ImageBackground, StatusBar, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import bgImage from '../static/images/Union.png'
import HomeIcon from '../static/images/tab/home.svg'
import TicketIcon from '../static/images/tab/ticket.svg'
import DashboardIcon from '../static/images/tab/dashboard.svg'
import CardIcon from '../static/images/tab/card.svg'
import ProfileIcon from '../static/images/tab/profile.svg'
import HomeIcon2 from '../static/images/tab/home2.svg'
import TicketIcon2 from '../static/images/tab/ticket2.svg'
import DashboardIcon2 from '../static/images/tab/dashboard2.svg'
import CardIcon2 from '../static/images/tab/card2.svg'

import ProfileIcon2 from '../static/images/tab/profile2.svg'
import Home from '../screens/Main/Home/Home';
import Profile from '../screens/Main/Profile/Profile';
import EditProfile from '../screens/Main/Profile/EditProfile';
import ChangePassword from '../screens/Auth/ForgotPassword/ChangePassword';
import Payments from '../screens/Main/Payments/Payments';
import Dashboard from '../screens/Main/Dashboard/Dashboard';
import Void from '../screens/Main/Dashboard/Void';
import Tickets from '../screens/Main/Tickets/Tickets';
import About from '../screens/Main/About/About';
import Contact from '../screens/Main/About/Contact';
import Faq from '../screens/Main/About/Faq';
import ViewSupport from '../screens/Main/Support/ViewSupport/ViewSupport';
import Support from '../screens/Main/Support/Support';
import Winner from '../screens/Main/Tickets/Winner';
import VoidResult from '../screens/Main/Tickets/VoidResult';
import Lotteries from '../screens/Main/Lottery/Lottery';
import WinningResults from '../screens/Main/Home/Lottery/RecentDraws/WinningResults';
import Lottery from '../screens/Main/Home/Lottery/Lottery';
import OrderDetails from '../screens/Main/Home/Lottery/Buy/OrderDetails/OrderDetails';
import TransactionComplete from '../screens/Main/Home/Lottery/Buy/OrderDetails/TransactionComplete';


import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthenticationStore } from '../Store/AuthenticationStore';
import { formatNumberWithCommas } from '../helpers/utils';
import MainBackground from '../Components/MainBackground/MainBackground';
import logo from '../static/images/logo.png';
import fonts from '../helpers/fonts';
import VersionInfo from 'react-native-version-info';
import { colors } from './../helpers/colors';
import { useHomeStore } from './../Store/HomeStore/HomeStore';

const Fonts = fonts

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const color = "#fff"
const blueColor = "#fff"

const CustomTabBarIcon = ({ focused, icon }) => {
    const { fetchBalance, setBalance, balance } = useHomeStore()
    React.useEffect(() => {
        fetchBalance()
            .then(res => {
                setBalance(res.data.data)
            })
            .catch(err => {

            })
    }, [])

    const { route } = icon;
    if (route.name === 'Home') {
        return (
            <View style={{
                width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center',marginBottom:-73
            }}>
                {focused ? <HomeIcon2 width={20} height={20} style={[{ width: 50, shadowColor: colors.blue, height: 50, borderRadius: 10, shadowOpacity: 0.8, elevation: 1, marginTop: 13 }]} /> : <HomeIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text numberOfLines={1} style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: Fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{route.name}</Text>
            </View>
        );
    }
    else if (route.name === 'Ticket') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center',marginBottom:-73 }}>
                {focused ? <TicketIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <TicketIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text numberOfLines={1} style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: Fonts.medium, paddingTop: 2,minWidth:50 }} allowFontScaling={false}>My {route.name}s</Text>
            </View>
        );
    }
    else if (route.name === 'Dashboard') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center',marginBottom:-73 }}>
                {focused ? <DashboardIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <DashboardIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text numberOfLines={1} style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: Fonts.medium, paddingTop: 2, minWidth:50,textAlign:'center' }} allowFontScaling={false}>{route.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: -23 }}>
                    <Icon name={"wallet"} size={14} color={colors.white} />
                    <Text numberOfLines={1} allowFontScaling={false} style={{ color: colors.white, fontSize: 11, fontFamily: Fonts.medium, minWidth:80,textAlign:'center' }}> Your Balance</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: -8 }}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{ color: colors.green2, fontSize: 11, fontFamily: Fonts.bold,minWidth:80,textAlign:'center' }}> ${formatNumberWithCommas(balance)}</Text>
                </View>
            </View>
        );
    }
    else if (route.name === 'Card') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center',marginBottom:-73 }}>
                {focused ? <CardIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <CardIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text numberOfLines={1} style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: Fonts.medium, paddingTop: 2,minWidth:70, textAlign:'center' }} allowFontScaling={false}>{'Transactions'}</Text>
            </View>
        );
    }
    else if (route.name === 'Profile') {
        return (
            <View style={{ width: "100%", alignItems: 'center', flexDirection: 'column', justifyContent: 'center',marginBottom:-73 }}>
                {focused ? <ProfileIcon2 width={20} height={20} style={{ marginTop: 13 }} /> : <ProfileIcon width={20} height={20} style={{ marginTop: 13 }} />}
                <Text numberOfLines={1} style={{ color: focused ? colors.blue5 : colors.white, fontSize: 10, fontFamily: Fonts.medium, paddingTop: 2 }} allowFontScaling={false}>{route.name}</Text>
            </View>
        );
    }

};

const OtherScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarLabelStyle: {
          color: blueColor,
          fontFamily: Fonts.semiBold,
          fontSize: 9,
        },
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          borderTopWidth: 0,
          backgroundColor: "#010101"
        },
        tabBarItemStyle: {
          flex:1
        },
        tabBarBackground: () => (
          <ImageBackground
            source={bgImage}
            resizeMode="cover"
            style={{
              marginTop: "auto",
              height: 105,
              backgroundColor: "#010101",
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              icon={{ route: { name: "Home" } }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={Tickets}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              icon={{ route: { name: "Ticket" } }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              icon={{ route: { name: "Dashboard" } }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Card"
        component={Payments}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              icon={{ route: { name: "Card" } }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              icon={{ route: { name: "Profile" } }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
    const { setUserInfo, userInfo, fetchTab } = useAuthenticationStore()
    const handleLogout = async () => {
        await AsyncStorage.removeItem('userInfo');
        setUserInfo(null)
    }
    const { authenticateUser } = useHomeStore()
    const [splashLoading, setSplashLoading] = useState(true)

    useEffect(() => {
        fetchTab()
        const timer = setInterval(() => {
            authenticateUser()
                .then(res => {
                    if (res.data.data.status === "Inactive") {
                        Toast.show({
                            type: 'error',
                            text1: 'Your acount is deactivated, Please contact Admin for more details.'
                        });
                        handleLogout()
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 401) {
                        Toast.show({
                            type: 'error',
                            text1: 'Token expire, Please login again.'
                        });
                        handleLogout()
                    }
                })
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        authenticateUser()
            .then(res => {
                setSplashLoading(false)
                if (res.data.data.status === "Inactive") {
                    Toast.show({
                        type: 'error',
                        text1: 'Your acount is deactivated, Please contact Admin for more details.'
                    });
                    handleLogout()
                }
            })
            .catch(err => {
                setSplashLoading(false)
                if (err.response && err.response.status === 401) {
                    Toast.show({
                        type: 'error',
                        text1: 'Token expire, Please login again.'
                    });
                    handleLogout()
                }
            })
    }, []);

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
                        <Text allowFontScaling={false} style={[{ fontSize: 11, color: colors.white, fontFamily: Fonts.bold, textAlign: 'center' }]}>App Version : v{VersionInfo?.appVersion || '1.1'}</Text>
                    </View>
                </MainBackground>
            </>
        )
    }

    return (
        <NavigationContainer>
            {/* <StatusBar barStyle="light-content" backgroundColor="#0A2547" /> */}
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
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} />
                    <Stack.Screen name="Void" component={Void} />
                    <Stack.Screen name="About" component={About} />
                    <Stack.Screen name="Contact" component={Contact} />
                    <Stack.Screen name="Faq" component={Faq} />
                    <Stack.Screen name="Support" component={Support} />
                    <Stack.Screen name="ViewSupport" component={ViewSupport} />
                    <Stack.Screen name="WinnersList" component={Winner} />
                    <Stack.Screen name="VoidResult" component={VoidResult} />
                    <Stack.Screen name="Lotteries" component={Lotteries} />
                    <Stack.Screen name="WinningResults" component={WinningResults} />
                    <Stack.Screen name="Lottery" component={Lottery} />
                    <Stack.Screen name="OrderDetails" component={OrderDetails} />
                    <Stack.Screen name="TransactionComplete" component={TransactionComplete} />
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