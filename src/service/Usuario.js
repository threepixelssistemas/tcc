import AsyncStorage from '@react-native-community/async-storage';
import { DEFAULT_USER_STRUCT } from '../config/helper'

async function getUser() {

    const user = await AsyncStorage.getItem('user')

    if (user === null) {
        let user = DEFAULT_USER_STRUCT
        await AsyncStorage.setItem('user', JSON.stringify(user))
        return user
    }

    let parsed = await JSON.parse(user)
    return parsed
}

export default getUser;
