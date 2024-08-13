package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
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

  @PostMapping
  public ResponseEntity<HolidayDTO> addHoliday(@RequestBody HolidayDTO holidayDTO) {
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
    if (holidayDTO.startDate().after(holidayDTO.endDate())) {
      throw new BadRequestException("Start date can't be after end date");
    }
    Holiday holiday = new Holiday(employee, holidayDTO.startDate(), holidayDTO.endDate());
    holidayRepository.save(holiday);

    return ResponseEntity.ok(HolidayDTO.from(holiday));
  }
}
