import axios from 'axios';

const formatData = (data) => {
  var formattedData = new FormData();
  formattedData.append('metadata', JSON.stringify(data));
  return(formattedData)
};

const signIn = ({ apiHost, user, password }) => axios({
  method: 'get',
  url: `${apiHost}/user/authentication`,
  headers: { 'Girder-Authorization': `Basic ${btoa(`${user}:${password}`)}` },
});

const sendActivityData = ({ apiHost, token, data }) => axios({
  method: 'post',
  // JON TODO: fill in the route below
  url: `${apiHost}/response`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    //'Accept': 'application/json',
    //'Content-Type': 'application/json',
    'Girder-Token': token,
  },
  data: formatData(data),
});

export default { signIn, sendActivityData };
