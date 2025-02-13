package com.interscience.planning.employee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, UUID> {
  Optional<Employee> findByEmail(String email);

  List<Employee> findAllByEnabledTrue();

  List<Employee> findByEnabledTrueAndFunctionIn(List<Function> functions);

  Optional<Employee> findByIdAndEnabledTrue(UUID id);
}
