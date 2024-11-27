package com.interscience.planning.ssptask;

import com.interscience.planning.employee.Employee;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  List<SSPTask> findByEmployeeIsNull();

  List<SSPTask> findByEmployee(Employee employee);

  List<SSPTask> findByEmployeeOrderByIndex(Employee employee);

  List<SSPTask> findByEmployeeId(UUID employeeId);

  List<SSPTask> findByEmployeeAndIndexGreaterThan(Employee employee, Integer index);

  @Query(
      "SELECT t FROM SSPTask t WHERE t.employee = :employee AND (t.dateCompleted IS NULL OR t.dateCompleted >= :currentDate) ORDER BY t.index")
  List<SSPTask> findByEmployeeAndUnfinishedTasks(
      @Param("employee") Employee employee, @Param("currentDate") LocalDate currentDate);

  List<SSPTask> findFirst10ByEmployeeAndIndexGreaterThanEqualOrderByIndex(
      Employee employee, Integer index);

  List<SSPTask> findByEmployeeAndIndexGreaterThanEqual(
      Employee employee, Integer index, Sort sort, Limit limit);

  Optional<SSPTask> findFirstByEmployeeAndDateStartedBeforeOrderByIndexDesc(
      Employee employee, LocalDate date);
}
