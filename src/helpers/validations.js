export const validateEmail = (text) => {
    //Validates the email address
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(text);
};

export const validatePhone = (text) => {
    //Validates the phone number
    var regex = /^[0]?[456789]\d{9}$/; // Change this regex based on requirement
    return regex.test(text);
};

export const validateName = (text) => {
    //Validates the phone number
    var regex = /^[a-zA-Z ]+$/; // Change this regex based on requirement
    return regex.test(text);
};

export const validatePassword = (text) => {
    //Validates the password
    var regex = /^(?=.*[a-z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/; // Change this regex based on requirement
    return regex.test(text);
};

export const validateNumber = (text) => {
    //Validates the password
    var regex = /[0-9]$/;
    return regex.test(text);
};

export const validateFormText = (text) => {
    //Validates the password
    const regex = /^[a-zA-Z0-9\s.,!?'"()-]*$/;
    return regex.test(text);
};


import AES from 'react-native-aes-crypto';
import Config from "react-native-config";

const IV = Config.IV
const SALT = Config.SALT
const ITERATIONS = Number(Config.ITERATIONS)
const KEY_LENGTH = Number(Config.KEY_LENGTH)
const password = Config.password

async function encrypt(plainText) {
    try {
        const key = await AES.pbkdf2(password, SALT, ITERATIONS, KEY_LENGTH, 'sha1');
        const encrypted = await AES.encrypt(plainText, key, IV, 'aes-128-cbc');
        return encrypted; // Base64 string
    } catch (e) {
        console.error('Encryption failed:', e);
        return '';
    }
}

async function decrypt(encryptedBase64) {
    try {
        const key = await AES.pbkdf2(password, SALT, ITERATIONS, KEY_LENGTH, 'sha1');
        const decrypted = await AES.decrypt(encryptedBase64, key, IV, 'aes-128-cbc');
        return decrypted;
    } catch (e) {
        console.error('Decryption failed:', e);
        return '';
    }
}

export const EncryptText = async (text) => {
    let data = await encrypt(text)
    return data
}

export const DecryptText = async (text) => {
    let data = await decrypt(text)
    return data
}