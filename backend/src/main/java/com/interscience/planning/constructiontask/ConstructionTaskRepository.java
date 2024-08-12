package com.interscience.planning.constructiontask;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstructionTaskRepository extends JpaRepository<ConstructionTask, UUID> {}
