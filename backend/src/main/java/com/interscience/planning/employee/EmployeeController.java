package com.interscience.planning.employee;

import com.interscience.planning.holiday.HolidayDTO;
import com.interscience.planning.ssptask.SSPTaskDto;
import java.time.LocalDate;
import java.util.*;
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

  @GetMapping("/schedules/{id}")
  public ResponseEntity<EmployeeScheduleDto> getScheduleItems(@PathVariable UUID id) {
    //    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.FRENCH);
    //    String dateInString = "06-08-2024";
    //    Date date = formatter.parse(dateInString);
    //    date.setTime(date.getTime() + 20000000L);

    LocalDate testDate = LocalDate.parse("2024-08-06");
    LocalDate firstDay = LocalDate.parse("2024-08-01");

    var testSchedule = new ArrayList<SSPTaskDto>();
    testSchedule.add(new SSPTaskDto(1, "b001", null, 3, testDate, testDate.plusDays(2)));

    testSchedule.add(new SSPTaskDto(3, "b002", null, 2, null, null));

    testSchedule.add(new SSPTaskDto(2, "b003", null, 5, testDate.plusDays(1), null));
    testSchedule.sort(Comparator.comparingInt(SSPTaskDto::index));

    var holidays = new ArrayList<HolidayDTO>();
    holidays.add(new HolidayDTO(null, firstDay.plusDays(1), firstDay.plusDays(3)));
    holidays.add(new HolidayDTO(null, testDate.plusDays(7), testDate.plusDays(7)));
    holidays.add(new HolidayDTO(null, testDate.plusDays(4), testDate.plusDays(5)));
    holidays.sort(Comparator.comparing(HolidayDTO::startDate));
    return ResponseEntity.ok(new EmployeeScheduleDto(testSchedule, holidays));
  }
}
