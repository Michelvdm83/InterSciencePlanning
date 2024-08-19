package com.interscience.planning.ssptask;

import java.time.LocalDate;

public record SSPTaskDto(
    Integer index,
    String systemName,
    String taskName,
    Integer estimatedDays,
    LocalDate dateStarted,
    LocalDate dateCompleted) {}
