<script>
import axios from 'axios';
import _ from 'lodash';

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
  const fileUploadData = {};
  const metadata = {};

  // sort out blobs from metadata
  _.map(data.responses, (val, key) => {
    if (val instanceof Blob) {
      fileUploadData[key] = val;
    } else if (_.isObject(val)) {
      // make sure there aren't any Blobs here.
      // if there are, add them to fileUploadData
      // and create a merged key?
      _.map(val, (val2, key2) => {
        if (val2 instanceof Blob) {
          fileUploadData[`${key}...${key2}`] = val2;
        } else {
          // refill the object.
          if (!metadata[key]) {
            metadata[key] = {};
          }
          metadata[key][key2] = val2;
        }
      });
    } else {
      metadata[key] = val;
    }
  });

  // append the files separately on the formmatedData object.
  _.map(fileUploadData, (val, key) => {
    formattedData.append(key, val);
    metadata[key] = {
      size: val.size,
      type: val.type,
    };
  });

  // finally, get the metadata on there.
  formattedData.append('metadata',
    JSON.stringify({ activity: data.activity,
      applet: data.applet,
      responses: metadata,
    }));
  return { formattedData };
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
const sendActivityData = ({ apiHost, token, data }) => {
  const { formattedData } = formatData(data);
  return axios({
    method: 'post',
    url: `${apiHost}/response/${data.applet}/${data.activity}`,
    headers: {
      'Content-Type': 'multipart/form-data', // 'application/x-www-form-urlencoded',
      'Girder-Token': token,
    },
    // `onDownloadProgress` allows handling of progress events for downloads
    // onDownloadProgress(progressEvent) {
    //   // Do whatever you want with the native progress event
    //   // console.log('progress', progressEvent);
    // },
    data: formattedData,
  });
};

/**
 * ## getAppletsForUser
 *
 * a route that gets the set of Applets for a given user.
 */
const getAppletsForUser = ({ apiHost, token, user, role = null }) => axios({
  method: 'get',
  url: `${apiHost}/user/${user}/applets?role=${role}`,
  headers: {
    'Girder-Token': token,
  },
});

/**
 * ## addAppletToUser
 *
 * A route that adds an Applet to a User
 * right now, an appletId is the URL to the Repronim jsonld file.
 * If the applet is already there, it shouldn't duplicate.
 */

const getActivityFromURI = ({ apiHost, token, URI }) => axios({
  method: 'get',
  url: `${apiHost}/activity?url=${URI}`,
  headers: {
    'Girder-Token': token,
  },
});

const getAppletFromURI = ({ apiHost, token, URI }) => axios({
  method: 'get',
  url: `${apiHost}/applet?url=${URI}`,
  headers: {
    'Girder-Token': token,
  },
});

const addAppletToUser = ({ apiHost, appletId, token }) => axios({
  method: 'post',
  url: `${apiHost}/applet/invite?url=${appletId}&role=user&rsvp=false`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Girder-Token': token,
  },
  data: {
    appletId,
  },
});

const getUserDataFromApplet = ({ apiHost, token, userId, appletId }) => axios({
  method: 'get',
  url: `${apiHost}/response?informant=${userId}&applet=${appletId}`,
  headers: {
    'girder-token': token,
  },
});

const getInvitation = ({ apiHost, token, invitationId }) => axios({
  method: 'get',
  url: `${apiHost}/invitation/${invitationId}?includeLink=false`,
  headers: {
    'girder-token': token,
  },
});

const acceptInvitation = ({ apiHost, token, invitationId }) => axios({
  method: 'post',
  url: `${apiHost}/invitation/${invitationId}/accept`,
  headers: {
    'girder-token': token,
  },
});

const removeInvitation = ({ apiHost, token, invitationId }) => axios({
  method: 'delete',
  url: `${apiHost}/invitation/${invitationId}`,
  headers: {
    'girder-token': token,
  },
});

export default {
  signIn,
  signUp,
  sendActivityData,
  getActivityFromURI,
  getAppletFromURI,
  getAppletsForUser,
  getUserDataFromApplet,
  addAppletToUser,
  getInvitation,
  acceptInvitation,
  removeInvitation,
};
</script>
