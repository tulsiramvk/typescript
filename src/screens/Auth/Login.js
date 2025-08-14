
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { authStore } from '../../Store/AuthStore/auth';
import { storeData } from '../../Store/Storage';
import { showToast } from '../../Components/Modal/showToasts';
import logo from '../../static/images/logo.jpg'

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const Login = () => {
  const { userLogin, setUserInfo } = authStore()
  const [loginMethod, setLoginMethod] = useState('Password');
  // const [identifier, setIdentifier] = useState('vivek.v@mailinator.com');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  // const [password, setPassword] = useState('Yug@0308');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateIdentifier = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    if (!emailRegex.test(identifier) && !mobileRegex.test(identifier)) {
      setError('Invalid email or mobile number');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendOtp = () => {
    if (validateIdentifier()) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setSuccess('OTP sent successfully');
        setLoading(false);
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    }
  };

  const handleLogin = () => {
    if (loginMethod === 'OTP' && otp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setSuccess('Login successful');
        setLoading(false);
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } else if (loginMethod === 'Password' && password) {
      setLoading(true);
      let payload = {
        email: identifier, password: password
      }
      userLogin(payload)
        .then(res => {
          storeData(res.data)
          showToast('Login successful');
          setUserInfo(res.data)
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setSuccess(err?.message || 'Login failed!!!');
          setLoading(false);
        })
      setTimeout(() => {
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } else {
      setError(loginMethod === 'OTP' ? 'Enter a valid 6-digit OTP' : 'Enter a valid password');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.formCard}>
          <Image source={logo} resizeMode='contain' style={{width:wp(50),height:hp(10),marginHorizontal:'auto'}} />
          <Text allowFontScaling={false} style={styles.header}>Welcome to Dealer CRM</Text>
          <Text allowFontScaling={false} style={styles.desc}>Sign in to manage your CRM.</Text>
          {/* <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'OTP' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('OTP')}
            >
              <Text allowFontScaling={false} style={[styles.toggleText, loginMethod === 'OTP' && styles.toggleTextActive]}>
                OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'Password' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('Password')}
            >
              <Text style={[styles.toggleText, loginMethod === 'Password' && styles.toggleTextActive]}>
                Password
              </Text>
            </TouchableOpacity>
          </View> */}
          <Text style={styles.label}>Mobile or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile or Email"
            value={identifier}
            onChangeText={setIdentifier}
            accessibilityLabel="Enter email"
            keyboardType="email-address"
          />
          {loginMethod === 'OTP' && otpSent && (
            <>
              <Text allowFontScaling={false} style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                keyboardType="numeric"
                accessibilityLabel="Enter 6-digit OTP"
              />
              <Text style={styles.timer}>OTP expires in 5:00</Text>
            </>
          )}
          {loginMethod === 'Password' && (
            <View style={styles.passwordContainer}>
              <Text allowFontScaling={false} style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                accessibilityLabel="Enter password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel="Toggle password visibility"
              >
                <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={wp(5)} color="#0078D4" />
              </TouchableOpacity>
            </View>
          )}
          {error ? <Text allowFontScaling={false} style={styles.error}>{error}</Text> : null}
          {success ? <Text allowFontScaling={false} style={styles.success}>{success}</Text> : null}
          {loginMethod === 'OTP' && !otpSent ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSendOtp}
              disabled={loading}
              accessibilityLabel="Send OTP"
            >
              <Text allowFontScaling={false} style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
              accessibilityLabel="Login"
            >
              <Text allowFontScaling={false} style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={{}}>
        <Text allowFontScaling={false} style={[styles.desc, { fontSize: hp(1.3) }]}>Powered by  9orbits CRM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: isDesktop ? 'row' : 'column',
    backgroundColor: '#fff',
  },
  illustration: {
    width: isDesktop ? '50%' : 0,
    height: '100%',
    backgroundColor: '#0078D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    color: '#FFFFFF',
    fontSize: wp(6),
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    width: isDesktop ? wp(60) : wp(90),
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: hp(0.2) },
    // shadowOpacity: 0.1,
    // shadowRadius: wp(2),
    // elevation: 5,
  },
  header: {
    fontSize: hp(3),
    fontWeight: '700',
    color: '#0078D4',
    textAlign: 'center',
    marginBottom: hp(1),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  desc: {
    fontSize: hp(1.9),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: hp(6),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  toggleButton: {
    flex: 1,
    padding: hp(1.2),
    borderRadius: wp(2),
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#0078D4',
  },
  toggleText: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  toggleTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(1),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D8DE',
    borderRadius: wp(2),
    padding: hp(1.5),
    fontSize: wp(4),
    marginBottom: hp(2),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: wp(3),
    top: hp(4.8),
  },
  timer: {
    fontSize: wp(3.5),
    color: '#0078D4',
    marginBottom: hp(2),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  button: {
    borderRadius: wp(2),
    padding: hp(1.5),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  primaryButton: {
    backgroundColor: '#FF6200',
  },
  disabledButton: {
    backgroundColor: '#D3D8DE',
  },
  buttonText: {
    fontSize: wp(4),
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  signUpLink: {
    fontSize: wp(3.5),
    color: '#0078D4',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  error: {
    fontSize: wp(3.5),
    color: '#D14343',
    marginBottom: hp(2),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
  success: {
    fontSize: wp(3.5),
    color: '#00C4B4',
    marginBottom: hp(2),
    fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: 'sans-serif' }),
  },
});

export default Login;