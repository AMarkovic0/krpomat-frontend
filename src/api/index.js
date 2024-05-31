import axios from 'axios';

import { TOKEN, refreshPage } from '../utils';

const HOST_ADDRESS = "192.168.1.9";
const HOST_PORT = 5000;
const HOST = HOST_ADDRESS + ":" + HOST_PORT;

function handle401(error) {
  if (typeof error.response === 'undefined') {
    return;
  }

  if (error.response.status === 401) {
    const usr = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (token === null) {
        localStorage.setItem("isAuth", false);
        refreshPage();
    }

    refresh(usr, token);
  }
}

export const login = async (username, password) => {
  let resp = {};

  try {
    await axios.post("http://" + HOST + "/login", {
      'username' : username,
      'password' : password
    }).then((data) => { resp = data.data; });

    return resp;
  } catch (error) {
    localStorage.setItem("isAuth", false);
  }
}

export const refresh = async (username, token) => {
  let resp = {};

  try {
    await axios.post("http://" + HOST + "/refresh", {
      'username' : username,
      'token' : token
    }).then((data) => { resp = data.data; });

    return resp;
  } catch (error) {
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
  let resp = [];

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    handle401(error);
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
  let resp = [];

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    handle401(error);
  });

  return resp;
}

export const addMachine = async (machine_id, machine_name, username) => {
  if (typeof username === 'undefined') {
    username = localStorage.getItem("username");
  }

  let token = localStorage.getItem(TOKEN());
  let data = {
    id: +machine_id,
    machine_name: machine_name,
    username: username
  };
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/AddMachine',
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    },
    data: data
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    resp = error;
  });

  return resp;
}

export const editMachine = async (machine_id, machine_name) => {
  let token = localStorage.getItem(TOKEN());
  let data = {
    id: +machine_id,
    machine_name: machine_name
  };
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/EditMachineName',
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    },
    data: data
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    resp = error;
  });

  return resp;
}

export const deleteMachine = async (machine_id) => {
  let token = localStorage.getItem(TOKEN());
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/DeleteMachine/' + machine_id.toString(),
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    }
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    resp = error;
  });

  return resp;
}

export const addUser = async (name, pass) => {
  let token = localStorage.getItem(TOKEN());
  let data = {
    username: name,
    password: pass
  };
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://' + HOST + '/AddUser',
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-HTTP-Method-Override' : 'GET'
    },
    data: data
  };
  let resp = {};

  await axios.request(config)
  .then((response) => {
    resp = response.data;
  })
  .catch((error) => {
    resp = error;
  });

  return resp;
}

