package com.interscience.planning.system;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemRepository extends JpaRepository<System, UUID> {
  Optional<System> findByName(String name);

  List<SystemNameAndPoNumberOnly>
      findFirst6SystemNamesByNameContainingIgnoreCaseOrPoNumberContainingIgnoreCaseOrderByNameDesc(
          String name, String poNumber);

  List<System> findByDelayCheckedBySupervisorFalse();
}
