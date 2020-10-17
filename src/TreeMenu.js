import React, { useState } from 'react';
import LabelIcon from '@material-ui/icons/Label';
import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
    MenuItemLink,
    getResources,
    useTranslate, 
    translate, 
    DashboardMenuItem
} from 'react-admin';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import DefaultIcon from '@material-ui/icons/ViewList';
import CustomMenuItem from './CustomMenuItem';

const useStyles = makeStyles(
    theme => ({
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginTop: '0.5em',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.up('md')]: {
                marginTop: '1.5em',
            },
        },
    }),
    { name: 'RaTreeMenu' }
);

const Menu = (props) => {
    const {
        className,
        dense,
        hasDashboard,
        onMenuClick,
        logout,
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    const pathname = useSelector((state) => state.router.location.pathname);
    const resources = useSelector(getResources, shallowEqual);

    const handleToggle = (parent) => {
        setState(state => ({ [parent]: !state[parent] }));
    };

    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );

    const isParent = (resource) => {
        return (
            resource.options && 
            resource.options.hasOwnProperty('isMenuParent') && 
            resource.options.isMenuParent
        );
    };

    const isOrphan = (resource) =>{
        return (
            resource.options && 
            !resource.options.hasOwnProperty('menuParent') && 
            !resource.options.hasOwnProperty('isMenuParent')
        )
    };

    /**
     * Mapping independent (without a parent) entries
     */
    const mapIndependent = (independentResource) =>
        <MenuItemLink
            key={independentResource.name}
            to={`/${independentResource.name}`}
            primaryText={independentResource.options.label}
            leftIcon={
                independentResource.icon 
                    ? <independentResource.icon/> 
                    : <DefaultIcon/>
            }
            onClick={onMenuClick}
            dense={dense}
            sidebarIsOpen={open}
        />;

    const isOrpahn= resource =>{
        return resource.options && !resource.options.hasOwnProperty('menuParent') && !resource.options.hasOwnProperty('isMenuParent')
    }

    /**
     * Mapping a "parent" entry and then all its children to the "tree" layout
     */
    const mapParentStack = parentResource =>
        <CustomMenuItem
            handleToggle={() => handleToggle(parentResource.name)}
            isOpen={state[parentResource.name]}
            sidebarIsOpen={open}
            name={parentResource.options.label}
            icon={parentResource.icon ? <parentResource.icon/> : <LabelIcon/>}
            dense={dense}
        >
            {
                // eslint-disable-next-line
                resources.filter(r => r.options && r.options.hasOwnProperty('menuParent') && r.options.menuParent == parentResource.name)
                    .map(childResource => (
                        <MenuItemLink
                            key={childResource.name}
                            to={`/${childResource.name}`}
                            primaryText={childResource.options.label}
                            leftIcon={
                                childResource.icon ? <childResource.icon/> : <DefaultIcon/>
                            }
                            onClick={onMenuClick}
                            dense={dense}
                        />
                    ))
            }
        </CustomMenuItem>;

    /**
     * Mapping independent (without a parent) entries
     */
    const mapIndependent=independentResource=>
        <MenuItemLink
            key={independentResource.name}
            to={`/${independentResource.name}`}
            primaryText={independentResource.options.label}
            leftIcon={
                independentResource.icon ? <independentResource.icon/> : <DefaultIcon/>
            }
            onClick={onMenuClick}
            dense={dense}
        />;

    const initialExpansionState = {};
    let parentActiveResName = null;

    // initialize all parents to unexpanded first, and also find active resource
    resources.forEach(res => {
        if (isParent(res)) {
            initialExpansionState[res.name] = false;
        } else if (
            pathname.startsWith(`/${res.name}`) && 
            res.options.hasOwnProperty('menuParent')
        ) {
            parentActiveResName = res.options.menuParent;
        }
    });

    const [state, setState] = useState(initialExpansionState);

    /**
     * Mapping a "parent" entry and then all its children to the "tree" layout
     */
    const mapParentStack = (parentResource) =>
        <CustomMenuItem
            handleToggle={() => handleToggle(parentResource.name)}
            isOpen={state[parentResource.name] || parentActiveResName === parentResource.name}
            sidebarIsOpen={open}
            name={parentResource.options.label}
            icon={parentResource.icon ? <parentResource.icon/> : <LabelIcon/>}
            dense={dense}
        >
            {
                // eslint-disable-next-line
                resources
                    .filter((resource) => (
                        resource.options &&
                        resource.options.hasOwnProperty('menuParent') && 
                        resource.options.menuParent == parentResource.name
                    ))
                    .map((childResource) => (
                        <MenuItemLink
                            key={childResource.name}
                            to={`/${childResource.name}`}
                            primaryText={childResource.options.label}
                            leftIcon={
                                childResource.icon 
                                    ? <childResource.icon/> 
                                    : <DefaultIcon/>
                            }
                            onClick={onMenuClick}
                            dense={dense}
                            sidebarIsOpen={open}
                        />
                    ))
            }
        </CustomMenuItem>;

    const resRenderGroup = [];

    /**
     * Pushing the menu tree for rendering in the order we find them declared
     */
    resources.forEach(r => {
        if(isParent(r)){
            resRenderGroup.push(mapParentStack(r))
        }
        if(isOrphan(r)) {
            resRenderGroup.push(mapIndependent(r))
        }
    });

    return (
        <div>
            <div
                className={classnames(classes.main, className)} 
                {...rest}
            >
                {hasDashboard && (
                    <DashboardMenuItem
                        onClick={onMenuClick}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                )}
                {resRenderGroup}
            </div>
        </div>
    );
}

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
};

Menu.defaultProps = {
    onMenuClick: () => null
};


export default Menu;
