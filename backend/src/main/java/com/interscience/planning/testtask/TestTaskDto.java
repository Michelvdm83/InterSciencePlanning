package com.interscience.planning.testtask;

import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.system.System;
import com.interscience.planning.system.SystemStatus;
import java.util.UUID;

public record TestTaskDto(UUID id, String systemName, SystemStatus status, Integer estimatedDays) {

  static TestTaskDto from(TestTask testTask) {
    if (testTask.getSystem() == null) {
      throw new NotFoundException();
    }
    System system = testTask.getSystem();
    return new TestTaskDto(
        testTask.getTaskId(), system.getName(), system.getStatus(), testTask.getEstimatedTime());
  }
}
