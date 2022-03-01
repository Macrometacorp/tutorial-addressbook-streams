const parseMessage = (msg) => {
    const encodedMessage = JSON.parse(msg).payload
    const messageId = JSON.parse(msg).messageId
    const decodedMessage = atob(encodedMessage)

    if (decodedMessage.length === 0) {
        return { data: {}, messageId }
    }
    const data = JSON.parse(decodedMessage)
    return { data, messageId }
}

const generateDcList = (dataCentersInfo) => {
    return dataCentersInfo.reduce((dataCenters, _dcInfo) => {
        dataCenters.push({
            location: `${_dcInfo.locationInfo.city}, ${_dcInfo.locationInfo.countrycode}`,
            url: `https://${_dcInfo.locationInfo.url}`,
        })
        return dataCenters
    }, [])
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export { parseMessage, generateDcList, sleep }
