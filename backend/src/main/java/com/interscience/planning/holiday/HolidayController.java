package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
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
    return holidayRepository.findAllByEnabledTrue().stream()
        .sorted(Comparator.comparing(Holiday::getStartDate))
        .map(HolidayResponseDTO::from)
        .collect(Collectors.toList());
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
    Holiday holiday = new Holiday(employee, holidayDTO.startDate(), holidayDTO.endDate());
    holidayRepository.save(holiday);

    return ResponseEntity.status(201).body(HolidayResponseDTO.from(holiday));
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteHoliday(@PathVariable UUID id) {
    Holiday holiday = holidayRepository.findById(id).orElseThrow(NotFoundException::new);
    holiday.setEnabled(false);
    holidayRepository.save(holiday);
    return ResponseEntity.noContent().build();
  }
}
