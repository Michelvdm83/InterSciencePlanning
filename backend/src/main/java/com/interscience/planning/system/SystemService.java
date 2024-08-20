package com.interscience.planning.system;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.constructiontask.ConstructionTaskRepository;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.testtask.TestTask;
import com.interscience.planning.testtask.TestTaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class SystemService {
  private final SystemRepository systemRepository;
  private final EmployeeRepository employeeRepository;
  private final SSPTaskRepository sspTaskRepository;
  private final ConstructionTaskRepository constructionTaskRepository;
  private final TestTaskRepository testTaskRepository;

  public void createNewSystem(SystemPostPatchDTO systemPostPatchDTO) {
    if (systemRepository.findByName(systemPostPatchDTO.name()).isPresent()) {
      throw new BadRequestException("System name already exists");
    }

    if (systemPostPatchDTO.name() == null || systemPostPatchDTO.name().trim().isEmpty()) {
      throw new BadRequestException("System name is required");
    }
    System system = new System(systemPostPatchDTO.name());

    system.setPoNumber(systemPostPatchDTO.poNumber());
    system.setSystemType(systemPostPatchDTO.systemType());
    system.setAgreedDate(systemPostPatchDTO.agreedDate());
    system.setActualDeliveryDate(systemPostPatchDTO.actualDeliveryDate());

    if (systemPostPatchDTO.employeeResponsible() != null) {
      Employee employeeResponsible =
          employeeRepository
              .findById(systemPostPatchDTO.employeeResponsible())
              .orElseThrow(NotFoundException::new);
      system.setEmployeeResponsible(employeeResponsible);
    }

    ConstructionTask newConstructionTask;
    SSPTask newSSPTask;
    if (systemPostPatchDTO.estimatedConstructionDays() != null
        && systemPostPatchDTO.employeeSSP() != null) {
      Employee sspEmployee =
          employeeRepository
              .findById(systemPostPatchDTO.employeeSSP())
              .orElseThrow(NotFoundException::new);
      newSSPTask = new SSPTask(sspEmployee);
      newConstructionTask =
          new ConstructionTask(newSSPTask, systemPostPatchDTO.estimatedConstructionDays());
    } else {
      newSSPTask = new SSPTask();
      newConstructionTask = new ConstructionTask(newSSPTask);
    }
    newConstructionTask.setDateStarted(systemPostPatchDTO.startOfConstruction());
    constructionTaskRepository.save(newConstructionTask);
    newSSPTask.setConstructionTask(newConstructionTask);
    sspTaskRepository.save(newSSPTask);

    TestTask newTestTask;
    if (systemPostPatchDTO.estimatedTestDays() != null && systemPostPatchDTO.employeeFT() != null) {
      Employee ftEmployee =
          employeeRepository
              .findById(systemPostPatchDTO.employeeFT())
              .orElseThrow(NotFoundException::new);
      newTestTask = new TestTask(ftEmployee, systemPostPatchDTO.estimatedTestDays());
    } else {
      newTestTask = new TestTask();
    }
    newTestTask.setDateStarted(systemPostPatchDTO.startOfTest());

    newConstructionTask.setSystem(system);
    constructionTaskRepository.save(newConstructionTask);
    newTestTask.setSystem(system);
    testTaskRepository.save(newTestTask);

    system.setNotes(systemPostPatchDTO.notes());

    system.setCustomerContactInformation(systemPostPatchDTO.customerContactInformation());
    system.setProjectInformation(systemPostPatchDTO.projectInformation());

    system.setSchemeApproved(
        systemPostPatchDTO.schemeApproved() != null ? systemPostPatchDTO.schemeApproved() : false);
    system.setSpecsheetApproved(
        systemPostPatchDTO.specsheetApproved() != null
            ? systemPostPatchDTO.specsheetApproved()
            : false);
    system.setStatus(
        systemPostPatchDTO.status() != null
            ? systemPostPatchDTO.status()
            : SystemStatus.TO_BE_PLANNED);

    systemRepository.save(system);
  }
}
