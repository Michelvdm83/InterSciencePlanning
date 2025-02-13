package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, UUID> {
  List<Holiday> findByEmployeeId(UUID employeeId);

  List<Holiday> findAllByEndDateGreaterThanEqual(LocalDate date);

  List<Holiday> findAllByEndDateGreaterThanEqualAndEmployeeId(LocalDate date, UUID employeeId);

  @Query(
      "SELECT h FROM Holiday h WHERE h.employee = :employee AND ((h.startDate BETWEEN :firstDate AND :lastDate) OR (h.endDate BETWEEN :firstDate AND :lastDate))")
  List<Holiday> findAllByEmployeeAndBetween(
      @Param("employee") Employee employee,
      @Param("firstDate") LocalDate firstDate,
      @Param("lastDate") LocalDate lastDate);
}
