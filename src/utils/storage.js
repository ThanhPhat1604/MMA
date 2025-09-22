import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData(key, value) {
    try{
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }catch (e){
        console.error("saveData error", key, e);
    }
}

export async function getData(key) {
    try{
        const json = await AsyncStorage.getItem(key);
        return json != null ? JSON.parse(json) : null;
    }catch (e) {
        console.error("getData error", key, e);
        return null;
    }
}
export async function removData(key) {
    try{
        await AsyncStorage.removeItem(key);
    }catch(e){
        console.error("removeData error", key, e);
    }
}