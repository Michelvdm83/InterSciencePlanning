package com.interscience.planning.ssptask;

import com.interscience.planning.employee.Employee;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  List<SSPTask> findByEmployeeIsNull();

  List<SSPTask> findByEmployee(Employee employee);

  List<SSPTask> findByEmployeeOrderByIndex(Employee employee);

  List<SSPTask> findByEmployeeId(UUID employeeId);

  List<SSPTask> findByEmployeeAndIndexGreaterThan(Employee employee, Integer index);

  List<SSPTask> findFirst10ByEmployeeAndIndexGreaterThanEqualOrderByIndex(
      Employee employee, Integer index);

  Optional<SSPTask> findFirstByEmployeeAndDateStartedBeforeOrderByIndexDesc(
      Employee employee, LocalDate date);
}
