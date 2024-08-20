package com.interscience.planning.ssptask;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SSPTaskRepository extends JpaRepository<SSPTask, UUID> {
  List<SSPTask> findByEmployeeId(UUID employeeId);
}
