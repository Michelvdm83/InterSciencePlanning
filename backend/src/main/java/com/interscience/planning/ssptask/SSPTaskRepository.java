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
import org.springframework.stereotype.Repository;

@Repository
public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  List<SSPTask> findByEmployeeIsNull();

  List<SSPTask> findByEmployee(Employee employee);

  List<SSPTask> findByEmployeeAndIndexGreaterThan(Employee employee, Integer index);

  @Query(
      "SELECT t FROM SSPTask t WHERE t.employee = :employee AND (t.dateCompleted IS NULL OR t.dateCompleted >= :currentDate) ORDER BY t.index")
  List<SSPTask> findByEmployeeAndUnfinishedTasks(
      @Param("employee") Employee employee, @Param("currentDate") LocalDate currentDate);

  List<SSPTask> findByEmployeeNotNullAndDateStartedNotNullAndDateCompletedNull();

  List<SSPTask> findByEmployeeAndIndexGreaterThanEqual(
      Employee employee, Integer index, Sort sort, Limit limit);

  Optional<SSPTask> findFirstByEmployeeAndDateStartedBeforeOrderByIndexDesc(
      Employee employee, LocalDate date);

  // returns all the systems that ssp finished in the given year
  @Query("SELECT t FROM SSPTask t WHERE YEAR(t.dateCompleted) = :year")
  List<SSPTask> findByDateCompletedInYear(@Param("year") int year);
}
