import MainBackground from '../../../Components/MainBackground/MainBackground.js'
import Title from '../../../Components/Title/Title.js'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from './Style.js'
import PTRView from 'react-native-pull-to-refresh';
import { useOtherStore } from './../../../Store/OtherStore/OtherStore';

const FAQItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.faqItem}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.questionContainer}>
                <Text allowFontScaling={false} style={[styles.title, { fontSize: 15 }]}>{item.question}</Text>
                <Icon name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} color="#fff" />
            </TouchableOpacity>
            {expanded && <Text allowFontScaling={false} style={[styles.cardLabel, { marginTop: 5 }]}>{item.answer}</Text>}
        </View>
    );
};

const Faq = () => {
    const { fetchFaq, setFaq, faqs } = useOtherStore()
    const [spinning, setSpinning] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        return new Promise((resolve) => {
            setRefreshing(prevRefreshing => {
                setTimeout(() => {
                    resolve();
                }, 1000);

                return !prevRefreshing; // Toggle state
            });
        });
    };

    useEffect(() => {
        setSpinning(true)
        fetchFaq()
            .then(res => {
                setFaq(res.data.data)
                setSpinning(false)
            })
            .catch(err => {
                console.log(err);
                setSpinning(false)
            })
    }, [refreshing])

    return (
        <MainBackground>
            <View style={[styles.block]}>
                <Title name="FAQ'S" />
            </View>
            {faqs &&
                <View style={[styles.block, { marginTop: 15 }]}>
                    <View style={{ width: '100%', height: 170, marginVertical: 10 }}>
                        <Image style={{ width: '100%', height: '100%', objectFit: 'contain' }} source={{ uri: faqs.image }} />
                    </View>
                    <PTRView onRefresh={onRefresh} >
                        <FlatList
                            data={faqs.questions}
                            renderItem={({ item }) => <FAQItem item={item} />}
                            keyExtractor={(item, index) => index.toString()}

                        />
                    </PTRView>
                </View>
            }

        </MainBackground>
    )
}

export default Faq