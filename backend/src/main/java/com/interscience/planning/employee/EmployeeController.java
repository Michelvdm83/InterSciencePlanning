package com.interscience.planning.employee;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.holiday.HolidayDTO;
import com.interscience.planning.ssptask.SSPTaskDto;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
  public List<EmployeeResponseDTO> getAll() {
    return employeeRepository.findAllByEnabledTrue().stream()
        .map(EmployeeResponseDTO::from)
        .collect(Collectors.toList());
  }

  @PostMapping
  public ResponseEntity<EmployeeResponseDTO> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
    if (employeeDTO.name() == null || employeeDTO.name().isBlank()) {
      throw new BadRequestException("Name is required");
    }
    if (employeeDTO.email() == null || employeeDTO.email().isBlank()) {
      throw new BadRequestException("Email is required");
    }
    if (!employeeService.isValidEmail(employeeDTO.email())) {
      throw new BadRequestException("Email is not valid");
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

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id, Authentication authentication) {
    Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);
    Employee loggedInEmployee = (Employee) authentication.getPrincipal();

    if (employee.equals(loggedInEmployee)) {
      throw new BadRequestException("You can't delete yourself");
    }

    employee.setEnabled(false);
    employeeRepository.save(employee);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/schedules/{id}")
  public ResponseEntity<EmployeeScheduleDto> getScheduleItems(@PathVariable UUID id) {
    //    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.FRENCH);
    //    String dateInString = "06-08-2024";
    //    Date date = formatter.parse(dateInString);
    //    date.setTime(date.getTime() + 20000000L);

    LocalDate testDate = LocalDate.parse("2024-08-06");

    var testSchedule = new ArrayList<SSPTaskDto>();
    testSchedule.add(new SSPTaskDto(1, "b001", null, 3, testDate, testDate.plusDays(2)));

    testSchedule.add(new SSPTaskDto(3, "b002", null, 2, null, null));

    testSchedule.add(new SSPTaskDto(2, "b003", null, 5, testDate.plusDays(1), null));
    testSchedule.sort(Comparator.comparingInt(SSPTaskDto::index));

    var holidays = new ArrayList<HolidayDTO>();
    holidays.add(new HolidayDTO(null, testDate, testDate.plusDays(3)));
    holidays.add(new HolidayDTO(null, testDate.plusDays(7), testDate.plusDays(7)));
    holidays.add(new HolidayDTO(null, testDate.plusDays(1), testDate.plusDays(2)));
    holidays.sort(Comparator.comparing(HolidayDTO::startDate));
    return ResponseEntity.ok(new EmployeeScheduleDto(testSchedule, holidays));
  }
}
