import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RecentDrawList from './RecentDrawList'
import styles from '../Style'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../../helpers/colors';
import { useNavigation } from '@react-navigation/native'
import Loader from '../../../../../helpers/Loader';
import { useLotteryPurchaseStore } from './../../../../../Store/LotteryPurchaseStore/LotteryPurchaseStore';

const RecentDraws = ({ lid }) => {
  const navigation = useNavigation()
  const [spinning, setSpinning] = useState(false)
  const { lotteryDetail,fetchRecentDraws } = useLotteryPurchaseStore()
  const [recentDraws, setRecentDraws] = useState([])
  const [pagination, setPagination] = useState()
  
  const fetch = (pageNumber) => {
    setSpinning(true)
    let u = `?page=${pageNumber}&per_page=15`
    fetchRecentDraws(lid, u)
      .then(res => {
        if (pageNumber > 1) {
          let d = [...recentDraws, ...res.data.data]
          setRecentDraws(d)
          setPagination(res.data.pagination)
          setSpinning(false)
        } else {
          setRecentDraws(res.data.data)
          setPagination(res.data.pagination)
          setSpinning(false)
        }
      })
      .catch(err => {
        console.log(err);
        setSpinning(false)
      })
  }
  useEffect(() => {
    fetch(1)
  }, [])

  const loadMoreData = () => {
    if (!pagination) return;
    if (spinning || pagination.current_page >= pagination.last_page || !pagination.next_page_url) return;
    fetch(pagination.current_page + 1)
  }
    
  const flatListRef = useRef(null);

  // console.log({recentDraws});
  
  return (
    <View style={[styles.block, { paddingBottom: 300 }]}>
      <Loader spinning={spinning} />

      {recentDraws.length > 0 && pagination ?
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={() => { return (
            <TouchableOpacity onPress={() => navigation.navigate('WinningResults',{lname:lotteryDetail?.name,data:recentDraws.slice(0,12),total:pagination?.total})} style={[styles.btnIcon, { paddingVertical: 8, marginBottom: 10 }]}>
              <MaterialCommunityIcon name={"printer"} size={22} color={colors.white} />
              <Text allowFontScaling={false} style={[styles.btnText]}>  Print 12 recent results</Text>
            </TouchableOpacity>
          )}}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => fetch(1)}
          refreshing={false}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.8}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          data={recentDraws}
          renderItem={({ item, index }) => (
            <RecentDrawList key={index} data={item} lid={lotteryDetail} count={index} />
          )}

        />
        :
        <Text allowFontScaling={false} style={[styles.cardLabel, { fontSize: 14, marginTop: 10 }]}>The first draw of lottery is yet to be drawn.</Text>
      }


    </View>
  )
}

export default RecentDraws