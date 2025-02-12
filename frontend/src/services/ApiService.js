import axios from "axios";
import EmployeeService from "./EmployeeService";
import { apiUrl } from "../configuration.js";

const API_URL = apiUrl + "/api/v1";
//const API_URL = import.meta.env.VITE_API_URL + "/api/v1";
//const API_URL = "http://localhost:8080/api/V1";

export const TOKEN_STORAGE_LOCATION = "JWT";

export default class ApiService {
  static get(url, params) {
    return this.#doRequest("get", url, null, { params: params });
  }

  static post(url, data) {
    return this.#doRequest("post", url, data);
  }

  static patch(url, data) {
    return this.#doRequest("patch", url, data);
  }

  static put(url, data) {
    return this.#doRequest("put", url, data);
  }

  static delete(url) {
    return this.#doRequest("delete", url, null);
  }

  static #doRequest(method, url, data, otherConfig) {
    return axios
      .request(this.#getConfig(method, url, data, otherConfig))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          EmployeeService.logout();
        }
        return Promise.reject(error);
      });
  }

  static #getConfig(method, url, data, otherConfig) {
    const defaultConfig = {
      method: method,
      url: url,
      data: data,
      baseURL: API_URL,
      headers: this.#getHeaders(),
    };
    return { ...defaultConfig, ...otherConfig };
  }

  static #getHeaders() {
    let token = localStorage.getItem(TOKEN_STORAGE_LOCATION);

    if (token == null) return {};
    return {
      Authorization: "Bearer " + token,
    };
  }
}
