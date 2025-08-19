import { View, Text, TouchableOpacity, ScrollView, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../Style'
import styles2 from './Style.js'
import fonts from '../../../../../helpers/fonts.js'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import ViewDetails from './ViewDetails.js'
import Modal from "react-native-modal";
import LinearGradient from 'react-native-linear-gradient'
import { convertTo12Hour, formatToTwoDecimalPlacesbet, isTimePast } from './../../../../../helpers/utils'
import PTRView from 'react-native-pull-to-refresh';
import Loader from '../../../../../helpers/Loader.js'
import Toast from 'react-native-toast-message'
import { useHomeStore } from '../../../../../Store/HomeStore/HomeStore.js'
import { colors } from './../../../../../helpers/colors';
import globalStyles from '../../../../../helpers/globalStyles.js'
import TextInputWithIcon from '../../../../../Components/Inputs/TextInputIcon.js'
import InputIcon from '../../../../../Components/Inputs/InputIcon.js'

const Fonts = fonts;
const Buy = ({ lotteryDetails, refreshing, setRefreshing, totalBets, setTotalBets, reTestBets }) => {
  const [lotteryDetail, setLotteryDetail] = useState(lotteryDetails)
  const [currentPick3, setCurrentPick3] = useState(true)
  const [currentSelectedBox, setCurrentSelectedBox] = useState('st')
  const [currentGameDetails, setcurrentGameDetails] = useState(lotteryDetails?.gameDetails['3'] ?? [])
  const { isEnabled } = useHomeStore()

  // ---------------------------------------new States---------------------------
  const [amo, setAmo] = useState({
    straight: '', megaball: '', monstaball: '', box: '', pick2: ''
  })

  const [error, setError] = useState('')
  const [straightError, setStraightError] = useState('')
  const [boxError, setBoxError] = useState('')
  const [megaError, setMegaError] = useState()
  const [monstaError, setMonstaError] = useState()

  // ---------------------------------------UseState Define-----------------------------------------------
  const [viewTotals, setViewTotals] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible5, setModalVisible5] = useState(false);
  const [spinning, setSpinning] = useState(false)
  const [betNo, setBetNo] = useState("")
  const [betError, setBetError] = useState("");
  const [currentBet, setCurrentBet] = useState({
    "draw_time": [],
    "number": "",
    "pick_type": "3",
    "lottery_id": String(lotteryDetails.id),
    "game_id": lotteryDetail?.type === "Pick2" ? ['4'] : ['1', '2', '3', '4'],
    "amount": lotteryDetail?.type === "Pick2" ? [0] : [0, 0, 0, 0]
  })

  useEffect(() => {
    setCurrentBet({
      ...currentBet,
      "draw_time": [],
      "number": "",
      "pick_type": "3",
      "lottery_id": String(lotteryDetails.id),
      "game_id": lotteryDetail?.type === "Pick2" ? ['4'] : ['1', '2', '3', '4'],
      "amount": lotteryDetail?.type === "Pick2" ? [0] : [0, 0, 0, 0]
    })
  }, [lotteryDetail])

  useEffect(() => {
    setCurrentBet({ ...currentBet, pick_type: currentPick3 ? '3' : '4' })
  }, [currentPick3])


  const [payload, setPayload] = useState({
    name: '', contact: '', country: '+1-345'
  });
  const [canAddData, setCanAddData] = useState(false)

  // ---------------------------------------Modal Toggles-----------------------------------------------
  const toggleModal = () => { setModalVisible(!isModalVisible); };
  const toggleModal5 = () => { setModalVisible5(!isModalVisible5); };

  const clearData = () => {
    setCurrentBet({ ...currentBet, "draw_time": [], "number": "", "lottery_id": String(lotteryDetail.id), "game_id": lotteryDetail?.type === "Pick2" ? ['4'] : ['1', '2', '3', '4'], "amount": lotteryDetail?.type === "Pick2" ? [0] : [0, 0, 0, 0] })
    setAmo({ ...amo, straight: '', megaball: '', monstaball: '', box: '' })
    setStraightError()
    setMegaError()
    setMonstaError()
    setBoxError()
  }

  const handleInit = () => {
    clearData()
    setTotalBets([])
    setRefreshing(!refreshing)
    setLotteryDetail(lotteryDetails)
    setShowAskModal(false)
  }

  // =============FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFzN==================

  const handleAddBetAmount = (value) => {
    if (currentSelectedBox === 'st') {
      let currentValue = String(amo.straight); // Ensure it's a string
      let newValue = currentValue + value;
      // Allow only valid decimal numbers (max two decimal places)
      if (/^\d*\.?\d{0,2}$/.test(newValue)) {
        setAmo({ ...amo, straight: newValue });
        Vibration.vibrate(100);
      }
    }
    if (currentSelectedBox === 'b') {
      let currentValue = String(amo.box); // Ensure it's a string
      let newValue = currentValue + value;
      // Allow only valid decimal numbers (max two decimal places)
      if (/^\d*\.?\d{0,2}$/.test(newValue)) {
        setAmo({ ...amo, box: newValue });
        Vibration.vibrate(100);
      }
    }
    if (currentSelectedBox === 'm') {
      let currentValue = String(amo.megaball); // Ensure it's a string
      let newValue = currentValue + value;
      // Allow only valid decimal numbers (max two decimal places)
      if (/^\d*\.?\d{0,2}$/.test(newValue)) {
        setAmo({ ...amo, megaball: newValue });
        Vibration.vibrate(100);
      }
    }
    if (currentSelectedBox === 'mt') {
      let currentValue = String(amo.monstaball); // Ensure it's a string
      let newValue = currentValue + value;
      // Allow only valid decimal numbers (max two decimal places)
      if (/^\d*\.?\d{0,2}$/.test(newValue)) {
        setAmo({ ...amo, monstaball: newValue });
        Vibration.vibrate(100);
      }
    }
  };
  const handleClearAmount = () => {
    if (currentSelectedBox === 'st') {
      setAmo({ ...amo, straight: '' });
    }
    if (currentSelectedBox === 'b') {
      setAmo({ ...amo, box: '' });
    }
    if (currentSelectedBox === 'm') {
      setAmo({ ...amo, megaball: '' });
    }
    if (currentSelectedBox === 'mt') {
      setAmo({ ...amo, monstaball: '' });
    }
  };
  const handleDotAmountAdd = () => {
    if (currentSelectedBox === 'st') {
      if (amo?.straight?.includes('.')) {
        Vibration.vibrate(100)
        return; // Prevent adding another decimal
      }
      // Append the new value to the current input
      handleAddBetAmount('.')
    }
    if (currentSelectedBox === 'b') {
      if (amo?.box?.includes('.')) {
        Vibration.vibrate(100)
        return; // Prevent adding another decimal
      }
      // Append the new value to the current input
      handleAddBetAmount('.')
    }
    if (currentSelectedBox === 'm') {
      if (amo?.megaball?.includes('.')) {
        Vibration.vibrate(100)
        return; // Prevent adding another decimal
      }
      // Append the new value to the current input
      handleAddBetAmount('.')
    }
    if (currentSelectedBox === 'mt') {
      if (amo?.monstaball?.includes('.')) {
        Vibration.vibrate(100)
        return; // Prevent adding another decimal
      }
      // Append the new value to the current input
      handleAddBetAmount('.')
    }
  };

  const handleCurrentBetAmountAdd = () => {
    if (currentBet.draw_time?.toString()?.length === 0) {
      Vibration.vibrate()
      setError("Please Select Draw Time.")
      return
    }
    if (currentBet.number?.toString()?.length === 0) {
      Vibration.vibrate()
      setError("Please Select Bet Number.")
      return
    }
    setError('')
    // ==============Straight Errors=========================
    let stErr = []
    let stErr2 = []
    let rem = []
    for (let i = 0; i < currentBet.draw_time.length; i++) {
      const e = currentBet.draw_time[i];
      let rba = lotteryDetail.remainingBetLimit.find((f) => String(f.draw_time) === String(e) && String(f.ticket_number) === String(currentBet.number))
      if (rba) {
        if (Number(rba.remaining_bet) < 1) {
          stErr2.push(e)
        }
        else if (Number(rba.remaining_bet) < Number(amo.straight)) {
          stErr.push(e)
          rem.push(Number(rba.remaining_bet))
        }
      } else {
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        console.log({ rba });
        if (rba) {
          let l = currentPick3 ? rba?.p3_bet_limit : rba?.p4_bet_limit
          if (Number(l) < Number(amo.straight)) {
            stErr.push(e)
            rem.push(Number(l))
          }
        }
      }
    }

    if (stErr2.length > 0) {
      Vibration.vibrate()
      setStraightError('Straight game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(stErr2.map((m) => convertTo12Hour(isEnabled, m))))
      return
    }
    if (stErr.length > 0) {
      Vibration.vibrate()
      setStraightError('Bet limit exceeding in these draw times - ' + String(stErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${rem[i]} Remaining Limit)`).join(', ')))
      return
    }

    // ==============Box Errors=========================
    let bErr = []
    let bErr2 = []
    let brem = []
    for (let i = 0; i < currentBet.draw_time.length; i++) {
      const e = currentBet.draw_time[i];
      let rba = lotteryDetail.remainingBetLimit.find((f) => String(f.draw_time) === String(e) && String(f.ticket_number) === String(currentBet.number))
      if (rba) {
        if (Number(rba.remaining_bet) < 1) {
          bErr2.push(e)
        }
        else if (Number(rba.remaining_bet) < Number(amo.box)) {
          bErr.push(e)
          brem.push(Number(rba.remaining_bet))
        }
      } else {
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_bet_limit : rba?.p4_bet_limit
          if (Number(l) < Number(amo.box)) {
            bErr.push(e)
            brem.push(Number(l))
          }
        }
      }
    }

    if (bErr2.length > 0) {
      Vibration.vibrate()
      setBoxError('Box game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(bErr2.map((m) => convertTo12Hour(isEnabled, m))))
      return
    }
    if (bErr.length > 0) {
      Vibration.vibrate()
      setBoxError('Bet limit exceeding in these draw times - ' + String(bErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${brem[i]} Remaining Limit)`).join(', ')))
      return
    }

    // ==========Megaball Work=================

    let mErr = []
    let mErr2 = []
    let mrem = []
    if (Number(amo.megaball) <= Number(amo.straight)) {
      for (let i = 0; i < currentBet.draw_time.length; i++) {
        const e = currentBet.draw_time[i];
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_remaining_megaball_bet_limit : rba?.p4_remaining_megaball_bet_limit
          if (Number(l) < 1) {
            mErr2.push(e)
          }
          else if (Number(l) < Number(amo.megaball)) {
            mErr.push(e)
            mrem.push(Number(l))
          }
        }
      }
      if (mErr2.length > 0) {
        Vibration.vibrate()
        setMegaError('Megaball is soldout for these draws - ' + String(mErr2.map((m) => convertTo12Hour(isEnabled, m))))
        return false
      }
      if (mErr.length > 0) {
        Vibration.vibrate()
        setMegaError('Bet limit exceeding in these draw times - ' + String(mErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mrem[i]} Remaining Limit)`).join(', ')))
        return false
      }
      setMegaError('')
    } else {
      Vibration.vibrate()
      setMegaError('Megaball Bet Amount can not be more than Straight Bet Amount.')
      return
    }

    // ==========Monstaball Work=================

    let mtErr = []
    let mtErr2 = []
    let mtrem = []

    if (Number(amo.monstaball) <= Number(amo.straight) && Number(amo.monstaball) <= Number(amo.megaball)) {
      for (let i = 0; i < currentBet.draw_time.length; i++) {
        const e = currentBet.draw_time[i];
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_remaining_megaball_bet_limit : rba?.p4_remaining_megaball_bet_limit
          if (Number(l) < 1) {
            mtErr2.push(e)
          }
          else if (Number(l) < Number(amo.monstaball)) {
            mtErr.push(e)
            mtrem.push(Number(l))
          }
        }
      }
      if (mtErr2.length > 0) {
        Vibration.vibrate()
        setMonstaError('Monstaball is soldout for these draws - ' + String(mtErr2.map((m) => convertTo12Hour(isEnabled, m))))
        return false
      }
      if (mtErr.length > 0) {
        Vibration.vibrate()
        setMonstaError('Bet limit exceeding in these draw times - ' + String(mtErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mtrem[i]} Remaining Limit)`).join(', ')))
        return false
      }
      setMonstaError('')
    } else {
      Vibration.vibrate()
      setMonstaError('Monstaball Bet Amount can not be more than Straight and Megaball Bet Amount.')
      return
    }
    setCurrentBet({ ...currentBet, amount: [amo.straight.length === 0 ? 0 : amo.straight, amo.box.length === 0 ? 0 : amo.box, amo.megaball.length === 0 ? 0 : amo.megaball, amo.monstaball.length === 0 ? 0 : amo.monstaball] })
    toggleModal()
    return true
  }

  const validateAddBet = () => {
    if (currentBet.draw_time?.toString()?.length === 0) {
      Vibration.vibrate()
      setError("Please Select Draw Time.")
      Toast.show({
        type: 'error',
        text1: 'Please Select Draw Time.'
      });
      return false
    }
    if (currentBet.number?.toString()?.length === 0) {
      Vibration.vibrate()
      setError("Please Select Bet Number.")
      Toast.show({
        type: 'error',
        text1: 'Please Select Bet Number.'
      });
      return false
    }
    setError('')
    // ==============Straight Errors=========================
    let stErr = []
    let stErr2 = []
    let rem = []
    for (let i = 0; i < currentBet.draw_time.length; i++) {
      const e = currentBet.draw_time[i];
      let rba = lotteryDetail.remainingBetLimit.find((f) => String(f.draw_time) === String(e) && String(f.ticket_number) === String(currentBet.number))
      if (rba) {
        if (Number(rba.remaining_bet) < 1) {
          stErr2.push(e)
        }
        else if (Number(rba.remaining_bet) < Number(currentBet?.amount[0])) {
          stErr.push(e)
          rem.push(Number(rba.remaining_bet))
        }
      } else {
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_bet_limit : rba?.p4_bet_limit
          if (Number(l) < Number(currentBet?.amount[0])) {
            stErr.push(e)
            rem.push(Number(l))
          }
        }
      }
    }

    if (stErr2.length > 0) {
      Vibration.vibrate()
      setStraightError('Straight game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(stErr2.map((m) => convertTo12Hour(isEnabled, m))))
      Toast.show({
        type: 'error',
        text1: 'Straight game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(stErr2.map((m) => convertTo12Hour(isEnabled, m)))
      });
      return false
    }
    if (stErr.length > 0) {
      Vibration.vibrate()
      setStraightError('Bet limit exceeding in these draw times - ' + String(stErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${rem[i]} Remaining Limit)`).join(', ')))
      Toast.show({
        type: 'error',
        text1: 'Bet limit exceeding in these draw times - ' + String(stErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${rem[i]} Remaining Limit)`).join(', '))
      });
      return false
    }

    // ==============Box Errors=========================
    let bErr = []
    let bErr2 = []
    let brem = []
    for (let i = 0; i < currentBet.draw_time.length; i++) {
      const e = currentBet.draw_time[i];
      let rba = lotteryDetail.remainingBetLimit.find((f) => String(f.draw_time) === String(e) && String(f.ticket_number) === String(currentBet.number))
      if (rba) {
        if (Number(rba.remaining_bet) < 1) {
          bErr2.push(e)
        }
        else if (Number(rba.remaining_bet) < Number(currentBet?.amount[1])) {
          bErr.push(e)
          brem.push(Number(rba.remaining_bet))
        }
      } else {
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_bet_limit : rba?.p4_bet_limit
          if (Number(l) < Number(currentBet?.amount[1])) {
            bErr.push(e)
            brem.push(Number(l))
          }
        }
      }
    }

    if (bErr2.length > 0) {
      Vibration.vibrate()
      setBoxError('Box game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(bErr2.map((m) => convertTo12Hour(isEnabled, m))))
      Toast.show({
        type: 'error',
        text1: 'Box game No. ' + Number(currentBet?.number) + ' has been sold out for the the draw of - ' + String(bErr2.map((m) => convertTo12Hour(isEnabled, m)))
      });
      return false
    }
    if (bErr.length > 0) {
      Vibration.vibrate()
      setBoxError('Bet limit exceeding in these draw times - ' + String(bErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${brem[i]} Remaining Limit)`).join(', ')))
      Toast.show({
        type: 'error',
        text1: 'Bet limit exceeding in these draw times - ' + String(bErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${brem[i]} Remaining Limit)`).join(', '))
      });
      return false
    }

    // ==========Megaball Work=================

    let mErr = []
    let mErr2 = []
    let mrem = []
    if (Number(currentBet?.amount[2]) <= Number(currentBet.amount[0])) {
      for (let i = 0; i < currentBet.draw_time.length; i++) {
        const e = currentBet.draw_time[i];
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_remaining_megaball_bet_limit : rba?.p4_remaining_megaball_bet_limit
          if (Number(l) < 1) {
            mErr2.push(e)
          }
          else if (Number(l) < Number(currentBet?.amount[2])) {
            mErr.push(e)
            mrem.push(Number(l))
          }
        }
      }
      if (mErr2.length > 0) {
        Vibration.vibrate()
        setMegaError('Megaball is soldout for these draws - ' + String(mErr2.map((m) => convertTo12Hour(isEnabled, m))))
        Toast.show({
          type: 'error',
          text1: 'Megaball is soldout for these draws - ' + String(mErr2.map((m) => convertTo12Hour(isEnabled, m)))
        });
        return false
      }
      if (mErr.length > 0) {
        Vibration.vibrate()
        setMegaError('Bet limit exceeding in these draw times - ' + String(mErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mrem[i]} Remaining Limit)`).join(', ')))
        Toast.show({
          type: 'error',
          text1: 'Bet limit exceeding in these draw times - ' + String(mErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mrem[i]} Remaining Limit)`).join(', '))
        });
        return false
      }
      setMegaError('')
    } else {
      Vibration.vibrate()
      setMegaError('Megaball Bet Amount can not be more than Straight Bet Amount.')
      Toast.show({
        type: 'error',
        text1: 'Megaball Bet Amount can not be more than Straight Bet Amount.'
      });
      return false
    }

    // ==========Monstaball Work=================

    let mtErr = []
    let mtErr2 = []
    let mtrem = []

    if (Number(currentBet.amount[3]) <= Number(currentBet.amount[0]) &&
      Number(currentBet.amount[3]) <= Number(currentBet.amount[2])
    ) {
      for (let i = 0; i < currentBet.draw_time.length; i++) {
        const e = currentBet.draw_time[i];
        let rba = lotteryDetail.drawDetails.find((f) => String(f.draw_time) === String(e))
        if (rba) {
          let l = currentPick3 ? rba?.p3_remaining_megaball_bet_limit : rba?.p4_remaining_megaball_bet_limit
          if (Number(l) < 1) {
            mtErr2.push(e)
          }
          else if (Number(l) < Number(currentBet?.amount[3])) {
            mtErr.push(e)
            mtrem.push(Number(l))
          }
        }
      }
      if (mtErr2.length > 0) {
        Vibration.vibrate()
        setMonstaError('Monstaball is soldout for these draws - ' + String(mtErr2.map((m) => convertTo12Hour(isEnabled, m))))
        Toast.show({
          type: 'error',
          text1: 'Monstaball is soldout for these draws - ' + String(mtErr2.map((m) => convertTo12Hour(isEnabled, m)))
        });
        return false
      }
      if (mtErr.length > 0) {
        Vibration.vibrate()
        setMonstaError('Bet limit exceeding in these draw times - ' + String(mtErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mtrem[i]} Remaining Limit)`).join(', ')))
        Toast.show({
          type: 'error',
          text1: 'Bet limit exceeding in these draw times - ' + String(mtErr.map((m, i) => `${convertTo12Hour(isEnabled, m)} (${mtrem[i]} Remaining Limit)`).join(', '))
        });
        return false
      }
      setMonstaError('')
    } else {
      Vibration.vibrate()
      setMonstaError('Monstaball Bet Amount can not be more than Straight Bet Amount.')
      Toast.show({
        type: 'error',
        text1: 'Monstaball Bet Amount can not be more than Straight & Megaball Bet Amount.'
      });
      return false
    }
    return true
  }

  const handleAddSchedule = (df) => {
    let d = [...currentBet.draw_time]
    let f = d.find(x => x === df)
    if (f) {
      const index = d.indexOf(f);
      if (index > -1) { // only splice array when item is found
        d.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      d.push(df)
    }
    setCurrentBet({ ...currentBet, draw_time: d, amount: [0, 0, 0, 0] })
  }

  useEffect(() => {
    Toast.hide()
    if (currentBet.draw_time.length > 0 && String(currentBet.number).length > 0 && String(currentBet.lottery_id).length > 0 && currentBet.game_id.length > 0 && (currentBet.amount[0] > 0 || currentBet.amount[1] > 0)) {
      setCanAddData(true)
    } else {
      setCanAddData(false)
    }
  }, [currentBet])

  const getPermutations = (str) => {
    if (str.length <= 1) return [str];
    let result = [];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remaining = str.slice(0, i) + str.slice(i + 1);
      const perms = getPermutations(remaining);
      perms.forEach(p => result.push(char + p));
    }
    return [...new Set(result)]; // remove duplicates (for cases like "112")
  };

  const addBet = () => {
    if (validateAddBet()) {
      let d = [...totalBets];
      d.push(currentBet);
      setTotalBets(d);
      setCurrentBet({ ...currentBet, number: "" });
      setBetNo("");

      let redata = lotteryDetail;

      for (let i = 0; i < currentBet?.draw_time?.length; i++) {
        const e = currentBet.draw_time[i];

        // Generate all permutations of the entered number
        const allNumbers = getPermutations(currentBet.number);

        allNumbers.forEach((num) => {
          let rba = lotteryDetail.remainingBetLimit.find(
            (f) =>
              String(f.draw_time) === String(e) &&
              String(f.ticket_number) === String(num)
          );

          // Decide deduction amount
          const deduction =
            num === currentBet.number
              ? Number(currentBet.amount[0]) + Number(Number(currentBet.amount[1]) / allNumbers?.length)
              : Number(Number(currentBet.amount[1]) / allNumbers?.length);

          if (rba) {
            for (let j = 0; j < redata.remainingBetLimit.length; j++) {
              const ej = redata.remainingBetLimit[j];
              if (
                String(ej.draw_time) === String(e) &&
                String(ej.ticket_number) === String(num)
              ) {
                ej.remaining_bet = Number(ej.remaining_bet) - deduction;
              }
            }
          } else {
            let l = currentPick3
              ? redata.drawDetails.find((f) => String(f.draw_time) === String(e))
                ?.p3_bet_limit
              : redata.drawDetails.find((f) => String(f.draw_time) === String(e))
                ?.p4_bet_limit;

            redata.remainingBetLimit.push({
              lottery_id: lotteryDetails.id,
              draw_time: e,
              ticket_number: num,
              remaining_bet: l - deduction,
            });
          }
        });
        let mt = redata.drawDetails.find(f => String(f.draw_time) === String(e))
        if (mt) {
          for (let k = 0; k < redata.drawDetails.length; k++) {
            const el = redata.drawDetails[k];
            let mm = currentPick3 ? el?.p3_remaining_megaball_bet_limit : el?.p4_remaining_megaball_bet_limit
            let mst = currentPick3 ? el?.p3_remaining_monstaball_bet_limit : el?.p4_remaining_monstaball_bet_limit
            if (String(el.draw_time) === String(e)) {
              el[mm] = mm - Number(currentBet.amount[2])
              el[mst] = mst - Number(currentBet.amount[3])
            }
          }
        }
      }
      setLotteryDetail(redata)
    }
  }

  const [showAskModal, setShowAskModal] = useState(false)

  const onRefresh = () => {
    if (totalBets.length === 0) {
      return new Promise((resolve) => {
        setRefreshing(prevRefreshing => {
          setTimeout(() => {
            resolve();
          }, 1000);
          return !prevRefreshing; // Toggle state
        });
      });
    } else {
      setShowAskModal(true)
    }
  };

  useEffect(() => {
    setSpinning(true);
    // -----------------------------
    setViewTotals(false);
    setCurrentBet({
      ...currentBet,
      draw_time: [],
      number: "",
      lottery_id: String(lotteryDetails.id),
      game_id: lotteryDetail?.type === "Pick2" ? ["4"] : ["1", "2", "3", "4"],
      amount: lotteryDetail?.type === "Pick2" ? [0] : [0, 0, 0, 0],
    });
    setAmo({ ...amo, straight: "", box: "", megaball: "", monstaball: "" });
    setBetNo("");
    setCanAddData(false);
    setStraightError();
    setBoxError();
    setMegaError();
    setMonstaError();
    // -----------------------------

    let d = [];
    let redata = lotteryDetails;

    for (let index = 0; index < totalBets.length; index++) {
      const cb = totalBets[index];

      // filter expired draw times
      cb.draw_time = cb.draw_time.filter((f) => !isTimePast(f));
      if (cb.draw_time.length > 0) {
        d.push(cb);
      }

      for (let i = 0; i < cb.draw_time.length; i++) {
        const e = cb.draw_time[i];

        let allNumbers;
        allNumbers = getPermutations(cb.number);


        allNumbers.forEach((num) => {

          // Pick3 or Pick4
          let deduction = num === cb.number
            ? Number(cb.amount[0]) + Number(Number(cb.amount[1]) / allNumbers?.length)
            : Number(cb.amount[1]) / allNumbers?.length;


          if (deduction > 0) {
            let rba = lotteryDetail.remainingBetLimit.find(
              (f) =>
                String(f.draw_time) === String(e) &&
                String(f.ticket_number) === String(num)
            );

            if (rba) {
              for (let j = 0; j < redata?.remainingBetLimit?.length; j++) {
                const ej = redata.remainingBetLimit[j];
                if (
                  String(ej.draw_time) === String(e) &&
                  String(ej.ticket_number) === String(num)
                ) {
                  ej.remaining_bet = Number(ej.remaining_bet) - deduction;
                }
              }
            } else {
              // find base bet limit depending on game type
              let l;
              if (currentPick3) {
                l =
                  redata.drawDetails.find(
                    (f) => String(f.draw_time) === String(e)
                  )?.p3_bet_limit || 0;
              } else {
                l =
                  redata.drawDetails.find(
                    (f) => String(f.draw_time) === String(e)
                  )?.p4_bet_limit || 0;
              }

              redata.remainingBetLimit.push({
                lottery_id: lotteryDetails.id,
                draw_time: e,
                ticket_number: num,
                remaining_bet: l - deduction,
              });
            }
          }
        });

        // Update MegaBall & MonstaBall limits
        let mt = redata.drawDetails.find(f => String(f.draw_time) === String(e))
        if (mt) {
          for (let k = 0; k < redata.drawDetails.length; k++) {
            const el = redata.drawDetails[k];
            if (String(el.draw_time) === String(e)) {
              if (currentPick3) {
                el.p3_remaining_megaball_bet_limit =
                  Number(el.p3_remaining_megaball_bet_limit) -
                  Number(cb.amount[2]);
                el.p3_remaining_monstaball_bet_limit =
                  Number(el.p3_remaining_monstaball_bet_limit) -
                  Number(cb.amount[3]);
              } else {
                el.p4_remaining_megaball_bet_limit =
                  Number(el.p4_remaining_megaball_bet_limit) -
                  Number(cb.amount[2]);
                el.p4_remaining_monstaball_bet_limit =
                  Number(el.p4_remaining_monstaball_bet_limit) -
                  Number(cb.amount[3]);
              }
            }
          }
        }
      }
    }

    setLotteryDetail(redata);
    setTotalBets(d);
    setSpinning(false);
  }, [reTestBets, lotteryDetails]);


  useEffect(() => {
    console.log(lotteryDetails);
  }, [])

  const handleBetNumberAdd = (text) => {
    // Remove all non-numeric
    setBetError("");
    let cleaned = text.replace(/[^0-9]/g, "");

    if (currentPick3) {
      cleaned = cleaned.slice(0, 3); // max 3 digits
    } else {
      cleaned = cleaned.slice(0, 4); // max 4 digits
    }

    // Add hyphen between digits
    let formatted = cleaned.split("").join("-");

    setBetNo(formatted);
  };

  const handleBlurBetNumber = () => {
    let cleaned = betNo.replace(/-/g, "");

    if (currentPick3) {
      if (cleaned.length !== 3) {
        setBetError("Please enter a valid 3-digit number (000–999)");
        return;
      }
    } else {
      if (cleaned.length !== 4) {
        setBetError("Please enter a valid 4-digit number (0000–9999)");
        return;
      }
    }
    if (isRepeatingDigits(cleaned)) {
      setCurrentBet({ ...currentBet, amount: [currentBet?.amount[0], 0, currentBet?.amount[2], currentBet?.amount[3]] })
      setAmo({ ...amo, box: '' })
    }
    setCurrentBet((prev) => ({ ...prev, number: cleaned }));
    setBetError("");
  };

  const isRepeatingDigits = (num) => {
    if (!num) return false;
    return num.split('').every((digit) => digit === num[0]);
  };

  return (
    <>
      {!viewTotals && <>
        <PTRView onRefresh={onRefresh} >
          {lotteryDetails.status === 0 &&
            <View style={[styles.block]}>
              <View style={[styles2.card, { alignItems: 'center', justifyContent: 'center', minHeight: 300 }]}>
                <IoniconsIcon name={"timer-outline"} style={{ opacity: 0.6 }} size={50} color={colors.blue} />
                <Text allowFontScaling={false} style={[styles2.title, { marginTop: 8, textAlign: 'center' }]}>Please wait for the lottery to begin. Regular draws will be held once it starts.</Text>
              </View>
            </View>
          }
          {lotteryDetails.status === 1 &&
            <View style={[styles.block]}>
              <View style={[styles2.card, { alignItems: 'center', justifyContent: 'center', minHeight: 300 }]}>
                <IoniconsIcon name={"close-outline"} style={{ opacity: 0.6 }} size={50} color={'red'} />
                <Text allowFontScaling={false} style={[styles2.title, { marginTop: 8, textAlign: 'center' }]}>The lottery has ended, no more further bets can be placed.</Text>
              </View>
            </View>
          }
          {lotteryDetails.status === 2 &&
            <ScrollView>
              <View style={[styles.block, { marginBottom: 5 }]}>
                <Loader spinning={spinning} />
                <View style={[styles2.card]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <View style={{ backgroundColor: colors.blue2, borderRadius: 3, padding: 5, paddingHorizontal: 8 }}><Text allowFontScaling={false} style={{ fontSize: 11, color: colors.white, fontFamily: Fonts.regular }}>DAILY SCHEDULE</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                      <View style={{ backgroundColor: colors.blue2, borderRadius: 3, padding: 5, paddingHorizontal: 6 }}><Text allowFontScaling={false} style={{ fontSize: 13, color: colors.white, fontFamily: Fonts.bold }}>{currentBet.draw_time.length > 9 ? currentBet.draw_time.length : '0' + currentBet.draw_time.length}</Text></View>
                      <Text allowFontScaling={false} style={[styles2.cardLabel, { color: colors.white, fontSize: 11 }]}> Selected Draws</Text>
                    </View>
                  </View>
                  <Text allowFontScaling={false} style={[styles2.title, { marginVertical: 8 }]}>Select your Next Draw Slots</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                    {lotteryDetails?.drawDetails?.map((dt, c) => {
                      return <TouchableOpacity key={c} disabled={isTimePast(dt.draw_time)} onPress={() => handleAddSchedule(dt.draw_time)} style={[styles2.button, { backgroundColor: isTimePast(dt.draw_time) ? colors.secondaryBg : currentBet.draw_time.find(f => f === dt.draw_time) ? colors.blue2 : colors.blueActive }]}>
                        <Text allowFontScaling={false} style={[styles2.title, { fontSize: 12, textAlign: 'center' }]}>{convertTo12Hour(isEnabled, dt.draw_time)}</Text>
                      </TouchableOpacity>
                    })}
                  </View>
                </View>

                {/* =========Game Type Buttons========== */}

                <View style={{ borderRadius: 8, borderWidth: 1, borderColor: colors.blue, marginVertical: 4, padding: 4, marginBottom: 10 }}>
                  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', }]}>
                    <TouchableOpacity onPress={() => { setBetNo(""); setCurrentBet({ ...currentBet, number: '', amount: [0, 0, 0, 0] }); setCurrentPick3(true); setcurrentGameDetails(lotteryDetails?.gameDetails['3']) }} style={{ backgroundColor: currentPick3 ? colors.blue : 'transparent', paddingVertical: 5, borderRadius: 4, width: '49%', marginHorizontal: 'auto' }}>
                      <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, textAlign: 'center' }}>Pick 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setBetNo(""); setCurrentBet({ ...currentBet, number: '', amount: [0, 0, 0, 0] }); setCurrentPick3(false); setcurrentGameDetails(lotteryDetails?.gameDetails['4']) }} style={{ backgroundColor: !currentPick3 ? colors.blue : 'transparent', paddingVertical: 5, borderRadius: 4, width: '49%', marginHorizontal: 'auto' }}>
                      <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, textAlign: 'center' }}>Pick 4</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* =========Bet Number Buttons========== */}

                <View style={[styles2.card, { paddingBottom: 10 }]}>
                  <Text allowFontScaling={false} style={[styles2.title, { marginVertical: 3, marginTop: 0 }]}>Pick your Bet Number</Text>
                  <View style={{ marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text allowFontScaling={false} style={[styles2.cardLabel, { color: colors.white, fontSize: 14 }]}>Bet No. </Text>
                      <View style={{ flex: 1 }}>
                        <InputIcon
                          iconName=""
                          placeholder={currentPick3 ? "Enter 3-digit number" : "Enter 4-digit number"}
                          value={betNo}
                          onChangeText={handleBetNumberAdd}
                          keyboardType="number-pad"
                          onBlur={handleBlurBetNumber}
                        />
                      </View>
                    </View>
                    {betError ? (
                      <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
                        {betError}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* =========Amount Buttons========== */}
                <View style={[styles2.card, { paddingBottom: 7 }]}>
                  <Text allowFontScaling={false} style={[styles2.title, { marginVertical: 3, marginTop: 0 }]}>Enter your Bet Amount</Text>

                  {lotteryDetail?.type === "Pick2" ?
                    <View style={{ width: '100%' }}>
                      <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Pick 2</Text>
                      <View style={{ width: '100%' }}>
                        <View style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                          <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(currentBet?.amount[0])}</Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => toggleModal5()} style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', backgroundColor: colors.blue, paddingVertical: 4.5, borderRadius: 4 }}>
                        <IoniconsIcon name="add" color={colors.white} size={20} />
                        <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 12, textAlign: 'center' }}> Add</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <View style={{ width: '49%', paddingBottom: 10 }}>
                        <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Straight</Text>
                        <View style={{ width: '100%' }}>
                          <View style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(currentBet.amount[0])}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ width: '49%', paddingBottom: 10 }}>
                        <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Box</Text>
                        <View>
                          <View style={{ width: '100%' }}>
                            <View style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                              <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(currentBet.amount[1])}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ width: '49%', paddingBottom: 10 }}>
                        <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Megaball</Text>
                        <View style={{ width: '100%' }}>
                          <View style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(currentBet.amount[2])}</Text>
                          </View>
                        </View>

                      </View>
                      <View style={{ width: '49%', paddingBottom: 10 }}>
                        <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Monstaball</Text>
                        <View style={{ width: '100%' }}>
                          <View style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                            <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(currentBet.amount[2])}</Text>
                          </View>
                        </View>

                      </View>
                    </View>

                  }
                  <TouchableOpacity onPress={() => toggleModal()} disabled={String(currentBet.number)?.length === 0} style={{ opacity: String(currentBet.number)?.length > 0 ? 1 : 0.7, marginTop: 5, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', backgroundColor: colors.blue, paddingVertical: 4.5, borderRadius: 4 }}>
                    <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 13 }}>Add </Text>
                    <IoniconsIcon name="add" color={colors.white} size={20} />
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }}>
                  <TouchableOpacity onPress={clearData} style={{ borderWidth: 1, borderColor: colors.blue, paddingVertical: 4, borderRadius: 4, marginStart: 5, paddingHorizontal: 8 }}>
                    <Text allowFontScaling={false} style={[styles2.title]}>Clear Data</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={addBet} disabled={!canAddData} style={{ opacity: canAddData ? 1 : 0.6, flexDirection: 'row', alignItems: 'center', width: '28%', justifyContent: 'center', backgroundColor: colors.blue, paddingVertical: 5, borderRadius: 4 }}>
                    <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, fontSize: 12 }}>Add Bet </Text>
                    <IoniconsIcon name="add" color={colors.white} size={20} />
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          }
        </PTRView>
        <TouchableOpacity onPress={() => setViewTotals(true)} disabled={totalBets.length === 0} style={{ opacity: totalBets.length > 0 ? 1 : 0.7, backgroundColor: colors.blue, paddingVertical: 12, borderRadius: 4, marginVertical: 10, position: 'fixed', bottom: 0, width: '95%', marginHorizontal: 'auto' }}>
          <Text allowFontScaling={false} style={{ fontFamily: Fonts.medium, color: colors.white, textAlign: 'center' }}>Total Bets View({totalBets.length}) </Text>
        </TouchableOpacity>
      </>}
      {viewTotals &&
        <ViewDetails totalBets={totalBets} payload={payload} setPayload={setPayload} setTotalBets={setTotalBets} lotteryDetail={lotteryDetail} setLotteryDetail={setLotteryDetail} viewTotals={viewTotals} setViewTotals={setViewTotals} />
      }

      {/* --------------------Add Amount Modal Cashpot-------------------------------- */}

      <Modal onBackdropPress={() => toggleModal(null)} isVisible={isModalVisible} style={{ padding: 0, margin: 0, }}>

        <View style={styles2.modalWrapper}>
          <Text allowFontScaling={false} style={[styles2.title, {}]}>Enter the Amount</Text>

          <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <View style={{ width: '49%', paddingBottom: 10 }}>
              <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Straight</Text>
              <TouchableOpacity onPress={() => setCurrentSelectedBox('st')} activeOpacity={0.8} style={{ width: '100%' }}>
                <View style={{ borderWidth: 1, borderColor: colors.blue, backgroundColor: currentSelectedBox === 'st' ? colors.blueActive : 'transparent', paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                  <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(amo?.straight)}</Text>
                </View>
              </TouchableOpacity>
              {straightError ? (
                <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
                  {straightError}
                </Text>
              ) : null}
            </View>
            <View style={{ width: '49%', paddingBottom: 10, opacity: isRepeatingDigits(currentBet?.number) ? 0.7 : 1 }}>
              <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Box</Text>
              <TouchableOpacity disabled={isRepeatingDigits(currentBet?.number)} onPress={() => setCurrentSelectedBox('b')} activeOpacity={0.8} style={{ width: '100%' }}>
                <View style={{ borderWidth: 1, borderColor: colors.blue, backgroundColor: currentSelectedBox === 'b' ? colors.blueActive : 'transparent', paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                  <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(amo?.box)}</Text>
                </View>
              </TouchableOpacity>
              {boxError ? (
                <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
                  {boxError}
                </Text>
              ) : null}
            </View>
            <View style={{ width: '49%', paddingBottom: 10 }}>
              <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Megaball</Text>
              <TouchableOpacity onPress={() => setCurrentSelectedBox('m')} activeOpacity={0.8} style={{ width: '100%' }}>
                <View style={{ borderWidth: 1, borderColor: colors.blue, backgroundColor: currentSelectedBox === 'm' ? colors.blueActive : 'transparent', paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                  <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(amo?.megaball)}</Text>
                </View>
              </TouchableOpacity>
              {megaError ? (
                <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
                  {megaError}
                </Text>
              ) : null}
            </View>
            <View style={{ width: '49%', paddingBottom: 10 }}>
              <Text allowFontScaling={false} style={[styles2.title, { fontSize: 13, paddingBottom: 5, paddingStart: 5 }]}>Monstaball</Text>
              <TouchableOpacity onPress={() => setCurrentSelectedBox('mt')} activeOpacity={0.8} style={{ width: '100%' }}>
                <View style={{ borderWidth: 1, borderColor: colors.blue, backgroundColor: currentSelectedBox === 'mt' ? colors.blueActive : 'transparent', paddingVertical: 5, borderRadius: 4, paddingHorizontal: 8 }}>
                  <Text allowFontScaling={false} style={[styles2.title]}>$ {formatToTwoDecimalPlacesbet(amo?.monstaball)}</Text>
                </View>
              </TouchableOpacity>
              {monstaError ? (
                <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
                  {monstaError}
                </Text>
              ) : null}
            </View>
          </View>

          {error ? (
            <Text allowFontScaling={false} style={{ color: "red", marginTop: 5, fontSize: 12 }}>
              {error}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '74%', justifyContent: 'space-between' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                return <TouchableOpacity onPress={() => { handleAddBetAmount(m); Vibration.vibrate(100) }} key={m} style={[styles2.numBtn]}>
                  <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>{m}</Text>
                </TouchableOpacity>
              })}
              <TouchableOpacity onPress={() => { handleAddBetAmount('0'); Vibration.vibrate(100) }} style={[styles2.numBtn, { width: '100%' }]}>
                <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>0</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: "23%" }}>
              <TouchableOpacity onPress={handleDotAmountAdd} style={[styles2.numBtn, { width: '100%', height: 90 }]}>
                <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleClearAmount(); Vibration.vibrate(100) }} style={[styles2.numBtn, { width: '100%', height: 90 }]}>
                <Text allowFontScaling={false} style={[styles2.title, { textAlign: 'center' }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 5 }}>
            <TouchableOpacity onPress={() => toggleModal(null)} style={[styles2.btn_outline2, { width: '35%', marginEnd: 10 }]}>
              <Text allowFontScaling={false} style={styles2.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCurrentBetAmountAdd()} style={[styles2.btn2, { width: '35%' }]}>
              <Text allowFontScaling={false} style={styles2.btnText}>Done</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

      {/* --------------------Ask Refresh Modal-------------------------------- */}

      <Modal onBackdropPress={() => setShowAskModal(false)} isVisible={showAskModal} style={{ padding: 0, margin: 0, marginTop: "-10%" }}>
        <View style={styles2.modalWrapper}>
          <Text allowFontScaling={false} style={[styles2.modalTitle]}>Confirm</Text>

          <Text allowFontScaling={false} style={[styles2.modalDesc, { marginVertical: 20 }]}>
            <Text allowFontScaling={false}>If you refresh all your saved bets will be reset.</Text>
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 5 }}>
            <TouchableOpacity onPress={() => setShowAskModal(false)} style={[styles2.btn_outline2, { width: '35%', marginEnd: 10 }]}>
              <Text allowFontScaling={false} style={styles2.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInit} style={[styles2.btn2, { width: '35%' }]}>
              <Text allowFontScaling={false} style={styles2.btnText}>Done</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

    </>
  )
}

export default Buy