package com.interscience.planning.task;

import java.time.LocalDate;
import java.util.UUID;

public record TaskDTO(
    String name,
    Integer estimatedTime,
    LocalDate dateStarted,
    LocalDate dateCompleted,
    UUID employee) {
  public static TaskDTO from(Task task) {
    UUID employeeId = null;
    if (task.getSspTask().getEmployee() != null) {
      employeeId = task.getSspTask().getEmployee().getId();
    }

    return new TaskDTO(
        task.getName(),
        task.getSspTask().getEstimatedTime(),
        task.getSspTask().getDateStarted(),
        task.getSspTask().getDateCompleted(),
        employeeId);
  }
}
