package com.interscience.planning.ssptask;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import java.util.List;
import java.util.UUID;
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

    if (sspTask.getEmployee() != null
        && sspTask.getIndex() != null
        && !assignee.equals(sspTask.getEmployee())) {
      sspTaskRepository
          .findByEmployeeAndIndexGreaterThan(sspTask.getEmployee(), sspTask.getIndex())
          .forEach(
              (sspT) -> {
                sspT.setIndex(sspTask.getIndex() - 1);
                sspTaskRepository.save(sspT);
              });
    }

    sspTask.setEmployee(assignee);
    sspTask.setIndex(sspTaskRepository.findByEmployee(assignee).size());

    sspTaskRepository.save(sspTask);
  }

  public List<SSPTaskAssignedDTO> getAllByEmployeeId(UUID employeeId) {
    Employee employee = employeeRepository.findById(employeeId).orElseThrow(NotFoundException::new);
    return sspTaskRepository.findByEmployee(employee).stream()
        .map(SSPTaskAssignedDTO::from)
        .toList();
  }

  public void updateOrder(UUID id, Integer newIndex) {
    SSPTask sspTask = sspTaskRepository.findById(id).orElseThrow(NotFoundException::new);

    if (newIndex == null) {
      throw new BadRequestException("Index can't be null");
    }
    sspTask.setIndex(newIndex);
    sspTaskRepository.save(sspTask);
  }
}
