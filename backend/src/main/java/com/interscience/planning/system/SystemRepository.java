package com.interscience.planning.system;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemRepository extends JpaRepository<System, UUID> {}
