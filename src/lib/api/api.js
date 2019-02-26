import axios from 'axios';

/**
 * # Mindlogger API library
 *
 * This library contains the calls to the Mindlogger Girder API.
 * We explicitly define what the routes do here.
 */

/**
 * ## formatData
 *
 * a function to prepare data to be posted to an endpoint as
 * datatype FormData.
 * @param {Object} data : data to be converted into the FormData datatype
 */
const formatData = (data) => {
  const formattedData = new FormData();
  formattedData.append('metadata', JSON.stringify(data));
  return formattedData;
};

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
const signIn = ({ apiHost, user, password }) => axios({
  method: 'get',
  url: `${apiHost}/user/authentication`,
  headers: { 'Girder-Authorization': `Basic ${btoa(`${user}:${password}`)}` },
});

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
const signUp = (apiHost, body) => axios({
  method: 'post',
  url: `${apiHost}/user`,
  params: {
    ...body,
    admin: true,
  },
});


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
const sendActivityData = ({ apiHost, token, data }) => axios({
  method: 'post',
  // JON TODO: fill in the route below
  url: `${apiHost}/response`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json',
    'Girder-Token': token,
  },
  data: formatData(data),
});

/**
 * ## getAppletsForUser
 *
 * a route that gets the set of Applets for a given user.
 */
const getAppletsForUser = ({ apiHost, token }) => axios({
  method: 'get',
  url: `${apiHost}/???`, // TODO: fill in this route!
  headers: {
    'Girder-Token': token,
  },
});

export default { signIn, signUp, sendActivityData, getAppletsForUser };
