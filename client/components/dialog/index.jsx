/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	noop = require( 'lodash/utility/noop' ),
	debug = require( 'debug' )( 'calypso:dialog' );

/**
 * Internal dependencies
 */
var SingleChildCSSTransitionGroup = require( 'components/single-child-css-transition-group' ),
	DialogBase = require( './dialog-base' );

var Dialog = React.createClass( {
	propTypes: {
		isVisible: React.PropTypes.bool,
		baseClassName: React.PropTypes.string,
		enterTimeout: React.PropTypes.number,
		leaveTimeout: React.PropTypes.number,
		transitionLeave: React.PropTypes.bool,
		onClosed: React.PropTypes.func,
		onClickOutside: React.PropTypes.func,
		disableBackgroundScroll: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			isVisible: false,
			enterTimeout: 200,
			leaveTimeout: 200,
			transitionLeave: true,
			onClosed: noop,
			onClickOutside: noop,
			disableBackgroundScroll: false
		};
	},

	componentDidMount: function() {
		debug( 'mounting' );
		this._container = document.createElement( 'div' );
		document.body.appendChild( this._container );

		this._renderDialogBase();
	},

	componentDidUpdate: function() {
		debug( 'updating' );
		this._renderDialogBase();
	},

	componentWillUnmount: function() {
		debug( 'unmounting' );
		if ( this._container ) {
			React.unmountComponentAtNode( this._container );
			this._container.parentNode.removeChild( this._container );
			this._container = null;
		}
	},

	_renderDialogBase: function() {
		var dialogComponent = this.props.isVisible ? <DialogBase { ...this.props } key="dialog" onDialogClose={ this.onDialogClose } /> : null,
			transitionName = this.props.baseClassName || 'dialog';

		React.render(
			<SingleChildCSSTransitionGroup
				transitionName={ transitionName }
				component="div"
				transitionLeave={ this.props.transitionLeave }
				onChildDidLeave={ this.onDialogDidLeave }
				enterTimeout={ this.props.enterTimeout }
				leaveTimeout={ this.props.leaveTimeout }>
				{ dialogComponent }
			</SingleChildCSSTransitionGroup>,
			this._container
		);
	},

	render: function() {
		return null;
	},

	onDialogDidLeave: function() {
		if ( this.props.onClosed ) {
			process.nextTick( this.props.onClosed );
		}
	},

	onDialogClose: function( action ) {
		if ( this.props.onClose ) {
			this.props.onClose( action );
		}
	}
} );

module.exports = Dialog;
