import React, { useRef, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles, darken, fade } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ReorderIcon from '@material-ui/icons/Reorder'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import Box from '@material-ui/core/Box'
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc'
import arrayMove from 'array-move'
import Heading from './Heading'
import { Scrollbars } from 'react-custom-scrollbars'
import InputBase from '@material-ui/core/InputBase'

const useStyles = makeStyles(theme => ({
    screensRoot: {
        // height: 200,
    },
    text: {
        lineHeight: 1,
    },
    screenSize: {
        lineHeight: 1,
        marginTop: 0,
    },
    visibilityIconInactive: {
        opacity: 0.5,
    },
    screenRow: {
        marginBottom: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        borderBottom: '1px solid #3837379e',
    },
    screenRowActions: {
        marginRight: theme.spacing(1),
    },
    screenDescription: {
        width: 150,
        color: theme.palette.secondary.main,
        '&:hover': {
            color: theme.palette.primary.main,
            cursor: 'pointer',
        },
    },
    searchInput: {
        height: 25,
        fontSize: 13,
        margin: theme.spacing(1, 0),
        padding: theme.spacing(0, 1),
        borderRadius: 3,
        background: darken(theme.palette.background.default, 0.15),
        color: fade(theme.palette.secondary.dark, 0.6),
    },
}))

const DradHandle = sortableHandle(({ children }) => children)

const Item = ({
    value: screen,
    sortIndex,
    updateVisibility,
    classes,
    onClick,
    disableSort = false,
    toggleScreenDialog,
}) => (
    <Box display="flex" alignItems="center" className={classes.screenRow}>
        <div className={classes.screenRowActions}>
            <IconButton
                onClick={() => updateVisibility(screen.id, !screen.visible)}
                size="small"
            >
                {!screen.visible && (
                    <RemoveRedEyeOutlinedIcon
                        className={classes.visibilityIconInactive}
                        fontSize="inherit"
                    />
                )}
                {screen.visible && <RemoveRedEyeIcon fontSize="inherit" />}
            </IconButton>

            {screen.visible && !disableSort && (
                <DradHandle>
                    <IconButton aria-label="sort" size="small">
                        <ReorderIcon fontSize="inherit" />
                    </IconButton>
                </DradHandle>
            )}
        </div>

        <div
            className={classes.screenDescription}
            onDoubleClick={() => toggleScreenDialog(screen)}
            onClick={() => onClick(screen.id)}
        >
            <Typography
                variant="caption"
                display={'block'}
                color="inherit"
                noWrap
                className={classes.text}
            >
                {screen.name}
            </Typography>
            <Typography
                variant="caption"
                color="inherit"
                className={classes.screenSize}
            >
                {screen.width}x{screen.height}
            </Typography>
        </div>
    </Box>
)
const SortableItem = sortableElement(Item)

const Sortable = sortableContainer(({ children }) => <div>{children}</div>)

export default props => {
    const rootRef = useRef()

    const {
        updateVisibility,
        screens,
        sortScreens,
        onClick,
        toggleScreenDialog,
    } = props

    const classes = useStyles()

    const [searchKeyword, setSearchKeyword] = useState('')

    const visibleScreens = screens.filter(screen => screen.visible)
    const invisibleScreens = screens.filter(screen => !screen.visible)

    const onSortEnd = ({ oldIndex, newIndex }) => {
        sortScreens(arrayMove(visibleScreens, oldIndex, newIndex))
    }

    const hasSearch = searchKeyword.trim('') !== ''

    const onSearchChange = e => setSearchKeyword(e.target.value)

    const searchResults = screens.filter(screen => {
        const size = `${screen.width}${screen.height}`
        return (
            screen.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            size.includes(searchKeyword.toLowerCase())
        )
    })

    return (
        <React.Fragment>
            <Heading>Screens</Heading>
            <InputBase
                value={searchKeyword}
                onChange={onSearchChange}
                className={classes.searchInput}
                placeholder={'Search for screen'}
                fullWidth
            />
            <Scrollbars style={{ height: 300 }}>
                <div ref={rootRef} className={classes.screensRoot}>
                    {hasSearch &&
                        searchResults.map(screen => (
                            <Item
                                disableSort={true}
                                key={screen.id}
                                onClick={onClick}
                                classes={classes}
                                updateVisibility={updateVisibility}
                                toggleScreenDialog={toggleScreenDialog}
                                value={screen}
                            />
                        ))}

                    {!hasSearch && (
                        <Sortable
                            lockAxis={'y'}
                            helperContainer={() => rootRef.current}
                            onSortEnd={onSortEnd}
                            useDragHandle
                        >
                            {visibleScreens.map((screen, index) => (
                                <SortableItem
                                    key={screen.id}
                                    index={index}
                                    onClick={onClick}
                                    classes={classes}
                                    updateVisibility={updateVisibility}
                                    toggleScreenDialog={toggleScreenDialog}
                                    value={screen}
                                />
                            ))}
                        </Sortable>
                    )}

                    {!hasSearch &&
                        invisibleScreens.map(screen => (
                            <Item
                                key={screen.id}
                                onClick={onClick}
                                classes={classes}
                                updateVisibility={updateVisibility}
                                toggleScreenDialog={toggleScreenDialog}
                                value={screen}
                            />
                        ))}
                </div>
            </Scrollbars>
        </React.Fragment>
    )
}
