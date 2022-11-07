import React from "react"
import debounce from "lodash/debounce"
import { Button, Chip, InputAdornment, TextField, Typography } from "@mui/material"
import { LocationOnRounded, SearchRounded } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"

import useApp from "../../../hooks/useApp"
import useContact from "../../../hooks/useContact"
import { executeRestql } from "../../services/restqlService"

const useStyles = makeStyles({
    flex: {
        display: "flex",
        alignItems: "center"
    },
    root: {
        display: "flex",
        backgroundColor: "#fff",
        borderBottom: "1px solid rgba(197, 200, 209, .5)",
        marginBottom: "0.5rem",
        padding: "0.5rem 1rem",
        alignItems: "center",
        justifyContent: "space-between",
    },
})

const ButtonBar = () => {
    const classes = useStyles()
    const {
        setAppConfig,
        appConfig: { selectedRegion },
    } = useApp()

    const { setAddressBookData } = useContact()
    
    // This is the search enabled Query Worker that will power adding search to the app. Uncomment line 37 - 42 
    // const getContactsBySearchTerm = debounce(async (searchTerm) => {
    //     const response = await executeRestql("getContactBySearchTerm", {
    //         searchTerm: searchTerm.toLowerCase() 
    //     })
    //     setAddressBookData(response)
    // }, 400)

    return (
        <div className={classes.root}>
            <div className={classes.flex}>
                <Typography variant="subtitle1" sx={{ mr: "0.5rem" }}>
                    Region: <Chip label={selectedRegion} icon={<LocationOnRounded />} />
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                        setAppConfig((prev) => {
                            return {
                                ...prev,
                                showSelectDataCenter: true,
                            }
                        })
                    }}
                >
                    Change Region
                </Button>
            </div>
            {/* This code block add a search UI to the header. To enable it uncomment line 67 - 82. Also uncomment the div at line 100 */}
            {/* <div className={classes.flex}>
                <TextField
                    sx={{mr: 2}}
                    hiddenLabel
                    variant="outlined"
                    size="small"
                    placeholder="Search Contact"
                    onChange={(event) => { getContactsBySearchTerm(event.target.value)}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchRounded />
                            </InputAdornment>
                        )
                    }}
                /> */}

                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                        setAppConfig((prev) => {
                            return {
                                ...prev,
                                addUpdateContact: true,
                            }
                        })
                    }}
                >
                    Add Contact
                </Button>
            </div>
        // </div>
    )
}

export default ButtonBar
