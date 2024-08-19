package com.interscience.planning.employee;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class EmployeeController {
  private final EmployeeRepository employeeRepository;
  private final EmployeeService employeeService;

  @GetMapping
  public List<EmployeeResponseDTO> findAll() {
    return employeeService.findAll();
  }

  @PostMapping
  public ResponseEntity<EmployeeResponseDTO> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
    EmployeeResponseDTO employee = employeeService.createEmployee(employeeDTO);
    return ResponseEntity.status(201).body(employee);
  }

  @PatchMapping("{id}")
  public ResponseEntity<EmployeeResponseDTO> editEmployee(
      @PathVariable UUID id, @RequestBody EmployeeDTO employeeDTO, Authentication authentication) {
    EmployeeResponseDTO updatedEmployee =
        employeeService.editEmployee(employeeDTO, id, authentication);
    return ResponseEntity.ok(updatedEmployee);
  }

  @PatchMapping("{id}/password")
  public ResponseEntity<Void> setPassword(
      @PathVariable UUID id, @RequestBody PasswordDTO passwordDTO) {
    employeeService.setPassword(passwordDTO, id);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id, Authentication authentication) {
    employeeService.deleteEmployee(id, authentication);
    return ResponseEntity.noContent().build();
  }
}
