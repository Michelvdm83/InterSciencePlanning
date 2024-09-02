package com.interscience.planning.ssptask;

import java.util.UUID;

public record SSPTaskAssignedDTO(
    UUID id, UUID employeeId, Integer index, String systemName, String taskName, UUID taskId) {
  public static SSPTaskAssignedDTO from(SSPTask sspTask) {
    UUID employeeId = null;
    if (sspTask.getEmployee() != null) {
      employeeId = sspTask.getEmployee().getId();
    }

    String systemName = null;
    String taskName = null;
    UUID taskId = null;
    if (sspTask.getConstructionTask() != null
        && sspTask.getConstructionTask().getSystem() != null) {
      systemName = sspTask.getConstructionTask().getSystem().getName();
    } else if (sspTask.getTask() != null) {
      taskName = sspTask.getTask().getName();
      taskId = sspTask.getTask().getId();
    }

    return new SSPTaskAssignedDTO(
        sspTask.getId(), employeeId, sspTask.getIndex(), systemName, taskName, taskId);
  }
}
