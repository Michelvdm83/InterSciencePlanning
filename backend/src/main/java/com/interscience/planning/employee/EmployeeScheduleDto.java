package com.interscience.planning.employee;

import com.interscience.planning.holiday.HolidayDTO;
import com.interscience.planning.ssptask.SSPTaskDTO;
import java.util.List;
import java.util.Set;

public record EmployeeScheduleDto(Set<SSPTaskDTO> allTasks, List<HolidayDTO> holidays) {}
