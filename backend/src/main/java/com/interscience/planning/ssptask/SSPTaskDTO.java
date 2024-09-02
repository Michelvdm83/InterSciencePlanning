package com.interscience.planning.ssptask;

import com.interscience.planning.system.System;
import java.time.LocalDate;

public record SSPTaskDTO(
    Integer index,
    String systemName,
    String taskName,
    Integer estimatedDays,
    LocalDate dateStarted,
    LocalDate dateCompleted) {
  public static SSPTaskDTO from(SSPTask sspTask) {

    Integer estimatedDays = sspTask.getEstimatedTime();
    LocalDate dateStarted = sspTask.getDateStarted();
    LocalDate dateCompleted = sspTask.getDateCompleted();
    String systemName = null;
    String taskName = null;
    if (sspTask.getConstructionTask() != null) {
      System thisSystem = sspTask.getConstructionTask().getSystem();
      systemName = thisSystem == null ? null : thisSystem.getName();
    } else if (sspTask.getTask() != null) {
      taskName = sspTask.getTask().getName();
    }

    return new SSPTaskDTO(
        sspTask.getIndex(), systemName, taskName, estimatedDays, dateStarted, dateCompleted);
  }
}
