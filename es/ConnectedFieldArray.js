import _mapValues from 'lodash-es/mapValues';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component, PropTypes, createElement } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createFieldArrayProps from './createFieldArrayProps';

import plain from './structure/plain';

var propsToNotUpdateFor = ['_reduxForm', 'value'];

var createConnectedFieldArray = function createConnectedFieldArray(_ref) {
  var deepEqual = _ref.deepEqual;
  var getIn = _ref.getIn;
  var size = _ref.size;


  var getSyncError = function getSyncError(syncErrors, name) {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncErrors, name + '._error');
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    // For an array, the warning can _ONLY_ be under _warning.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncWarnings, name + '._warning');
  };

  var ConnectedFieldArray = function (_Component) {
    _inherits(ConnectedFieldArray, _Component);

    function ConnectedFieldArray() {
      _classCallCheck(this, ConnectedFieldArray);

      return _possibleConstructorReturn(this, (ConnectedFieldArray.__proto__ || Object.getPrototypeOf(ConnectedFieldArray)).apply(this, arguments));
    }

    _createClass(ConnectedFieldArray, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var _this2 = this;

        var nextPropsKeys = Object.keys(nextProps);
        var thisPropsKeys = Object.keys(this.props);
        return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
          // useful to debug rerenders
          // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
          //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
          // }
          var propsNotEqual = !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this2.props[prop], nextProps[prop]);

          if (!propsNotEqual && prop === 'state') {
            var statePropsToCheck = ['touched', 'autofilled', 'active', 'visited'];

            return statePropsToCheck.some(function (statePropToCheck) {
              if (_this2.props[prop] && nextProps[prop]) {
                return !deepEqual(_this2.props[prop][statePropToCheck], nextProps[prop][statePropToCheck]);
              }

              return false;
            });
          }

          return propsNotEqual;
        });
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        return this.refs.renderedComponent;
      }
    }, {
      key: 'render',
      value: function render() {
        /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_reduxForm$" }]*/
        var _props = this.props;
        var component = _props.component;
        var withRef = _props.withRef;
        var name = _props.name;
        var _reduxForm = _props._reduxForm;

        var rest = _objectWithoutProperties(_props, ['component', 'withRef', 'name', '_reduxForm']);

        var props = createFieldArrayProps(getIn, name, _extends({}, rest, {
          name: name
        }));
        if (withRef) {
          props.ref = 'renderedComponent';
        }
        return createElement(component, props);
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.props.dirty;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.props.pristine;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.props.value;
      }
    }]);

    return ConnectedFieldArray;
  }(Component);

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    props: PropTypes.object
  };

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  };

  var connector = connect(function (state, ownProps) {
    var name = ownProps.name;
    var _ownProps$_reduxForm = ownProps._reduxForm;
    var initialValues = _ownProps$_reduxForm.initialValues;
    var getFormState = _ownProps$_reduxForm.getFormState;

    var formState = getFormState(state);
    var initial = getIn(formState, 'initial.' + name) || initialValues && getIn(initialValues, name);
    var value = getIn(formState, 'values.' + name);
    var submitting = getIn(formState, 'submitting');
    var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
    var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
    var pristine = deepEqual(value, initial);
    return {
      asyncError: getIn(formState, 'asyncErrors.' + name + '._error'),
      dirty: !pristine,
      pristine: pristine,
      state: getIn(formState, 'fields.' + name),
      submitError: getIn(formState, 'submitErrors.' + name + '._error'),
      submitting: submitting,
      syncError: syncError,
      syncWarning: syncWarning,
      value: value,
      length: size(value)
    };
  }, function (dispatch, ownProps) {
    var name = ownProps.name;
    var _reduxForm = ownProps._reduxForm;
    var arrayInsert = _reduxForm.arrayInsert;
    var arrayMove = _reduxForm.arrayMove;
    var arrayPop = _reduxForm.arrayPop;
    var arrayPush = _reduxForm.arrayPush;
    var arrayRemove = _reduxForm.arrayRemove;
    var arrayRemoveAll = _reduxForm.arrayRemoveAll;
    var arrayShift = _reduxForm.arrayShift;
    var arraySplice = _reduxForm.arraySplice;
    var arraySwap = _reduxForm.arraySwap;
    var arrayUnshift = _reduxForm.arrayUnshift;

    return _mapValues({
      arrayInsert: arrayInsert,
      arrayMove: arrayMove,
      arrayPop: arrayPop,
      arrayPush: arrayPush,
      arrayRemove: arrayRemove,
      arrayRemoveAll: arrayRemoveAll,
      arrayShift: arrayShift,
      arraySplice: arraySplice,
      arraySwap: arraySwap,
      arrayUnshift: arrayUnshift
    }, function (actionCreator) {
      return bindActionCreators(actionCreator.bind(null, name), dispatch);
    });
  }, undefined, { withRef: true });
  return connector(ConnectedFieldArray);
};

export default createConnectedFieldArray;