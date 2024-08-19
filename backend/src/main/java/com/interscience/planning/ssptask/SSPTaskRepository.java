package com.interscience.planning.ssptask;

import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  Set<SSPTask> findByEmployeeId(UUID employeeId);
}
