package com.interscience.planning.employee;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class EmployeeController {
  private final EmployeeRepository employeeRepository;
  private final EmployeeService employeeService;
  private final PasswordEncoder passwordEncoder;

  @GetMapping
  public Iterable<Employee> getAll() {
    return employeeRepository.findAll();
  }

  @PostMapping
  public ResponseEntity<EmployeeResponseDTO> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
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
    return ResponseEntity.ok(EmployeeResponseDTO.from(newEmployee));
  }

  @PatchMapping("{id}")
  public ResponseEntity<Void> setPassword(
      @PathVariable UUID id, @RequestBody PasswordDTO passwordDTO) {
    Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);

    if (passwordDTO.password() == null || passwordDTO.password().isBlank()) {
      throw new BadRequestException("Password is required");
    }
    if (!employeeService.isValidPassword(passwordDTO.password())) {
      throw new BadRequestException("Password is invalid");
    }
    employee.setPassword(passwordEncoder.encode(passwordDTO.password()));
    employeeRepository.save(employee);
    return ResponseEntity.ok().build();
  }
}
