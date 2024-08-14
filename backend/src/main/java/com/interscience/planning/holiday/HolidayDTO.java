package com.interscience.planning.holiday;

import java.time.LocalDate;
import java.util.UUID;

public record HolidayDTO(UUID employeeId, LocalDate startDate, LocalDate endDate) {
  public static HolidayDTO from(Holiday holiday) {
    return new HolidayDTO(
        holiday.getEmployee().getId(), holiday.getStartDate(), holiday.getEndDate());
  }
}
