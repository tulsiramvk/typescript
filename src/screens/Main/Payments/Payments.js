import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from './Style'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import fonts from '../../../helpers/fonts'
import Loader from '../../../helpers/Loader'
import Pagination from '@cherry-soft/react-native-basic-pagination';
import InputIcon from '../../../Components/Inputs/InputIcon'
import PTRView from 'react-native-pull-to-refresh';
import { useAuthenticationStore } from '../../../Store/AuthenticationStore'
import TabDisable from '../../../helpers/TabDisable'
import PaymentList2 from './PaymentList2'
import globalStyles from '../../../helpers/globalStyles'
import Filter from '../../../static/images/filter.svg'
import Calendar from '../../../static/images/calendar.svg'
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import moment from 'moment'
import { useHomeStore } from '../../../Store/HomeStore/HomeStore'
import {colors} from './../../../helpers/colors';
import { usePaymentStore } from './../../../Store/PaymentStore/PaymentStore';
import { formatNumberWithCommas, localTimezone, tabs } from './../../../helpers/utils';


const Fonts = fonts;
const Payments = () => {
    const {fetchBalance2} = useHomeStore()
    const { tabData, fetchTab } = useAuthenticationStore()
    const [showDeposit, setShowDeposit] = useState(false)
    const [showWithdrawal, setShowWithdrawal] = useState(false)
    const [showTransaction, setShowTransaction] = useState(false)
    useEffect(() => {
        let d = tabData.find(f => f.name === tabs.deposit)
        if (d) {
            setShowDeposit(d.status)
        }
        let dd = tabData.find(f => f.name === tabs.withdrawal)
        if (dd) {
            setShowWithdrawal(dd.status)
        }
        let ddd = tabData.find(f => f.name === tabs.transaction)
        if (ddd) {
            setShowTransaction(ddd.status)
        }
    }, [tabData])

    const [reload, setReload] = useState(false)
    const [page, setPage] = useState(1)
    const [pageData, setPageData] = useState()
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setReload(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };
    const { deposit, withdraw, transaction, fetchDeposit, setDeposit, fetchWithdraw, setWithdraw, fetchTransaction, setTransaction } = usePaymentStore()
    const P = {
        D: "Deposit", W: "Withdrawal", T: "Transaction"
    }
    const [totals, setTotals] = useState({
        deposit: "0", withdrawal: "0", transaction: "0"
    })
    const [currentPage, setCurrentPage] = useState(P.T)
    const [spinning, setSpinning] = useState(false)

    const [searchInput, setSearchInput] = useState({
        searchD: '', searchW: '', searchT: '',
    })

    // ------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            fetchBalance2()
            // Reset dropdown state when the screen gains focus
            setModalVisible2(false);
        }, [])
    );
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const toggleModal = () => { setModalVisible(!isModalVisible); };
    const toggleModal2 = () => { setModalVisible2(!isModalVisible2); };
    const [filter, setFilter] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startDateD, setStartDateD] = useState('')
    const [endDateD, setEndDateD] = useState('')
    const [startDateW, setStartDateW] = useState('')
    const [endDateW, setEndDateW] = useState('')
    const [dateFilter, setDateFilter] = useState(false)
    const [dateFilterD, setDateFilterD] = useState(false)
    const [dateFilterW, setDateFilterW] = useState(false)

    const handleDateChange = (e, type) => {
        if (currentPage === P.T) {
            if (type === 'START_DATE') {
                setStartDate(moment(e).format('YYYY-MM-DD'))
                setEndDate(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDate(moment(e).format('YYYY-MM-DD'))
            }
        }
        if (currentPage === P.D) {
            if (type === 'START_DATE') {
                setStartDateD(moment(e).format('YYYY-MM-DD'))
                setEndDateD(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDateD(moment(e).format('YYYY-MM-DD'))
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
        if (currentPage === P.T) {
            setEndDate('')
            setStartDate('')
            setReload(!reload)
        }
        if (currentPage === P.D) {
            setEndDateD('')
            setStartDateD('')
            setReload(!reload)
        }
        if (currentPage === P.W) {
            setEndDateW('')
            setStartDateW('')
            setReload(!reload)
        }
    }

    useEffect(() => {
        fetchTab()
        fetchBalance2()
        if (currentPage === P.D) {
            let d = `?page=${page}&per_page=10&search=${searchInput.searchD || ''}&timezone=${localTimezone}`
            setSpinning(true)
            if (startDateD.length > 0 && endDateD.length > 0) {
                d = `?page=${page}&per_page=10&search=${searchInput.searchD || ''}&startdate=${startDateD || ''}&enddate=${endDateD || ''}&timezone=${localTimezone}`
                setDateFilterD(true)
            } else {
                setDateFilterD(false)
            }
            fetchDeposit(d)
                .then(res => {
                    setSpinning(false)
                    setDeposit(res.data.data)
                    setTotals({ ...totals, deposit: res.data?.todayTotals || '0' })
                    setPageData(res.data.pagination)
                })
                .catch(err => {
                    setSpinning(false)
                    setPageData()
                    console.log(err)
                    setDeposit([])
                })
        }
        if (currentPage === P.W) {
            let w = `?page=${page}&per_page=10&search=${searchInput.searchW || ''}&timezone=${localTimezone}`
            setSpinning(true)
            if (startDateW.length > 0 && endDateW.length > 0) {
                setDateFilterW(true)
                w = `?page=${page}&per_page=10&search=${searchInput.searchW || ''}&startdate=${startDateW || ''}&enddate=${endDateW || ''}&timezone=${localTimezone}`
            } else {
                setDateFilterW(false)
            }
            fetchWithdraw(w)
                .then(res => {
                    setSpinning(false)
                    setWithdraw(res.data.data)
                    setTotals({ ...totals, withdrawal: res.data?.todayTotals || '0' })
                    setPageData(res.data.pagination)
                })
                .catch(err => {
                    setSpinning(false)
                    console.log(err)
                    setWithdraw([])
                    setPageData()
                })
        }
        if (currentPage === P.T) {
            let t = `?page=${page}&per_page=10&search=${searchInput.searchT || ''}&filter=${filter}&timezone=${localTimezone}`
            if (startDate.length > 0 && endDate.length > 0) {
                t = `?page=${page}&per_page=10&search=${searchInput.searchT || ''}&startdate=${startDate || ''}&enddate=${endDate || ''}&filter=${filter}&timezone=${localTimezone}`
                setDateFilter(true)
            } else {
                setDateFilter(false)
            }
            setSpinning(true)
            fetchTransaction(t)
                .then(res => {
                    setSpinning(false)
                    setTransaction(res.data.data)
                    setTotals({ ...totals, transaction: res.data?.todayTotals || '0' })
                    setPageData(res.data.pagination)
                })
                .catch(err => {
                    setSpinning(false)
                    console.log(err)
                    setTransaction([])
                    setPageData()
                })
        }
    }, [currentPage, reload, filter])   

    return (
        <TouchableHighlight disabled={!isModalVisible2} onPress={toggleModal2} style={styles.backdrop}>
            <MainBackground>
                <Loader spinning={spinning} />
                <View style={[styles.block]}>
                    <Title name={'Payments'} />
                </View>

                <View style={[styles.block, { marginVertical: 10, marginBottom: 0 }]}>
                    <View style={[styles.btnWrapper]}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={[currentPage === P.T ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.T); setPage(1) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.T ? styles.btnTextActive : styles.btnTextInActive]}>{P.T}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.D ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.D); setPage(1) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.D ? styles.btnTextActive : styles.btnTextInActive]}>{P.D}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.W ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.W); setPage(1) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.W ? styles.btnTextActive : styles.btnTextInActive]}>{P.W}</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
                <PTRView onRefresh={onRefresh} >
                    <ScrollView>
                        <View style={[styles.block, { marginVertical: 10 }]}>
                            {currentPage === P.D ?
                                showDeposit ?
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexGrow: 0.95 }}>
                                                <InputIcon
                                                    iconName="magnify"
                                                    placeholder="Search"
                                                    value={searchInput.searchD}
                                                    onChangeText={(e) => setSearchInput({ ...searchInput, searchD: e })}
                                                    onBlur={() => setReload(!reload)}
                                                />
                                                <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 15 }}>
                                                    <Icon onPress={() => { setSearchInput({ ...searchInput, searchD: '' }); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                                <Calendar />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}>Deposit {dateFilterD ? <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDateD} to {endDateD})</Text> : null}</Text>
                                            {dateFilterD && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                        </View>
                                        <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Deposit: $ {formatNumberWithCommas(totals.deposit || '0')}</Text>
                                        </View>
                                        <View style={[globalStyles.tableWrapper]}>
                                            <View style={[globalStyles.headerRow]}>
                                                <View style={{ width: '14%', }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Txn ID</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                                </View>
                                                <View style={{ width: '43%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Date & Time</Text>
                                                </View>
                                            </View>
                                            {deposit.length > 0 && pageData ?
                                                deposit.map((m, c) => {
                                                    const globalCount = pageData.total - ((page - 1) * 10 + c);
                                                    return <PaymentList2 count={globalCount} key={m.id} data={m} currentPage={currentPage} P={P} />
                                                })
                                                :
                                                <Text allowFontScaling={false} style={[styles.title, { fontSize: 14, color: colors.thirdText }]}>You have not made any deposit yet.</Text>}
                                        </View>
                                    </>
                                    :
                                    !spinning && <TabDisable onRefresh={onRefresh} />
                                : null}
                            {currentPage === P.W ?
                                showWithdrawal ?
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexGrow: 0.95 }}>
                                                <InputIcon
                                                    iconName="magnify"
                                                    placeholder="Search"
                                                    value={searchInput.searchW}
                                                    onChangeText={(e) => setSearchInput({ ...searchInput, searchW: e })}
                                                    onBlur={() => setReload(!reload)}
                                                />
                                                <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 15 }}>
                                                    <Icon onPress={() => { setSearchInput({ ...searchInput, searchW: '' }); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                                <Calendar />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}>Withdrawal {dateFilterW ? <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDateW} to {endDateW})</Text> : null}</Text>
                                            {dateFilterW && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                        </View>
                                        <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Withdrawal: $ {formatNumberWithCommas(totals.withdrawal || '0')}</Text>
                                        </View>
                                        <View style={[globalStyles.tableWrapper]}>
                                            <View style={[globalStyles.headerRow]}>
                                                <View style={{ width: '14%', }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Txn ID</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                                </View>
                                                <View style={{ width: '43%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Date & Time</Text>
                                                </View>
                                            </View>
                                            {withdraw.length > 0 && pageData ?
                                                withdraw.map((m, c) => {
                                                    const globalCount = pageData.total - ((page - 1) * 10 + c);
                                                    return <PaymentList2 count={globalCount} key={m.id} data={m} currentPage={currentPage} P={P} />
                                                })
                                                :
                                                <Text allowFontScaling={false} style={[styles.title, { fontSize: 14, color: colors.thirdText }]}>You have not made any withdrawal yet.</Text>}
                                        </View>
                                    </>
                                    :
                                    !spinning && <TabDisable onRefresh={onRefresh} />
                                : null}
                            {currentPage === P.T ?
                                showTransaction ?
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexGrow: 0.95 }}>
                                                <InputIcon
                                                    iconName="magnify"
                                                    placeholder="Search"
                                                    value={searchInput.searchT}
                                                    onChangeText={(e) => setSearchInput({ ...searchInput, searchT: e })}
                                                    onBlur={() => setReload(!reload)}
                                                />
                                                <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 15 }}>
                                                    <Icon onPress={() => { setSearchInput({ ...searchInput, searchT: '' }); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                                <Calendar />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={toggleModal2} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 11 }}>
                                                <Filter />
                                            </TouchableOpacity>
                                            {isModalVisible2 &&
                                                <View style={styles.dropdown}>
                                                    <TouchableOpacity onPress={() => { setFilter('all'); setModalVisible2(false) }} style={[styles.dropdownElement, { backgroundColor: filter === 'all' ? colors.blueActive : '' }]}>
                                                        <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>All </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { setFilter('purchase'); setModalVisible2(false) }} style={[styles.dropdownElement, { backgroundColor: filter === 'purchase' ? colors.blueActive : '' }]}>
                                                        <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>Purchase </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { setFilter('void'); setModalVisible2(false) }} style={[styles.dropdownElement, { backgroundColor: filter === 'void' ? colors.blueActive : '' }]}>
                                                        <Text allowFontScaling={false} style={[styles.title, { fontSize: 14 }]}>Void </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </View>
                                        <View style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}>{filter} {dateFilter ? <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDate} to {endDate})</Text> : null}</Text>
                                            {dateFilter && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                        </View>
                                        <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Transaction: $ {formatNumberWithCommas(totals.transaction || '0')}</Text>
                                        </View>
                                        <View style={[globalStyles.tableWrapper]}>
                                            <View style={[globalStyles.headerRow]}>
                                                <View style={{ width: '14%', }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Order ID</Text>
                                                </View>
                                                <View style={{ width: '21%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                                </View>
                                                <View style={{ width: '43%', paddingHorizontal: 8 }}>
                                                    <Text allowFontScaling={false} style={[globalStyles.headerText]}>Time</Text>
                                                </View>
                                            </View>
                                            {transaction.length > 0 && pageData ?
                                                transaction.map((m, c) => {
                                                    const globalCount = pageData.total - ((page - 1) * 10 + c);
                                                    return <PaymentList2 count={globalCount} key={m.id} data={m} currentPage={currentPage} P={P} />
                                                })
                                                :
                                                <Text allowFontScaling={false} style={[styles.title, { fontSize: 14, color: colors.thirdText }]}>You have not made any transaction yet.</Text>}
                                        </View>
                                    </>
                                    :
                                    !spinning && <TabDisable onRefresh={onRefresh} />
                                : null}
                        </View>
                    </ScrollView>
                </PTRView>
                <View style={{ paddingVertical: 5 }}>
                    {pageData && currentPage === P.D && showDeposit ?
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
                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 13 }}
                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 13 }}
                            />
                            : null
                        : null
                    }
                    {pageData && currentPage === P.W && showWithdrawal ?
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
                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 13 }}
                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 13 }}
                            />
                            : null
                        : null
                    }
                    {pageData && currentPage === P.T && showTransaction ?
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
                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 13 }}
                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 13 }}
                            />
                            : null
                        : null
                    }
                </View>

                {/* -----------------------Modal------------------------ */}

                <Modal onBackdropPress={toggleModal} onBackButtonPress={toggleModal} isVisible={isModalVisible} style={{ padding: 0, margin: 0 }}>
                    <View style={styles.modalWrapper}>
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
                            <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setReload(!reload); toggleModal() }} style={[styles.btn2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
            </MainBackground>
        </TouchableHighlight>
    )
}

export default Payments

const darkThemeStyles = {
    container: {
        backgroundColor: colors.darkBg, // Dark background
    },
    headerWrapper: {
        backgroundColor: colors.darkBg, // Dark header background
    },
    monthTitle: {
        color: '#ffffff', // White text for month title
    },
    yearTitle: {
        color: '#ffffff', // White text for year title
    },
    dayLabelsWrapper: {
        backgroundColor: colors.darkBg, // Dark background for day labels
    },
    dayLabel: {
        color: '#ffffff', // White text for day labels
    },
    selectedDayColor: colors.blue, // Accent color for selected day
    selectedDayTextColor: '#ffffff', // White text for selected day
    todayBackgroundColor: '#f9f9f9', // Accent color for today
    todayTextStyle: {
        color: '#000000', // Black text for today
    },
    textStyle: {
        color: '#fff', // White text for days
    },
};