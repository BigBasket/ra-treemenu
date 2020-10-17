import React, { useState } from 'react';
import LabelIcon from '@material-ui/icons/Label';
import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItemLink, getResources, translate, DashboardMenuItem } from 'react-admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
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
        open,
        pathname,
        resources,
        translate,
        logout,
        ...rest
    } = props;
    const classes = useStyles(props);

    const handleToggle = (parent) => {
        setState(state => ({ [parent]: !state[parent] }));
    };

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
            <div style={{marginTop: '10px'}} className={classnames(classes.main, className)} {...rest}>
                {hasDashboard && <DashboardMenuItem onClick={onMenuClick} />}
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
    open: PropTypes.bool,
    pathname: PropTypes.string,
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired
};

Menu.defaultProps = {
    onMenuClick: () => null
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    resources: getResources(state),
    pathname: state.router.location.pathname
});

const enhance = compose(
    translate,
    connect(
        mapStateToProps,
        {}, // Avoid connect passing dispatch in props,
        null,
        {
            areStatePropsEqual: (prev, next) =>
                prev.resources.every(
                    (value, index) => value === next.resources[index] // shallow compare resources
                ) &&
                // eslint-disable-next-line
                prev.pathname == next.pathname &&
                // eslint-disable-next-line
                prev.open == next.open
        }
    ),
    withStyles(null)
);

export default enhance(Menu);