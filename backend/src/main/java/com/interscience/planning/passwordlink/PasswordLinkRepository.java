package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface PasswordLinkRepository extends CrudRepository<PasswordLink, UUID> {
  Optional<PasswordLink> findByEmployee(Employee employee);
}
