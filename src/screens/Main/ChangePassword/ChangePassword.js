import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../../Components/ScreenWrapper/ScreenWrapper'
import Header from '../../../Components/Header/Header'
import globalStyles from '../../../helpers/globalStyles'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon.js'
import Button from '../../../Components/Buttons/Button.js'
import { useNavigation } from '@react-navigation/native'
import { showToast } from '../../../Components/Modal/showToasts.js'
import { authStore } from '../../../Store/AuthStore/auth.js'

const ChangePassword = (props) => {
    const navigation = useNavigation()
    const globalStyle = globalStyles()
    const { userInfo, changePassword } = authStore()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        newPassword: '', confirmNewPassword: ''
    });

    const handleSave = () => {
        if (formData.newPassword.length < 1 || formData.confirmNewPassword.length < 1) {
            showToast("Please fill all fields")
            return;
        }
        setIsLoading(true);
        changePassword({ old_password: formData.newPassword, new_password: formData.confirmNewPassword })
            .then((res) => {
                showToast("Password changed successfully", "success");
                navigation.goBack();
            })
            .catch((error) => {
                showToast(error?.message || 'Errror occurred while changing password');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (<>
        <Header back={true} title={"Change Password"} />
        <ScreenWrapper>
            <ScrollView>
                <View style={globalStyle.screen}>

                    <TextInputWithIcon
                        placeholder="Old Password *"
                        value={formData.newPassword}
                        onChangeText={text => setFormData({ ...formData, newPassword: text })}
                    />
                    <TextInputWithIcon
                        placeholder="New Passowrd *"
                        value={formData.confirmNewPassword}
                        onChangeText={text => setFormData({ ...formData, confirmNewPassword: text })}
                    />


                    <View style={globalStyle.buttonRow}>
                        <View style={{ width: '49%' }}>
                            <Button variant={"danger"} onPress={handleSave} buttonText={"Save"} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <Button variant={"secondary"} onPress={() => navigation?.goBack()} buttonText={"Cancel"} />
                        </View>
                    </View>
                </View>
            </ScrollView>

        </ScreenWrapper >
    </>
    )
}

export default ChangePassword