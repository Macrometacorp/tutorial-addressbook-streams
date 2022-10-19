import { getInstance } from "./jsc8Instance"

export const executeQuery = async (query, params = {}) => {
    let restqlResponse = []
    try {
        const jsC8 = getInstance()
        restqlResponse = await jsC8.executeQuery(query, params)
        return restqlResponse
    } catch (error) {
        console.error("Failed to execute", error.message)
        return restqlResponse
    }
}

export const executeRestql = async (name, params = {}) => {
    try {
        const jsC8 = getInstance()
        const { result } = await jsC8.executeRestql(name, params);
        return result;
    } catch (error) {
        console.error("Failed to execute", error.message)
        return [];
    }
};
