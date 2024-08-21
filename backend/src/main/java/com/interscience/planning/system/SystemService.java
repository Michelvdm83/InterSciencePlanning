package com.interscience.planning.system;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.constructiontask.ConstructionTaskRepository;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
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
    validateName(systemPostPatchDTO);

    System system = new System(systemPostPatchDTO.name());

    if (systemPostPatchDTO.employeeResponsible() != null) {
      setEmployeeResponsible(systemPostPatchDTO, system);
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

  private void validateName(SystemPostPatchDTO systemPostPatchDTO) {
    if (systemRepository.findByName(systemPostPatchDTO.name()).isPresent()) {
      throw new BadRequestException("System name already exists");
    }
    if (systemPostPatchDTO.name() == null || systemPostPatchDTO.name().isBlank()) {
      throw new BadRequestException("System name is required");
    }
  }

  private void setEmployeeResponsible(SystemPostPatchDTO systemPostPatchDTO, System system) {
    Employee employeeResponsible =
        employeeRepository
            .findById(systemPostPatchDTO.employeeResponsible())
            .orElseThrow(NotFoundException::new);
    if (employeeResponsible.getFunction() == Function.SSP) {
      throw new BadRequestException("Employee responsible can't be an SSP employee");
    }
    system.setEmployeeResponsible(employeeResponsible);
  }

  private void setSSPEmployee(SystemPostPatchDTO systemPostPatchDTO, SSPTask sspTask) {
    if (systemPostPatchDTO.estimatedConstructionDays() == null) {
      throw new BadRequestException(
          "Estimated construction days are required for assigning an SSP employee");
    }
    Employee sspEmployee =
        employeeRepository
            .findById(systemPostPatchDTO.employeeSSP())
            .orElseThrow(NotFoundException::new);
    if (sspEmployee.getFunction() != Function.SSP) {
      throw new BadRequestException("SSP employee needs to have function SSP");
    }
    sspTask.setEmployee(sspEmployee);
  }

  private void setConstructionStartDate(
      SystemPostPatchDTO systemPostPatchDTO, ConstructionTask constructionTask) {
    if (systemPostPatchDTO.estimatedConstructionDays() == null) {
      throw new BadRequestException(
          "Estimated construction days required for setting construction start date");
    }
    if (systemPostPatchDTO.employeeSSP() == null) {
      throw new BadRequestException("SSP employee required for setting construction start date");
    }
    constructionTask.setDateStarted(systemPostPatchDTO.startOfConstruction());
  }

  private void createConstructionTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    ConstructionTask newConstructionTask = new ConstructionTask();
    SSPTask newSSPTask = new SSPTask();

    if (systemPostPatchDTO.employeeSSP() != null) {
      setSSPEmployee(systemPostPatchDTO, newSSPTask);
    }

    newConstructionTask.setEstimatedTime(systemPostPatchDTO.estimatedConstructionDays());

    if (systemPostPatchDTO.startOfConstruction() != null) {
      setConstructionStartDate(systemPostPatchDTO, newConstructionTask);
    }

    newSSPTask.setConstructionTask(newConstructionTask);
    newConstructionTask.setSspTask(newSSPTask);
    newConstructionTask.setSystem(system);
    sspTaskRepository.save(newSSPTask);
    constructionTaskRepository.save(newConstructionTask);
    system.setConstructionTask(newConstructionTask);
  }

  private void setFTEmployee(SystemPostPatchDTO systemPostPatchDTO, TestTask testTask) {
    if (systemPostPatchDTO.estimatedTestDays() == null) {
      throw new BadRequestException(
          "Estimated test days are required for assigning an FT employee");
    }
    Employee ftEmployee =
        employeeRepository
            .findById(systemPostPatchDTO.employeeFT())
            .orElseThrow(NotFoundException::new);
    if (ftEmployee.getFunction() != Function.FT) {
      throw new BadRequestException("FT employee needs to have function FT");
    }
    testTask.setEmployee(ftEmployee);
  }

  private void setTestStartDate(SystemPostPatchDTO systemPostPatchDTO, TestTask testTask) {
    if (systemPostPatchDTO.estimatedTestDays() == null) {
      throw new BadRequestException("Estimated test days required for setting test start date");
    }
    if (systemPostPatchDTO.employeeFT() == null) {
      throw new BadRequestException("FT employee required for setting test start date");
    }
    testTask.setDateStarted(systemPostPatchDTO.startOfTest());
  }

  private void createTestTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    TestTask newTestTask = new TestTask();

    if (systemPostPatchDTO.employeeFT() != null) {
      setFTEmployee(systemPostPatchDTO, newTestTask);
    }

    newTestTask.setEstimatedTime(systemPostPatchDTO.estimatedTestDays());

    if (systemPostPatchDTO.startOfTest() != null) {
      setTestStartDate(systemPostPatchDTO, newTestTask);
    }

    newTestTask.setSystem(system);
    testTaskRepository.save(newTestTask);
    system.setTestTask(newTestTask);
  }
}
