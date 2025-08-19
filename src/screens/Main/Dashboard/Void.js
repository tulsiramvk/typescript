import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from './Style'
import fonts from '../../../helpers/fonts'
import Pagination from '@cherry-soft/react-native-basic-pagination';
import Loader from '../../../helpers/Loader'
import PTRView from 'react-native-pull-to-refresh';
import InputIcon from '../../../Components/Inputs/InputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import TabDisable from '../../../helpers/TabDisable'
import WinningCard2 from '../Tickets/WinningCard2'
import TicketCard2 from '../Tickets/TicketCard2'
import MyCommissionList2 from './MyCommissionList2'
import Filter from '../../../static/images/filter.svg'
import Calendar from '../../../static/images/calendar.svg'
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import moment from 'moment'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from './../../../helpers/colors';
import { useDashboardStore } from './../../../Store/DashboardStore/DashboardStore';
import { formatNumberWithCommas, localTimezone, tabs } from './../../../helpers/utils';
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';
import globalStyles, { darkThemeStyles } from './../../../helpers/globalStyles';

const Fonts = fonts;
const Void = ({ route }) => {
    const { params } = route
    const { tabData, fetchTab } = useAuthenticationStore()
    const [showVoid, setShowVoid] = useState(false)
    const [showPaid, setShowPaid] = useState(false)
    const [showCommission, setShowCommission] = useState(false)
    useEffect(() => {
        let d = tabData.find(f => f.name === tabs.void)
        if (d) {
            setShowVoid(d.status)
        }
        let dd = tabData.find(f => f.name === tabs.paid)
        if (dd) {
            setShowPaid(dd.status)
        }
        let ddd = tabData.find(f => f.name === tabs.commission)
        if (ddd) {
            setShowCommission(ddd.status)
        }
    }, [tabData])
    const [searchInput, setSearchInput] = useState('')
    const [searchInput2, setSearchInput2] = useState('')
    const [searchInput3, setSearchInput3] = useState('')
    const [searchActive, setSearchActive] = useState({
        void: false, paid: false, commission: false
    })
    const [spinning, setSpinning] = useState(false)
    const [currentPage, setCurrentPage] = useState(params.status)
    const { voids, setPageData, pageData, pageData2, pageData3, setPageData2, setPageData3, commissions, paid, fetchVoid, fetchCommissions, fetchPaid, setVoid, setCommissions, setPaid } = useDashboardStore()
    const P = {
        V: "Void", C: "Commission", P: "Paid", T: "Transaction"
    }
    const [totals, setTotals] = useState({
        void: "0", paid: "0", commission: "0"
    })
    const [reload, setReload] = useState(false)
    const [page, setPage] = useState(1)
    const [page2, setPage2] = useState(1)
    const [page3, setPage3] = useState(1)
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
    const [startDateP, setStartDateP] = useState('')
    const [endDateP, setEndDateP] = useState('')
    const [startDateC, setStartDateC] = useState('')
    const [endDateC, setEndDateC] = useState('')
    const [dateFilter, setDateFilter] = useState(false)
    const [dateFilterP, setDateFilterP] = useState(false)
    const [dateFilterC, setDateFilterC] = useState(false)

    const handleDateChange = (e, type) => {
        if (currentPage === P.V) {
            if (type === 'START_DATE') {
                setStartDate(moment(e).format('YYYY-MM-DD'))
                setEndDate(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDate(moment(e).format('YYYY-MM-DD'))
            }
        }
        if (currentPage === P.P) {
            if (type === 'START_DATE') {
                setStartDateP(moment(e).format('YYYY-MM-DD'))
                setEndDateP(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDateP(moment(e).format('YYYY-MM-DD'))
            }
        }
        if (currentPage === P.C) {
            if (type === 'START_DATE') {
                setStartDateC(moment(e).format('YYYY-MM-DD'))
                setEndDateC(moment(e).format('YYYY-MM-DD'))
            } else if (type === 'END_DATE') {
                setEndDateC(moment(e).format('YYYY-MM-DD'))
            }
        }
    }
    const handleDateClear = () => {
        if (currentPage === P.V) {
            setEndDate('')
            setStartDate('')
        }
        if (currentPage === P.P) {
            setEndDateP('')
            setStartDateP('')
        }
        if (currentPage === P.C) {
            setEndDateC('')
            setStartDateC('')
        }
        setReload(!reload)
    }
    const handleDone = () => {
        setReload(!reload);
        toggleModal()
    }

    useEffect(() => {
        fetchTab()
        setModalVisible2(false)
        if (currentPage === P.C) {
            let u = `?page=${page3}&per_page=10&search=${searchInput3}&timezone=${localTimezone}`
            setSpinning(true)
            if (startDateC.length > 0 && endDateC.length > 0) {
                u = `?page=${page2}&per_page=10&search=${searchInput}&startdate=${startDateC || ''}&enddate=${endDateC || ''}&timezone=${localTimezone}`
                setDateFilterC(true)
            } else {
                setDateFilterC(false)
            }
            fetchCommissions(u)
                .then(res => {
                    setSpinning(false)
                    searchInput3.length > 0 ? setSearchActive({ ...searchActive, commission: true }) : setSearchActive({ ...searchActive, commission: false })
                    setCommissions(res.data.data)
                    setTotals({ ...totals, commission: res.data.todayCommission })
                    setPageData3(res.data.pagination)
                })
                .catch(err => {
                    setSpinning(false)
                    console.log(err)
                    setCommissions([])
                    setPageData3()
                })
        }
        if (currentPage === P.P) {
            let u = `?page=${page2}&per_page=10&search=${searchInput2}&filter=${filter2}&timezone=${localTimezone}`
            setSpinning(true)
            if (startDateP.length > 0 && endDateP.length > 0) {
                u = `?page=${page2}&per_page=10&search=${searchInput}&startdate=${startDateP || ''}&enddate=${endDateP || ''}&filter=${filter2}&timezone=${localTimezone}`
                setDateFilterP(true)
            } else {
                setDateFilterP(false)
            }
            fetchPaid(u)
                .then(res => {
                    setSpinning(false)
                    searchInput2.length > 0 ? setSearchActive({ ...searchActive, paid: true }) : setSearchActive({ ...searchActive, paid: false })
                    setPaid(res.data.data)
                    setPageData2(res.data.pagination)
                    setTotals({ ...totals, paid: res.data.todayPayout })
                })
                .catch(err => {
                    setSpinning(false)
                    console.log(err)
                    setPaid([])
                    setPageData2()
                })
        }
    }, [currentPage, reload, filter2])

    useEffect(() => {
        setModalVisible2(false)
        if (currentPage === P.V) {
            let u = `?page=${page}&per_page=10&search=${searchInput}&filter=${filter}&timezone=${localTimezone}`
            setSpinning(true)
            if (startDate.length > 0 && endDate.length > 0) {
                u = `?page=${page2}&per_page=10&search=${searchInput}&startdate=${startDate || ''}&enddate=${endDate || ''}&filter=${filter}&timezone=${localTimezone}`
                setDateFilter(true)
            } else {
                setDateFilter(false)
            }
            fetchVoid(u)
                .then(res => {
                    setSpinning(false)
                    searchInput.length > 0 ? setSearchActive({ ...searchActive, void: true }) : setSearchActive({ ...searchActive, void: false })
                    setVoid(res.data.data)
                    setTotals({ ...totals, void: res.data.todayVoid })
                    setPageData(res.data.pagination)
                })
                .catch(err => {
                    setSpinning(false)
                    setPageData(null)
                    setPage(1)
                    setVoid([])
                })
        }
    }, [reload, currentPage, filter])

    return (
        <TouchableHighlight disabled={!isModalVisible2} onPress={toggleModal2} style={globalStyles.backdrop}>
            <MainBackground>
                <Loader spinning={spinning} />
                <View style={[styles.block]}>
                    <Title name={currentPage} />
                </View>

                <View style={[styles.block, { marginVertical: 4, marginBottom: 15 }]}>
                    <View style={[styles.btnWrapper]}>
                        < ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                            <TouchableOpacity style={[currentPage === P.V ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.V) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.V ? styles.btnTextActive : styles.btnTextInActive]}>Void</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.P ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.P) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.P ? styles.btnTextActive : styles.btnTextInActive]}>Paid</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[currentPage === P.C ? styles.btn : styles.btn_outline]} onPress={() => { setCurrentPage(P.C) }}>
                                <Text allowFontScaling={false} style={[currentPage === P.C ? styles.btnTextActive : styles.btnTextInActive]}>Commission</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>

                {currentPage === P.V ?
                    showVoid ?
                        <>
                            <PTRView onRefresh={onRefresh} >
                                <ScrollView>
                                    <View style={[styles.block, { marginBottom: 10 }]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexGrow: 0.95 }}>
                                                <InputIcon
                                                    iconName="magnify"
                                                    placeholder="Search"
                                                    value={searchInput}
                                                    onChangeText={(e) => setSearchInput(e)}
                                                    onBlur={() => setReload(!reload)}
                                                />
                                                <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 10 }}>
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
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}>{filter}{dateFilter && <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDate} to {endDate})</Text>}</Text>
                                            {dateFilter && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                        </View>

                                        <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                            <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Void: $ {formatNumberWithCommas(totals.void)}</Text>
                                        </View>
                                        {searchActive.void && <Text allowFontScaling={false} style={[styles.cardLabel, { marginBottom: 7, fontSize: 12 }]}>Search result</Text>}

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
                                            {voids.length > 0 && pageData ?
                                                voids.map((m, count) => {
                                                    const globalCount = pageData.total - ((page - 1) * 10 + count);
                                                    return <TicketCard2 count={globalCount} v={true} reload={reload} setReload={setReload} data={m} key={Number(String(m.order_no) + String(m.card_id)) + String(count)} />
                                                })
                                                :
                                                <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>{searchInput.length > 0 ? "No search result found for void ticket." : "You have not made any ticket void yet."}</Text>
                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </PTRView>
                            <View>
                                {voids.length > 0 && pageData ?
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
                                            textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 14 }}
                                            activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 14 }}
                                        />
                                        : null
                                    : null
                                }
                            </View>
                        </>
                        :
                        !spinning && <TabDisable onRefresh={onRefresh} />
                    : null
                }

                {
                    currentPage === P.P ?
                        showPaid ?
                            <>
                                <PTRView onRefresh={onRefresh} >
                                    <ScrollView>
                                        <View style={[styles.block, { marginVertical: 5 }]}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexGrow: 0.95 }}>
                                                    <InputIcon
                                                        iconName="magnify"
                                                        placeholder="Search"
                                                        value={searchInput2}
                                                        onChangeText={(e) => setSearchInput2(e)}
                                                        onBlur={() => setReload(!reload)}
                                                    />
                                                    <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 10 }}>
                                                        <Icon onPress={() => { setSearchInput2(''); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
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
                                            <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}>{filter2}{dateFilterP && <Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDateP} to {endDateP})</Text>}</Text>
                                                {dateFilterP && <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>}
                                            </View>

                                            <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 0 }]}>
                                                <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Payouts: $ {formatNumberWithCommas(totals.paid)}</Text>
                                            </View>
                                            <View style={[globalStyles.tableWrapper]}>
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
                                                {paid.length > 0 && pageData2 ? paid.map((m, c) => {
                                                    const globalCount = pageData2.total - ((page2 - 1) * 10 + c);
                                                    return <WinningCard2 P={P} count={globalCount} data={m} key={globalCount} currentPage={currentPage} />
                                                })
                                                    :
                                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>{searchInput2.length > 0 ? "No search result found for payout ticket." : "You have not given payout to any ticket yet."}</Text>
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
                                                onPageChange={(e) => { setPage2(e); setReload(!reload) }}
                                                containerStyle={{ paddingVertical: 8, marginTop: 10,marginBottom:0 }}
                                                btnStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 4, paddingHorizontal: 10 }}
                                                activeBtnStyle={{ backgroundColor: colors.blue2, borderWidth: 0, borderRadius: 90, padding: 5, paddingHorizontal: 10 }}
                                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 14 }}
                                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 14 }}
                                            />
                                            : null
                                        : null
                                    }
                                </View>

                            </>
                            :
                            !spinning && <TabDisable onRefresh={onRefresh} />
                        : null
                }

                {
                    currentPage === P.C ?
                        showCommission ?
                            <>
                                <PTRView onRefresh={onRefresh} >
                                    <ScrollView>
                                        <View style={[styles.block, { marginVertical: 5 }]}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexGrow: 0.95 }}>
                                                    <InputIcon
                                                        iconName="magnify"
                                                        placeholder="Search"
                                                        value={searchInput3}
                                                        onChangeText={(e) => setSearchInput3(e)}
                                                        onBlur={() => setReload(!reload)}
                                                    />
                                                    <View style={{ position: 'absolute', right: 0, marginTop: 12, marginRight: 10 }}>
                                                        <Icon onPress={() => { setSearchInput3(''); setReload(!reload) }} name={'close'} size={20} color={colors.white} />
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={toggleModal} style={{ borderWidth: 0.7, borderColor: colors.blue, borderRadius: 4, padding: 10 }}>
                                                    <Calendar />
                                                </TouchableOpacity>
                                            </View>
                                            {dateFilterC && <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={[styles.title, { textTransform: 'capitalize' }]}><Text allowFontScaling={false} style={{ fontSize: 14 }}> (Date :{startDateC} to {endDateC})</Text></Text>
                                                <TouchableOpacity onPress={handleDateClear} style={{ marginLeft: 'auto' }}><AntDesignIcon name="closesquare" color={colors.redBg} size={18} /></TouchableOpacity>
                                            </View>
                                            }
                                            <View style={[globalStyles.textCard, { marginBottom: 10, marginTop: 5 }]}>
                                                <Text allowFontScaling={false} style={[globalStyles.rowText]}>Today's Total Commission: $ {formatNumberWithCommas(totals.commission)}</Text>
                                            </View>
                                            <View style={[globalStyles.tableWrapper]}>
                                                <View style={[globalStyles.headerRow]}>
                                                    <View style={{ width: '20%', }}>
                                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>S.No.</Text>
                                                    </View>
                                                    <View style={{ width: '32%', paddingHorizontal: 8 }}>
                                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Amount</Text>
                                                    </View>
                                                    <View style={{ width: '48%', paddingHorizontal: 8 }}>
                                                        <Text allowFontScaling={false} style={[globalStyles.headerText]}>Date & Time</Text>
                                                    </View>
                                                </View>
                                                {commissions.length > 0 && pageData3 ?
                                                    commissions.map((m, c) => {
                                                        const globalCount = pageData3.total - ((page - 1) * 10 + c);
                                                        return <MyCommissionList2 P={P} count={globalCount} data={m} key={c} currentPage={currentPage} />
                                                    })
                                                    :
                                                    <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>{searchInput3.length > 0 ? "No search result found for commission." : "You have not earned any commission yet."}</Text>
                                                }
                                            </View>
                                        </View>
                                    </ScrollView>
                                </PTRView>
                                <View>
                                    {commissions.length > 0 && pageData3 ?
                                        pageData3.total > pageData3.per_page ?
                                            <Pagination
                                                showLastPagesButtons
                                                totalItems={pageData3.total}
                                                pageSize={10}
                                                pagesToDisplay={3}
                                                currentPage={pageData3.current_page}
                                                onPageChange={(e) => { setPage3(e); setReload(!reload) }}
                                                containerStyle={{ paddingVertical: 8, marginTop: 10,marginBottom:0 }}
                                                btnStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 4, paddingHorizontal: 10 }}
                                                activeBtnStyle={{ backgroundColor: colors.blue2, borderWidth: 0, borderRadius: 90, padding: 5, paddingHorizontal: 10 }}
                                                textStyle={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 14 }}
                                                activeTextStyle={{ fontFamily: Fonts.medium, color: "#fff", fontSize: 14 }}
                                            />
                                            : null
                                        : null
                                    }
                                </View>
                            </>
                            :
                            !spinning && <TabDisable onRefresh={onRefresh} />
                        : null
                }


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
                            <TouchableOpacity onPress={toggleModal} style={[styles.btn_outline3, { width: '35%', marginEnd: 10 }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDone} style={[styles.btn3, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </MainBackground >
        </TouchableHighlight>
    )
}

export default Void