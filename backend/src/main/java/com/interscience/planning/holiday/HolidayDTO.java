package com.interscience.planning.holiday;

import java.util.Date;
import java.util.UUID;

public record HolidayDTO(UUID employeeId, Date startDate, Date endDate) {
  public static HolidayDTO from(Holiday holiday) {
    return new HolidayDTO(
        holiday.getEmployee().getId(), holiday.getStartDate(), holiday.getEndDate());
  }
}
