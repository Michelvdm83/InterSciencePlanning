package com.interscience.planning.employee;

import java.util.UUID;

public record EmployeeResponseDTO(String name, String email, Function function, UUID id) {
  public static EmployeeResponseDTO from(Employee employee) {
    return new EmployeeResponseDTO(
        employee.getName(), employee.getEmail(), employee.getFunction(), employee.getId());
  }
}
