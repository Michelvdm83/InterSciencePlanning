package com.interscience.planning.holiday;


import java.time.LocalDate;
import java.util.UUID;

public record HolidayResponseDTO(UUID id, UUID employeeId, LocalDate startDate, LocalDate endDate) {
  public static HolidayResponseDTO from(Holiday holiday) {
    var employeeId = holiday.getEmployee() == null ? null : holiday.getEmployee().getId();

    return new HolidayResponseDTO(
        holiday.getId(),
        employeeId,
        holiday.getStartDate(),
        holiday.getEndDate());
  }
}
