import MainBackground from '../../../../Components/MainBackground/MainBackground.js'
import Title from '../../../../Components/Title/Title.js'
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../../../helpers/colors.js'
import { useNavigation } from '@react-navigation/native'
import styles from './Style.js'
import Loader from '../../../../helpers/Loader.js'
import Toast from 'react-native-toast-message'
import { types, pick } from 'react-native-document-picker'
import { useSupportStore } from './../../../../Store/SupportStore/SupportStore';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons.js';
import moment from 'moment-timezone'
import FetherIcon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import InputIcon from '../../../../Components/Inputs/InputIcon.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHomeStore } from '../../../../Store/HomeStore/HomeStore.js'

const ViewSupport = ({ route }) => {
    const navigation = useNavigation()
    const { params } = route
    const [spinning, setSpinning] = useState(false)
    const { fetchViewSupportList, createReply, uploadSupportAttachments } = useSupportStore()
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const {isEnabled} = useHomeStore()

    useEffect(() => {
        setSpinning(true)
        fetchViewSupportList(params.id)
            .then(res => {
                setData(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing, params.id])

    const [payload, setPayload] = useState({
        replayTicket: 1, message: ''
    })

    const [attatchments, setAttatchments] = useState([])

    // Memoized renderItem to prevent unnecessary re-renders

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'Application needs access to your storage to download File',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                return true
                // console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted');
                return false
            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
            return false
        }
    }

    const [downloading, setDownloading] = useState(false)

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    const downloadFile = (url) => {
        if (checkPermission) {
            let date = new Date();
            let FILE_URL = url;
            let file_ext = getFileExtention(FILE_URL);
            file_ext = '.' + file_ext[0];
            const { config, fs } = RNFetchBlob;
            let RootDir = fs.dirs.DownloadDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext;
            var path = RNFS.DocumentDirectoryPath + '/test.' + file_ext;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    path:
                        RootDir +
                        '/file_' +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        file_ext,
                    description: 'Downloading file...',
                    notification: true,
                    useDownloadManager: true,
                },
            };
            setDownloading(true)
            RNFS.downloadFile({
                fromUrl: FILE_URL,
                toFile: RootDir,
            })
                .promise
                .then(response => {
                    if (response.statusCode === 200) {
                        console.log('File downloaded successfully:', RootDir);
                        Toast.show({
                            type: 'success',
                            text1: 'File download successfully in folder ' + RootDir + '.'
                        });
                    } else {
                        console.error('Failed to download file:', response);
                        Toast.show({
                            type: 'error',
                            text1: 'File download Failed.'
                        });
                    }
                })
        }
    };

    const renderItem = ({ item, index }) => {
        return <View style={[styles.cardWrapper, { marginLeft: item.send_by === 0 ? 'auto' : 0 }]} key={item.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: item.send_by === 0 ? 'flex-end' : 'flex-start' }}>
                <View><MaterialIcon name={'account-circle'} color={colors.blue2} size={30} /></View>
                <View><Text allowFontScaling={false} style={[styles.titleName]}>{item.name}</Text></View>
            </View>
            <View>
                <Text allowFontScaling={false} style={[styles.desc, { textAlign: item.send_by === 0 ? 'right' : 'left' }]}>{item.message}</Text>
            </View>
            {item.attachments.map((f, c) => {
                return <TouchableOpacity onPress={() => downloadFile(f.url)} key={f.id} style={[styles.fileCard]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View><FetherIcon name={'file-text'} color={colors.white} size={17} /></View>
                        <View><Text numberOfLines={1} allowFontScaling={false} style={[styles.desc]}>{f.url.length > 30 ? '...' + f.url.slice(-30) : f.url}</Text></View>
                    </View>
                </TouchableOpacity>
            })}

            <Text allowFontScaling={false} style={[styles.time, { textAlign: item.send_by === 0 ? 'right' : 'left' }]}>Posted On {moment.utc(item.utc_posted_on).tz(moment.tz.guess()).format(isEnabled?'lll':'MMM DD, YYYY HH:mm A')}</Text>
        </View>
    }

    // -------------------------------Reply Work-------------------------
    const fileHandle = async () => {
        try {
            const pickResult = await pick({ allowMultiSelection: true, mode: 'import' })
            setAttatchments(pickResult)

        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async () => {
        if (payload.message.length > 0) {
            let token = await AsyncStorage.getItem('userInfo')
            token = JSON.parse(token);
            setSpinning(true)
            let formdata = new FormData()
            formdata.append('message', payload.message)
            formdata.append('replayTicket', "1")
            createReply(formdata, params.id)
                .then((res => {
                            if (attatchments.length > 0) {
                                const formData = new FormData()
                                for (let i = 0; i < attatchments.length; i++) {
                                    const e = attatchments[i];
                                    formData.append('attachments[]', {
                                        uri: e.uri, type: e.type, name: e.name
                                    }, e.name)
                                }
                                uploadSupportAttachments(formData, res.data.message_id)
                                    .then(res => {
                                        setSpinning(false)
                                        setPayload({ ...payload, replayTicket: 1, message: '' })
                                        setAttatchments([])
                                        setRefreshing(!refreshing)
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Support ticked created successfully.'
                                        });
                                    })
                                    .catch(err => {
                                        console.log({ err });
                                        setSpinning(false)
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Attachment Error.'
                                        });
                                    })
                            } else {
                                setSpinning(false)
                                setPayload({ ...payload, replayTicket: 1, message: '' })
                                setAttatchments([])
                                setRefreshing(!refreshing)
                                Toast.show({
                                    type: 'success',
                                    text1: 'Support ticked replied successfully.'
                                });
                            }
                        }))
                        .catch(err => {
                            setSpinning(false)
                            setSpinning(false)
                            Toast.show({
                                type: 'error',
                                text1: 'Attachment Error.'
                            });
                        })
                .catch(err => {
                    console.log(err);
                    setSpinning(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Error.'
                    });
                })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Please enter message.'
            });
        }
    }

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}><Title name="Support Ticket View" /></View>
            <View style={[styles.block, { marginTop: 15 }]}>
                <Text allowFontScaling={false} style={[styles.title]}>[Ticket#{params.id}] {params.subject}</Text>
            </View>

            <View style={[styles.block, { flexDirection: 'column', marginTop: 20, flex: 1 }]}>

                {data &&
                    <FlatList
                        onRefresh={() => setRefreshing(!refreshing)}
                        refreshing={spinning}
                        data={data.messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        contentContainerStyle={{ flexGrow: 1 }}
                        windowSize={8}
                        removeClippedSubviews={true}

                    />
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                    {attatchments.length > 0 && <View style={[styles.card]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
                            <Text allowFontScaling={false} style={[styles.desc]}>{attatchments.length} files selected.</Text>
                            <TouchableOpacity onPress={() => setAttatchments([])} style={[styles.btnIcon, { paddingVertical: 4, marginEnd: 5, backgroundColor: colors.redBg }]}>
                                <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Remove</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }
                    <TouchableOpacity onPress={fileHandle}>
                        <IoniconsIcon color={colors.blue} size={23} name={'attach'} />
                    </TouchableOpacity>
                    <View style={{ flexGrow: 0.9 }}>
                        <InputIcon
                            iconName={''}
                            placeholder={'Type Message'}
                            value={payload.message}
                            onChangeText={(value) => setPayload({ ...payload, message: value })}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSubmit}>
                        <IoniconsIcon color={colors.blue} size={20} name={'send'} />
                    </TouchableOpacity>
                </View>
            </View>
        </MainBackground>
    )
}

export default ViewSupport