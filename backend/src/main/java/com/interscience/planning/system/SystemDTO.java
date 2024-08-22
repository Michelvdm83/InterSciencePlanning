package com.interscience.planning.system;

import java.time.LocalDate;

public record SystemDTO(
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
    Integer estimatedConstructionDays,
    LocalDate startOfTest,
    Integer estimatedTestDays) {

  public static SystemDTO from(System system) {

    String responsiblePerson =
        system.getEmployeeResponsible() == null ? null : system.getEmployeeResponsible().getName();

    String ftEmployee;
    if (system.getTestTask() == null || system.getTestTask().getEmployee() == null) {
      ftEmployee = null;
    } else {
      ftEmployee = system.getTestTask().getEmployee().getName();
    }

    LocalDate startOfTest;
    Integer estimatedTestDays;
    if (system.getTestTask() == null) {
      startOfTest = null;
      estimatedTestDays = null;
    } else {
      startOfTest = system.getTestTask().getDateStarted();
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
    Integer estimatedConstructionDays;
    if (system.getConstructionTask() == null) {
      startOfConstruction = null;
      estimatedConstructionDays = null;
    } else {
      startOfConstruction = system.getConstructionTask().getDateStarted();
      estimatedConstructionDays = system.getConstructionTask().getEstimatedTime();
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
        system.isSchemeApproved(),
        system.isSpecsheetApproved(),
        system.getStatus().toString(),
        system.isDelayCheckedBySupervisor(),
        startOfConstruction,
        estimatedConstructionDays,
        startOfTest,
        estimatedTestDays);
  }
}
