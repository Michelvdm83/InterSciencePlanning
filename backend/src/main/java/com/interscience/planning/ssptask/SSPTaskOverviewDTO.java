package com.interscience.planning.ssptask;

import java.util.UUID;

public record SSPTaskOverviewDTO(
    UUID id, UUID employeeId, String systemName, String taskName, Integer estimatedTime) {
  public static SSPTaskOverviewDTO from(SSPTask sspTask) {
    var id = sspTask.getId();
    var employeeId = sspTask.getEmployee() == null ? null : sspTask.getEmployee().getId();
    Integer estimatedTime = sspTask.getEstimatedTime();

    String systemName = null;
    String taskName = null;
    if (sspTask.getConstructionTask() != null) {
      var thisSystem = sspTask.getConstructionTask().getSystem();
      systemName = thisSystem == null ? null : thisSystem.getName();
    } else {
      if (sspTask.getTask() != null) {
        taskName = sspTask.getTask().getName();
      }
    }

    return new SSPTaskOverviewDTO(id, employeeId, systemName, taskName, estimatedTime);
  }
}
