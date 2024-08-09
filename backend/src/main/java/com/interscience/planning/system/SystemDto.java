package com.interscience.planning.system;

import java.util.Date;

public record SystemDto(
    String name,
    String poNumber,
    String systemType,
    Date agreedDate,
    Date actualDeliveryDate,
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
    Date startOfConstruction,
    Integer estimatedConstructionDays) {

  public static SystemDto from(System system) {

    String responsiblePerson =
        system.getEmployeeResponsible() == null ? null : system.getEmployeeResponsible().getName();

    String ftEmployee;
    if (system.getTestTask() == null || system.getTestTask().getEmployee() == null) {
      ftEmployee = null;
    } else {
      ftEmployee = system.getTestTask().getEmployee().getName();
    }

    String sspEmployee;
    if (system.getConstructionTask() == null
        || system.getConstructionTask().getSspTask() == null
        || system.getConstructionTask().getSspTask().getEmployee() == null) {
      sspEmployee = null;
    } else {
      sspEmployee = system.getConstructionTask().getSspTask().getEmployee().getName();
    }

    Date startOfConstruction;
    Integer estimatedConstructionDays;
    if (system.getConstructionTask() == null) {
      startOfConstruction = null;
      estimatedConstructionDays = null;
    } else {
      startOfConstruction = system.getConstructionTask().getDateStarted();
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
        estimatedConstructionDays);
  }
}
