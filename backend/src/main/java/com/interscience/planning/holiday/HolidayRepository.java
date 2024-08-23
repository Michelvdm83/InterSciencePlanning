package com.interscience.planning.holiday;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, UUID> {
  List<Holiday> findByEmployeeId(UUID employeeId);

  List<Holiday> findAllByEndDateGreaterThanEqual(LocalDate date);
}
