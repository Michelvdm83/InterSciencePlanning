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

    Integer estimatedDays;
    LocalDate dateStarted;
    LocalDate dateCompleted;
    if (sspTask.getConstructionTask() != null) {
      estimatedDays = sspTask.getConstructionTask().getEstimatedTime();
      dateStarted = sspTask.getConstructionTask().getDateStarted();
      dateCompleted = sspTask.getConstructionTask().getDateCompleted();
    } else {
      estimatedDays = sspTask.getTask().getEstimatedTime();
      dateStarted = sspTask.getTask().getDateStarted();
      dateCompleted = sspTask.getTask().getDateCompleted();
    }

    return new SSPTaskDTO(
        sspTask.getIndex(),
        sspTask.getConstructionTask().getSystem().getName(),
        sspTask.getTask().getName(),
        estimatedDays,
        dateStarted,
        dateCompleted);
  }
}
