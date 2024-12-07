package com.interscience.planning.system;

import com.interscience.planning.ssptask.SSPTask;
import java.time.LocalDate;
import java.util.UUID;

public record SystemDTO(
    String name,
    String poNumber,
    String systemType,
    LocalDate agreedDate,
    LocalDate actualDeliveryDate,
    String employeeResponsible,
    UUID employeeFT,
    UUID employeeSSP,
    String notes,
    String customerContactInformation,
    String projectInformation,
    String status,
    Boolean delayCheckedBySupervisor,
    LocalDate startOfConstruction,
    LocalDate endOfConstruction,
    Integer estimatedConstructionDays,
    LocalDate startOfTest,
    LocalDate endOfTest,
    Integer estimatedTestDays,
    String seller) {

  public static SystemDTO from(System system) {

    String responsiblePerson = system.getEmployeeResponsible();

    UUID ftEmployee;
    if (system.getTestTask() == null || system.getTestTask().getEmployee() == null) {
      ftEmployee = null;
    } else {
      ftEmployee = system.getTestTask().getEmployee().getId();
    }

    LocalDate startOfTest;
    LocalDate endOfTest;
    Integer estimatedTestDays;
    if (system.getTestTask() == null) {
      startOfTest = null;
      estimatedTestDays = null;
      endOfTest = null;
    } else {
      startOfTest = system.getTestTask().getDateStarted();
      endOfTest = system.getTestTask().getDateCompleted();
      estimatedTestDays = system.getTestTask().getEstimatedTime();
    }

    UUID sspEmployee;
    if (system.getConstructionTask() == null
        || system.getConstructionTask().getSspTask() == null
        || system.getConstructionTask().getSspTask().getEmployee() == null) {
      sspEmployee = null;
    } else {
      sspEmployee = system.getConstructionTask().getSspTask().getEmployee().getId();
    }

    LocalDate startOfConstruction;
    LocalDate endOfConstruction;
    Integer estimatedConstructionDays;
    if (system.getConstructionTask() == null || system.getConstructionTask().getSspTask() == null) {
      startOfConstruction = null;
      endOfConstruction = null;
      estimatedConstructionDays = null;
    } else {
      SSPTask thisSSPTask = system.getConstructionTask().getSspTask();
      startOfConstruction = thisSSPTask.getDateStarted();
      endOfConstruction = thisSSPTask.getDateCompleted();
      estimatedConstructionDays = thisSSPTask.getEstimatedTime();
    }

    return new SystemDTO(
        system.getName(),
        system.getPoNumber(),
        system.getSystemType(),
        system.getAgreedDate(),
        system.getActualDeliveryDate(),
        responsiblePerson,
        ftEmployee,
        sspEmployee,
        system.getNotes(),
        system.getCustomerContactInformation(),
        system.getProjectInformation(),
        system.getStatus().toString(),
        system.getDelayCheckedBySupervisor(),
        startOfConstruction,
        endOfConstruction,
        estimatedConstructionDays,
        startOfTest,
        endOfTest,
        estimatedTestDays,
        system.getSeller());
  }
}
