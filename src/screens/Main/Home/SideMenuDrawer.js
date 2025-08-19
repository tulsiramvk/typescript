import { View, Text, Image, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, Switch, NativeEventEmitter, NativeModules, Animated, Easing } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import fonts from '../../../helpers/fonts.js'
import FetherIcon from 'react-native-vector-icons/Feather'
import FoundationIcon from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BleManager from 'react-native-ble-manager';
import Modal from 'react-native-modal';
import styles from './Style.js'
import { useHomeStore } from '../../../Store/HomeStore/HomeStore.js'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import Loader from '../../../helpers/Loader.js'
import { useNavigation } from '@react-navigation/native'
import FontistosIcon from 'react-native-vector-icons/Fontisto.js'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AndroidOpenSettings from 'react-native-android-open-settings'
import VersionInfo from 'react-native-version-info';
import { colors } from './../../../helpers/colors';
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';

const Fonts = fonts
const SideMenuDrawer = ({ setIsOpen }) => {
  const { setUserInfo, userInfo } = useAuthenticationStore()
  const { connectedDevice, setConnectedDevice, setServiceUUID, setCharacteristicUUID, homeData, setIsEnabled, isEnabled } = useHomeStore()
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo');
    setUserInfo(null)
  }
  const navigation = useNavigation()
  const [spinning, setSpinning] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => { setModalVisible(!isModalVisible); };

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version < 30) {
          return true
        }
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          let d = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN])
          console.log({ d })
          console.log('Bluetooth permissions not granted');
          return false;
        } else {
          console.log('Bluetooth permissions granted');
          return true;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS handles permissions differently
    }
  }
  const [permissionGiven, setPermissionGiven] = useState(false)

  useEffect(() => {
    if (permissionGiven) {
      BleManager.start({ showAlert: false }).then(() => {
        // console.log('Bluetooth initialized');
        scanAndPrint()
      });
    }
  }, [permissionGiven]);

  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [devices, setDevices] = useState([])
  const scanAndPrint = () => {
    BleManager.getBondedPeripherals([]).then((d) => {
      setDevices(d)
    }).catch(err => {
      console.error('Failed to get connected devices', err);
    });
  };

  const connectToDevice = async (deviceId) => {
    if (connectedDevice === deviceId) {
      setSpinning(true)
      await BleManager.disconnect(deviceId);
      setConnectedDevice()
      setServiceUUID();
      setCharacteristicUUID();
      setSpinning(false)
    } else {
      try {
        setSpinning(true)
        await BleManager.connect(deviceId);
        setConnectedDevice(deviceId);
        const { serviceUUID, characteristicUUID } = await discoverServicesAndCharacteristics(deviceId);
        if (serviceUUID && characteristicUUID) {
          setServiceUUID(serviceUUID);
          setCharacteristicUUID(characteristicUUID);
          toggleModal()
          Toast.show({
            type: 'success',
            text2: "Printer addedd successfully.",
          })
        }
        setSpinning(false)
      } catch (error) {
        setSpinning(false)
        Toast.show({
          type: 'error',
          text2: "Printer not supported.",
        })
        console.error('Connection error:', error);
      }
    }
  };

  const discoverServicesAndCharacteristics = async (deviceId) => {
    try {
      const peripheralInfo = await BleManager.retrieveServices(deviceId);
      // console.log('Peripheral Info:', peripheralInfo);

      // Typically, you'll look for a service and characteristic that allows write operations.
      const services = peripheralInfo.services;
      const characteristics = peripheralInfo.characteristics;

      // Example: Find a writable characteristic
      const writableCharacteristic = characteristics.find(
        (char) => char.properties.Write || char.properties.WriteWithoutResponse
      );

      if (writableCharacteristic) {
        // console.log('Found writable characteristic:', writableCharacteristic);
        return {
          serviceUUID: writableCharacteristic.service,
          characteristicUUID: writableCharacteristic.characteristic,
        };
      } else {
        // console.log('No writable characteristic found.');
      }
    } catch (error) {
      console.error('Error discovering services and characteristics:', error);
    }
  };

  const toggleBluetooth = () => {
    if (permissionGiven) {
      if (on) {
        Toast.show({
          type: 'info',
          text2: "Cannot turn off bluetooth from here. Go to settings and try to do a turn off.",
        })
      } else {
        BleManager.enableBluetooth()
          .then(() => {
            setOn(true)
            scanAndPrint()
          })
          .catch((error) => {
            console.log(error);
            Toast.show({
              type: 'error',
              text2: "Please allow to turn on bluetooth device.",
            })
          });
      }
    } else {
      Toast.show({
        type: 'error',
        text2: "Permissions not granted. Cannot access bluetooth device.",
      })
    }
  }

  const [on, setOn] = useState(false)
  const handlePrint = async () => {
    setModalVisible(true)
    await requestBluetoothPermissions().then((granted) => {
      if (granted) {
        setPermissionGiven(true)
        BleManager.checkState().then((state) => {
          if (state === 'off') {
            setOn(false)
          }
          else {
            setOn(true)
            scanAndPrint()
          }
        }
        );

      } else {
        setPermissionGiven(false)
        Toast.show({
          type: 'error',
          text2: "Permissions not granted. Cannot use bluetooth.",
        })
      }
    });
  }

  // --------------------------------------------------------------------------------------
  const [rotated, setRotated] = useState(false);  // Track whether it's rotated or not
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateIcon = () => {
    // Reset the animation value before starting it again
    rotateAnim.setValue(0);
    // Start the rotation loop for 2 seconds
    Animated.timing(rotateAnim, {
      toValue: 1,  // Rotate from 0 to 1
      duration: 2000,  // Set the duration to 2 seconds for a full rotation
      useNativeDriver: false,  // Enable native driver for better performance
      easing: Easing.linear,  // Ensure smooth continuous rotation
    }).start();
  };

  // Interpolate the animated value to rotate between 0deg and 180deg
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const colorInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.blue, colors.thirdText],  // Change color from black to red
  });

  const openBluetoothSettings = () => {
    AndroidOpenSettings.bluetoothSettings()
  };

  const toggleSwitch = async () => { setIsEnabled(!isEnabled); await AsyncStorage.setItem("isEnabled", JSON.stringify(!isEnabled)) }

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[allowFontScaling = false]}
        text2Props={[allowFontScaling = false]}
        style={{ borderColor: colors.blue, paddingVertical: 4, backgroundColor: "rgba(0, 39, 76,0.8)", minHeight: 50, marginBottom: 40, height: 'auto', borderWidth: 0.4 }}
        text1Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
        text2Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[allowFontScaling = false]}
        text2Props={[allowFontScaling = false]}
        style={{ borderColor: colors.blue, paddingVertical: 4, backgroundColor: "rgba(0, 39, 76,0.8)", minHeight: 50, marginBottom: 40, height: 'auto', borderWidth: 0.4 }}
        text1Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
        text2Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[allowFontScaling = false]}
        text2Props={[allowFontScaling = false]}
        style={{ borderColor: 'tomato', paddingVertical: 4, backgroundColor: "rgba(0, 39, 76,0.8)", minHeight: 50, height: 'auto', marginBottom: 40, borderWidth: 0.4 }}
        text1Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
        text2Style={{
          fontSize: 13, fontFamily: Fonts.regular, color: colors.white, fontWeight: 400
        }}
      />
    ),
  };


  return (<>
    <View style={{ flex: 1, marginTop: "15%", backgroundColor: colors.darkBg, marginVertical: 'auto' }}>
      <Loader spinning={spinning} />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingVertical: 15, paddingBottom: 13, borderBottomColor: colors.blue, borderBottomWidth: 0.8 }}>
        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: homeData ? homeData.image : '' }} />
        <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginHorizontal: 8, marginEnd: 25 }}>{userInfo.firstName + ' ' + userInfo.lastName}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingStart: 15, paddingVertical: 13, borderWidth: 0.7, borderColor: colors.blue, marginTop: 15, marginHorizontal: 10, marginRight: 20, borderRadius: 6, paddingBottom: 12 }}>
        <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 15, color: colors.white, fontFamily: Fonts.medium }}>Use 12 Hrs Time</Text>
        <View>
          <Switch
            trackColor={{ false: colors.blue2, true: colors.blue2 }}
            thumbColor={isEnabled ? colors.blue : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>
      </View>

      <View style={{ marginTop: 15 }}>
        <TouchableOpacity onPress={() => { navigation.navigate('About'); setIsOpen(false) }} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FoundationIcon name={"info"} size={26} color={colors.white} />
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 8 }}>About</Text>
          </View>
          <FetherIcon name={"chevron-right"} size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Contact'); setIsOpen(false) }} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon name={"shield-account"} size={22} color={colors.white} />
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 5 }}>Contact</Text>
          </View>
          <FetherIcon name={"chevron-right"} size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Faq'); setIsOpen(false) }} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon name={"help-circle"} size={22} color={colors.white} />
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 8 }}>FAQ</Text>
          </View>
          <FetherIcon name={"chevron-right"} size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Support'); setIsOpen(false) }} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon name={"face-agent"} size={22} color={colors.white} />
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 8 }}>Support</Text>
          </View>
          <FetherIcon name={"chevron-right"} size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrint} style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcon name={"printer"} size={22} color={colors.white} />
              <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 8 }}>Printer Setting</Text>
            </View>
            <FetherIcon name={"chevron-right"} size={22} color={colors.white} />
          </View>
          {connectedDevice && <View style={{ paddingHorizontal: 10 }}>
            <Text allowFontScaling={false} style={[styles.title, { fontSize: 12, textAlign: 'left' }]}>{connectedDevice}</Text>
            <Text allowFontScaling={false} style={[styles.title, { fontSize: 10, textAlign: 'left', color: colors.blue, paddingVertical: 2 }]}>Connected</Text>
          </View>}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon name={"sign-out"} size={22} color={colors.white} />
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.white, fontFamily: Fonts.medium, marginStart: 8 }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 'auto', marginBottom: 50 }}>
        <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center' }]}>App Version : v{VersionInfo?.appVersion || '1.1'}</Text>
      </View>
    </View>

    {/* -----------------------Modal------------------------ */}

    <Modal onBackdropPress={toggleModal} onBackButtonPress={toggleModal} isVisible={isModalVisible}>
      <View style={styles.modalWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
          <Text allowFontScaling={false} style={[styles.modalTitle, { textAlign: 'left', fontSize: 16 }]}>Connect Bluetooth Printer</Text>
          {permissionGiven && <Switch
            trackColor={{ false: '#767577', true: colors.blue }}
            thumbColor={on ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleBluetooth}
            value={on}
          />}
        </View>
        {on &&
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
            <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'left', fontSize: 14 }]}>Available Printers</Text>
            <TouchableOpacity onPress={() => { scanAndPrint(); rotateIcon() }} style={{ marginEnd: 10 }}>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Animated.Text style={{ color: colorInterpolate }}>
                  <FontistosIcon name={"spinner-refresh"} size={18} color={colors.thirdText} />
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        }
        {permissionGiven ?
          <View style={{ maxHeight: 350 }}>
            {on ? <ScrollView>
              {devices.length > 0 ?
                devices.map((m, count) => {
                  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 8, borderBottomWidth: 0.4, borderColor: colors.border2 }} key={count}>
                    <View>
                      <Text allowFontScaling={false} style={[styles.title, { fontSize: 14, textAlign: 'left' }]}>{m.name}</Text>
                      <Text allowFontScaling={false} style={[styles.title, { fontSize: 12, textAlign: 'left', color: colors.thirdText, paddingVertical: 2 }]}>{m.id}</Text>
                    </View>
                    <TouchableOpacity style={[styles.btnIconOutline, { paddingBottom: 6, backgroundColor: connectedDevice ? connectedDevice === m.id ? colors.blue : 'transparent' : 'transparent' }]} onPress={() => connectToDevice(m.id)}>
                      <Text style={[styles.btnTextIcon]} allowFontScaling={false} >{connectedDevice ? connectedDevice === m.id ? 'Connected' : '   Connect  ' : '   Connect   '}</Text>
                    </TouchableOpacity>
                  </View>
                })
                : <Text allowFontScaling={false} style={[styles.modalDesc, { textAlign: 'left', width: '100%' }]}>No device found.</Text>}
            </ScrollView>
              :
              <Text allowFontScaling={false} style={[styles.modalDesc, { textAlign: 'left' }]}>Turn on Bluetooth Device.</Text>
            }
          </View>
          : <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginBottom: 20 }]}>Bluetooth permission not given. Please grant bluetooth permission from setting.</Text>}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={openBluetoothSettings} style={[styles.btn2]}>
              <Text allowFontScaling={false} style={styles.btnText}>Pair New</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline2, { width: 100 }]}>
              <Text allowFontScaling={false} style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast position='bottom' config={toastConfig} />
    </Modal>
  </>)
}

export default SideMenuDrawer