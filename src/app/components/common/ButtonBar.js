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

    // Search bar handler goes here!

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
            <div className={classes.flex}>
                {/* Search bar goes here! */}

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
        </div>
    )
}

export default ButtonBar
