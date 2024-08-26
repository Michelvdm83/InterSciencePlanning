package com.interscience.planning.ssptask;

import com.interscience.planning.system.SystemStatus;
import java.util.UUID;

public record SSPTaskAssignedDTO(
    UUID id,
    UUID employeeId,
    Integer index,
    String systemName,
    SystemStatus status,
    String taskName) {
  public static SSPTaskAssignedDTO from(SSPTask sspTask) {
    UUID employeeId = null;
    if (sspTask.getEmployee() != null) {
      employeeId = sspTask.getEmployee().getId();
    }

    String systemName = null;
    SystemStatus status = null;
    String taskName = null;
    if (sspTask.getConstructionTask() != null
        && sspTask.getConstructionTask().getSystem() != null) {
      systemName = sspTask.getConstructionTask().getSystem().getName();
      status = sspTask.getConstructionTask().getSystem().getStatus();
    } else if (sspTask.getTask() != null) {
      taskName = sspTask.getTask().getName();
    }

    return new SSPTaskAssignedDTO(
        sspTask.getId(), employeeId, sspTask.getIndex(), systemName, status, taskName);
  }
}
