package com.interscience.planning.employee;

public record EmployeeDTO(String name, String email, Function function) {
  public static EmployeeDTO from(Employee employee) {
    return new EmployeeDTO(employee.getName(), employee.getEmail(), employee.getFunction());
  }
}
