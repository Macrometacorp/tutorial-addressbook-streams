import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material"
import { makeStyles } from "@mui/styles"
import React, { useEffect, useRef, useState } from "react"
import { CloseRounded, EditRounded } from "@mui/icons-material"
import { parseMessage } from "../../util/helperFunctions"
import { createStreamReader } from "../services/streamsService"
import { ADDRESS_COLLECTION_NAME, DOCUMENT_OPERATIONS, RESTQL } from "../../util/constants"
import { executeQuery } from "../services/restqlService"
import useApp from "../../hooks/useApp"
import useContact from "../../hooks/useContact"
import useSnackbarAlert from "../../hooks/useSnackbarAlert"

const useStyles = makeStyles({
    tableCell: {
        textTransform: "uppercase",
        fontWeight: "600 !important",
    },
})

const AddressBookTable = () => {
    const classes = useStyles()
    const { setContact, addressBookData, setAddressBookData } = useContact()
    const { setAlert } = useSnackbarAlert()
    const {
        appConfig: { isAppReady, selectedRegion, showLogin, showSelectDataCenter },
        setAppConfig,
    } = useApp()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [triggerUseEffect, setTriggerUseEffect] = useState(0)

    const streamConsumer = useRef()
    const streamProducer = useRef()

    const setAlertMessage = (message, severity = "error") => {
        setAlert({
            message,
            severity,
            open: true,
        })
    }

    const updateAddressBookData = (data, operation) => {
        switch (operation) {
            case DOCUMENT_OPERATIONS.UPDATE:
                setAddressBookData((prev) => {
                    const index = prev.findIndex((_data) => _data._key === data._key)
                    prev.splice(index, 1, data)
                    return prev
                })
                break
            case DOCUMENT_OPERATIONS.DELETE:
                setAddressBookData((prev) => {
                    const index = prev.findIndex((_data) => _data._key === data._key)
                    if (index > -1) {
                        prev.splice(index, 1)
                    }
                    return prev
                })
                break
            default:
                setAddressBookData((prev) => [data, ...prev])

                break
        }
        setTriggerUseEffect(Math.random())
    }

    const messageManipulation = (message) => {
        const { data } = parseMessage(message)
        if (!data || !Object.keys(data).length) return

        updateAddressBookData(data, JSON.parse(message).properties.op)
    }

    const closeWsConnections = async () => {
        console.info("Terminating websocket connections")
        if (streamConsumer.current) {
            streamConsumer.current.terminate()
        }

        if (streamProducer.current) {
            streamProducer.current.terminate()
        }
    }

    const addEventListener = (wsConnection, streamName, type) => {
        wsConnection.current.on("open", () => console.log(`${type}: Connection open for ${streamName}`))
        wsConnection.current.on("close", () => console.log(`${type}: Connection close for ${streamName}`))
        wsConnection.current.on("error", (error) => {
            closeWsConnections()
            setAlertMessage("Failed to establish collection stream connection.")
        })
    }

    const establishStreamConsumerConnection = async (streamName) => {
        try {
            streamConsumer.current = await createStreamReader(streamName)
            addEventListener(streamConsumer, streamName, "Consumer")

            streamConsumer.current.on("message", (event) => {
                streamConsumer.current.send(JSON.stringify({ messageId: JSON.parse(event).messageId }))
                messageManipulation(event)
            })
        } catch (error) {
            console.error("error", error)
        }
    }

    const getInitialData = async () => {
        try {
            const response = await executeQuery(RESTQL.GET_CONTACTS)
            setAddressBookData((prev) => [...response, ...prev])
        } catch (error) {
            setAlertMessage("Failed to get all contacts.")
        }
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const editContact = (contact) => {
        setContact({
            _key: contact._key,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
        })
        setAppConfig((prev) => {
            return {
                ...prev,
                addUpdateContact: true,
            }
        })
    }

    const removeContact = async (contact) => {
        try {
            await executeQuery(RESTQL.REMOVE_CONTACT, { _key: contact._key })
            setAlertMessage("Contact removed successfully.", "success")
        } catch (error) {
            setAlertMessage("Failed to remove contact.")
        }
    }

    useEffect(() => {
        const init = async () => {
            setAddressBookData([])
            await getInitialData()
            await closeWsConnections()
            await establishStreamConsumerConnection(ADDRESS_COLLECTION_NAME)
        }

        if (isAppReady && selectedRegion && !showLogin && !showSelectDataCenter) {
            init()
        }
    }, [isAppReady, selectedRegion, showLogin, showSelectDataCenter])

    useEffect(() => {}, [triggerUseEffect])
    return (
        <Container sx={{ maxWidth: "100% !important", px: "8rem !important" }}>
            <Paper>
                <TableContainer>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
                                <TableCell width={"12%"} className={classes.tableCell} align="left">
                                    Key
                                </TableCell>
                                <TableCell width={"20%"} className={classes.tableCell} align="left">
                                    First Name
                                </TableCell>
                                <TableCell width={"20%"} className={classes.tableCell} align="left">
                                    Last Name
                                </TableCell>
                                <TableCell width={"26%"} className={classes.tableCell} align="left">
                                    Email
                                </TableCell>
                                <TableCell width={"22%"} className={classes.tableCell} align="left">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addressBookData.length ? (
                                addressBookData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((_data, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                "&:hover, &:focus, &:active": {
                                                    backgroundColor: "rgba(145, 158, 171, 0.08)",
                                                },
                                            }}
                                        >
                                            <TableCell>{_data._key}</TableCell>
                                            <TableCell align="left">{_data.firstName}</TableCell>
                                            <TableCell align="left">{_data.lastName}</TableCell>
                                            <TableCell align="left">{_data.email}</TableCell>
                                            <TableCell align="left">
                                                <Button
                                                    sx={{ mr: "2rem" }}
                                                    size="small"
                                                    variant="text"
                                                    color="primary"
                                                    onClick={() => editContact(_data)}
                                                >
                                                    <EditRounded sx={{ pr: "5px" }} fontSize="small" /> Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    color="error"
                                                    onClick={() => removeContact(_data)}
                                                >
                                                    <CloseRounded sx={{ pr: "5px" }} />
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontSize: "1rem", fontWeight: "600" }}>
                                        No contacts available
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[rowsPerPage]}
                        component="div"
                        count={addressBookData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            </Paper>
        </Container>
    )
}

export default AddressBookTable
