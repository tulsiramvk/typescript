import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainBackground from '../../../Components/MainBackground/MainBackground'
import styles from './Style'
import FetherIcon from 'react-native-vector-icons/Feather'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6'
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient'
import LotterCard from './LotterCard'
import SideMenu from 'react-native-side-menu'
import SideMenuDrawer from './SideMenuDrawer'
import Loader from '../../../helpers/Loader'
import Scanner from '../../../static/images/scanner.svg'
import Pri from '../../../static/images/shield-minus.svg'
import Pay from '../../../static/images/pay.svg'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PTRView from 'react-native-pull-to-refresh';
import { formatNumberWithCommas } from '../../../helpers/utils'
import CameraView from '../Tickets/CameraView'
import CameraView2 from '../Tickets/CameraView2'
import Toast from 'react-native-toast-message'
import {
  Camera,
} from 'react-native-vision-camera';
import globalStyles from '../../../helpers/globalStyles'
import { colors } from './../../../helpers/colors';
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';
import { useHomeStore } from './../../../Store/HomeStore/HomeStore';

const Home = () => {
  const navigation = useNavigation()
  const [spinning, setSpinning] = useState(false)
  const { userInfo } = useAuthenticationStore()
  const width = Dimensions.get('screen').width;
  const height = width / 2
  const [isOpen, setIsOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const { homeData, setHomeData, fetchHomeData, fetchBalance, setBalance } = useHomeStore()
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const refresh = () => {
    fetchBalan()
    fetchHomeData()
      .then(res => {
        setHomeData(res.data.data)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const fetchBalan = () => {
    fetchBalance()
      .then(res => {
        setBalance(res.data.data)
      })
      .catch(err => {

      })
  }

  useEffect(() => {
    setSpinning(true)
    fetchHomeData()
      .then(res => {
        setHomeData(res.data.data)
        setSpinning(false)
      })
      .catch(err => {
        console.log(err);
        setSpinning(false)
      })
    fetchBalan()
  }, [refreshing])

  const onRefresh = () => {
    return new Promise((resolve) => {
      setRefreshing(prevRefreshing => {
        setTimeout(() => {
          resolve();
        }, 1500);

        return !prevRefreshing; // Toggle state
      });
    });
  };
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
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
  const handlePress = (d) => {
    toggleDropdown()
    if (d === 'P') {
      handleWin()
    } else if (d === 'V') {
      handleVoid()
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      // Reset dropdown state when the screen gains focus
      Toast.hide()
      setShowDropdown(false);
      fetchBalan()
    }, [])
  );

  // console.log(homeData?.lotteriesData)

  return (
    <TouchableHighlight disabled={!showDropdown} onPress={() => setShowDropdown(false)} style={globalStyles.backdrop}>
      <MainBackground>
        <SideMenu openMenuOffset={270} edgeHitWidth={0} hiddenMenuOffset={0} onChange={() => setIsOpen(!isOpen)} autoClosing={true} isOpen={isOpen} menu={isOpen ? <SideMenuDrawer setIsOpen={setIsOpen} /> : null}>
          {show &&
            <CameraView show={show} hasPermission={hasPermission} setHasPermission={setHasPermission} setShow={setShow} />
          }
          {show2 &&
            <CameraView2 show={show2} hasPermission={hasPermission} setHasPermission={setHasPermission} setShow={setShow2} />
          }
          <Loader spinning={spinning} />
          <View style={[styles.block, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, marginTop: 25, marginLeft: isOpen ? -275 : 'auto' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { setIsOpen(true); setShowDropdown(false) }}><FetherIcon name={"menu"} size={20} color={colors.white} /></TouchableOpacity>
              <View><Text allowFontScaling={false} style={[styles.title, { marginStart: 5 }]}>Hii, {homeData ? `${homeData.firstName} ${homeData.lastName}` : `${userInfo.firstName} ${userInfo.lastName}`}</Text></View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={toggleDropdown} style={[styles.qrButton]}>
                <Scanner />
              </TouchableOpacity>
              {showDropdown && (
                <View
                  style={[styles.dropdown]}
                >
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 }} onPress={() => handlePress('V')}>
                    <View>
                      <Pri /></View>
                    <Text style={[styles.dropdownItem, { marginLeft: 8 }]}> Scan for Void</Text>
                  </TouchableOpacity>
                  <View style={{ height: 0.8, backgroundColor: colors.blue2 }} />
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 }} onPress={() => handlePress('P')}>
                    <View>
                      <Pay /></View>
                    <Text style={[styles.dropdownItem, { marginLeft: 8 }]}> Scan for Payout</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {homeData && homeData.image ?
                  <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: homeData.image }} />
                  :
                  <Icon name={'account-circle'} size={30} color={colors.thirdText} style={{ borderRadius: 50 }} />
                }
              </TouchableOpacity>
            </View>
          </View>
          <PTRView onPress={toggleDropdown} onRefresh={onRefresh} colors={colors.blue} >
            <ScrollView>

              {/* ---------Carousal Work--------------- */}

              <View style={[styles.block, { marginVertical: 0, height:width / 2.1, marginLeft: isOpen ? -270 : 'auto' }]}>
                {homeData?.bannerImages?.length > 0 && (
                  <Carousel
                    loop
                    width={width}
                    height={width / 2.1}
                    autoPlay
                    snapEnabled={false}
                    data={homeData.bannerImages} // Pass the actual images
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          overflow: 'hidden',
                          borderRadius: 16,
                        }}
                      >
                        <Image
                          resizeMethod="cover"
                          resizeMode="contain"
                          style={{ width: '95%', height: '100%', borderRadius: 16,backgroundColor:'gray' }}
                          source={{ uri: item }}
                        />
                      </View>
                    )}
                  />
                )}
              </View>

              {/* ---------Overview Work--------------- */}

              <View style={{ width: '100%', marginVertical: 10 }}><Text allowFontScaling={false} style={[styles.title, { marginStart: 10, textAlign: 'left' }]}>Today's Data</Text></View>
              <View style={[styles.block, { flexDirection: 'row', marginLeft: isOpen ? -270 : 'auto', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginVertical: 10, marginTop: 10 }]}>
                <View style={[styles.card]}>
                  <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'right', paddingEnd: 5 }]}>Sales</Text>
                  <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[styles.container, { borderRadius: 5 }]} >
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', margin: 'auto', flexWrap: 'wrap' }]}>
                      <View><FontAwesomeIcon name={"pie-chart"} size={30} style={{ position: 'absolute', marginTop: -30 }} color={colors.white} /></View>
                      <View style={[{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }]}><Text allowFontScaling={false} style={[styles.title, { width: '100%', fontSize: 13, textAlign: homeData && String(homeData.userCount).length > 5 ? 'right' : 'right' }]}>${homeData ? formatNumberWithCommas(homeData.userCount) : 0}</Text></View>
                    </View>
                  </LinearGradient>
                </View>

                <View style={[styles.card]}>
                  <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'right', paddingEnd: 5 }]}>Winners</Text>
                  <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[styles.container, { borderRadius: 5 }]} >
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', margin: 'auto', flexWrap: 'wrap' }]}>
                      <View><FontAwesomeIcon name={"trophy"} size={35} style={{ position: 'absolute', marginTop: -30 }} color={colors.white} /></View>
                      <View style={[{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }]}><Text allowFontScaling={false} style={[styles.title, { width: '100%', fontSize: 13, textAlign: homeData && String(homeData.totalWinner).length > 5 ? 'right' : 'right' }]}>{homeData ? homeData.totalWinner : 0}</Text></View>
                    </View>
                  </LinearGradient>
                </View>

                <View style={[styles.card]}>
                  <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'right', paddingEnd: 5 }]}>Payouts</Text>
                  <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[styles.container, { borderRadius: 5 }]} >
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', margin: 'auto', flexWrap: 'wrap' }]}>
                      <View><FontAwesome6Icon name={"wallet"} size={30} style={{ position: 'absolute', marginTop: -30 }} color={colors.white} /></View>
                      <View style={[{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }]}><Text allowFontScaling={false} style={[styles.title, { fontSize: 13 }, { width: '100%', textAlign: homeData && String(homeData.payments).length > 5 ? 'right' : 'right' }]}>${homeData ? formatNumberWithCommas(homeData.payments) : 0}</Text></View>
                    </View>
                  </LinearGradient>
                </View>

              </View>

              {/* *****************Lottery List work****************** */}

              <View style={[styles.block, { marginVertical: 10, marginLeft: isOpen ? -270 : 'auto', marginTop: 15, marginBottom: 20 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
                  <View><Text allowFontScaling={false} style={[styles.title, { marginStart: 5 }]}>Lotteries</Text></View>
                  <TouchableOpacity onPress={() => navigation.navigate("Lotteries")} style={{ flexDirection: 'row', alignItems: 'center' }}><Text allowFontScaling={false} style={[styles.cardLabel, { paddingEnd: 2, color: colors.blue, fontSize: 13 }]}>See All</Text><FetherIcon name={"chevron-right"} size={16} color={colors.blue} /></TouchableOpacity>
                </View>

                {homeData ?
                  homeData.lotteriesData.map((d, count) => {
                    return <LotterCard refresh={refresh} d={d} key={d.id} />
                  })
                  : null}

              </View>

            </ScrollView>
          </PTRView>
        </SideMenu>
      </MainBackground>
    </TouchableHighlight>
  )
}

export default Home