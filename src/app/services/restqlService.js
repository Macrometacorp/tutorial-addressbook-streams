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
