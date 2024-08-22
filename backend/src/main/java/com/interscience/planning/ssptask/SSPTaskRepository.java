package com.interscience.planning.ssptask;

import com.interscience.planning.employee.Employee;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  List<SSPTask> findByEmployeeIsNull();

  List<SSPTask> findByEmployee(Employee employee);
}
