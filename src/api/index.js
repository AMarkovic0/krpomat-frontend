import axios from 'axios';

import { TOKEN } from '../utils';

const HOST_ADDRESS = "192.168.1.9";
const HOST_PORT = 5000;
const HOST = HOST_ADDRESS + ":" + HOST_PORT;

export const login = async (username, password) => {
  let resp = {};

  try {
    await axios.post("http://" + HOST + "/login", {
      'username' : username,
      'password' : password
    }).then((data) => { resp = data.data; });

    return resp;
  } catch (error) {
    console.log(error);
  }
}

export const getSales = async (salesData) => {
  let token = localStorage.getItem(TOKEN());
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/Sales',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    },
    data: JSON.stringify(salesData)
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    console.log(error);
  });

  return resp;
}

export const getMachines = async () => {
  let token = localStorage.getItem(TOKEN());
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/Machines',
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    },
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    console.log(error);
  });

  return resp;
}
