package com.interscience.planning.holiday;

import java.time.LocalDate;
import java.util.UUID;

public record HolidayResponseDTO(UUID id, UUID employeeId, LocalDate startDate, LocalDate endDate) {
  public static HolidayResponseDTO from(Holiday holiday) {
    return new HolidayResponseDTO(
        holiday.getId(),
        holiday.getEmployee().getId(),
        holiday.getStartDate(),
        holiday.getEndDate());
  }
}
