package com.interscience.planning.employee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface EmployeeRepository extends CrudRepository<Employee, UUID> {
  Optional<Employee> findByEmail(String email);

  List<Employee> findAllByEnabledTrue();
}
