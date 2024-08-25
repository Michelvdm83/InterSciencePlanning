package com.interscience.planning.system;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.constructiontask.ConstructionTaskRepository;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskAssignDTO;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.ssptask.SSPTaskService;
import com.interscience.planning.testtask.TestTask;
import com.interscience.planning.testtask.TestTaskRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
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
  private final SSPTaskService sspTaskService;

  public System getSystem(String name) {
    return systemRepository.findByName(name).orElseThrow(NotFoundException::new);
  }

  public List<String> searchByName(String contains) {
    List<SystemNameOnly> names =
        systemRepository.findFirst3SystemNamesByNameContainingIgnoreCaseOrderByNameDesc(contains);
    return names.stream().map(SystemNameOnly::getName).toList();
  }

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
    system.setStatus(SystemStatus.TO_BE_PLANNED);
    system.setSeller(systemPostPatchDTO.seller());

    createConstructionTask(systemPostPatchDTO, system);
    createTestTask(systemPostPatchDTO, system);

    systemRepository.save(system);
  }

  public void updateSystem(SystemPostPatchDTO systemPostPatchDTO, String name) {
    System system = systemRepository.findByName(name).orElseThrow(NotFoundException::new);

    if (systemPostPatchDTO.name() != null) {
      validateName(systemPostPatchDTO);
      system.setName(systemPostPatchDTO.name());
    }
    if (systemPostPatchDTO.poNumber() != null) {
      system.setPoNumber(systemPostPatchDTO.poNumber());
    }
    if (systemPostPatchDTO.systemType() != null) {
      system.setSystemType(systemPostPatchDTO.systemType());
    }
    if (systemPostPatchDTO.employeeResponsible() != null) {
      setEmployeeResponsible(systemPostPatchDTO, system);
    }
    if (systemPostPatchDTO.agreedDate() != null) {
      system.setAgreedDate(systemPostPatchDTO.agreedDate());
    }
    if (systemPostPatchDTO.actualDeliveryDate() != null) {
      system.setActualDeliveryDate(systemPostPatchDTO.actualDeliveryDate());
    }
    if (systemPostPatchDTO.customerContactInformation() != null) {
      system.setCustomerContactInformation(systemPostPatchDTO.customerContactInformation());
    }
    if (systemPostPatchDTO.status() != null) {
      system.setStatus(systemPostPatchDTO.status());
    }
    if (systemPostPatchDTO.estimatedConstructionDays() != null) {
      system.getConstructionTask().setEstimatedTime(systemPostPatchDTO.estimatedConstructionDays());
    }
    if (systemPostPatchDTO.employeeSSP() != null) {
      setSSPEmployee(systemPostPatchDTO, system.getConstructionTask().getSspTask());
    }
    if (systemPostPatchDTO.startOfConstruction() != null) {
      setConstructionStartDate(systemPostPatchDTO, system.getConstructionTask());
    }
    if (systemPostPatchDTO.endOfConstruction() != null) {
      setConstructionEndDate(systemPostPatchDTO, system);
    }
    if (systemPostPatchDTO.estimatedTestDays() != null) {
      system.getTestTask().setEstimatedTime(systemPostPatchDTO.estimatedTestDays());
    }
    if (systemPostPatchDTO.employeeFT() != null) {
      setFTEmployee(systemPostPatchDTO, system.getTestTask());
    }
    if (systemPostPatchDTO.startOfTest() != null) {
      setTestStartDate(systemPostPatchDTO, system);
    }
    if (systemPostPatchDTO.endOfTest() != null) {
      setTestEndDate(systemPostPatchDTO, system.getTestTask());
    }
    if (systemPostPatchDTO.seller() != null) {
      system.setSeller(systemPostPatchDTO.seller());
    }
    if (systemPostPatchDTO.projectInformation() != null) {
      system.setProjectInformation(systemPostPatchDTO.projectInformation());
    }
    if (systemPostPatchDTO.notes() != null) {
      system.setNotes(systemPostPatchDTO.notes());
    }

    system.setSchemeApproved(
        systemPostPatchDTO.schemeApproved() != null ? systemPostPatchDTO.schemeApproved() : false);
    system.setSpecsheetApproved(
        systemPostPatchDTO.specsheetApproved() != null
            ? systemPostPatchDTO.specsheetApproved()
            : false);

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
    if (systemPostPatchDTO.estimatedConstructionDays() == null
        && sspTask.getConstructionTask().getEstimatedTime() == null) {
      throw new BadRequestException(
          "Estimated construction days required for assigning an SSP employee");
    }
    Employee sspEmployee =
        employeeRepository
            .findById(systemPostPatchDTO.employeeSSP())
            .orElseThrow(NotFoundException::new);
    if (sspEmployee.getFunction() != Function.SSP) {
      throw new BadRequestException("SSP employee needs to have function SSP");
    }
    sspTaskService.assignEmployee(new SSPTaskAssignDTO(sspTask.getId(), sspEmployee.getId()));
  }

  private void setConstructionStartDate(
      SystemPostPatchDTO systemPostPatchDTO, ConstructionTask constructionTask) {
    if (systemPostPatchDTO.estimatedConstructionDays() == null
        && constructionTask.getEstimatedTime() == null) {
      throw new BadRequestException(
          "Estimated construction days required for setting construction start date");
    }
    if (systemPostPatchDTO.employeeSSP() == null
        && constructionTask.getSspTask().getEmployee() == null) {
      throw new BadRequestException("SSP employee required for setting construction start date");
    }

    LocalDate endDate =
        systemPostPatchDTO.endOfConstruction() != null
            ? systemPostPatchDTO.endOfConstruction()
            : constructionTask.getDateCompleted();
    if (endDate != null && systemPostPatchDTO.startOfConstruction().isAfter(endDate)) {
      throw new BadRequestException("Construction end date must be after construction start date");
    }

    constructionTask.setDateStarted(systemPostPatchDTO.startOfConstruction());
  }

  private void setConstructionEndDate(SystemPostPatchDTO systemPostPatchDTO, System system) {
    ConstructionTask constructionTask = system.getConstructionTask();
    LocalDate startDate =
        systemPostPatchDTO.startOfConstruction() != null
            ? systemPostPatchDTO.startOfConstruction()
            : constructionTask.getDateStarted();

    if (startDate == null) {
      throw new BadRequestException(
          "Construction start date required for setting construction end date");
    }
    if (systemPostPatchDTO.endOfConstruction().isBefore(startDate)) {
      throw new BadRequestException("Construction end date must be after construction start date");
    }

    LocalDate testStartDate =
        systemPostPatchDTO.startOfTest() != null
            ? systemPostPatchDTO.startOfTest()
            : system.getTestTask().getDateStarted();
    if (testStartDate != null && systemPostPatchDTO.endOfConstruction().isAfter(testStartDate)) {
      throw new BadRequestException("Construction end date must be before test start date");
    }

    constructionTask.setDateCompleted(systemPostPatchDTO.endOfConstruction());
  }

  private void createConstructionTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    ConstructionTask newConstructionTask = new ConstructionTask();
    SSPTask newSSPTask = new SSPTask();
    sspTaskRepository.save(newSSPTask);

    if (systemPostPatchDTO.employeeSSP() != null) {
      setSSPEmployee(systemPostPatchDTO, newSSPTask);
    }

    newConstructionTask.setEstimatedTime(systemPostPatchDTO.estimatedConstructionDays());

    newSSPTask.setConstructionTask(newConstructionTask);
    newConstructionTask.setSspTask(newSSPTask);
    newConstructionTask.setSystem(system);
    sspTaskRepository.save(newSSPTask);
    constructionTaskRepository.save(newConstructionTask);
    system.setConstructionTask(newConstructionTask);
  }

  private void setFTEmployee(SystemPostPatchDTO systemPostPatchDTO, TestTask testTask) {
    if (systemPostPatchDTO.estimatedTestDays() == null && testTask.getEstimatedTime() == null) {
      throw new BadRequestException("Estimated test days required for assigning an FT employee");
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

  private void setTestStartDate(SystemPostPatchDTO systemPostPatchDTO, System system) {
    TestTask testTask = system.getTestTask();

    LocalDate constructionEndDate =
        systemPostPatchDTO.endOfConstruction() != null
            ? systemPostPatchDTO.endOfConstruction()
            : system.getConstructionTask().getDateCompleted();
    if (constructionEndDate == null) {
      throw new BadRequestException("Construction end date required for setting test start date");
    }
    if (!systemPostPatchDTO.startOfTest().isAfter(constructionEndDate)) {
      throw new BadRequestException("Test start date must be after construction end date");
    }

    if (systemPostPatchDTO.estimatedTestDays() == null
        && system.getTestTask().getEstimatedTime() == null) {
      throw new BadRequestException("Estimated test days required for setting test start date");
    }
    if (systemPostPatchDTO.employeeFT() == null && system.getTestTask().getEmployee() == null) {
      throw new BadRequestException("FT employee required for setting test start date");
    }
    LocalDate endDate =
        systemPostPatchDTO.endOfTest() != null
            ? systemPostPatchDTO.endOfTest()
            : testTask.getDateCompleted();
    if (endDate != null && systemPostPatchDTO.startOfTest().isAfter(endDate)) {
      throw new BadRequestException("Test end date must be after test start date");
    }
    testTask.setDateStarted(systemPostPatchDTO.startOfTest());
  }

  private void setTestEndDate(SystemPostPatchDTO systemPostPatchDTO, TestTask testTask) {
    LocalDate startDate =
        systemPostPatchDTO.startOfTest() != null
            ? systemPostPatchDTO.startOfTest()
            : testTask.getDateStarted();

    if (startDate == null) {
      throw new BadRequestException("Test start date required for setting test end date");
    }
    if (systemPostPatchDTO.endOfTest().isBefore(startDate)) {
      throw new BadRequestException("Test end date must be after test start date");
    }
    testTask.setDateCompleted(systemPostPatchDTO.endOfTest());
  }

  private void createTestTask(SystemPostPatchDTO systemPostPatchDTO, System system) {
    TestTask newTestTask = new TestTask();

    if (systemPostPatchDTO.employeeFT() != null) {
      setFTEmployee(systemPostPatchDTO, newTestTask);
    }

    newTestTask.setEstimatedTime(systemPostPatchDTO.estimatedTestDays());

    newTestTask.setSystem(system);
    testTaskRepository.save(newTestTask);
    system.setTestTask(newTestTask);
  }
}
