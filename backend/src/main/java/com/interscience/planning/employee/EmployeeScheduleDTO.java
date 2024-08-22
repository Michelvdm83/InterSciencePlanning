package com.interscience.planning.employee;

import com.interscience.planning.holiday.HolidayDTO;
import com.interscience.planning.ssptask.SSPTaskDTO;
import java.util.List;

public record EmployeeScheduleDTO(List<SSPTaskDTO> allTasks, List<HolidayDTO> holidays) {}
