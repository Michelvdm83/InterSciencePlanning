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
        if (sspTask.getConstructionTask() != null) {
            estimatedDays = sspTask.getConstructionTask().getEstimatedTime();
        } else {
            estimatedDays = sspTask.getTask().getEstimatedTime();
        }

        return new SSPTaskDTO(sspTask.getIndex(), sspTask.getConstructionTask().getSystem().getName(), sspTask.getTask().getName(),
                estimatedDays, ;)
    }
}
