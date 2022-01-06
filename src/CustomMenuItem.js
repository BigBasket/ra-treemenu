import React, { Fragment } from 'react';
import { useTranslate } from 'react-admin';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        icon: { minWidth: theme.spacing(5) },
        sidebarIsOpen: {
        '& a': {
            paddingLeft: theme.spacing(3),
            transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            },
        },
    sidebarIsClosed: {
        '& a': {
            paddingLeft: theme.spacing(2),
            transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            },
        },
        menuItem: {},
        menuItemName: {
            color: theme.palette.secondary
        },
        openMenuItem: {}
    }),
    { name: 'RaTreeCustomMenuItem' }
);

const CustomMenuItem = ({
    handleToggle,
    sidebarIsOpen,
    isOpen,
    name,
    icon,
    children,
    dense
}) => {
    const classes = useStyles();
    const translate = useTranslate();

    const header = (
        <MenuItem
            key={name}
            dense={dense}
            button
            onClick={handleToggle}
            className={classnames(
                classes.menuItem,
                { [classes.openMenuItem]: isOpen }
            )}
        >
            <ListItemIcon className={classes.icon}>
                {icon}
            </ListItemIcon>
            <Typography
                variant="inherit"
                className={classnames(
                    classes.menuItemName,
                    'menuItemName'
                )}
            >
                {translate(name)}
            </Typography>
            <ListItemIcon className={classes.icon}>
                {isOpen ? <ExpandMore /> : <ExpandLessIcon />}
            </ListItemIcon>
        </MenuItem>
    );

    return (
        <Fragment>
            {sidebarIsOpen || isOpen ? (
                header
            ) : (
                    <Tooltip title={translate(name)} placement="right">
                        {header}
                    </Tooltip>
                )}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    dense={dense}
                    component="div"
                    disablePadding
                    className={
                        sidebarIsOpen
                            ? classes.sidebarIsOpen
                            : classes.sidebarIsClosed
                    }
                    style={{ display: "flex", flexDirection: "column", alignItems: 'left' }}
                >
                    {children}
                </List>
            </Collapse>
        </Fragment>
    );
};

export default CustomMenuItem;