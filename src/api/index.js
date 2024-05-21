import axios from 'axios';

const HOST_ADDRESS = "192.168.1.9";
const HOST_PORT = 5000;
const HOST = HOST_ADDRESS + ":" + HOST_PORT;

export const login = async (username, password) => {
  let resp = {};

  try {
    console.log("http://" + HOST + "/login");
    await axios.post("http://" + HOST + "/login", {
      'username' : username,
      'password' : password
    }).then((data) => { resp = data.data; });

    return resp;
  } catch (error) {
    console.log(error);
  }
}
