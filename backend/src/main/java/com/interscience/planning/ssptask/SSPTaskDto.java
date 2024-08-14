package com.interscience.planning.ssptask;

import java.time.LocalDate;
import java.util.Date;

public record SSPTaskDto(
    Integer index,
    String systemName,
    String taskName,
    Integer estimatedDays,
    LocalDate dateStarted) {}
