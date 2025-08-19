import { View, Text } from 'react-native'
import React from 'react'
import styles from '../../Style.js'
import MainBackground from '../../../../../../Components/MainBackground/MainBackground.js'
import Title from '../../../../../../Components/Title/Title.js'
import OrderDetailsComponent from './OrderDetailsComponent.js'

const OrderDetails = ({ route }) => {
    const { params } = route
    
    return (
        <MainBackground>
            <View style={[styles.block]}>
                <Title name="Order Details" />

                <View>
                    <OrderDetailsComponent data={params.arr} />
                </View>
            </View>

        </MainBackground>
    )
}

export default OrderDetails