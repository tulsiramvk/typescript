import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import Fonts from './Fonts';
import { colors } from './Colors';

const Loader = (props) => {
    const { spinning } = props
    return (
        <Spinner
            visible={spinning}
            textContent={'Please wait ! Loading...'}
            textStyle={{ marginTop: -35, fontFamily: Fonts.regular, fontSize: 14, fontWeight: 400, color: colors.white }}
            size={'large'}
            overlayColor={'rgba(0,0,0,0.7)'}
            color={colors.blue}
        />
    )
}

export default Loader