import { View, Text, Image, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, Switch, NativeEventEmitter, NativeModules, BackHandler, Animated, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import stylesw from './WinningStyle';
import moment from 'moment';
import logo from '../../../../../static/images/logo.png'
import MainBackground from '../../../../../Components/MainBackground/MainBackground';
import Title from '../../../../../Components/Title/Title';
import fonts from '../../../../../helpers/fonts';
import { useNavigation } from '@react-navigation/native';
import { useHomeStore } from '../../../../../Store/HomeStore/HomeStore';
import { BLEPrinter, COMMANDS, ColumnAlignment, } from 'react-native-thermal-receipt-printer-image-qr';
import BleManager from 'react-native-ble-manager';
import Modal from 'react-native-modal';
import ViewShot from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import FontistosIcon from 'react-native-vector-icons/Fontisto.js'
import AndroidOpenSettings from 'react-native-android-open-settings'
import { useOtherStore } from '../../../../../Store/OtherStore/OtherStore';
import { useLotteryPurchaseStore } from '../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';
import { colors } from './../../../../../helpers/colors';
import { whatsappQr } from './../../../../../helpers/utils';

const Fonts = fonts;
const WinningResults = (props) => {
    const { fetchContact, setContact, contact } = useOtherStore()
    const { lotteryDetail } = useLotteryPurchaseStore()
    const { isEnabled } = useHomeStore()
    let data = props.route?.params?.data || []
    let lname = props.route?.params?.lname || ''
    let total = props.route?.params?.total || 0
    const navigation = useNavigation()
    const { connectedDevice, setConnectedDevice, serviceUUID, setServiceUUID, characteristicUUID, setCharacteristicUUID } = useHomeStore()
    // -------------------------------------------------------------------------------------------
    const [isLoading, setIsLoading] = useState(false)
    const viewShotLogoRef = useRef(null);
    const viewShotQrRef = useRef(null);
    const [spinning, setSpinning] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => { setModalVisible(!isModalVisible); };
    const [refreshing, setRefreshing] = useState(false);
    const [printAvailable, setPrintAvailable] = useState(true)
    const [printSuccess, setPrintSuccess] = useState(false)
    const [showModal, setShowModal] = useState(false)

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
        fetchContact()
            .then(res => {
                setContact(res.data.data)
            })
            .catch(err => {
                console.log(err);

            })
    }, [])


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
                setConnectedDevice(null)
                setServiceUUID(null)
                setCharacteristicUUID(null)
                await BleManager.connect(deviceId);
                // await BleManager.refreshCache(deviceId)
                setConnectedDevice(deviceId);
                const { serviceUUID, characteristicUUID } = await discoverServicesAndCharacteristics(deviceId);
                if (serviceUUID && characteristicUUID) {
                    setServiceUUID(serviceUUID);
                    setCharacteristicUUID(characteristicUUID);
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
                    text2: "Printer not working or device not supported.",
                })
                setConnectedDevice(null)
                setServiceUUID(null)
                setCharacteristicUUID(null)
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

    const clearFunction = async () => {
        if (connectedDevice) {
            let connected = await BleManager.isPeripheralConnected(connectedDevice)
            if (connected) {
                BleManager.refreshCache(connectedDevice)
                setPrintAvailable(true)
            } else {
                setPrintAvailable(true)
                setConnectedDevice(null)
                setServiceUUID(null)
                setCharacteristicUUID(null)
            }
        } else {
            setPrintAvailable(true)
            setConnectedDevice(null)
            setServiceUUID(null)
            setCharacteristicUUID(null)
        }
    }

    useEffect(() => {
        clearFunction()
    }, [])

    const fetchImageData = async (uri) => {
        try {
            const imagePath = uri // Remove 'file://' prefix if present
            const fileExists = await RNFetchBlob.fs.exists(imagePath);
            if (!fileExists) {
                Toast.show({
                    type: 'error',
                    text2: "Printing data not found.",
                })
                throw new Error('Image file not found');
            }
            const imageData = await RNFetchBlob.fs.readFile(imagePath, 'base64');
            return imageData;
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: "Error getting print data.",
            })
            console.error('Error fetching image data:', error);
            throw error;
        }
    };
    const captureAndConvertToBase64 = async () => {
        const uri = await viewShotLogoRef.current.capture();
        let data = await fetchImageData(uri)
        return data
    };
    const captureAndConvertToBase64Q = async () => {
        const uri = await viewShotQrRef.current.capture();
        let data = await fetchImageData(uri)
        return data
    };

    const [isPrinting, setIsPrinting] = useState(false)

    const UNDERLINE_ON = COMMANDS.TEXT_FORMAT.TXT_UNDERL2_ON;
    const UNDERLINE_OFF = COMMANDS.TEXT_FORMAT.TXT_UNDERL_OFF;
    const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
    const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
    const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
    const LEFT = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
    const RIGHT = COMMANDS.TEXT_FORMAT.TXT_ALIGN_RT;
    const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
    let columnAlignment = lotteryDetail?.type !== "Pick2" ? [
        ColumnAlignment.CENTER,
        ColumnAlignment.CENTER,
        ColumnAlignment.CENTER,
        ColumnAlignment.CENTER,
    ] : [ColumnAlignment.CENTER];
    let columnWidth = lotteryDetail?.type !== "Pick2" ? [6, 6, 9, 9] : [28];
    const header = lotteryDetail?.type !== "Pick2" ? ['Pick3', 'Pick4', 'Mega', 'Monsta'] : ['Pick 2'];
    const horizontalLine1 = "=".repeat(32);
    const horizontalLine = "-".repeat(32);
    const horizontalLineS = "*".repeat(22);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const throwError = () => {
        setIsPrinting(false);
        printAvailable(true)
        setConnectedDevice(null)
        setServiceUUID(null)
        setCharacteristicUUID(null)
        Toast.show({
            type: 'error',
            text2: "Printer disconnected. Please reconnect to print.",
        });
    }

    const printingWork = async () => {
        try {
            setIsPrinting(true)
            let con = await BleManager.isPeripheralConnected(connectedDevice)
            if (!con) {
                throwError()
                return
            }
            try {
                await BLEPrinter.init();
                await BLEPrinter.closeConn();
            }
            catch {
                console.log('No connection was made.');
            }
            await BLEPrinter.init();
            await BLEPrinter.connectPrinter(connectedDevice)
            await delay(100);
            await BLEPrinter.printText(COMMANDS.HARDWARE.HW_INIT);
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}Printed At: ${moment().format("lll")}\n`,
            );
            await delay(100);
            await BLEPrinter.printText(`${LEFT}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} PRINT DETAILS ${BOLD_OFF}\n`);
            await delay(100);
            await BLEPrinter.printText(`Lottery Name : ${lname}`);
            await delay(100);
            await BLEPrinter.printText(`Total Draws Completed : ${total}`);
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine1}`,
            );
            await delay(100);
            await BLEPrinter.printText(`${LEFT}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A}Last ${total} Draws ${BOLD_OFF}\n`);
            await delay(100);
            // --------------------------
            for (let index = 0; index < data.length; index++) {
                const m = data[index];
                let row =  [m?.pick3, m?.pick4, m.megaball, m.monstaball]
                await BLEPrinter.printColumnsText([`S.no. ${index + 1}`, `Draw Time:${moment.utc(m.utc_draw_time).tz(moment.tz.guess()).format('MMMD,hh:mmA')}`], [8, 24], [ColumnAlignment.LEFT, ColumnAlignment.RIGHT,], [
                    `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}`, `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${RIGHT}`
                ]);
                await delay(100);
                await BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
                    `${BOLD_OFF}${CENTER}`, `${BOLD_OFF}${CENTER}`, `${BOLD_OFF}${CENTER}`
                ]);
                await delay(100);
                await BLEPrinter.printColumnsText(row, columnWidth, columnAlignment, [
                    `${BOLD_ON}${CENTER}`, `${BOLD_ON}${CENTER}`, `${BOLD_ON}${CENTER}`
                ]);
                await delay(100);
                await BLEPrinter.printText(
                    `${CENTER}${horizontalLine}`,
                );
                await delay(100);
            }
            // --------------------------
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_C}\nThankyou!! for being a valuable customer of Fortune Lottery`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${horizontalLineS}`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} Join Community ${BOLD_OFF}`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}Address: ${contact.address || ''}`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${contact?.content || ''}`);
            await delay(100);
            await BLEPrinter.printImageBase64(whatsappQr, {
                imageWidth: 225, imageHeight: 225
            })
            await delay(500);
            await BLEPrinter.printText(
                `${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}End of Receipt`
            );
            await BLEPrinter.printBill(`\n`);
            await delay(200);
            let conected2 = await BleManager.isPeripheralConnected(connectedDevice)
            if (!conected2) {
                throwError()
                return; // Exit function if connection fails
            }
            setModalVisible(false)
            await delay(100);
            setIsPrinting(false);
            setPrintSuccess(true)
            Toast.show({
                type: 'success',
                text2: "Print Successfull.",
            })
            return true
        } catch (error) {
            setIsPrinting(false)
            setPrintAvailable(true)
            setConnectedDevice(null)
            setServiceUUID(null)
            setCharacteristicUUID(null)
            Toast.show({
                type: 'error',
                text2: "Printer not working please try to reconnect and print again.",
            })
            return
        }
    }

    const printImage = async () => {
        if (connectedDevice && serviceUUID && characteristicUUID) {
            BleManager.isPeripheralConnected(
                connectedDevice
            ).then((isConnected) => {
                if (isConnected) {
                    printingWork()
                } else {
                    setConnectedDevice(null)
                    setServiceUUID(null)
                    setCharacteristicUUID(null)
                    Toast.show({
                        type: 'error',
                        text2: "Reconnect printer.",
                    })
                }
            });
        } else {
            Toast.show({
                type: 'error',
                text2: "Printer Error.",
            })
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
                            text2: "Permissions not granted. Cannot access bluetooth device.",
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

    const openBluetoothSettings = () => {
        AndroidOpenSettings.bluetoothSettings()
    };

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

    return (
        <MainBackground>
            {/* <Loader spinning={isLoading} /> */}
            <Title name="Transaction Complete" />
            <View style={[stylesw.block, { borderWidth: 0.5, borderColor: colors.blue, flex: 1, borderStyle: 'dashed', borderRadius: 6, marginTop: 20, padding: 15, paddingVertical: 15 }]}>
                <View style={{ backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, height: '100%' }}>
                    <ScrollView>
                        <View style={{ marginBottom: 10, justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <ViewShot ref={viewShotLogoRef} options={{ format: 'png', quality: 1, width: 160, height: 150 }}>
                                <Image source={logo} style={{ width: 70, height: 70, marginHorizontal: 'auto' }} />
                            </ViewShot>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text allowFontScaling={false} style={[stylesw.title, { color: "#000" }]}>Print Details</Text>
                            </View>
                        </View>

                        <View>
                            <View style={{ marginTop: 10 }}>
                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { marginBottom: 1 }]}>Lottery Name</Text>
                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#111", fontSize: 13, fontFamily: Fonts.medium }]}>{lname}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { marginBottom: 1 }]}>Total Draws Completed</Text>
                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#111", fontSize: 13, fontFamily: Fonts.medium }]}>{total}</Text>
                            </View>
                        </View>

                        <View style={{ height: 0.7, backgroundColor: colors.thirdText, marginVertical: 15 }} />
                        <Text allowFontScaling={false} style={[stylesw.title, { color: "#000", marginBottom: 15 }]}>Last {total} Draws</Text>

                        {data.map((m, c) => {
                            return <View key={c}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text allowFontScaling={false} style={[stylesw.cardLabel2, { color: "#000" }]}>S.no. {c + 1}</Text>
                                    <Text allowFontScaling={false} style={[stylesw.cardLabel2, {}]}>Draw Time : {moment.utc(m.utc_draw_time)
                                        .tz(moment.tz.guess())
                                        .format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')
                                    }</Text>
                                </View>

                                <View style={[stylesw.card, { marginTop: 4 }]}>
                                    {lotteryDetail?.type !== "Pick2" ?
                                        <>
                                            <View style={{ width: '24%', borderRightWidth: 0.7, borderRightColor: colors.thirdText }}>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'center', marginBottom: 4, fontFamily: Fonts.regular, color: "#333" }]}>Pick 3</Text>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#000", textAlign: 'center' }]}>{m?.pick3}</Text>
                                            </View>
                                            <View style={{ width: '24%', borderRightWidth: 0.7, borderRightColor: colors.thirdText }}>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'center', marginBottom: 4, fontFamily: Fonts.regular, color: "#333" }]}>Pick 4</Text>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#000", textAlign: 'center' }]}>{m?.pick4}</Text>
                                            </View>
                                            <View style={{ width: '24%', borderRightWidth: 0.7, borderRightColor: colors.thirdText }}>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'center', marginBottom: 4, fontFamily: Fonts.regular, color: "#333" }]}>Megaball</Text>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#000", textAlign: 'center' }]}>{m.megaball}</Text>
                                            </View>
                                            <View style={{ width: '24%' }}>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'center', marginBottom: 4, fontFamily: Fonts.regular, color: "#333" }]}>Monstaball</Text>
                                                <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#000", textAlign: 'center' }]}>{m.monstaball}</Text>
                                            </View>
                                        </>
                                        :
                                        <View style={{ width: '100%', borderRightWidth: 0.7, borderRightColor: colors.thirdText }}>
                                            <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'center', marginBottom: 4, fontFamily: Fonts.regular, color: "#333" }]}>Pick 2</Text>
                                            <Text allowFontScaling={false} style={[stylesw.cardLabel, { color: "#000", textAlign: 'center' }]}>{m.cashpot_no?.toString().length === 1 ? '0' + m.cashpot_no?.toString() : m.cashpot_no}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={{ height: 0.7, backgroundColor: colors.thirdText, marginVertical: 10 }} />
                            </View>
                        })}

                    </ScrollView>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, alignItems: 'center', marginHorizontal: 15 }}>
                <TouchableOpacity onPress={() => navigation.navigate("OtherScreen", { screen: "Home" })}>
                    <Text allowFontScaling={false} style={[stylesw.title, { color: colors.blue, fontSize: 15 }]}>Go to Home</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={[stylesw.btn_outline2, { width: 70 }]}>
                        <Text allowFontScaling={false} style={stylesw.btnText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePrint} style={[stylesw.btn2, { width: 80, marginStart: 5 }]}>
                        <Text allowFontScaling={false} style={stylesw.btnText}>Print</Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* -----------------------Modal------------------------ */}

            <Modal onBackdropPress={toggleModal} isVisible={isModalVisible} style={{ padding: 0, margin: 0 }}>
                <View style={stylesw.modalWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                        <Text allowFontScaling={false} style={[stylesw.modalTitle, { textAlign: 'left', fontSize: 16 }]}>Connect Bluetooth Printer</Text>
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
                            <Text allowFontScaling={false} style={[stylesw.cardLabel, { textAlign: 'left', fontSize: 14 }]}>Available Printers</Text>
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
                                        return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderColor: colors.border2 }} key={count}>
                                            <View>
                                                <Text allowFontScaling={false} style={[stylesw.title, { color: colors.white, fontSize: 14, textAlign: 'left' }]}>{m.name}</Text>
                                                <Text allowFontScaling={false} style={[stylesw.title, { fontSize: 12, textAlign: 'left', color: colors.thirdText, paddingVertical: 2 }]}>{m.id}</Text>
                                            </View>
                                            <TouchableOpacity style={[stylesw.btnIconOutline, { paddingBottom: 6, backgroundColor: connectedDevice ? connectedDevice === m.id ? colors.blue : 'transparent' : 'transparent' }]} onPress={() => connectToDevice(m.id)}>
                                                <Text style={[stylesw.btnTextIcon]} allowFontScaling={false} >{connectedDevice ? connectedDevice === m.id ? 'Connected' : '   Connect  ' : '   Connect   '}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    })
                                    : <Text allowFontScaling={false} style={[stylesw.modalDesc, { textAlign: 'left', width: '100%' }]}>No device found.</Text>}
                            </ScrollView>
                                :
                                <Text allowFontScaling={false} style={[stylesw.modalDesc, { textAlign: 'left' }]}>Turn on Bluetooth Device.</Text>
                            }
                        </View>
                        : <Text allowFontScaling={false} style={[stylesw.cardLabel, { fontSize: 14, marginBottom: 20 }]}>Bluetooth permission not given. Please grant bluetooth permission from setting.</Text>}
                    {permissionGiven && connectedDevice && on &&
                        <View style={{ marginVertical: 10 }}>
                            <Text allowFontScaling={false} style={[stylesw.title, { textAlign: 'left', fontSize: 12, color: colors.thirdText }]}>If print is not generated, kindly consider Re-pairing of your bluetooth device.</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={openBluetoothSettings} style={[stylesw.btn3]}>
                                <Text allowFontScaling={false} style={stylesw.btnText}>Pair New</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={toggleModal} style={[stylesw.btn_outline2, { width: 100 }]}>
                                <Text allowFontScaling={false} style={stylesw.btnText}>Close</Text>
                            </TouchableOpacity>
                            {permissionGiven && connectedDevice && on ?
                                <TouchableOpacity disabled={isPrinting} onPress={printImage} style={[stylesw.btn2, { width: 100, marginStart: 7, opacity: isPrinting ? 0.7 : 1 }]}>
                                    <Text allowFontScaling={false} style={stylesw.btnText}>{isPrinting ? 'Printing...' : 'Print'}</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>
                </View>
                <Toast position='bottom' config={toastConfig} />
            </Modal>
        </MainBackground>
    )
}

export default WinningResults;