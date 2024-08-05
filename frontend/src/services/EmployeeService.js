import ApiService, { TOKEN_STORAGE_LOCATION } from "./ApiService.js";

export const EMPLOYEE_STORAGE_LOCATION = "EMPLOYEE";

export default class EmployeeService {
  static login(email, password) {
    return this.#requestToken("auth/login", email, password);
  }

  static register(email, password) {
    return this.#requestToken("auth/register", email, password);
  }

  static #requestToken(url, email, password) {
    return ApiService.post(url, {
      email: email,
      password: password,
    })
      .then((response) => {
        const data = response.data;

        this.#setToken(data.token);
        this.#setEmployee(data.employee);

        return Promise.resolve({
          success: true,
          user: data.employee,
        });
      })
      .catch((error) => {
        throw error.response.data.detail;
      });
  }

  static #setToken(token) {
    localStorage.setItem(TOKEN_STORAGE_LOCATION, token);
  }

  static #setEmployee(employee) {
    localStorage.setItem(EMPLOYEE_STORAGE_LOCATION, JSON.stringify(employee));
  }

  static logout() {
    localStorage.removeItem(TOKEN_STORAGE_LOCATION);
  }

  static isLoggedIn() {
    return localStorage.getItem(TOKEN_STORAGE_LOCATION) !== null;
  }

  static getEmployee() {
    return JSON.parse(localStorage.getItem(EMPLOYEE_STORAGE_LOCATION));
  }
}
