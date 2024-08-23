package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
@RequestMapping("api/v1/holidays")
public class HolidayController {
  private final HolidayRepository holidayRepository;
  private final EmployeeRepository employeeRepository;

  @GetMapping
  public List<HolidayResponseDTO> getAll() {
    return holidayRepository.findAllByEndDateGreaterThanEqual(LocalDate.now()).stream()
        .sorted(Comparator.comparing(Holiday::getStartDate))
        .map(HolidayResponseDTO::from)
        .toList();
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteHoliday(@PathVariable UUID id) {
    Holiday holiday = holidayRepository.findById(id).orElseThrow(NotFoundException::new);
    holidayRepository.delete(holiday);
    return ResponseEntity.noContent().build();
  }

  @PostMapping
  public ResponseEntity<HolidayResponseDTO> addHoliday(@RequestBody HolidayDTO holidayDTO) {
    if (holidayDTO.employeeId() == null) {
      throw new BadRequestException("EmployeeId can't be null");
    }
    Employee employee =
        employeeRepository.findById(holidayDTO.employeeId()).orElseThrow(NotFoundException::new);

    if (holidayDTO.startDate() == null) {
      throw new BadRequestException("Start date can't be null");
    }
    if (holidayDTO.endDate() == null) {
      throw new BadRequestException("End date can't be null");
    }
    if (holidayDTO.startDate().isAfter(holidayDTO.endDate())) {
      throw new BadRequestException("Start date can't be after end date");
    }

    Holiday newHoliday = new Holiday(employee, holidayDTO.startDate(), holidayDTO.endDate());
    Holiday newHolidayMerged = mergeHolidaysIfOverlapping(newHoliday, employee);
    holidayRepository.save(newHolidayMerged);

    return ResponseEntity.status(201).body(HolidayResponseDTO.from(newHolidayMerged));
  }

  private Holiday mergeHolidaysIfOverlapping(Holiday newHoliday, Employee employee) {
    List<Holiday> existingHolidays = holidayRepository.findByEmployeeId(employee.getId());

    for (Holiday h : existingHolidays) {
      if (overlaps(h, newHoliday)) {
        newHoliday = mergeHolidays(h, newHoliday);
        holidayRepository.delete(h);
      }
    }
    return newHoliday;
  }

  private boolean overlaps(Holiday h1, Holiday h2) {
    return !(h1.getEndDate().isBefore(h2.getStartDate())
        || h1.getStartDate().isAfter(h2.getEndDate()));
  }

  private Holiday mergeHolidays(Holiday h1, Holiday h2) {
    return new Holiday(
        h1.getEmployee(),
        h1.getStartDate().isBefore(h2.getStartDate()) ? h1.getStartDate() : h2.getStartDate(),
        h1.getEndDate().isAfter(h2.getEndDate()) ? h1.getEndDate() : h2.getEndDate());
  }
}
