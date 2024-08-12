package com.interscience.planning.employee;

import com.interscience.planning.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

  @PostMapping
  public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
    if (employeeDTO.name() == null || employeeDTO.name().isBlank()) {
      throw new BadRequestException("Name is required");
    }
    if (employeeDTO.email() == null || employeeDTO.email().isBlank()) {
      throw new BadRequestException("Email is required");
    }
    if (employeeDTO.function() == null) {
      throw new BadRequestException("Function is required");
    }

    if (employeeRepository.findByEmail(employeeDTO.email()).isPresent()) {
      throw new BadRequestException("Employee with this email already exists");
    }

    Employee newEmployee =
        new Employee(employeeDTO.name(), employeeDTO.email(), null, employeeDTO.function());
    employeeRepository.save(newEmployee);
    return ResponseEntity.ok(EmployeeDTO.from(newEmployee));
  }
}
