package com.interscience.planning.holiday;

import java.time.LocalDate;
import java.util.UUID;

public record HolidayResponseDTO(
    UUID id, UUID employeeId, String employeeName, LocalDate startDate, LocalDate endDate) {
  public static HolidayResponseDTO from(Holiday holiday) {
    var employeeId = holiday.getEmployee() == null ? null : holiday.getEmployee().getId();
    var employeeName = holiday.getEmployee() == null ? null : holiday.getEmployee().getName();

    return new HolidayResponseDTO(
        holiday.getId(), employeeId, employeeName, holiday.getStartDate(), holiday.getEndDate());
  }
}
