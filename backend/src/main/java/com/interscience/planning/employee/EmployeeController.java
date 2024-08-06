package com.interscience.planning.employee;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class EmployeeController {
  private final EmployeeRepository employeeRepository;

  @GetMapping
  public Iterable<Employee> getAll() {
    return employeeRepository.findAll();
  }
}
