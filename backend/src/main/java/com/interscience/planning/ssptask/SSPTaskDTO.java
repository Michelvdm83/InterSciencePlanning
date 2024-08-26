package com.interscience.planning.ssptask;

import com.interscience.planning.system.SystemStatus;
import java.time.LocalDate;

public record SSPTaskDTO(
    Integer index,
    String systemName,
    SystemStatus status,
    String taskName,
    Integer estimatedDays,
    LocalDate dateStarted,
    LocalDate dateCompleted) {
  public static SSPTaskDTO from(SSPTask sspTask) {

    Integer estimatedDays = null;
    LocalDate dateStarted = null;
    LocalDate dateCompleted = null;
    String systemName = null;
    SystemStatus status = null;
    String taskName = null;
    if (sspTask.getConstructionTask() != null) {
      estimatedDays = sspTask.getConstructionTask().getEstimatedTime();
      dateStarted = sspTask.getConstructionTask().getDateStarted();
      dateCompleted = sspTask.getConstructionTask().getDateCompleted();
      systemName = sspTask.getConstructionTask().getSystem().getName();
      status = sspTask.getConstructionTask().getSystem().getStatus();
    } else if (sspTask.getTask() != null) {
      estimatedDays = sspTask.getTask().getEstimatedTime();
      dateStarted = sspTask.getTask().getDateStarted();
      dateCompleted = sspTask.getTask().getDateCompleted();
      taskName = sspTask.getTask().getName();
    }

    return new SSPTaskDTO(
        sspTask.getIndex(), systemName, status,taskName, estimatedDays, dateStarted, dateCompleted);
  }
}
