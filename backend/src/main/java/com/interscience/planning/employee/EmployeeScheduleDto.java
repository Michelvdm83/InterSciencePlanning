package com.interscience.planning.employee;

import com.interscience.planning.ssptask.SSPTaskDto;
import java.util.List;

public record EmployeeScheduleDto(List<SSPTaskDto> allTasks) {}
