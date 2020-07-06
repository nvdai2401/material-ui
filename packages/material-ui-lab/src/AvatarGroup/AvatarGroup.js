import * as React from 'react';
import PropTypes from 'prop-types';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { chainPropTypes } from '@material-ui/utils';

const SPACINGS = {
  small: -16,
  medium: null,
};

export const styles = (theme) => ({
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
  },
  /* Styles applied to the avatar elements. */
  avatar: {
    border: `2px solid ${theme.palette.background.default}`,
  },
  /* Styles applied to the avatar elements when direction is left to right. */
  ltrAvatar: {
    marginLeft: -8,
    '&:first-child': {
      marginLeft: 0,
    },
  },
  /* Styles applied to the avatar elements when direction is right to left. */
  rtlAvatar: {
    marginRight: -8,
    '&:first-child': {
      marginRight: 0,
    },
  },
});

const AvatarGroup = React.forwardRef(function AvatarGroup(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    max = 5,
    spacing = 'medium',
    direction = 'ltr',
    ...other
  } = props;
  const clampedMax = max < 2 ? 2 : max;
  const children = React.Children.toArray(childrenProp).filter((child) => {
    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "Material-UI: The AvatarGroup component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n'),
        );
      }
    }

    return React.isValidElement(child);
  });

  const extraAvatars = children.length > clampedMax ? children.length - clampedMax + 1 : 0;

  const margin = spacing && SPACINGS[spacing] !== undefined ? SPACINGS[spacing] : -spacing;

  return (
    <div
      className={clsx(classes.root, className)}
      style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : undefined }}
      ref={ref}
      {...other}
    >
      {children.slice(0, children.length - extraAvatars).map((child, index) => {
        return React.cloneElement(child, {
          className: clsx(
            child.props.className,
            classes.avatar,
            direction === 'ltr' ? classes.ltrAvatar : classes.rtlAvatar,
          ),
          style: {
            zIndex: children.length - index,
            marginLeft: direction === 'ltr' && (index === 0 ? undefined : margin),
            marginRight: direction === 'rtl' && (index === 0 ? undefined : margin),
            ...child.props.style,
          },
        });
      })}
      {extraAvatars ? (
        <Avatar
          className={clsx(
            classes.avatar,
            direction === 'ltr' ? classes.ltrAvatar : classes.rtlAvatar,
          )}
          style={{
            zIndex: 0,
            marginLeft: direction === 'ltr' ? margin : undefined,
            marginRight: direction === 'rtl' ? margin : undefined,
          }}
        >
          +{extraAvatars}
        </Avatar>
      ) : null}
    </div>
  );
});

AvatarGroup.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The avatars to stack.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Group direction.
   */
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  /**
   * Max avatars to show before +x.
   */
  max: chainPropTypes(PropTypes.number, (props) => {
    if (props.max < 2) {
      throw new Error(
        [
          'Material-UI: The prop `max` should be equal to 2 or above.',
          'A value below is clamped to 2.',
        ].join('\n'),
      );
    }
  }),
  /**
   * Spacing between avatars.
   */
  spacing: PropTypes.oneOfType([PropTypes.oneOf(['medium', 'small']), PropTypes.number]),
};

export default withStyles(styles, { name: 'MuiAvatarGroup' })(AvatarGroup);
