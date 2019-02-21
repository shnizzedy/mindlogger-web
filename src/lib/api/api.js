import axios from 'axios';

const signIn = ({ apiHost, user, password }) => axios({
  method: 'get',
  url: `${apiHost}/user/authentication`,
  headers: { 'Girder-Authorization': `Basic ${btoa(`${user}:${password}`)}` },
});

const sendActivityData = ({ apiHost, token, data }) => axios({
  method: 'post',
  // JON TODO: fill in the route below
  url: `${apiHost}/`,
  headers: {
    'Girder-Token': token,
  },
  body: data,
});

export default { signIn, sendActivityData };
