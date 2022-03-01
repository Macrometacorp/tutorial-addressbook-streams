import { getInstance } from "./jsc8Instance"

const createStreamReader = async (streamName) => {
    let response
    try {
        const jsC8 = getInstance()
        response = await jsC8.createStreamReader(
            streamName,
            `${streamName}-${Math.round(Math.random() * 99999)}`,
            true,
            true,
            jsC8._connection._urls[0].replace("https://api-", ""),
        )
    } catch (error) {
        console.error(error)
    }
    return response
}

const createStreamProducer = async (streamName) => {
    let response
    try {
        const jsC8 = getInstance()
        response = await jsC8.createStreamProducer(
            streamName,
            true,
            true,
            jsC8._connection._urls[0].replace("https://api-", ""),
        )
    } catch (error) {
        console.error(error)
    }
    return response
}

export { createStreamReader, createStreamProducer }
