import { View, Text, TouchableOpacity, ScrollView, Image, PermissionsAndroid, Platform, Switch, NativeEventEmitter, NativeModules, BackHandler, Vibration, Alert } from 'react-native'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import styles from '../../Style.js'
import styles3 from './Style.js'
import MainBackground from '../../../../../../Components/MainBackground/MainBackground.js'
import Title from '../../../../../../Components/Title/Title.js'
import logo from '../../../../../../static/images/logo.png'
import complete from '../../../../../../static/images/complete.png'
import moment from 'moment-timezone'
import fonts from '../../../../../../helpers/fonts.js'
import QRCode from 'react-native-qrcode-svg';
import Loader from '../../../../../../helpers/Loader.js'
import { formatToTwoDecimalPlaces, whatsappQr } from './../../../../../../helpers/utils'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useHomeStore } from '../../../../../../Store/HomeStore/HomeStore.js'
import { BLEPrinter, COMMANDS, ColumnAlignment, } from 'react-native-thermal-receipt-printer-image-qr';
import BleManager from 'react-native-ble-manager';
import Modal from 'react-native-modal';
import ViewShot from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import FontistosIcon from 'react-native-vector-icons/Fontisto.js'
import AndroidOpenSettings from 'react-native-android-open-settings'
import { useOtherStore } from '../../../../../../Store/OtherStore/OtherStore.js'
import { FlashList } from '@shopify/flash-list'
import { useTicketStore } from '../../../../../../Store/TicketStore/TicketStore.js'
import { useLotteryPurchaseStore } from '../../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore.js'
import { colors } from './../../../../../../helpers/colors';

const Fonts = fonts;
const TransactionComplete = ({ route }) => {
    const { cancelTicket, purchaseSuccess } = useTicketStore()
    const { fetchContact, setContact, contact } = useOtherStore()
    const { isEnabled } = useHomeStore()
    const { connectedDevice, setConnectedDevice, serviceUUID, setServiceUUID, characteristicUUID, setCharacteristicUUID } = useHomeStore()
    const viewShotLogoRef = useRef(null);
    const viewShotQrRef = useRef(null);
    const navigation = useNavigation()
    const { params } = route
    const [isLoading, setIsLoading] = useState(false)
    const [data, setdata] = useState()
    const { printPurchaseLottery, lotteryDetail } = useLotteryPurchaseStore()
    const [spinning, setSpinning] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => { setModalVisible(!isModalVisible); };
    const [refreshing, setRefreshing] = useState(false);
    const [printAvailable, setPrintAvailable] = useState(true)
    const [printSuccess, setPrintSuccess] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showExpireModal, setShowExpireModal] = useState(false)
    const [currentBackHandler, setCurrentBackHandler] = useState('Home')

    const onRefresh = () => {
        setRefreshing(true)
        setIsLoading(true)
        printPurchaseLottery(params.data.data.order_no)
            .then(res => {
                setRefreshing(false)
                setIsLoading(false)
                setdata(res.data.data)
            })
            .catch(err => {
                setIsLoading(false)
                setRefreshing(false)
            })

        fetchContact()
            .then(res => {
                setContact(res.data.data)
            })
            .catch(err => {
                console.log(err);

            })
    };

    useEffect(() => {
        setIsLoading(true)
        printPurchaseLottery(params.data.data.order_no)
            .then(res => {
                setIsLoading(false)
                setdata(res.data.data)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [params])

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
    let columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.LEFT,
        ColumnAlignment.RIGHT,
    ];
    let columnAlignment2 = [
        ColumnAlignment.LEFT,
        ColumnAlignment.RIGHT,
    ];
    let columnWidth = [10, 9, 11];
    let columnWidth2 = [15, 15];
    const header = ['#', 'NAME', 'AMOUNT'];
    const horizontalLine1 = "=".repeat(32);
    const horizontalLine = "".repeat(32);
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
            // let l = await captureAndConvertToBase64()
            let q = await captureAndConvertToBase64Q()

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
            // await BLEPrinter.printImageBase64(l, {
            //     imageWidth: 160, imageHeight: 150
            // })
            // await delay(600);
            await BLEPrinter.printText(`${CENTER}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} ORDER DETAILS ${BOLD_OFF}\n`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${BOLD_ON}${UNDERLINE_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} Date: ${data.bet[0].draw_date} ${UNDERLINE_OFF}${BOLD_OFF}\n`);
            await delay(100);
            await BLEPrinter.printText(`Order No. : ${data.order_no}`);
            await delay(100);
            await BLEPrinter.printText(`Name : ${data.lotteryDetails.name}`);
            await delay(100);
            await BLEPrinter.printText(`Agent Name : ${data.agent_name}`);
            await delay(100);
            await BLEPrinter.printText(`Customer Name : ${data.customerDetails.customer_name || ''}`);
            await delay(100);
            await BLEPrinter.printText(`Contact : ${data.customerDetails.customer_contact || ""}`);
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine1}`,
            );
            await delay(100);
            await BLEPrinter.printImageBase64(q, {
                imageWidth: 140, imageHeight: 140
            })
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}Scan QR, (Only for Agents)\n`
            );
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine}`,
            );
            await delay(100);
            await BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
                `${BOLD_ON}`, ``, ``
            ]);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine1}`,
            );
            await delay(100);
            for (let j = 0; j < data.bet.length; j++) {
                const ndata = data.bet[j];
                let rowHead = [
                    `${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}Entry : ${ndata.card_id}${BOLD_OFF}`,
                    `${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${ndata.pick_type}${BOLD_OFF}`
                ]
                await BLEPrinter.printColumnsText(rowHead, columnWidth2, columnAlignment2, [
                    `${BOLD_OFF}`, ``, ``
                ]);
                // await BLEPrinter.printText(
                //     `${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}Entry : ${ndata.card_id}${BOLD_OFF}`,
                // );
                // await BLEPrinter.printText(
                //     `${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${ndata.pick_type}${BOLD_OFF}`,
                // );
                await delay(100);
                await BLEPrinter.printColumnsText([`Time: ${moment.utc(ndata.utc_drawDateTime).tz(moment.tz.guess()).format('hh:mmA')}`, `Draw No. ${ndata.draw_no}`], [19, 13], [ColumnAlignment.LEFT, ColumnAlignment.RIGHT,], [
                    `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}`, `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}`
                ]);
                await delay(100);
                for (let i = 0; i < ndata.games.length; i++) {
                    const e = ndata.games[i];
                    let row = [
                        e.game_name.toLowerCase() === 'straight' || e.game_name.toLowerCase() === 'box' ? `${e.ticket_number?.toString().length === 1 ? '0' + e.ticket_number?.toString() : e.ticket_number}` : e.game_name.toLowerCase() === 'megaball' ? 'Gold' : 'Red',
                        e.game_name.toLowerCase() === 'straight' ? "Straight" : e.game_name.toLowerCase() === 'box' ? "Box" : e.game_name.toLowerCase() === 'megaball' ? 'Mega' : 'Monsta',
                        '$' + formatToTwoDecimalPlaces(e.bet_amount)
                    ]
                    await BLEPrinter.printColumnsText(row, columnWidth, columnAlignment, [
                        `${e.game_name.toLowerCase() === 'straight' ? BOLD_ON : BOLD_OFF}`, COMMANDS.LINE_SPACING.LS_DEFAULT
                    ]);
                    await delay(100);
                    let conected4 = await BleManager.isPeripheralConnected(connectedDevice)
                    if (!conected4) {
                        throwError()
                        return; // Exit function if connection fails
                    }
                }

                await BLEPrinter.printText(
                    `${CENTER}${j === data.bet.length - 1 ? horizontalLine1 : horizontalLine1}`,
                );
                await delay(100);
                let conected = await BleManager.isPeripheralConnected(connectedDevice)
                if (!conected) {
                    throwError()
                    return; // Exit function if connection fails
                }
            }
            await BLEPrinter.printText(
                `${RIGHT}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_2HEIGHT}Total Amount : $${formatToTwoDecimalPlaces(data.bet_amount)}`,
            );
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_C}`);
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
            setPrintAvailable(false)
            setPrintSuccess(true)
            setShowModal(true)
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

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (showExpireModal) {
                    navigation.replace("OtherScreen", { screen: "Home" })
                    return true;
                } else {
                    setShowModal(true)
                    setCurrentBackHandler('Home')
                    return true; // Return true to prevent the default behavior (going back)
                }
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );
            // Clean up the event listener when the screen is unfocused
            return () => backHandler.remove();
        }, [])
    );

    const openBluetoothSettings = () => {
        AndroidOpenSettings.bluetoothSettings()
    };

    useEffect(() => {
        fetchContact()
            .then(res => {
                setContact(res.data.data)
            })
            .catch(err => {
                console.log(err);

            })
    }, [])

    // ------------------------------------------------------------------------------------
    console.log(data);

    // Render the header component
    const renderHeader = useMemo(
        () => (
            <>
                <View style={{ marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <ViewShot ref={viewShotLogoRef} options={{ format: 'png', quality: 1, width: 160, height: 150 }}>
                        <Image source={logo} style={{ width: 100, height: 100, backgroundColor: 'transparent' }} />
                    </ViewShot>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text allowFontScaling={false} style={[styles3.title, { color: "#000" }]}>Order Details</Text>
                    </View>
                    <View>
                        <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#fff", backgroundColor: colors.blue, paddingHorizontal: 7, borderRadius: 4, fontFamily: Fonts.medium, paddingVertical: 1 }]}>ID No : {data ? data.order_no : ''}</Text>
                    </View>
                </View>
                {data &&
                    <View>
                        <View style={{ marginTop: 6 }}>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111" }]}>Lottery Name</Text>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>{data.lotteryDetails.name}</Text>
                        </View>
                        <View style={{ marginTop: 6 }}>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111" }]}>Agent Name</Text>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>{data.agent_name}</Text>
                        </View>
                        <View style={{ marginTop: 6 }}>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111" }]}>Customer Name</Text>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>{data.customerDetails.customer_name}</Text>
                        </View>
                        <View style={{ marginTop: 6 }}>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111" }]}>Contact</Text>
                            <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>{data.customerDetails.customer_contact}</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 0, top: 20 }}>
                            <ViewShot ref={viewShotQrRef} options={{ format: 'png', quality: 1 }}>
                                <QRCode
                                    value={String(data.order_no)}
                                    size={100}
                                    color="black"
                                    backgroundColor="white"
                                />
                            </ViewShot>
                        </View>
                    </View>
                }
                <View style={{ marginVertical: 10 }}><View style={{ height: 0.4, backgroundColor: "#777", width: '100%' }}></View></View>
                <Text allowFontScaling={false} style={[styles3.title, { color: "#000" }]}>Order Details</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 6, backgroundColor: colors.blackBg, marginTop: 8 }}>
                    <View style={{ width: '13%' }}>
                        <Text allowFontScaling={false} style={[styles3.cardLabel, { color: colors.black, fontSize: 12, }]}>Bet #</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                        <Text allowFontScaling={false} style={[styles3.cardLabel, { color: colors.black, fontSize: 12, paddingHorizontal: 8, paddingStart: 12 }]}>Game</Text>
                    </View>
                    <View style={{ width: '29%' }}>
                        <Text allowFontScaling={false} style={[styles3.cardLabel, { color: colors.black, fontSize: 12, paddingHorizontal: 8 }]}>Drawtime</Text>
                    </View>
                    <View style={{ width: '28%' }}>
                        <Text allowFontScaling={false} style={[styles3.cardLabel, { color: colors.black, fontSize: 12, paddingHorizontal: 8 }]}>Amount</Text>
                    </View>
                </View>
            </>
        ),
        [data]
    );
    const renderFooter = useMemo(
        () => (
            <>
                {data ? <View style={{ paddingTop: 8 }}>
                    <Text allowFontScaling={false} style={[styles3.title, { textAlign: 'right' }]}><Text allowFontScaling={false} style={{ fontSize: 13 }}>Total Amount </Text>$ {formatToTwoDecimalPlaces(data.bet_amount)}</Text>
                </View>
                    : null}
            </>
        ),
        [data]
    );

    // Memoized renderItem to prevent unnecessary re-renders
    const renderItem = ({ item, index }) => {
        return <View key={index} style={[styles.renderContainer3]}>
            <View style={[styles.renderContainer2]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={[styles.entryStyle4]}>Entry </Text>
                    <View style={[styles.entryStyle3]}><Text allowFontScaling={false} style={[styles.entryStyle5]}>{item.card_id}</Text></View>
                </View>
                <View style={{ marginRight: 'auto', marginStart: 10 }}>
                    <View style={[styles.entryStyle3]}><Text allowFontScaling={false} style={[styles.entryStyle5]}>{item?.pick_type}</Text></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={[styles.entryStyle4]}>Draw No. </Text>
                    <View style={[styles.entryStyle3]}><Text allowFontScaling={false} style={[styles.entryStyle5]}>{item.draw_no}</Text></View>
                </View>
            </View>
            {item.games.map((d, c) => {
                return <View key={c} style={[styles.cashpotContainer2]}>
                    <View style={[styles.col111]}>
                        {d.game_name.toLowerCase() === 'box' && <Text allowFontScaling={false} style={[styles3.title, styles3.cashpotNumber2]}>{d.ticket_number?.toString().length === 1 ? '0' + d.ticket_number?.toString() : d.ticket_number}</Text>}
                        {d.game_name.toLowerCase() === 'straight' && <Text allowFontScaling={false} style={[styles3.title, styles3.cashpotNumber2]}>{d.ticket_number?.toString().length === 1 ? '0' + d.ticket_number?.toString() : d.ticket_number}</Text>}
                        {d.game_name.toLowerCase() === 'megaball' &&
                            <Text allowFontScaling={false} style={[styles3.title, { fontSize: 12, color: colors.black, }]}>Gold</Text>
                        }
                        {d.game_name.toLowerCase() === 'monstaball' &&
                            <Text allowFontScaling={false} style={[styles3.title, { fontSize: 12, color: colors.black, }]}>Red</Text>
                        }
                    </View>
                    <View style={[styles.col222]}>
                        <Text allowFontScaling={false} style={[styles3.title, { fontSize: 13, fontFamily: Fonts.bold }]}>{d.game_name}</Text>
                    </View>
                    <View style={[styles.col333]}>
                        <Text allowFontScaling={false} style={[styles3.title, { fontSize: 12, fontFamily: Fonts.bold, lineHeight: 16 }]}>{moment.utc(item.utc_drawDateTime).tz(moment.tz.guess()).format(isEnabled ? 'lll' : 'MMM DD, YYYY HH:mm A')}</Text>
                    </View>
                    <View style={[styles.col444]}>
                        <Text allowFontScaling={false} style={[styles3.title, { fontSize: 13, fontFamily: Fonts.bold }]}>$ {formatToTwoDecimalPlaces(d.bet_amount)}</Text>
                    </View>
                </View>
            })}
        </View>
    }

    const handleNo = () => {
        Vibration.cancel()
        setIsLoading(true)
        cancelTicket(params.data.data.order_no)
            .then(res => {
                setIsLoading(false)
                setShowModal(false)
                Toast.show({
                    type: 'success',
                    text2: "Order Cancelled.",
                });
                Alert.alert('Contact Admin', "If your ticket didn't print, please contact admin.")
                navigation.replace("OtherScreen", { screen: currentBackHandler ?? 'Home' })
            })
            .catch(err => {
                setIsLoading(false)
                if (err.response && err.response.status === 400) {
                    Toast.show({
                        type: 'error',
                        text2: err.response.data.message,
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text2: "Ticket void error.",
                    });
                }
            })
    }

    const handleYes = () => {
        Vibration.cancel()
        const nowUTC = new Date().toISOString(); // Current UTC time
        const expiredDraws = data.bet.filter(
            (b) => new Date(b.utc_drawDateTime) < new Date(nowUTC)
        );
        if (expiredDraws.length > 0) {
            setShowExpireModal(true)
        } else {
            setIsLoading(true)
            purchaseSuccess(params.data.data.order_no)
                .then(res => {
                    setIsLoading(false)
                    setShowModal(false)
                    navigation.replace("OtherScreen", { screen: currentBackHandler ?? 'Home' })

                })
                .catch(err => {
                    Toast.show({
                        type: 'error',
                        text2: "Error",
                    })
                    setIsLoading(false)
                })
        }
    }

    // ------------------------------------Time Left Popup-------------------------------------

    const [timeLeft, setTimeLeft] = useState(null);
    const [nextDraw, setNextDraw] = useState(null);

    useEffect(() => {
        if (data) {
            // Get the current UTC time as a string
            const nowUTC = new Date().toISOString();

            // Sort bets by `utc_drawDateTime` (assumed to be in UTC already)
            const sortedBets = data.bet.sort((a, b) =>
                new Date(a.utc_drawDateTime).getTime() - new Date(b.utc_drawDateTime).getTime()
            );

            // Find the next draw that hasn't expired
            const upcomingDraw = sortedBets.find(
                (bet) => new Date(bet.utc_drawDateTime).getTime() > new Date(nowUTC).getTime()
            );

            if (upcomingDraw) {
                setNextDraw(upcomingDraw);

                // Calculate the time difference between the next draw and now in UTC
                const timeDiff = new Date(upcomingDraw.utc_drawDateTime).getTime() - new Date(nowUTC).getTime();
                setTimeLeft(timeDiff);
            }

            // Set up the timer
            const timer = setInterval(() => {
                const currentTimeUTC = new Date().toISOString();
                const updatedTimeDiff =
                    new Date(upcomingDraw?.utc_drawDateTime).getTime() - new Date(currentTimeUTC).getTime();

                if (updatedTimeDiff <= 0) {
                    setTimeLeft(null);
                    clearInterval(timer);
                } else {
                    setTimeLeft(updatedTimeDiff);
                }
            }, 1000);

            // Cleanup timer on component unmount
            return () => clearInterval(timer);
        }
    }, [data]);


    const formatTime = (ms) => {
        if (ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            // Pad hours, minutes, and seconds with leading zeros if needed
            const pad = (num) => String(num).padStart(2, '0');

            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
            return `00:00:00`;

        }
    };

    useEffect(() => {
        if (showModal) {
            Vibration.vibrate(1000000)
        } else {
            Vibration.cancel()
        }
    }, [showModal])

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
            <Loader spinning={isLoading} />
            <View style={[styles.block, { marginBottom: 10 }]}>
                <Title name="Transaction Complete" />
                <View style={{ marginVertical: 10, marginTop: 25 }}>
                    <Image source={complete} style={{ width: 70, height: 70, marginHorizontal: 'auto' }} />
                </View>
                <Text allowFontScaling={false} style={[styles.title, { textAlign: 'center' }]}>Transaction Complete</Text>
                <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center' }]}>{moment().format("LLL")}</Text>
            </View>
            {data &&
                <View style={[styles.block, { flex: 1 }]}>
                    <View style={[styles3.card, { padding: 15, paddingVertical: 15, flex: 1 }]}>
                        <View style={{ backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, flex: 1 }}>
                            <FlashList
                                onRefresh={onRefresh}
                                refreshing={refreshing}
                                data={data.bet}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                ListHeaderComponent={renderHeader}
                                ListFooterComponent={renderFooter}
                                estimatedItemSize={150}
                                decelerationRate={'fast'}
                            />
                        </View >
                    </View >
                    <View style={[styles.block]}>
                        {printAvailable && <View style={{ paddingTop: 10 }}>
                            <Text allowFontScaling={false} style={[styles3.title, { color: colors.white, fontSize: 12 }]}>Purchase Receipt is ready for print</Text>
                        </View>}
                        {printSuccess && <View style={{ paddingTop: 10 }}>
                            <Text allowFontScaling={false} style={[styles3.title, { color: colors.green, fontSize: 12 }]}>The purchase receipt was printed successfully.</Text>
                        </View>}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { setCurrentBackHandler('Home'); setShowModal(true) }}>
                                <Text allowFontScaling={false} style={[styles3.title, { color: colors.blue, fontSize: 15 }]}>Go to Home</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { setCurrentBackHandler('Ticket'); setShowModal(true) }} style={[styles3.btn_outline2, { width: 70 }]}>
                                    <Text allowFontScaling={false} style={styles3.btnText}>View</Text>
                                </TouchableOpacity>
                                {printAvailable && <TouchableOpacity onPress={handlePrint} style={[styles3.btn2, { width: 80, marginStart: 5 }]}>
                                    <Text allowFontScaling={false} style={styles3.btnText}>Print</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>

                </View >
            }

            {/* -----------------------Modal------------------------ */}

            <Modal onBackdropPress={toggleModal} isVisible={isModalVisible} style={{ padding: 0, margin: 0 }}>
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
                            <TouchableOpacity onPress={scanAndPrint} style={{ marginEnd: 10 }}>
                                <FontistosIcon name={"spinner-refresh"} size={18} color={colors.thirdText} />
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
                    {permissionGiven && connectedDevice && on &&
                        <View style={{ marginVertical: 10 }}>
                            <Text allowFontScaling={false} style={[styles.title, { textAlign: 'left', fontSize: 12, color: colors.thirdText }]}>If print is not generated, kindly consider Re-pairing of your bluetooth device.</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={openBluetoothSettings} style={[styles3.btn3]}>
                                <Text allowFontScaling={false} style={styles3.btnText}>Pair New</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={toggleModal} style={[styles3.btn_outline2, { width: 100 }]}>
                                <Text allowFontScaling={false} style={styles3.btnText}>Close</Text>
                            </TouchableOpacity>
                            {permissionGiven && connectedDevice && on ?
                                <TouchableOpacity disabled={isPrinting} onPress={printImage} style={[styles3.btn2, { width: 100, marginStart: 7, opacity: isPrinting ? 0.7 : 1 }]}>
                                    <Text allowFontScaling={false} style={styles3.btnText}>{isPrinting ? 'Printing...' : 'Print'}</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>
                </View>
                <Toast position='bottom' config={toastConfig} />
            </Modal>

            {/* -----------------------Confirmation Modal------------------------ */}

            <Modal isVisible={showModal} style={{ padding: 0, margin: 0 }}>
                <View style={styles.modalWrapper}>
                    <Text allowFontScaling={false} style={[styles.modalTitle]}>Was your print successful?</Text>

                    <Text allowFontScaling={false} style={[styles.modalDesc, { marginVertical: 10 }]}>
                        <Text allowFontScaling={false}>
                            <Text allowFontScaling={false} style={{ fontFamily: Fonts.bold }}>
                                The next draw is in{" "}
                                <Text allowFontScaling={false} style={{ fontFamily: Fonts.bold, color: colors.red }}>{formatTime(timeLeft)}.</Text>
                            </Text>
                            {"\n"}Your purchase will be automatically cancelled after the draw time.
                            {"\n\n"}Select{" "}
                            <Text allowFontScaling={false} style={{ fontFamily: Fonts.bold }}>
                                YES
                            </Text>{" "}
                            if ticket print successfully, or{" "}
                            <Text allowFontScaling={false} style={{ fontFamily: Fonts.bold }}>
                                NO
                            </Text>{" "}
                            if ticket didn't print.
                        </Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5, marginTop: 5 }}>
                        <TouchableOpacity onPress={handleNo} style={[styles.btn2, { width: '35%', marginEnd: 20, backgroundColor: colors.red }]}>
                            <Text allowFontScaling={false} style={[styles.btnText, { fontFamily: Fonts.bold, fontSize: 14 }]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleYes} style={[styles.btn2, { width: '35%', backgroundColor: colors.green }]}>
                            <Text allowFontScaling={false} style={[styles.btnText, { fontFamily: Fonts.bold, fontSize: 14 }]}>Yes</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <Toast position='bottom' config={toastConfig} />
            </Modal>

            {/* -----------------------Expire Modal------------------------ */}

            <Modal isVisible={showExpireModal} style={{ padding: 0, margin: 0 }}>
                <View style={styles.modalWrapper}>
                    <Text allowFontScaling={false} style={[styles.modalTitle]}>Draw Time Passed</Text>

                    <Text allowFontScaling={false} style={[styles.modalDesc, { marginVertical: 10 }]}>
                        <Text allowFontScaling={false}>
                            Your recent purchase is cancelled due to late confirmation of the purchase.
                            Please consider betting again for upcoming draws!
                        </Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5, marginTop: 5 }}>
                        <TouchableOpacity onPress={() => navigation.replace("OtherScreen", { screen: "Home" })} style={[styles.btn2, { width: '35%' }]}>
                            <Text allowFontScaling={false} style={[styles.btnText, { fontFamily: Fonts.bold, fontSize: 14 }]}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <Toast position='bottom' config={toastConfig} />
            </Modal>
        </MainBackground >
    )
}

export default TransactionComplete