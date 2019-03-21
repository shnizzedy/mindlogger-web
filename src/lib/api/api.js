'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * # Mindlogger API library
 *
 * This library contains the calls to the Mindlogger Girder API.
 * We explicitly define what the routes do here.
 */

/**
 * ## signIn
 *
 * this route signs in a user, given a set of parameters.
 * @param {Object} params: Object that contains keys
 * `apiHost` the URL to the girder server, usually ending with
 * /api/v1.
 * `user` : the username
 * `password` : the password
 */
var signIn = function signIn(_ref) {
  var apiHost = _ref.apiHost,
      user = _ref.user,
      password = _ref.password;
  return (0, _axios2.default)({
    method: 'get',
    url: apiHost + '/user/authentication',
    headers: { 'Girder-Authorization': 'Basic ' + btoa(user + ':' + password) }
  });
};

/**
 * ## signUp
 *
 * sign up route to mindlogger-backend
 * @param {String} apiHost : string URL to mindlogger-server/api/v1
 * @param {Object} body : object that looks like:
 * ```javascript
 *  {
 *    email: this.form.email,
 *    password: this.form.password,
 *    login: this.form.login,
 *    firstName: this.form.firstName,
 *    lastName: this.form.lastName,
 *  }```
 */
var signUp = function signUp(apiHost, body) {
  return (0, _axios2.default)({
    method: 'post',
    url: apiHost + '/user',
    params: _extends({}, body, {
      admin: true
    })
  });
};

/**
 * ## sendActivityData
 *
 * a route that sends the data of a given activity for a
 * given user to the girder-server.
 * @param {Object} params: Object that contains keys
 * `apiHost` the URL to the girder server, usually ending with
 * /api/v1.
 * `token` : the girder token from authentication
 * `data` : an Object with keys as the jsonld URL and
 * values are the responses (in whatever form they take).
 */
var sendActivityData = function sendActivityData(_ref2) {
  var apiHost = _ref2.apiHost,
      token = _ref2.token,
      data = _ref2.data;
  return (0, _axios2.default)({
    method: 'post',
    // JON TODO: fill in the route below
    url: apiHost + '/',
    headers: {
      'Girder-Token': token
    },
    body: data
  });
};

exports.default = { signIn: signIn, signUp: signUp, sendActivityData: sendActivityData };
module.exports = exports['default'];

//# sourceMappingURL=api.js.map