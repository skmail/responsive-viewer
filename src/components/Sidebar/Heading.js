import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    root: {
        textTransform: 'uppercase',
        fontSize: 12,
        marginTop: theme.spacing(2),
        color: theme.palette.secondary.dark,
    },
}))

export const Heading = ({ children }) => {
    const classes = useStyles()

    return (
        <Typography variant={'subtitle2'} className={classes.root}>
            {children}
        </Typography>
    )
}

export default Heading
