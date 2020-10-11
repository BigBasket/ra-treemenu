import React, { useState } from 'react';
import LabelIcon from '@material-ui/icons/Label';
import { MenuItemLink, getResources, translate, DashboardMenuItem } from 'react-admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import DefaultIcon from '@material-ui/icons/ViewList';
import CustomMenuItem from './CustomMenuItem';

const Menu = ({
    classes,
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
}) => {

    const handleToggle = (parent) => {
        setState(state => ({ [parent]: !state[parent] }));
    };

    const isParent = (resource) => {
        return resource.options && resource.options.hasOwnProperty('isMenuParent') && resource.options.isMenuParent;
    }

    const initialExpansionState = {};
    resources.forEach(res => {
        if (isParent(res)) {
            initialExpansionState[res.name] = false;
        }
    });
    const [state, setState] = useState(initialExpansionState);
    const resRenderGroup = [];
    /**
     * Pushing the menu tree for rendering
     */
    resRenderGroup.push(
        resources.filter(r => isParent(r))
            .map(parentResource => (
                <CustomMenuItem
                    handleToggle={() => handleToggle(parentResource.name)}
                    isOpen={state[parentResource.name]}
                    sidebarIsOpen={open}
                    name={parentResource.options.label}
                    icon={parentResource.icon ? <parentResource.icon /> : <LabelIcon />}
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
                                        childResource.icon ? <childResource.icon /> : <DefaultIcon />
                                    }
                                    onClick={onMenuClick}
                                    dense={dense}
                                />
                            ))
                    }
                </CustomMenuItem>
            ))
    );
    /**
     * Pushing the orphan resources for rendering
     * below other menu items
     */
    resRenderGroup.push(
        resources.filter(r => r.options && !r.options.hasOwnProperty('menuParent') && !r.options.hasOwnProperty('isMenuParent') && (r.options.hasOwnProperty('menu') ? r.options.menu : true))
            .map(independentResource => (
                <MenuItemLink
                    key={independentResource.name}
                    to={`/${independentResource.name}`}
                    primaryText={independentResource.options.label}
                    leftIcon={
                        independentResource.icon ? <independentResource.icon /> : <DefaultIcon />
                    }
                    onClick={onMenuClick}
                    dense={dense}
                />
            ))
    );
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