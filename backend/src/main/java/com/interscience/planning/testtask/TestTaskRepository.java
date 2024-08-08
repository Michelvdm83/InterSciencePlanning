package com.interscience.planning.testtask;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestTaskRepository extends JpaRepository<TestTask, UUID> {}
