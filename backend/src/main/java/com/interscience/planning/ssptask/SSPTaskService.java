package com.interscience.planning.ssptask;

import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SSPTaskService {
  private final EmployeeRepository employeeRepository;
  private final SSPTaskRepository sspTaskRepository;

  public void assignEmployee(SSPTaskAssignDTO sspTaskAssignDTO) {
    var sspTask =
        sspTaskRepository.findById(sspTaskAssignDTO.id()).orElseThrow(NotFoundException::new);
    if (sspTaskAssignDTO.assignee() == null) {
      throw new BadRequestException("Employee required");
    }
    var possibleAssignee = employeeRepository.findByIdAndEnabledTrue(sspTaskAssignDTO.assignee());
    if (possibleAssignee.isEmpty()) {
      throw new BadRequestException("No enabled employee found");
    }
    var assignee = possibleAssignee.get();
    sspTask.setEmployee(assignee);
    sspTask.setIndex(sspTaskRepository.findByEmployee(assignee).size());

    sspTaskRepository.save(sspTask);
  }
}
