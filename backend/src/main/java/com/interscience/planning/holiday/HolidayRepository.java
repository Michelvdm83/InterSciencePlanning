package com.interscience.planning.holiday;

import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, UUID> {
  Set<Holiday> findByEmployeeId(UUID employeeId);
}
