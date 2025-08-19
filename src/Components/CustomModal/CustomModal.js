import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../helpers/globalStyles';
import { colors } from '../../helpers/colors';

const CustomModal = forwardRef((props, ref) => {
    const { height, headerTitle, modalContent } = props;

    return (
        <>
            <RBSheet
                closeOnPressBack={true}
                ref={ref}
                height={height || 260}
                useNativeDriver={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.65)',
                    },
                    draggableIcon: {
                        backgroundColor: '#fff',
                    },
                    container: {
                        backgroundColor: colors.darkBg,
                        padding: 15,
                        paddingHorizontal: 10,
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                customAvoidingViewProps={{
                    enabled: false,
                }}
            >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 5, alignItems: 'center' }}>
                        <Text allowFontScaling={false} style={[globalStyles.modalHeaderTitle]}>{headerTitle} :</Text>
                        <TouchableOpacity onPress={() => ref.current.close()}>
                            <MaterialCommunityIcon name={'close-thick'} size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                {modalContent}
            </RBSheet>
        </>
    );
});

export default CustomModal;
