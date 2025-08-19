import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Style'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment-timezone'
import { colors } from './../../../helpers/colors';
import fonts from '../../../helpers/fonts'

const LotterCard = (props) => {
  const { d, refresh } = props
  const navigation = useNavigation();
  const [cdt, setCdt] = useState(null);
  const [timeLeft, setTimeLeft] = useState();
  const [canRefresh, setCanRefresh] = useState(false)

  const calculateTimeLeft = () => {
    // Parse `d.currentDraw` as EST and convert it to the local timezone    

    let targetDate = moment
      .tz(d.currentDraw, 'America/New_York')

    targetDate = targetDate.clone().tz(moment.tz.guess()).toDate()

    // Get the current time in the local timezone
    const now = new Date();
    // Calculate the difference in milliseconds
    const difference = targetDate - now;

    let timeLeft1 = {};
    if (difference > 0) {
      setCanRefresh(true);
      timeLeft1 = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      if (d.status !== 1) {
        if (canRefresh) {
          setCanRefresh(false);
          console.log('Refreshed In Home Lottery Card.');
          // Run refresh after 8 seconds delay
          setTimeout(() => {
            refresh();
          }, 8000);
        }
      } else {
        setCanRefresh(true);
      }
      timeLeft1 = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft1;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [d]);


  return (
    <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0 }} colors={["#0C213C", "#0A274B", "#083B79"]} style={[{ borderRadius: 6, borderWidth: 0.3, borderColor: colors.blue, marginBottom: 30 }]} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <View style={{ width: '55%', marginLeft: '-12%' }}>
          <View style={[styles.block1]}>
            <View style={{ transform: [{ skewX: '-65deg' }, { skewY: '9deg' }], objectFit: 'cover' }}>
              <Image resizeMode='cover' resizeMethod='cover' style={{ width: '100%', height: '100%', objectFit: 'cover', transform: [{ rotate: '-10deg' }] }} source={{ uri: d.image }} />
            </View>
          </View>
        </View>

        <View style={[styles.block2]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <View style={[styles.entryStyle]}>
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 10, color: colors.white, fontFamily: fonts.regular }}
                >
                  {d?.schedule?.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text allowFontScaling={false} style={[styles.cardText, { flex: 1 }]}>{d.name}</Text>
          </View>

          <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'right', marginTop: 0 }]}>
            {canRefresh ? <>
              {d.status === 0 && "Waiting For Start"}
              {d.status === 2 && "Next Draw In"}
              {d.status === 1 && "Lottery Expired"}
            </> :
              "Updating lottery details..."}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>

            <View style={{ width: '20%' }}>
              <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 1, marginBottom: 2 }}>
                <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.days : 0}</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center', marginBottom: 0, color: colors.white }]} >Day</Text>
            </View>
            <View style={{ width: '20%' }}>
              <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 1, marginBottom: 2 }}>
                <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.hours : 0}</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center', marginBottom: 0, color: colors.white }]} >Hour</Text>
            </View>
            <View style={{ width: '20%' }}>
              <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 1, marginBottom: 2 }}>
                <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.minutes : 0}</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center', marginBottom: 0, color: colors.white }]} >Minute</Text>
            </View>
            <View style={{ width: '20%' }}>
              <View style={{ borderWidth: 1, borderColor: colors.blue, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 1, marginBottom: 2 }}>
                <Text allowFontScaling={false} style={[styles.cardText, { textAlign: 'center', marginBottom: 0 }]} >{timeLeft ? timeLeft.seconds : 0}</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.cardLabel, { textAlign: 'center', marginBottom: 0, color: colors.white }]} >Second</Text>
            </View>

          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Lottery", { id: d.id })} style={styles.btn}>
            <Text allowFontScaling={false} style={styles.btnText}>Bet Now</Text>
          </TouchableOpacity>

        </View>
      </View>
    </LinearGradient>
  )
}

export default LotterCard