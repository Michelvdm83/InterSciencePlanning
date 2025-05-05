package com.interscience.planning.ssptask;

import com.interscience.planning.system.System;
import java.time.LocalDate;
import java.util.UUID;

public record SSPTaskDTO(
    Integer index,
    String systemName,
    String poNumber,
    Boolean orderPickedByWarehouse,
    String status,
    String taskName,
    UUID taskId,
    Integer estimatedDays,
    LocalDate dateStarted,
    LocalDate dateCompleted) {
  public static SSPTaskDTO from(SSPTask sspTask) {

    Integer estimatedDays = sspTask.getEstimatedTime();
    LocalDate dateStarted = sspTask.getDateStarted();
    LocalDate dateCompleted = sspTask.getDateCompleted();
    String systemName = null;
    String poNumber = null;
    Boolean orderPickedByWarehouse = null;
    String status = null;
    String taskName = null;
    UUID taskId = null;
    if (sspTask.getConstructionTask() != null) {
      System thisSystem = sspTask.getConstructionTask().getSystem();
      systemName = thisSystem == null ? null : thisSystem.getName();
      poNumber = thisSystem == null ? null : thisSystem.getPoNumber();
      orderPickedByWarehouse = thisSystem == null ? null : thisSystem.getOrderPickedByWarehouse();
      status = thisSystem == null ? null : thisSystem.getStatus().name();
    } else if (sspTask.getTask() != null) {
      taskName = sspTask.getTask().getName();
      taskId = sspTask.getTask().getId();
    }

    return new SSPTaskDTO(
        sspTask.getIndex(),
        systemName,
        poNumber,
        orderPickedByWarehouse,
        status,
        taskName,
        taskId,
        estimatedDays,
        dateStarted,
        dateCompleted);
  }
}
