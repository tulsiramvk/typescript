import AsyncStorage from "@react-native-async-storage/async-storage"

export const Logout = async () => {
    await AsyncStorage.removeItem('userInfo')
    return true
}

export const getData = async () => {
    let data = await AsyncStorage.getItem('userInfo')
    if (data) {
        data = await JSON.parse(data)
        return data
    } else {
        return null
    }
}

export const storeData = async (data) => {
    data = JSON.stringify(data)
    await AsyncStorage.setItem('userInfo', data)
    return true
}