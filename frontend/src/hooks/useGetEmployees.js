import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export function useGetEmployees(endpoint) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get(endpoint).then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return [employees, setEmployees];
}
