import ApiService, { TOKEN_STORAGE_LOCATION } from "./ApiService.js";

export const EMPLOYEE_FUNCTION_STORAGE_LOCATION = "EMPLOYEE_FUNCTION";

export default class EmployeeService {
  static login(email, password) {
    return this.#requestToken("auth/login", email, password);
  }

  static #requestToken(url, email, password) {
    return ApiService.post(url, {
      email: email,
      password: password,
    })
      .then((response) => {
        const data = response.data;

        this.#setToken(data.token);
        this.#setEmployeeFunction(data.employee.function);

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

  static #setEmployeeFunction(employeeFunction) {
    localStorage.setItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION, employeeFunction);
  }

  static logout() {
    localStorage.removeItem(TOKEN_STORAGE_LOCATION);
    localStorage.removeItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION);
  }

  static isLoggedIn() {
    return localStorage.getItem(TOKEN_STORAGE_LOCATION) !== null;
  }

  static getEmployeeFunction() {
    return localStorage.getItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION);
  }
}