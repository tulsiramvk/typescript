import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, Switch, NativeEventEmitter, NativeModules, BackHandler, Animated, Easing, FlatList, ScrollView, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import styles from './Style'
import { colors } from '../../../helpers/colors'
import Loader from '../../../helpers/Loader'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import Modal from 'react-native-modal';
import { FlashList } from '@shopify/flash-list'
import globalStyles from '../../../helpers/globalStyles'
import WinningCard2 from './WinningCard2'
import logo from '../../../static/images/logo.png'
import { BLEPrinter, COMMANDS, ColumnAlignment, } from 'react-native-thermal-receipt-printer-image-qr';
import BleManager from 'react-native-ble-manager';
import RNFetchBlob from 'rn-fetch-blob';
import FontistosIcon from 'react-native-vector-icons/Fontisto.js'
import AndroidOpenSettings from 'react-native-android-open-settings'
import moment from 'moment'
import { useOtherStore } from '../../../Store/OtherStore/OtherStore'
import { formatToTwoDecimalPlaces, logobase64, whatsappQr } from './../../../helpers/utils'
import fonts from '../../../helpers/fonts'
import { useTicketStore } from '../../../Store/TicketStore/TicketStore'
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'

const Fonts = fonts;

const Winner = ({ route }) => {
    const { fetchContact, setContact, contact } = useOtherStore()
    const { fetchWinner, payOut } = useTicketStore()
    const [spinning2, setSpinning2] = useState(false)
    const { params } = route
    const [currentWinner, setCurrentWinner] = useState([])
    const [refreshing2, setRefreshing2] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing2(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };

    useEffect(() => {
        setSpinning2(true)
        fetchWinner(params.id[0].value)
            .then(res => {
                setSpinning2(false)
                setCurrentWinner(res.data.data)
            })
            .catch(err => {
                setSpinning2(false)
                console.log(err.response.data);
            })

        fetchContact()
            .then(res => {
                setContact(res.data.data)
            })
            .catch(err => {
                console.log(err);

            })
    }, [params, refreshing2])

    // ---------------------------------------------------------

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => { setModalVisible2(!isModalVisible2); };

    const handlePayout = () => {
        setSpinning2(true)
        payOut(params.id[0].value)
            .then(res => {
                handlePrint()
                setSpinning2(false)
                toggleModal2()
                setRefreshing2(!refreshing2)
                Toast.show({
                    type: 'success',
                    text2: res.data.message,
                });
            })
            .catch(err => {
                console.log({ err })
                // handlePrint()
                setSpinning2(false)
                toggleModal2()
                Toast.show({
                    type: 'error',
                    text2: err?.response?.data?.message?.toString() || "Server Error.",
                });
            })
    }

    const findTotalWon = () => {
        let w = 0
        for (let i = 0; i < currentWinner.length; i++) {
            const e = currentWinner[i];
            // if (e?.status === "unpaid") {
            //     w = w + Number(e.total_won)
            // }
            w = w + Number(e.total_won)
        }
        return w;
    }

    const findTotalBet = () => {
        let w = 0
        for (let i = 0; i < currentWinner.length; i++) {
            const e = currentWinner[i];
            w = w + Number(e.total_bet)
        }
        return w;
    }

    // ---------------------------------------------------------------printing Work------------------------------------------------------
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
            const resolvedImage = Image.resolveAssetSource(uri);
            const imagePath = resolvedImage.uri.replace('file://', '');
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
        let data = await fetchImageData(logo)
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
        ColumnAlignment.LEFT,
    ];
    let columnWidth = [11, 8, 11];
    const header = ['Game', 'Bet Amt', 'Win Amt'];
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
            await BLEPrinter.printText(`${CENTER}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} ORDER DETAILS ${BOLD_OFF}\n`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${BOLD_ON}${UNDERLINE_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_A} Order Id - ${params.id[0].value} ${UNDERLINE_OFF}${BOLD_OFF}\n`);
            await delay(100);
            await BLEPrinter.printText(`Lottery Name : ${currentWinner[0].lottery_name}`);
            await delay(100);
            await BLEPrinter.printText(`Agent Name : ${currentWinner[0].agent_name}`);
            await delay(100);
            await BLEPrinter.printText(`Customer Name : ${currentWinner[0].customer_name || ''}`);
            await delay(100);
            await BLEPrinter.printText(`Status : Paid`);
            await delay(100);
            await BLEPrinter.printText(`Payout By : ${currentWinner[0]?.paid_by || ''}`);
            await delay(100);
            await BLEPrinter.printText(`Draw Date : ${moment.utc(currentWinner[0].utc_drawDateTime).tz(moment.tz.guess()).format('lll')}`);
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine1}`,
            );
            await delay(100);
            await BLEPrinter.printText(
                `${LEFT}Winning Summary :`
            );
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine}`,
            );
            await delay(100);
            await BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
                `${BOLD_ON}${LEFT}`, `${BOLD_ON}${LEFT}`, `${BOLD_ON}${LEFT}`
            ]);
            await delay(100);
            await BLEPrinter.printText(
                `${CENTER}${horizontalLine}`,
            );
            await delay(100);
            for (let j = 0; j < currentWinner.length; j++) {
                const ndata = currentWinner[j];
                await BLEPrinter.printText(
                    `${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_FONT_B}S.no. ${j + 1}${BOLD_OFF}`,
                );
                await delay(100);
                await BLEPrinter.printColumnsText([`Draw Time: ${moment.utc(ndata.utc_drawDateTime).tz(moment.tz.guess()).format('hh:mmA')}`, `Draw No.: ${ndata.draw_no}`], [19, 13], [ColumnAlignment.LEFT, ColumnAlignment.RIGHT,], [
                    `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${LEFT}`, `${COMMANDS.TEXT_FORMAT.TXT_FONT_B}${RIGHT}`
                ]);
                await delay(100);
                for (let i = 0; i < ndata.games.length; i++) {
                    const e = ndata.games[i];
                    let b = e.bet?.toString().length === 1 ? '0' + e.bet?.toString() : e.bet
                    let row = [
                        (e.game_name.toLowerCase() === 'straight' ? "Straight (" + b + ")" : e?.game_name?.toLowerCase() === 'box' ? "Box (" + b + ")" : e.game_name.toLowerCase() === 'megaball' ? "Megaball (" + e.bet + ")" : "Monstaball (" + e.bet + ")"),
                        '$' + formatToTwoDecimalPlaces(e.bet_amount),
                        '$' + formatToTwoDecimalPlaces(e.win_amount)
                    ]
                    await BLEPrinter.printColumnsText(row, columnWidth, columnAlignment, [
                        `${BOLD_ON}${LEFT}`, COMMANDS.LINE_SPACING.LS_DEFAULT
                    ]);
                    await delay(100);
                    let conected4 = await BleManager.isPeripheralConnected(connectedDevice)
                    if (!conected4) {
                        throwError()
                        return; // Exit function if connection fails
                    }
                }

                await BLEPrinter.printText(
                    `${CENTER}${horizontalLine}`,
                );
                await delay(100);
                let conected = await BleManager.isPeripheralConnected(connectedDevice)
                if (!conected) {
                    throwError()
                    return; // Exit function if connection fails
                }
            }
            await BLEPrinter.printText(
                `${RIGHT}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_2HEIGHT}Total Bet Amount: $${formatToTwoDecimalPlaces(findTotalBet())}`,
            );
            await delay(100);
            await BLEPrinter.printText(
                `${RIGHT}${BOLD_ON}${COMMANDS.TEXT_FORMAT.TXT_2HEIGHT}Total Win Amount: $${formatToTwoDecimalPlaces(findTotalWon())}`,
            );
            await delay(100);
            await BLEPrinter.printText(`\n\n`);
            await delay(100);
            await BLEPrinter.printText(`${CENTER}${COMMANDS.TEXT_FORMAT.TXT_FONT_C}Thankyou!! for being a valuable customer of Fortune Lottery`);
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
            Toast.show({
                type: 'success',
                text2: "Print Successfully.",
            })
            return true
        } catch (error) {
            console.log({ error });
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
            <Loader spinning2={spinning2} />
            <View style={[styles.block]}>
                <Title name={'Winner List'} />
            </View>
            <View style={[styles.block, { flexDirection: 'column', marginTop: 10, flex: 1 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={[styles.title, { marginVertical: 15, width: 'auto' }]}>Payout Scan Result</Text>
                    <View style={[globalStyles.textCard, { marginLeft: 'auto', marginRight: 0, backgroundColor: colors.blue }]}>
                        <Text allowFontScaling={false} style={[globalStyles.rowText]}>Order ID : {params.id[0].value}</Text>
                    </View>
                </View>
                <View style={[globalStyles.tableWrapper, { flexGrow: 1, marginBottom: 5 }]}>
                    {currentWinner.length > 0 ?
                        <FlashList
                            data={currentWinner}
                            ListHeaderComponent={() => (
                                <View style={[globalStyles.headerRow]}>
                                    <View style={{ width: '13%', }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                    </View>
                                    <View style={{ width: '24%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Customer</Text>
                                    </View>
                                    <View style={{ width: '20%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                    </View>
                                    <View style={{ width: '27%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Date & Time</Text>
                                    </View>
                                    <View style={{ width: '16%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Status</Text>
                                    </View>
                                </View>
                            )}
                            onRefresh={() => setRefreshing2(!refreshing2)}
                            refreshing={spinning2}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => { return <WinningCard2 count={index + 1} data={item} key={index} /> }}
                            estimatedItemSize={100}
                            contentContainerStyle={{ flexGrow: 1 }}
                            decelerationRate={'fast'}
                        />
                        :
                        <View style={{ flexGrow: 1 }}>
                            <Text allowFontScaling={false} style={[styles.title2, { marginTop: 15, color: colors.secondaryText }]}>No Winner found...!</Text>
                        </View>
                    }
                </View>
                {currentWinner.length > 0 && <View style={[{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-end' }, styles.block]}>
                    <TouchableOpacity onPress={toggleModal2} style={[styles.btn2, { paddingVertical: 10 }]}>
                        <View><Text allowFontScaling={false} style={[styles.btnTextIcon, { fontSize: 14 }]}> Make Payout & Print </Text></View>
                    </TouchableOpacity>
                </View>
                }
            </View>
            <Modal onBackdropPress={toggleModal2} isVisible={isModalVisible2} style={{ padding: 0, margin: 0, marginTop: "-80%" }}>
                <View style={styles.modalWrapper}>
                    <Text allowFontScaling={false} style={[styles.modalTitle]}> Pay Out </Text>
                    <Text allowFontScaling={false} style={[styles.modalDesc, { marginVertical: 20 }]}>
                        <Text allowFontScaling={false}>Mark the payment of ${findTotalWon()} a paid?</Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5 }}>
                        <TouchableOpacity onPress={toggleModal2} style={[styles.btn_outline2, { width: '35%', marginEnd: 10 }]}>
                            <Text allowFontScaling={false} style={styles.btnText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={spinning2} onPress={handlePayout} style={[styles.btn2, { width: '35%' }]}>
                            <Text allowFontScaling={false} style={styles.btnText}>Yes</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {/* <Toast position='bottom' config={toastConfig} /> */}
            </Modal>

            {/* ---------------------Printing modal------------------------- */}

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
                                                <Text allowFontScaling={false} style={[styles.title, { color: colors.white, fontSize: 14, textAlign: 'left' }]}>{m.name}</Text>
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
                            <TouchableOpacity onPress={openBluetoothSettings} style={[styles.btn2, { width: 'auto' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Pair New</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline2, { width: 100 }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Close</Text>
                            </TouchableOpacity>
                            {permissionGiven && connectedDevice && on ?
                                <TouchableOpacity disabled={isPrinting} onPress={printImage} style={[styles.btn2, { width: 100, marginStart: 7, opacity: isPrinting ? 0.7 : 1 }]}>
                                    <Text allowFontScaling={false} style={styles.btnText}>{isPrinting ? 'Printing...' : 'Print'}</Text>
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

export default Winner