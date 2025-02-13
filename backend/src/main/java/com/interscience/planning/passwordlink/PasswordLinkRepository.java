package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordLinkRepository extends CrudRepository<PasswordLink, UUID> {
  Optional<PasswordLink> findByEmployee(Employee employee);
}
