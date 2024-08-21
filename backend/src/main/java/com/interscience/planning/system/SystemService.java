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

    if (systemPostPatchDTO.employeeResponsible() != null) {
      Employee employeeResponsible =
          employeeRepository
              .findById(systemPostPatchDTO.employeeResponsible())
              .orElseThrow(NotFoundException::new);
      system.setEmployeeResponsible(employeeResponsible);
    }

    system.setPoNumber(systemPostPatchDTO.poNumber());
    system.setSystemType(systemPostPatchDTO.systemType());
    system.setAgreedDate(systemPostPatchDTO.agreedDate());
    system.setActualDeliveryDate(systemPostPatchDTO.actualDeliveryDate());
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

    createConstructionTask(systemPostPatchDTO, system);
    createTestTask(systemPostPatchDTO, system);

    systemRepository.save(system);
  }

  private void createConstructionTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    ConstructionTask newConstructionTask = new ConstructionTask();
    SSPTask newSSPTask = new SSPTask();

    if (systemPostPatchDTO.estimatedConstructionDays() != null) {
      if (systemPostPatchDTO.employeeSSP() != null) {
        Employee sspEmployee =
            employeeRepository
                .findById(systemPostPatchDTO.employeeSSP())
                .orElseThrow(NotFoundException::new);
        newSSPTask.setEmployee(sspEmployee);
      }
      newConstructionTask.setEstimatedTime(systemPostPatchDTO.estimatedConstructionDays());
    }
    newConstructionTask.setDateStarted(systemPostPatchDTO.startOfConstruction());

    newSSPTask.setConstructionTask(newConstructionTask);
    newConstructionTask.setSspTask(newSSPTask);
    newConstructionTask.setSystem(system);
    sspTaskRepository.save(newSSPTask);
    constructionTaskRepository.save(newConstructionTask);
    system.setConstructionTask(newConstructionTask);
  }

  private void createTestTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    TestTask newTestTask = new TestTask();

    if (systemPostPatchDTO.estimatedTestDays() != null) {
      if (systemPostPatchDTO.employeeFT() != null) {
        Employee ftEmployee =
            employeeRepository
                .findById(systemPostPatchDTO.employeeFT())
                .orElseThrow(NotFoundException::new);
        newTestTask.setEmployee(ftEmployee);
      }
      newTestTask.setEstimatedTime(systemPostPatchDTO.estimatedTestDays());
    }
    newTestTask.setDateStarted(systemPostPatchDTO.startOfTest());
    newTestTask.setSystem(system);
    testTaskRepository.save(newTestTask);
    system.setTestTask(newTestTask);
  }
}
