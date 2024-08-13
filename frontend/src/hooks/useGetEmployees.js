import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export function useGetEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return [employees, setEmployees];
}
