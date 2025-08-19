import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import styles from '../../Style.js';
import styles3 from './Style.js';
import fonts from '../../../../../../helpers/fonts.js';
import logo from '../../../../../../static/images/logo.png';
import { useAuthenticationStore } from '../../../../../../Store/AuthenticationStore.js';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../../../../helpers/Loader.js';
import Yellow from '../../../../../../static/images/yellow.svg';
import Red from '../../../../../../static/images/red.svg';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useHomeStore } from '../../../../../../Store/HomeStore/HomeStore.js';
import { FlashList } from '@shopify/flash-list';
import { convertTo12Hour,formatToTwoDecimalPlaces } from './../../../../../../helpers/utils';
import {colors} from './../../../../../../helpers/colors';
import { useLotteryPurchaseStore } from './../../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';

const Fonts = fonts;
const OrderDetailsComponent = ({ data }) => {
  const { userInfo } = useAuthenticationStore();
  const { buyLottery, lotteryDetail } = useLotteryPurchaseStore();
  const navigation = useNavigation();
  const totalBets = data.result
  const [isModalVisible, setModalVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const toggleModal = () => { setModalVisible(!isModalVisible); };
  const { fetchBalance, setBalance,isEnabled } = useHomeStore();

  const fetchBalan = useCallback(() => {
    fetchBalance()
      .then(res => {
        setBalance(res.data.data);
      })
      .catch(err => {
        // Handle error if necessary
      });
  }, [fetchBalance, setBalance]);

  const toastConfig = useMemo(() => ({
    success: (props) => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={{ allowFontScaling: false }}
        text2Props={{ allowFontScaling: false }}
        style={{
          borderColor: colors.blue,
          paddingVertical: 4,
          backgroundColor: "rgba(0, 39, 76,0.8)",
          minHeight: 50,
          marginBottom: 30,
          height: 'auto',
          borderWidth: 0.4
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={{ allowFontScaling: false }}
        text2Props={{ allowFontScaling: false }}
        style={{
          borderColor: colors.blue,
          paddingVertical: 4,
          backgroundColor: "rgba(0, 39, 76,0.8)",
          minHeight: 50,
          marginBottom: 30,
          height: 'auto',
          borderWidth: 0.4
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={{ allowFontScaling: false }}
        text2Props={{ allowFontScaling: false }}
        style={{
          borderColor: 'tomato',
          paddingVertical: 4,
          backgroundColor: "rgba(0, 39, 76,0.8)",
          minHeight: 50,
          height: 'auto',
          marginBottom: 30,
          borderWidth: 0.4
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: '400'
        }}
      />
    ),
  }), []);

  const handlePay = useCallback(() => {
    setSpinning(true);
    buyLottery(data, lotteryDetail.id)
      .then(res => {
        setSpinning(false);
        fetchBalan();
        if (res.data.status === 'success') {
          toggleModal();
          navigation.navigate("TransactionComplete", { data: res.data });
        } else {
          Toast.show({
            type: 'error',
            text2: res.data.message,
          });
        }
      })
      .catch(err => {
        setSpinning(false);
        console.log({ err });
        if (err.response && err.response.data) {
          Toast.show({
            type: 'error',
            text2: err.response.data.message ? err.response.data.message : "Error in purchasing a lottery ticket. You may have insufficient funds.",
          });
        } else {
          Toast.show({
            type: 'error',
            text2: "Error! Something went wrong.",
          });
        }
      });
  }, [buyLottery, data, fetchBalan, lotteryDetail.id, navigation]);

  // Utility functions
  const getGrandTotalAmount = useCallback((data) => {
    let a = 0
    for (let j = 0; j < data.length; j++) {
      const element = data[j];
      let d = 0
      for (let i = 0; i < element.amount.length; i++) {
        const e = element.amount[i];
        d = d + (Number(e) * element.draw_time.length)
      }
      a = a + d
    }
    return a
  }, []);

  // Preparing sections for SectionList
  const flatData = useMemo(() => {
    return totalBets.flatMap((bet, index) => [
        // Insert entry row for each section
        { type: 'entryRow', entry: index },
        // Map over the draw_time array to generate bet rows
        ...bet.draw_time.map((drawTime, drawIndex) => ({
            sectionIndex: index,
            drawTime,
            drawIndex,
            number: bet.number,
            amount: bet.amount,
            type: 'betRow'
        }))
    ]);
}, [totalBets]);

  // Header Component
  const renderHeader = useMemo(() => (
    <>
      <View>
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <Image source={logo} style={{ width: 80, height: 80 }} />
        </View>
        <Text allowFontScaling={false} style={[styles3.title, { color: "#000" }]}>Order Details</Text>
        <View style={{ marginTop: 6 }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#777" }]}>Lottery Name</Text>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>
            {lotteryDetail.name}
          </Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#777" }]}>Agent Name</Text>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>
            {`${userInfo.firstName} ${userInfo.lastName}`}
          </Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#777" }]}>Customer Name</Text>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>
            {data.customer_name || "Not Provided"}
          </Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#777" }]}>Contact</Text>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { color: "#111", fontSize: 12, fontFamily: Fonts.medium }]}>
            {data.customer_contact || "Not Provided"}
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: 10 }}>
        <View style={{ height: 0.4, backgroundColor: "#777", width: '100%' }}></View>
      </View>

      <Text allowFontScaling={false} style={[styles3.title, { color: "#000" }]}>Order Details</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 6, backgroundColor: colors.blackBg }}>
        <View style={{ width: '13%' }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { fontSize: 12, fontFamily: Fonts.regular }]}>Bet #</Text>
        </View>
        <View style={{ width: '30%' }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { fontSize: 12, fontFamily: Fonts.regular, paddingHorizontal: 8 }]}>Game</Text>
        </View>
        <View style={{ width: '29%' }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { fontSize: 12, fontFamily: Fonts.regular, paddingHorizontal: 8 }]}>Drawtime</Text>
        </View>
        <View style={{ width: '28%' }}>
          <Text allowFontScaling={false} style={[styles3.cardLabel, { fontSize: 12, fontFamily: Fonts.regular, paddingHorizontal: 8 }]}>Amount</Text>
        </View>
      </View>
    </>
  ), [data.customer_contact, data.customer_name, lotteryDetail.name, styles3.cardLabel, styles3.title, userInfo.firstName, userInfo.lastName]);

  // Footer Component
  const renderFooter = useMemo(() => (
    <>
      <View style={{ marginVertical: 10 }}>
        <View style={{ height: 0.4, backgroundColor: "#777", width: '100%' }}></View>
      </View>
      <View style={{ paddingBottom: 5, alignItems: 'flex-end' }}>
        <Text allowFontScaling={false} style={[styles3.title, { textAlign: 'right' }]}>
          <Text allowFontScaling={false} style={{ fontSize: 12 }}>Total Amount </Text>$ {formatToTwoDecimalPlaces(getGrandTotalAmount(data.result))}
        </Text>
      </View>
    </>
  ), [data.result, getGrandTotalAmount, styles3.title]);

  // Section Header Component
  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <View style={[styles.renderContainer2]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text allowFontScaling={false} style={[styles.entryStyle2]}>Entry </Text>
        <View style={[styles.entryStyle3]}>
          <Text allowFontScaling={false} style={[styles.entryStyle2]}>{title.split(' ')[1]}</Text>
        </View>
      </View>
    </View>
  ), []);

  // Item Component
  const renderItem = useCallback(({ item }) => (
    item.type==="betRow"?
    <View>
      <View style={[styles.cashpotContainer2]}>
        <View style={[styles.col11]}>
          <Text allowFontScaling={false} style={[styles3.title, styles3.cashpotNumber]}>{item.number}</Text>
        </View>
        <View style={[styles.col22]}>
          <Text allowFontScaling={false} style={[styles3.title]}>Cashpot</Text>
        </View>
        <View style={[styles.col33]}>
          <Text allowFontScaling={false} style={[styles3.title]}>{convertTo12Hour(isEnabled,item.drawTime)}</Text>
        </View>
        <View style={[styles.col44]}>
          <Text allowFontScaling={false} style={[styles3.title]}>$ {formatToTwoDecimalPlaces(item.amount[0])}</Text>
        </View>
      </View>

      {Number(item.amount[1]) > 0 &&
        <View style={[styles.megaContainer2]}>
          <View style={[styles.col11]}>
            <Yellow style={{ width: 12, height: 12 }} />
          </View>
          <View style={[styles.col22]}>
            <Text allowFontScaling={false} style={[styles3.title]}>Megaball</Text>
          </View>
          <View style={[styles.col33]}>
            <Text allowFontScaling={false} style={[styles3.title]}>{convertTo12Hour(isEnabled,item.drawTime)}</Text>
          </View>
          <View style={[styles.col44]}>
            <Text allowFontScaling={false} style={[styles3.title]}>$ {formatToTwoDecimalPlaces(item.amount[1])}</Text>
          </View>
        </View>
      }

      {Number(item.amount[2]) > 0 &&
        <View style={[styles.monstaContainer2]}>
          <View style={[styles.col11]}>
            <Red style={{ width: 14, height: 14 }} />
          </View>
          <View style={[styles.col22]}>
            <Text allowFontScaling={false} style={[styles3.title]}>Monstaball</Text>
          </View>
          <View style={[styles.col33]}>
            <Text allowFontScaling={false} style={[styles3.title]}>{convertTo12Hour(isEnabled,item.drawTime)}</Text>
          </View>
          <View style={[styles.col44]}>
            <Text allowFontScaling={false} style={[styles3.title]}>$ {formatToTwoDecimalPlaces(item.amount[2])}</Text>
          </View>
        </View>
      }
    </View>
    :
    <View style={[styles.renderContainer2]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text allowFontScaling={false} style={[styles.entryStyle2]}>Entry </Text>
        <View style={[styles.entryStyle3]}>
          <Text allowFontScaling={false} style={[styles.entryStyle2]}>{item.entry+1}</Text>
        </View>
      </View>
    </View>
  ), []);

  return (
    <>
      <Loader spinning={spinning} />
      <View style={[styles3.card, { marginTop: 20, padding: 20, paddingVertical: 20, marginBottom: 200 }]}>
        <View style={{ backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, height: '93%' }}>
          <FlashList
            data={flatData}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            estimatedItemSize={110}
            decelerationRate={'fast'}
          />
        </View>

        <View style={{ flexDirection: 'row', marginVertical: 15, alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text allowFontScaling={false} style={[styles3.title, { color: colors.blue, fontSize: 15 }]}>Go to Home</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles3.btn_outline2, { width: 70, marginEnd: 10 }]}>
              <Text allowFontScaling={false} style={styles3.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={spinning} onPress={handlePay} style={[styles3.btn2, { width: 100 }]}>
              <Text allowFontScaling={false} style={styles3.btnText}>Pay & Print</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </>
  );
};

export default OrderDetailsComponent;
