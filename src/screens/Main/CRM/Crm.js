import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next' // Add this import
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Hr from '../../../Components/Hr/Hr'
import Lead from './Leads/Lead'
import Contact from './Contact/Contact'
import Customer from './Customer/Customer'

const Crm = () => {
    const { t } = useTranslation() // Add this line
    const globalStyle = globalStyles()
    const [currentPage, setCurrentPage] = useState('L')
    return (
        <ScreenWrapper>
            <Header title={t('crm.title')} />
            <View style={[globalStyle?.rowFlex, { paddingHorizontal: wp(4),justifyContent:'space-around',marginVertical:hp(1) }]}>
                <TouchableOpacity onPress={()=>setCurrentPage('L')} style={[currentPage==='L'?globalStyle?.activeTab:globalStyle?.disableTab]}>
                    <Text allowFontScaling={false} style={[currentPage==='L'?globalStyle?.activeTabTxt:globalStyle?.disaleTabTxt]}>{t('crm.tabs.leads')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setCurrentPage('C')} style={[currentPage==='C'?globalStyle?.activeTab:globalStyle?.disableTab]}>
                    <Text allowFontScaling={false} style={[currentPage==='C'?globalStyle?.activeTabTxt:globalStyle?.disaleTabTxt]}>{t('crm.tabs.contacts')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setCurrentPage('CT')} style={[currentPage==='CT'?globalStyle?.activeTab:globalStyle?.disableTab]}>
                    <Text allowFontScaling={false} style={[currentPage==='CT'?globalStyle?.activeTabTxt:globalStyle?.disaleTabTxt]}>{t('crm.tabs.customers')}</Text>
                </TouchableOpacity>
            </View>
            <Hr />
            {currentPage==='L' && <Lead />}
            {currentPage==='C' && <Contact />}
            {currentPage==='CT' && <Customer />}
        </ScreenWrapper>
    )
}

export default Crm