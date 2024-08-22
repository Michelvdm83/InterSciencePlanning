package com.interscience.planning.ssptask;

import java.time.LocalDate;

public record SSPTaskDTO(
    Integer index,
    String systemName,
    String taskName,
    Integer estimatedDays,
    LocalDate dateStarted,
    LocalDate dateCompleted) {
  public static SSPTaskDTO from(SSPTask sspTask) {

    Integer estimatedDays = null;
    LocalDate dateStarted = null;
    LocalDate dateCompleted = null;
    String systemName = null;
    String taskName = null;
    if (sspTask.getConstructionTask() != null) {
      estimatedDays = sspTask.getConstructionTask().getEstimatedTime();
      dateStarted = sspTask.getConstructionTask().getDateStarted();
      dateCompleted = sspTask.getConstructionTask().getDateCompleted();
      systemName = sspTask.getConstructionTask().getSystem().getName();
    } else if (sspTask.getTask() != null) {
      estimatedDays = sspTask.getTask().getEstimatedTime();
      dateStarted = sspTask.getTask().getDateStarted();
      dateCompleted = sspTask.getTask().getDateCompleted();
      taskName = sspTask.getTask().getName();
    }

    return new SSPTaskDTO(
        sspTask.getIndex(), systemName, taskName, estimatedDays, dateStarted, dateCompleted);
  }
}
