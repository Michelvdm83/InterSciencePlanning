package com.interscience.planning.system;

import java.time.LocalDate;

public record SystemDto(
    String name,
    String poNumber,
    String systemType,
    LocalDate agreedDate,
    LocalDate actualDeliveryDate,
    String employeeResponsible,
    String employeeFT,
    String employeeSSP,
    String notes,
    String customerContactInformation,
    String projectInformation,
    Boolean schemeApproved,
    Boolean specsheetApproved,
    String status,
    Boolean delayCheckedBySupervisor,
    LocalDate startOfConstruction,
    LocalDate endOfConstruction,
    Integer estimatedConstructionDays,
    LocalDate startOfTest,
    LocalDate endOfTest,
    Integer estimatedTestDays,
    String seller) {

  public static SystemDto from(System system) {

    String responsiblePerson =
        system.getEmployeeResponsible() == null ? null : system.getEmployeeResponsible().getName();

    String ftEmployee;
    if (system.getTestTask() == null || system.getTestTask().getEmployee() == null) {
      ftEmployee = null;
    } else {
      ftEmployee = system.getTestTask().getEmployee().getName();
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

    String sspEmployee;
    if (system.getConstructionTask() == null
        || system.getConstructionTask().getSspTask() == null
        || system.getConstructionTask().getSspTask().getEmployee() == null) {
      sspEmployee = null;
    } else {
      sspEmployee = system.getConstructionTask().getSspTask().getEmployee().getName();
    }

    LocalDate startOfConstruction;
    LocalDate endOfConstruction;
    Integer estimatedConstructionDays;
    if (system.getConstructionTask() == null) {
      startOfConstruction = null;
      endOfConstruction = null;
      estimatedConstructionDays = null;
    } else {
      startOfConstruction = system.getConstructionTask().getDateStarted();
      endOfConstruction = system.getConstructionTask().getDateCompleted();
      estimatedConstructionDays = system.getConstructionTask().getEstimatedTime();
    }

    return new SystemDto(
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
        system.isSchemeApproved(),
        system.isSpecsheetApproved(),
        system.getStatus().toString(),
        system.isDelayCheckedBySupervisor(),
        startOfConstruction,
        endOfConstruction,
        estimatedConstructionDays,
        startOfTest,
        endOfTest,
        estimatedTestDays,
        system.getSeller());
  }
}
