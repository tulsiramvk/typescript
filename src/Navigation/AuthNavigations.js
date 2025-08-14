import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Welcome from '../Screens/Login/Welcome';
// import Login from '../Screens/Login/Login';
// import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
// import ChangePassword from '../Screens/ForgotPassword/ChangePassword';
// import VerifyEmail from '../Screens/ForgotPassword/VerifyEmail';


const Stack = createNativeStackNavigator();

const Welcome = ()=>{
    return <View><Text>Welcome</Text></View>
}
const AuthNavigations = () => {
    return (
        <NavigationContainer
        >

            <Stack.Navigator
                initialRouteName="Welcome"
                headerMode="none"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    statusBarAnimation: 'slide'
                }}>
                <Stack.Screen name="Welcome" component={Welcome} />
                {/* <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="VerifyEmail" component={VerifyEmail} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AuthNavigations