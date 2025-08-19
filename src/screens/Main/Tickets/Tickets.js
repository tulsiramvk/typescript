import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, Image, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Style'
import fonts from '../../../helpers/fonts'
import InputIcon from '../../../Components/Inputs/InputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../../helpers/Loader'
import { useNavigation } from '@react-navigation/native'
import Pagination from '@cherry-soft/react-native-basic-pagination';
import CameraView from './CameraView'
import PTRView from 'react-native-pull-to-refresh';
import {
    Camera,
} from 'react-native-vision-camera';
import CameraView2 from './CameraView2'
import Toast from 'react-native-toast-message'
import { useDashboardStore } from '../../../Store/DashboardStore/DashboardStore'
import { useAuthenticationStore } from '../../../Store/AuthenticationStore'
import TabDisable from '../../../helpers/TabDisable'
import globalStyles, { darkThemeStyles } from './../../../helpers/globalStyles'
import TicketCard2 from './TicketCard2'
import WinningCard2 from './WinningCard2'
import Filter from '../../../static/images/filter.svg'
import Calendar from '../../../static/images/calendar.svg'
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import moment from 'moment'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'
import {colors} from './../../../helpers/colors';
import { useTicketStore } from './../../../Store/TicketStore/TicketStore';
import { formatNumberWithCommas, localTimezone, tabs } from './../../../helpers/utils';

const Tickets = () => {
    const {fetchBalance2} = useHomeStore()
    const { tabData, fetchTab } = useAuthenticationStore()
    const [showPurchase, setShowPurchase] = useState(false)
    const [showWinning, setShowWinning] = useState(false)
        
    useEffect(() => {
        let d = tabData.find(f => f.name === tabs.purchased)
        if (d) {
            setShowPurchase(d.status)
        }
        let dd = tabData.find(f => f.name === tabs.winnings)
        if (dd) {
            setShowWinning(dd.status)
        }
    }, [tabData])

    const navigation = useNavigation()
    const [spinning, setSpinning] = useState(false)
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [reload, setReload] = useState(false)
    const [reload2, setReload2] = useState(false)
    const [page, setPage] = useState(1)
    const [page2, setPage2] = useState(1)
    const { paid, fetchPaid, setPaid } = useDashboardStore()
    const { purchaseDetails, pageData, setPageData, pageData2, setPageData2, fetchPurchaseDetails, setPurchaseDetails, fetchWinningDetails, setWinningDetails, winningDetails, fetchWinner } = useTicketStore()
    const P = {
        P: "Purchased", W: "Winnings"
    }
    const [totals, setTotals] = useState({
        purchase: "0", winning: "0"
    })
    const [searchWin, setSearchWin] = useState(false)
    const [searchPur, setSearchPur] = useState(false)
    const [currentPage, setCurrentPage] = useState(P.P)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        fetchTab()
        if (currentPage === P.P) {
            return new Promise((resolve) => {
                setReload(prevRefreshing => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);

                    return !prevRefreshing; // Toggle state
                });
            });
        } else {
            return new Promise((resolve) => {
                setReload2(prevRefreshing => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);

                    return !prevRefreshing; // Toggle state
                });
            });
        }
    };

    const [searchInput, setSearchInput] = useState('')
    const [searchInput2, setSearchInput2] = useState('')
    // ----------------------Void WOrk----------------------------------
    const [hasPermission, setHasPermission] = useState(false);
    const handleWin = async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized' || status === "granted" ? true : false);
        if (status === 'authorized' || status === "granted") {
            setShow(true)
        } else {
            Toast.show({
                type: 'error',
                text2: "Camera Permission not granted.",
            });
        }
    }
    const handleVoid = async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized' || status === "granted" ? true : false);
        if (status === 'authorized' || status === "granted") {
            setShow2(true)
        } else {
            Toast.show({
                type: 'error',
                text2: "Camera Permission not granted.",
            });
        }
    }
    // ---------------------------------------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            // Reset dropdown state when the screen gains focus
            setModalVisible2(false);
        }, [])
    );
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const toggleModal = () => { setModalVisible(!isModalVisible); };
    const toggleModal2 = () => { setModalVisible2(!isModalVisible2); };
    const [filter, setFilter] = useState('all')
    const [filter2, setFilter2] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startDateW, setStartDateW] = useState('')
    const [endDateW, setEndDateW] = useState('')
    const [dateFilter, setDateFilter] = useState(false)
    const [dateFilterW, setDateFilterW] = useState(false)

    const handleDateChange = (e, type) => {
        if (currentPage === P.P) {
            if (type === 'START_DATE') {
                setStartDate(moment(e).format('YYYY-MM-DD'))
                setEndDate(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDate(moment(e).format('YYYY-MM-DD'))
            }
        }
        if (currentPage === P.W) {
            if (type === 'START_DATE') {
                setStartDateW(moment(e).format('YYYY-MM-DD'))
                setEndDateW(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDateW(moment(e).format('YYYY-MM-DD'))
            }
        }
    }
    const handleDateClear = () => {
        if (currentPage === P.P) {
            setEndDate('')
            setStartDate('')
            setReload(!reload)
        }
        if (currentPage === P.W) {
            setEndDateW('')
            setStartDateW('')
            setReload2(!reload2)
        }
    }

    useEffect(() => {
        fetchBalance2()
        if (currentPage === P.W) {
            setSpinning(true)
            let u = `?page=${page2}&per_page=10&search=${searchInput2}&filter=${filter2}&timezone=${localTimezone}`
           
            if (startDateW.length > 0 && endDateW.length > 0) {
                u = `?page=${page2}&per_page=10&search=${searchInput2}&startdate=${startDateW || ''}&enddate=${endDateW || ''}&filter=${filter2}&timezone=${localTimezone}`
                setDateFilterW(true)
            } else {
                setDateFilterW(false)
            }
            fetchPaid(u)
                .then(res => {                 
                    if (currentPage === P.W) {
                        setSpinning(false)
                    }
                    searchInput2.length > 0 ? setSearchWin(true) : setSearchWin(false)
                    setPaid(res.data.data)
                    setTotals({ ...totals, winning: res.data?.todayPayout || '0' })
                    setPageData2(res.data.pagination)
                })
                .catch(err => {
                    if (currentPage === P.W) {
                        setSpinning(false)
                    }
                    setPaid([])
                    setPageData2(null)
                    setPage2(1)
                })
        }
    }, [reload2, filter2, currentPage])

    const handleDone = () => {
        if (currentPage === P.P) {
            setReload(!reload);
        }
        else if (currentPage === P.W) {
            setReload2(!reload2)
        }
        toggleModal()
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchBalance2()
            if (currentPage === P.P) {
                setSpinning(true)
                let u = `?page=${page}&per_page=10&search=${searchInput}&filter=${filter}&timezone=${localTimezone}`
                if (startDate.length > 0 && endDate.length > 0) {
                    u = `?page=${page}&per_page=10&search=${searchInput}&startdate=${startDate || ''}&enddate=${endDate || ''}&filter=${filter}&timezone=${localTimezone}`
                    setDateFilter(true)
                } else {
                    setDateFilter(false)
                }
                fetchPurchaseDetails(u)
                    .then(res => {
                        setPurchaseDetails(res.data.data)
                        setTotals({ ...totals, purchase: res.data?.todayTotals || '0' })
                        setPageData(res.data.pagination)
                        searchInput.length > 0 ? setSearchPur(true) : setSearchPur(false)
                        if (currentPage === P.P) {
                            setSpinning(false)
                        }
                    })
                    .catch(err => {
                        if (currentPage === P.P) {
                            setSpinning(false)
                        }
                        setPageData(null)
                        setPage(1)
                        setPurchaseDetails([])
                    })
            }
        }, [reload, filter, currentPage])
    );

    return (
        <TouchableHighlight disabled={!isModalVisible2} onPress={toggleModal2} style={globalStyles.backdrop}>
            <MainBackground>
                {show &&
                    <CameraView show={show} hasPermission={hasPermission} setHasPermission={setHasPermission} setShow={setShow} />
                }
                {show2 &&
                    <CameraView2 show={show2} hasPermission={hasPermission} setHasPermission={setHasPermission} setShow={setShow2} />
                }
                <Loader spinning={spinning} />
                <View style={[styles.block]}>
                    <Title name={'My Tickets'} />
                </View>

                <View style={[styles.block, { marginTop: 5 }]}>
                    <View style={[styles.btnWrapper]}>
                        < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >

                            <TouchableOpacity style={[currentPage === P.P ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.P); setModalVisible2(false) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.P ? styles.btnTextActive : styles.btnTextInActive]}>{P.P}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.W ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.W); setModalVisible2(false) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.W ? styles.btnTextActive : styles.btnTextInActive]}>{P.W}</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>

                {currentPage === P.P ?
                    showPurchase ?
                        <>
                            <PTRView onRefresh={onRefresh} >
                                <ScrollView>
                                    <View style={[styles.block, { marginVertical: 10 }]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexGrow: 0.95 }}>
                                                <InputIcon
                                                    iconName="magnify"
                                                    placeholder="Search"
                                                    value={searchInput}
                                                    onChangeText={(e) => setSearchInput(e)}
                                                    onBlur={() => setReload(!reload)}
                                                />
                                                <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 15 }}>
                                                    <Icon onPress={() => { setSearchInput(''); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                                <Calendar />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={toggleModal2} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 11 }}>
                                                <Filter />
                                            </TouchableOpacity>
                                            {isModalVisible2 &&
                                                <View style={[globalStyles.dropdown, { bottom: '-150%' }]}>
                                                    <TouchableOpacity onPress={() => { setFilter('all'); setModalVisible2(false) }} style={[globalStyles.dropdownElement, { backgroundColor: filter === 'all' ? colors.blueActive : '' }]}>
                                                        <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>All </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { setFilter('today'); setModalVisible2(false) }} style={[globalStyles.dropdownElement, { backgroundColor: filter === 'today' ? colors.blueActive : '' }]}>
                                                        <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>Today </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </View>

                                        <View style={{ marginVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize', width: 'auto' }]}>{filter} {dateFilter ? <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDate} to {endDate})</Text> : null}</Text>
                                                {dateFilter && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 20 }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                            </View>
                                            <View>
                                                <TouchableOpacity onPress={handleVoid} style={[styles.btnIcon]}>
                                                    <View><MaterialCommunityIcon name={"qrcode-scan"} color={colors.white} size={11} /></View>
                                                    <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Void </Text></View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Purchase: $ {formatNumberWithCommas(totals.purchase || '0')}</Text>
                                        </View>
                                        {searchPur && <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 7, fontSize: 13 }]}>Search result</Text>}
                                        <View style={[globalStyles.tableWrapper]}>
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
                                            {purchaseDetails.length > 0 && pageData ?
                                                purchaseDetails.map((m, count) => {
                                                    const globalCount = pageData.total - ((page - 1) * 10 + count);
                                                    return <TicketCard2 count={globalCount} reload={reload} setReload={setReload} data={m} key={Number(String(m.order_no) + String(m.card_id) + String(count))} />
                                                })
                                                :
                                                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>{searchInput.length > 0 ? "No search result found for purchased ticket." : "You have not made any ticket purchase yet."}</Text>
                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </PTRView>
                            <View>
                                {purchaseDetails.length > 0 && pageData ?
                                    pageData.total > pageData.per_page ?
                                        <Pagination
                                            showLastPagesButtons
                                            totalItems={pageData.total}
                                            pageSize={10}
                                            pagesToDisplay={3}
                                            currentPage={pageData.current_page}
                                            onPageChange={(e) => { setPage(e); setReload(!reload) }}
                                            containerStyle={{ paddingVertical: 8, marginTop: 10,marginBottom:0 }}
                                            btnStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 4, paddingHorizontal: 10 }}
                                            activeBtnStyle={{ backgroundColor: colors.blue2, borderWidth: 0, borderRadius: 90, padding: 5, paddingHorizontal: 10 }}
                                            textStyle={{ fontFamily: fonts.medium, color: colors.white, fontSize: 14 }}
                                            activeTextStyle={{ fontFamily: fonts.medium, color: "#fff", fontSize: 14 }}
                                        />
                                        : null
                                    : null
                                }
                            </View>
                        </>
                        :
                        !spinning && <TabDisable onRefresh={onRefresh} />
                    : null}
                {currentPage === P.W ?
                    showWinning ? <>
                        <PTRView onRefresh={onRefresh} >
                            <ScrollView>
                                <View style={[styles.block, { marginVertical: 10 }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexGrow: 0.95 }}>
                                            <InputIcon
                                                iconName="magnify"
                                                placeholder="Search"
                                                value={searchInput2}
                                                onChangeText={(e) => setSearchInput2(e)}
                                                onBlur={() => setReload2(!reload2)}
                                            />
                                            <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 8 }}>
                                                <Icon onPress={() => { setSearchInput2(''); setReload2(!reload2) }} name={'close'} size={20} color={colors.white} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                            <Calendar />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toggleModal2} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 11 }}>
                                            <Filter />
                                        </TouchableOpacity>
                                        {isModalVisible2 &&
                                            <View style={[globalStyles.dropdown, { bottom: '-150%' }]}>
                                                <TouchableOpacity onPress={() => { setFilter2('all'); setModalVisible2(false) }} style={[globalStyles.dropdownElement, { backgroundColor: filter2 === 'all' ? colors.blueActive : '' }]}>
                                                    <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>All </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { setFilter2('today'); setModalVisible2(false) }} style={[globalStyles.dropdownElement, { backgroundColor: filter2 === 'today' ? colors.blueActive : '' }]}>
                                                    <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>Today </Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>

                                    <View style={{ marginVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize', width: 'auto' }]}>{filter2} {dateFilterW ? <Text allowFontScaling={false} style={{ fontSize: 12 }}> (Date :{startDateW} to {endDateW})</Text> : null}</Text>
                                            {dateFilterW && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 5 }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={handleWin} style={[styles.btnIcon]}>
                                                <View><MaterialCommunityIcon name={"qrcode-scan"} color={colors.white} size={11} /></View>
                                                <View><Text allowFontScaling={false} style={[styles.btnTextIcon]}> Scan & Payout </Text></View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                        <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Winning: $ {formatNumberWithCommas(totals.winning || '0')}</Text>
                                    </View>
                                    {searchWin && <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 7, fontSize: 13 }]}>Search result</Text>}
                                    <View style={[globalStyles.tableWrapper]}>
                                        <View style={[globalStyles.headerRow]}>
                                            <View style={{ width: '12%', }}>
                                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                            </View>
                                            <View style={{ width: '23%', paddingHorizontal: 8 }}>
                                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Customer</Text>
                                            </View>
                                            <View style={{ width: '19%', paddingHorizontal: 8 }}>
                                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                            </View>
                                            <View style={{ width: '25%', paddingHorizontal: 8 }}>
                                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Date & Time</Text>
                                            </View>
                                            <View style={{ width: '20%', paddingHorizontal: 8 }}>
                                                <Text allowFontScaling={false} style={[globalStyles.headerText]}>Status</Text>
                                            </View>
                                        </View>
                                        {paid.length > 0 && pageData2 ?
                                            paid.map((m, count) => {
                                                const globalCount = pageData2.total - ((page2 - 1) * 10 + count);
                                                return <WinningCard2 setReload2={setReload2} reload2={reload2} count={globalCount} data={m} key={globalCount} />
                                            })
                                            :
                                            <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>{searchInput2.length > 0 ? "No won ticket found in search." : "You have not won in any ticket yet."}</Text>
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                        </PTRView>
                        <View>
                            {paid.length > 0 && pageData2 ?
                                pageData2.total > pageData2.per_page ?
                                    <Pagination
                                        showLastPagesButtons
                                        totalItems={pageData2.total}
                                        pageSize={10}
                                        pagesToDisplay={3}
                                        currentPage={pageData2.current_page}
                                        onPageChange={(e) => { setPage2(e); setReload2(!reload2) }}
                                        containerStyle={{ paddingVertical: 8, marginTop: 10,marginBottom:0  }}
                                        btnStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 4, paddingHorizontal: 10 }}
                                        activeBtnStyle={{ backgroundColor: colors.blue2, borderWidth: 0, borderRadius: 90, padding: 5, paddingHorizontal: 10 }}
                                        textStyle={{ fontFamily: fonts.medium, color: colors.white, fontSize: 14 }}
                                        activeTextStyle={{ fontFamily: fonts.medium, color: "#fff", fontSize: 14 }}
                                    />
                                    : null
                                : null
                            }
                        </View>
                    </>
                        :
                        !spinning && <TabDisable onRefresh={onRefresh} />
                    : null}


                {/* -----------------------Modal------------------------ */}

                <Modal onBackdropPress={toggleModal} onBackButtonPress={toggleModal} isVisible={isModalVisible} style={{ padding: 0, margin: 0 }}>
                    <View style={[styles.modalWrapper, { marginHorizontal: 0 }]}>
                        <CalendarPicker onDateChange={handleDateChange}
                            allowRangeSelection={true}
                            selectedDayColor={darkThemeStyles.selectedDayColor}
                            selectedDayTextColor={darkThemeStyles.selectedDayTextColor}
                            todayBackgroundColor={darkThemeStyles.todayBackgroundColor}
                            todayTextStyle={darkThemeStyles.todayTextStyle}
                            textStyle={darkThemeStyles.textStyle}
                            headerWrapperStyle={darkThemeStyles.headerWrapper}
                            monthTitleStyle={darkThemeStyles.monthTitle}
                            yearTitleStyle={darkThemeStyles.yearTitle}
                            dayLabelsWrapperStyle={darkThemeStyles.dayLabelsWrapper}
                            dayLabelStyle={darkThemeStyles.dayLabel}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5, justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline2, { width: '35%', marginEnd: 10 }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDone} style={[styles.btn2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </MainBackground>
        </TouchableHighlight>
    )
}

export default Tickets