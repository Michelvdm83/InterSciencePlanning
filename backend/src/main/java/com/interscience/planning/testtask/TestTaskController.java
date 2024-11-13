package com.interscience.planning.testtask;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.NotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
@RequestMapping("api/v1/fttasks")
public class TestTaskController {
  private final TestTaskRepository testTaskRepository;
  private final EmployeeRepository employeeRepository;

  @GetMapping("/by-employee/{employeeId}")
  public List<TestTaskAssignedDto> getAllByEmployeeId(@PathVariable UUID employeeId) {
    Employee employee = employeeRepository.findById(employeeId).orElseThrow(NotFoundException::new);
    return testTaskRepository.findByEmployee(employee).stream()
        .map(TestTaskAssignedDto::from)
        .toList();
  }
}
