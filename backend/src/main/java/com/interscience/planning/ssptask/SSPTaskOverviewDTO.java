package com.interscience.planning.ssptask;

import com.interscience.planning.system.SystemStatus;
import java.util.UUID;

public record SSPTaskOverviewDTO(
    UUID id,
    UUID employeeId,
    String systemName,
    SystemStatus status,
    String taskName,
    Integer estimatedTime) {
  public static SSPTaskOverviewDTO from(SSPTask sspTask) {
    var id = sspTask.getId();
    var employeeId = sspTask.getEmployee() == null ? null : sspTask.getEmployee().getId();
    String systemName = null;
    SystemStatus status = null;
    String taskName = null;
    Integer estimatedTime = null;
    if (sspTask.getConstructionTask() != null) {
      var thisSystem = sspTask.getConstructionTask().getSystem();
      if (thisSystem != null) {
        systemName = thisSystem.getName();
        status = thisSystem.getStatus();
      }
      estimatedTime = sspTask.getConstructionTask().getEstimatedTime();
    } else {
      if (sspTask.getTask() != null) {
        taskName = sspTask.getTask().getName();
        estimatedTime = sspTask.getTask().getEstimatedTime();
      }
    }

    return new SSPTaskOverviewDTO(id, employeeId, systemName, status, taskName, estimatedTime);
  }
}
