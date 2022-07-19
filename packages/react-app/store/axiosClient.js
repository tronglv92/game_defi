import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useRouter } from "next/router";

import { getAuth, getLocal, setAuth } from "../helpers/local";
const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const auth = getAuth();
    if (auth) {
      config.headers["Authorization"] = "bearer " + auth.token;
    }

    const request = {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      data: config.data,
    };

    console.log("interceptors request", JSON.stringify(request, null, 2));

    return config;
  },

  function (error) {
    // Do something with request error

    return error;
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("interceptors response  ", response);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log("interceptors response eror ", error);
    if (error.response.status == 401) {
      return { data: { isLogout: true } };
    }
    // if(error.)
    return Promise.reject(error);
  },
);
export default axiosClient;
