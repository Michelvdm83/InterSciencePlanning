package com.interscience.planning.testtask;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.system.SystemStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestTaskRepository extends JpaRepository<TestTask, UUID> {
  List<TestTask> findByEmployee(Employee employee);

  List<TestTask> findByEmployeeAndSystem_StatusNot(Employee employee, SystemStatus status);
}
