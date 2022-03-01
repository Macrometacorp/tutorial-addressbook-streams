import React, { createContext, useEffect, useState } from "react"
import { GDN_URL, DEFAULT_USERNAME, DEFAULT_REGION, ADDRESS_COLLECTION_NAME } from "../../util/constants"
import { sleep } from "../../util/helperFunctions"
import * as CollectionService from "../services/collectionService"
import { reInitClient } from "../services/jsc8Instance"

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const [jsc8Config, setJsc8Config] = useState({
        gdnUrl: GDN_URL,
        username: DEFAULT_USERNAME,
        password: "",
        bearerToken: "",
    })
    const [appConfig, setAppConfig] = useState({
        selectedRegion: DEFAULT_REGION,
        dataCenters: [{ url: GDN_URL, location: DEFAULT_REGION }],
        showLogin: true,
        showSelectDataCenter: false,
        addUpdateContact: false,
        isAppReady: false,
    })

    useEffect(() => {
        const isAppReady = async () => {
            try {
                const appCollectionExists = await CollectionService.collectionExists(ADDRESS_COLLECTION_NAME)
                if (!appCollectionExists) {
                    await CollectionService.createCollectionWithStream(ADDRESS_COLLECTION_NAME)
                    await sleep(2000)
                } else {
                    const responsePromises = appConfig.dataCenters.map(async (dc) => {
                        reInitClient(dc.url, jsc8Config.bearerToken)
                        return await CollectionService.getCollection(ADDRESS_COLLECTION_NAME)
                    })
                    const addressesCollections = await Promise.all(responsePromises)

                    const regionsWithCollectionIssue = addressesCollections.filter(
                        (response) =>
                            response.type !== 2 ||
                            response.status !== 3 ||
                            response.collectionModel !== "DOC" ||
                            response.error !== false ||
                            response.isSystem !== false ||
                            response.hasStream !== true ||
                            response.isLocal !== false ||
                            response.searchEnabled !== false,
                    )

                    if (regionsWithCollectionIssue.length) {
                        await CollectionService.deleteCollection(ADDRESS_COLLECTION_NAME)
                        await sleep(2000)
                        await CollectionService.createCollectionWithStream(ADDRESS_COLLECTION_NAME)
                    }
                }

                setAppConfig((prev) => {
                    return {
                        ...prev,
                        isAppReady: true,
                    }
                })
            } catch (error) {
                console.error("Failed to launch the app.", error)
            }
        }

        if (appConfig.dataCenters.length > 1) {
            isAppReady()
        }
    }, [jsc8Config.bearerToken, appConfig.dataCenters])

    return (
        <AppContext.Provider
            value={{
                jsc8Config,
                setJsc8Config,
                appConfig,
                setAppConfig,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
