import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Style'
import { colors } from '../../../helpers/colors'
import Loader from '../../../helpers/Loader'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message'
import { FlashList } from '@shopify/flash-list'
import globalStyles from '../../../helpers/globalStyles'
import TicketCard2 from './TicketCard2'
import { useTicketStore } from './../../../Store/TicketStore/TicketStore';
import { isTimePast2, localTimezone } from './../../../helpers/utils';

const VoidResult = ({ route }) => {
    const navigation = useNavigation()
    const { fetchPurchaseDetails, voidTicket } = useTicketStore()
    const [spinning, setSpinning] = useState(false)
    const { params } = route
    const [currentData, setCurrentData] = useState([])
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };

    const P = {
        P: 'Pending Draws',
        C: 'Completed Draws',
    }

    const [currentPage, setCurrentPage] = useState(P.P)

    useEffect(() => {
        setSpinning(true)
        let u = `?page=${1}&per_page=10000&search=${params.id[0].value}&timezone=${localTimezone}`
        fetchPurchaseDetails(u)
            .then(res => {
                setCurrentData(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                setSpinning(false)
                setCurrentData([])
            })
    }, [params, refreshing])

    useEffect(() => {
        if (currentPage === P.P) {
            setData(currentData.filter(f => !isTimePast2(f.utc_drawDateTime)))
        } else {
            setData(currentData.filter(f => isTimePast2(f.utc_drawDateTime)))
        }
    }, [currentPage, currentData])

    // ----------------------------------------------------------------------
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => { setModalVisible(!isModalVisible); };

    const handleVoid = () => {
        setSpinning(true)
        voidTicket(params.id[0].value)
            .then(res => {
                setSpinning(false)
                toggleModal()
                setRefreshing(!refreshing)
                Toast.show({
                    type: 'success',
                    text2: "Ticket is void successfully.",
                });
            })
            .catch(err => {
                console.log({ err: err?.response?.data?.message })
                setSpinning(false)
                toggleModal()
                if (err.response && err.response.status === 400) {
                    Toast.show({
                        type: 'error',
                        text2: err.response.data.message,
                    });
                }
                else if (err.response && err.response.status === 404) {
                    Toast.show({
                        type: 'error',
                        text2: "Tickets already voided.",
                    });
                }

                else {
                    Toast.show({
                        type: 'error',
                        text2: "Ticket void error.",
                    });
                }
            })
    }

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}>
                <Title name={'Void Scan Results'} />
            </View>
            <View style={[styles.block, { marginTop: 5 }]}>
                <View style={[styles.btnWrapper]}>
                    < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >

                        <TouchableOpacity style={[currentPage === P.P ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.P) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.P ? styles.btnTextActive : styles.btnTextInActive]}>{P.P}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[currentPage === P.C ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.C) }}>
                            <Text allowFontScaling={false} style={[currentPage === P.C ? styles.btnTextActive : styles.btnTextInActive]}>{P.C}</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>
            <View style={[styles.block, { flexDirection: 'column', marginTop: 0, flex: 1 }]}>
                <Text allowFontScaling={false} style={[styles.title, { marginVertical: 10 }]}>{currentPage === P.P ? 'Pending Draws' : 'Completed Draws'}</Text>
                <View style={[globalStyles.tableWrapper, { flexGrow: 1, marginBottom: 5 }]}>
                    {data.length > 0 ?
                        <FlashList
                            data={data}
                            onRefresh={() => setRefreshing(!refreshing)}
                            refreshing={spinning}
                            ListHeaderComponent={() => (
                                <View style={[globalStyles.headerRow]}>
                                    <View style={{ width: '12%', }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                    </View>
                                    <View style={{ width: '20%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Order ID</Text>
                                    </View>
                                    <View style={{ width: '13%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Type</Text>
                                    </View>
                                    <View style={{ width: '20%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                    </View>
                                    <View style={{ width: '35%', paddingHorizontal: 8 }}>
                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Purchased On</Text>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => { return <TicketCard2 count={index + 1} reload={refreshing} setReload={setRefreshing} data={item} key={Number(String(item.order_no) + String(item.card_id) + String(index))} /> }}
                            estimatedItemSize={170}
                            contentContainerStyle={{ flexGrow: 1 }}
                            decelerationRate={'fast'}
                        />
                        :
                        <View style={{ flexGrow: 1 }}>
                            <Text allowFontScaling={false} style={[styles.title2, { marginTop: 15, color: colors.secondaryText }]}>No ticked found for this order id.</Text>
                        </View>
                    }
                </View>
                {currentPage === P.P && data.length > 0 ? <View style={[{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-end' }, styles.block]}>
                    <TouchableOpacity onPress={toggleModal} style={[styles.btn2, { paddingVertical: 10 }]}>
                        <View><Text allowFontScaling={false} style={[styles.btnTextIcon, { fontSize: 14 }]}> Void All Tickets </Text></View>
                    </TouchableOpacity>
                </View>
                    : null
                }
            </View>

            <Modal onBackdropPress={toggleModal} isVisible={isModalVisible} style={{ padding: 0, margin: 0, marginTop: "-80%" }}>
                <View style={styles.modalWrapper}>
                    <Text allowFontScaling={false} style={[styles.modalTitle]}>Void Ticket</Text>
                    <Text allowFontScaling={false} style={[styles.modalDesc, { marginVertical: 20 }]}>
                        <Text allowFontScaling={false}>Do you want to void this ticket purchase?</Text>
                        <Text allowFontScaling={false}> You wont be able to revert this again?</Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5 }}>
                        <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline2, { width: '35%', marginEnd: 10 }]}>
                            <Text allowFontScaling={false} style={styles.btnText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={spinning} onPress={handleVoid} style={[styles.btn2, { width: '35%' }]}>
                            <Text allowFontScaling={false} style={styles.btnText}>Yes</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>


        </MainBackground>
    )
}

export default VoidResult