package com.interscience.planning.system;

import com.fasterxml.jackson.databind.JsonNode;
import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.constructiontask.ConstructionTaskRepository;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.holiday.Holiday;
import com.interscience.planning.holiday.HolidayRepository;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskAssignDTO;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.ssptask.SSPTaskService;
import com.interscience.planning.testtask.TestTask;
import com.interscience.planning.testtask.TestTaskRepository;
import jakarta.transaction.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
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
  private final HolidayRepository holidayRepository;

  public SystemDTO getSystem(String name) {
    System system = systemRepository.findByName(name).orElseThrow(NotFoundException::new);
    LocalDate expectedEndDate = getExpectedEndDate(system);
    return SystemDTO.fromWithEndDate(system, expectedEndDate);
  }

  private LocalDate getExpectedEndDate(System system) {
    SystemDTO dto = SystemDTO.from(system);
    int testDays = dto.estimatedTestDays() == null ? 1 : dto.estimatedTestDays();
    if (dto.employeeSSP() == null) {
      return null;
    } else if (dto.endOfTest() != null) {
      return dto.endOfTest();
    } else if (dto.startOfTest() != null) {
      return addBusinessDays(dto.startOfTest(), testDays - 1);
    } else if (dto.endOfConstruction() != null) {
      return addBusinessDays(dto.endOfConstruction(), testDays);
    } else if (dto.startOfConstruction() != null) {
      LocalDate endOfConstruction =
          addWorkDays(
              dto.employeeSSP(), dto.startOfConstruction(), dto.estimatedConstructionDays() - 1);
      return addBusinessDays(endOfConstruction, testDays);

    } else {
      Employee employee =
          employeeRepository.findById(dto.employeeSSP()).orElseThrow(NotFoundException::new);
      SSPTask firstTask =
          sspTaskRepository
              .findFirstByEmployeeAndDateStartedBeforeOrderByIndexDesc(employee, LocalDate.now())
              .orElse(null);

      List<SSPTask> tasks;
      if (firstTask == null) {
        tasks = sspTaskRepository.findByEmployee(employee);
      } else {
        tasks =
            sspTaskRepository.findByEmployeeAndIndexGreaterThanEqual(
                employee, firstTask.getIndex(), Sort.by("index").ascending(), Limit.unlimited());
      }
      int daysToAdd = 0;
      for (SSPTask sspTask : tasks) {
        daysToAdd += sspTask.getEstimatedTime();
      }
      LocalDate firstDate;
      if (firstTask == null || firstTask.getDateStarted() == null) {
        firstDate = LocalDate.now();
      } else {
        firstDate = firstTask.getDateStarted();
      }
      LocalDate endOfProduction = addWorkDays(dto.employeeSSP(), firstDate, daysToAdd - 1);
      return addBusinessDays(endOfProduction, testDays);
    }
  }

  // by giving an employeeId, startDate and number of days to add (daysToAdd),
  // this will find and use all holidays of the employee and makes a list of dates of all days of
  // those holidays that
  // fall in the period. After this it calls addBusinessDays with that List as parameter
  private LocalDate addWorkDays(UUID employeeId, LocalDate startDate, int daysToAdd) {
    List<Holiday> holidays =
        holidayRepository.findAllByEndDateGreaterThanEqualAndEmployeeId(startDate, employeeId);

    LocalDate endDateWithoutHolidays = addBusinessDays(startDate, daysToAdd);
    if (holidays.isEmpty()) {
      return endDateWithoutHolidays;
    }
    Predicate<Holiday> startDateInPeriod =
        holiday ->
            startDate.isAfter(holiday.getStartDate().minusDays(1))
                && holiday.getStartDate().isBefore(endDateWithoutHolidays.plusDays(1));
    Predicate<Holiday> endDateInPeriod =
        holiday ->
            startDate.isAfter(holiday.getEndDate().minusDays(1))
                && holiday.getEndDate().isBefore(endDateWithoutHolidays.plusDays(1));

    long nrOfHolidaysOverlapping =
        holidays.stream()
            .filter(holiday -> startDateInPeriod.or(endDateInPeriod).test(holiday))
            .count();
    if (nrOfHolidaysOverlapping == 0) {
      return endDateWithoutHolidays;
    }
    List<LocalDate> daysOfHolidays = new ArrayList<>();
    holidays.forEach(
        hday -> {
          List<LocalDate> daysOfHoliday =
              hday.getStartDate().datesUntil(hday.getEndDate().plusDays(1)).toList();
          daysOfHolidays.addAll(daysOfHoliday);
        });

    return addBusinessDays(startDate, daysToAdd, daysOfHolidays);
  }

  // adds 'daysToAdd' businessdays to the startdate, returns the resulting date
  // if daysOfHolidays is given, it also checks for holidays
  private LocalDate addBusinessDays(
      LocalDate startDate, int daysToAdd, List<LocalDate> daysOfHolidays) {
    if (daysToAdd <= 0) {
      return startDate;
    }
    LocalDate resultDate = startDate;
    for (int addedDays = 0; addedDays < daysToAdd; addedDays++) {
      resultDate = resultDate.plusDays(1);
      DayOfWeek dayOfDate = resultDate.getDayOfWeek();
      if (dayOfDate == DayOfWeek.SATURDAY || dayOfDate == DayOfWeek.SUNDAY) {
        daysToAdd++;
      } else if (daysOfHolidays != null && daysOfHolidays.contains(resultDate)) {
        daysToAdd++;
      }
    }
    return resultDate;
  }

  private LocalDate addBusinessDays(LocalDate startDate, int daysToAdd) {
    return addBusinessDays(startDate, daysToAdd, null);
  }

  public List<String> searchByName(String contains) {
    List<SystemNameOnly> names =
        systemRepository.findFirst6SystemNamesByNameContainingIgnoreCaseOrderByNameDesc(contains);
    return names.stream().map(SystemNameOnly::getName).toList();
  }

  public List<SystemDelayedDTO> getDelayedSystems() {
    List<System> delayedSystems = systemRepository.findByDelayCheckedBySupervisorFalse();
    List<SystemDelayedDTO> returnList = new ArrayList<>();
    delayedSystems.forEach(
        (system -> {
          SSPTask sspTask = system.getConstructionTask().getSspTask();
          String employeeName =
              sspTask.getEmployee() == null ? "" : sspTask.getEmployee().getName();

          returnList.add(
              new SystemDelayedDTO(system.getName(), employeeName, getAffectedSystems(sspTask)));
        }));
    return returnList;
  }

  public List<YearOverviewDTO> getSystemsBuildInACertainYear(int year) {
    List<SSPTask> tasksCompleted = sspTaskRepository.findByDateCompletedInYear(year);
    List<YearOverviewDTO> systemsBuildInThisYear = new ArrayList<>();
    tasksCompleted.forEach(
        task -> {
          if (task.getConstructionTask() != null) {
            System system = task.getConstructionTask().getSystem();
            systemsBuildInThisYear.add(
                new YearOverviewDTO(system.getName(), system.getSystemType()));
          }
        });
    return systemsBuildInThisYear;
  }

  private List<String> getAffectedSystems(SSPTask sspTask) {

    List<String> affectedSystems = new ArrayList<>();
    sspTaskRepository
        .findByEmployeeAndIndexGreaterThan(sspTask.getEmployee(), sspTask.getIndex())
        .forEach(
            (task) -> {
              if (task.getConstructionTask() != null) {
                affectedSystems.add(task.getConstructionTask().getSystem().getName());
              }
            });
    return affectedSystems;
  }

  public void setDelayChecked(SystemSetCheckedDTO dto) {
    System system =
        systemRepository.findByName(dto.systemName()).orElseThrow(NotFoundException::new);
    if (dto.checked() != null) {
      system.setDelayCheckedBySupervisor(dto.checked());
      systemRepository.save(system);
    }
  }

  public void createNewSystem(SystemPostPatchDTO systemPostPatchDTO) {
    validateName(systemPostPatchDTO);

    System system = new System(systemPostPatchDTO.name());

    if (systemPostPatchDTO.employeeResponsible() != null) {
      system.setEmployeeResponsible(systemPostPatchDTO.employeeResponsible());
    }

    system.setPoNumber(systemPostPatchDTO.poNumber());
    system.setSystemType(systemPostPatchDTO.systemType());
    system.setAgreedDate(systemPostPatchDTO.agreedDate());
    system.setActualDeliveryDate(systemPostPatchDTO.actualDeliveryDate());
    system.setNotes(systemPostPatchDTO.notes());
    system.setCustomerContactInformation(systemPostPatchDTO.customerContactInformation());
    system.setProjectInformation(systemPostPatchDTO.projectInformation());
    system.setStatus(SystemStatus.TO_BE_PLANNED);
    system.setSeller(systemPostPatchDTO.seller());

    createConstructionTask(systemPostPatchDTO, system);
    createTestTask(systemPostPatchDTO, system);

    systemRepository.save(system);
  }

  public void updateSystem(SystemPostPatchDTO dto, String name, Map<String, Boolean> nullValues) {
    System system = systemRepository.findByName(name).orElseThrow(NotFoundException::new);

    if (dto.name() != null) {
      validateName(dto);
      system.setName(dto.name());
    }
    if (dto.poNumber() != null) {
      system.setPoNumber(dto.poNumber());
    }
    if (dto.orderPickedByWarehouse() != null) {
      system.setOrderPickedByWarehouse(dto.orderPickedByWarehouse());
    }
    if (dto.systemType() != null) {
      system.setSystemType(dto.systemType());
    }
    if (dto.employeeResponsible() != null) {
      system.setEmployeeResponsible(dto.employeeResponsible());
    }
    if (dto.agreedDate() != null) {
      system.setAgreedDate(dto.agreedDate());
    }
    if (nullValues.get("actualDeliveryDate")) {
      system.setActualDeliveryDate(null);
    }
    if (dto.actualDeliveryDate() != null) {
      system.setActualDeliveryDate(dto.actualDeliveryDate());
    }
    if (dto.customerContactInformation() != null) {
      system.setCustomerContactInformation(dto.customerContactInformation());
    }
    if (dto.status() != null) {
      system.setStatus(dto.status());
    }
    if (dto.estimatedConstructionDays() != null) {
      system.getConstructionTask().getSspTask().setEstimatedTime(dto.estimatedConstructionDays());
    }
    if (nullValues.get("employeeSSP")) {
      system.getConstructionTask().getSspTask().setEmployee(null);
    }
    if (dto.employeeSSP() != null) {
      setSSPEmployee(dto, system.getConstructionTask().getSspTask());
    }

    handleConstructionDates(system, dto, nullValues);

    if (dto.estimatedTestDays() != null) {
      system.getTestTask().setEstimatedTime(dto.estimatedTestDays());
    }
    if (nullValues.get("employeeFT")) {
      system.getTestTask().setEmployee(null);
    }
    if (dto.employeeFT() != null) {
      setFTEmployee(dto, system.getTestTask());
    }

    handleTestDates(system, dto, nullValues);

    if (dto.seller() != null) {
      system.setSeller(dto.seller());
    }
    if (dto.projectInformation() != null) {
      system.setProjectInformation(dto.projectInformation());
    }
    if (dto.notes() != null) {
      system.setNotes(dto.notes());
    }

    systemRepository.save(system);
  }

  public Map<String, Boolean> checkForExplicitNullValues(JsonNode jsonNode) {
    Map<String, Boolean> nullValues = new HashMap<>();
    nullValues.put("startOfConstruction", isExplicitlyNull(jsonNode, "startOfConstruction"));
    nullValues.put("endOfConstruction", isExplicitlyNull(jsonNode, "endOfConstruction"));
    nullValues.put("startOfTest", isExplicitlyNull(jsonNode, "startOfTest"));
    nullValues.put("endOfTest", isExplicitlyNull(jsonNode, "endOfTest"));
    nullValues.put("actualDeliveryDate", isExplicitlyNull(jsonNode, "actualDeliveryDate"));
    nullValues.put("employeeSSP", isExplicitlyNull(jsonNode, "employeeSSP"));
    nullValues.put("employeeFT", isExplicitlyNull(jsonNode, "employeeFT"));
    return nullValues;
  }

  private boolean isExplicitlyNull(JsonNode jsonNode, String field) {
    return jsonNode.has(field) && jsonNode.get(field).isNull();
  }

  private void validateName(SystemPostPatchDTO dto) {
    if (systemRepository.findByName(dto.name()).isPresent()) {
      throw new BadRequestException("System name already exists");
    }
    if (dto.name() == null || dto.name().isBlank()) {
      throw new BadRequestException("System name is required");
    }
  }

  private void handleConstructionDates(
      System system, SystemPostPatchDTO dto, Map<String, Boolean> nullValues) {
    if (nullValues.get("startOfConstruction")) {
      if (!nullValues.get("endOfConstruction")
          && system.getConstructionTask().getSspTask().getDateCompleted() != null) {
        throw new BadRequestException(
            "Construction start date required for setting construction end date");
      }
      system.getConstructionTask().getSspTask().setDateStarted(null);
    }
    if (dto.startOfConstruction() != null) {
      setConstructionStartDate(dto, system.getConstructionTask());
    }
    if (nullValues.get("endOfConstruction")) {
      if (!nullValues.get("startOfTest") && system.getTestTask().getDateStarted() != null) {
        throw new BadRequestException("Construction end date required for setting test start date");
      }
      system.getConstructionTask().getSspTask().setDateCompleted(null);
    }
    if (dto.endOfConstruction() != null) {
      setConstructionEndDate(dto, system);
    }
  }

  private void handleTestDates(
      System system, SystemPostPatchDTO dto, Map<String, Boolean> nullValues) {
    if (nullValues.get("startOfTest")) {
      if (!nullValues.get("endOfTest") && system.getTestTask().getDateCompleted() != null) {
        throw new BadRequestException("Test start date required for setting test end date");
      }
      system.getTestTask().setDateStarted(null);
    }
    if (dto.startOfTest() != null) {
      setTestStartDate(dto, system);
    }
    if (nullValues.get("endOfTest")) {
      system.getTestTask().setDateCompleted(null);
    }
    if (dto.endOfTest() != null) {
      setTestEndDate(dto, system.getTestTask());
    }
  }

  private void setSSPEmployee(SystemPostPatchDTO dto, SSPTask sspTask) {
    if (dto.estimatedConstructionDays() == null && sspTask.getEstimatedTime() == null) {
      throw new BadRequestException(
          "Estimated construction days required for assigning an SSP employee");
    }
    Employee sspEmployee =
        employeeRepository.findById(dto.employeeSSP()).orElseThrow(NotFoundException::new);
    if (sspEmployee.getFunction() != Function.SSP
        && sspEmployee.getFunction() != Function.SSP_TEAM_LEADER) {
      throw new BadRequestException("SSP employee needs to have function SSP or SSP team leader");
    }
    sspTaskService.assignEmployee(new SSPTaskAssignDTO(sspTask.getId(), sspEmployee.getId()));
  }

  private void setConstructionStartDate(SystemPostPatchDTO dto, ConstructionTask constructionTask) {
    if (dto.estimatedConstructionDays() == null
        && constructionTask.getSspTask().getEstimatedTime() == null) {
      throw new BadRequestException(
          "Estimated construction days required for setting construction start date");
    }
    if (dto.employeeSSP() == null && constructionTask.getSspTask().getEmployee() == null) {
      throw new BadRequestException("SSP employee required for setting construction start date");
    }

    LocalDate endDate =
        dto.endOfConstruction() != null
            ? dto.endOfConstruction()
            : constructionTask.getSspTask().getDateCompleted();
    if (endDate != null && dto.startOfConstruction().isAfter(endDate)) {
      throw new BadRequestException(
          "Construction end date must be on or after construction start date");
    }

    constructionTask.getSspTask().setDateStarted(dto.startOfConstruction());
  }

  private void setConstructionEndDate(SystemPostPatchDTO dto, System system) {
    ConstructionTask constructionTask = system.getConstructionTask();
    LocalDate startDate =
        dto.startOfConstruction() != null
            ? dto.startOfConstruction()
            : constructionTask.getSspTask().getDateStarted();

    if (startDate == null) {
      throw new BadRequestException(
          "Construction start date required for setting construction end date");
    }
    if (dto.endOfConstruction().isBefore(startDate)) {
      throw new BadRequestException(
          "Construction end date must be on or after construction start date");
    }

    LocalDate testStartDate =
        dto.startOfTest() != null ? dto.startOfTest() : system.getTestTask().getDateStarted();
    if (testStartDate != null && dto.endOfConstruction().isAfter(testStartDate)) {
      throw new BadRequestException("Construction end date must be on or before test start date");
    }

    constructionTask.getSspTask().setDateCompleted(dto.endOfConstruction());
  }

  private void createConstructionTask(SystemPostPatchDTO dto, System system) {
    ConstructionTask newConstructionTask = new ConstructionTask();
    SSPTask newSSPTask = new SSPTask();
    sspTaskRepository.save(newSSPTask);

    if (dto.employeeSSP() != null) {
      setSSPEmployee(dto, newSSPTask);
    }

    newSSPTask.setEstimatedTime(dto.estimatedConstructionDays());

    newSSPTask.setConstructionTask(newConstructionTask);
    newConstructionTask.setSspTask(newSSPTask);
    newConstructionTask.setSystem(system);
    sspTaskRepository.save(newSSPTask);
    constructionTaskRepository.save(newConstructionTask);
    system.setConstructionTask(newConstructionTask);
  }

  private void setFTEmployee(SystemPostPatchDTO dto, TestTask testTask) {
    if (dto.estimatedTestDays() == null && testTask.getEstimatedTime() == null) {
      throw new BadRequestException("Estimated test days required for assigning an FT employee");
    }
    Employee ftEmployee =
        employeeRepository.findById(dto.employeeFT()).orElseThrow(NotFoundException::new);
    if (ftEmployee.getFunction() != Function.FT
        && ftEmployee.getFunction() != Function.FT_TEAM_LEADER) {
      throw new BadRequestException("FT employee needs to have function FT or FT team leader");
    }
    testTask.setEmployee(ftEmployee);
  }

  private void setTestStartDate(SystemPostPatchDTO dto, System system) {
    TestTask testTask = system.getTestTask();

    LocalDate constructionEndDate =
        dto.endOfConstruction() != null
            ? dto.endOfConstruction()
            : system.getConstructionTask().getSspTask().getDateCompleted();
    if (constructionEndDate == null) {
      throw new BadRequestException("Construction end date required for setting test start date");
    }
    if (!dto.startOfTest().isAfter(constructionEndDate)) {
      throw new BadRequestException("Test start date must be on or after construction end date");
    }

    if (dto.estimatedTestDays() == null && system.getTestTask().getEstimatedTime() == null) {
      throw new BadRequestException("Estimated test days required for setting test start date");
    }
    if (dto.employeeFT() == null && system.getTestTask().getEmployee() == null) {
      throw new BadRequestException("FT employee required for setting test start date");
    }
    LocalDate endDate = dto.endOfTest() != null ? dto.endOfTest() : testTask.getDateCompleted();
    if (endDate != null && dto.startOfTest().isAfter(endDate)) {
      throw new BadRequestException("Test end date must be on or after test start date");
    }
    testTask.setDateStarted(dto.startOfTest());
  }

  private void setTestEndDate(SystemPostPatchDTO dto, TestTask testTask) {
    LocalDate startDate = dto.startOfTest() != null ? dto.startOfTest() : testTask.getDateStarted();

    if (startDate == null) {
      throw new BadRequestException("Test start date required for setting test end date");
    }
    if (dto.endOfTest().isBefore(startDate)) {
      throw new BadRequestException("Test end date must be on or after test start date");
    }
    testTask.setDateCompleted(dto.endOfTest());
  }

  private void createTestTask(SystemPostPatchDTO dto, System system) {
    TestTask newTestTask = new TestTask();

    if (dto.employeeFT() != null) {
      setFTEmployee(dto, newTestTask);
    }

    newTestTask.setEstimatedTime(dto.estimatedTestDays());

    newTestTask.setSystem(system);
    testTaskRepository.save(newTestTask);
    system.setTestTask(newTestTask);
  }
}
