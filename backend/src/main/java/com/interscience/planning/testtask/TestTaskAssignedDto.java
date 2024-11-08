package com.interscience.planning.testtask;

import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.system.System;
import com.interscience.planning.system.SystemStatus;
import java.util.UUID;

public record TestTaskAssignedDto(UUID id, String systemName, SystemStatus status) {

  static TestTaskAssignedDto from(TestTask testTask) {
    if (testTask.getSystem() == null) {
      throw new NotFoundException();
    }
    System system = testTask.getSystem();
    return new TestTaskAssignedDto(testTask.getTaskId(), system.getName(), system.getStatus());
  }
}
