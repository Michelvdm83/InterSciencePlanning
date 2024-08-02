package com.interscience.planning.system;

import java.util.Date;
import java.util.UUID;

public record SystemDto(
    String name,
    String poNumber,
    String systemType,
    Date estimatedDeliveryDate,
    Date actualDeliveryDate,
    UUID employeeResponsible,
    UUID employeeFT,
    UUID employeeSSP,
    String notes,
    String customerContactInformation,
    String projectInformation,
    Boolean schemeApproved,
    Boolean specsheetApproved,
    String status,
    Boolean delayCheckedBySupervisor) {

  public static SystemDto from(System system) {
    return new SystemDto(
        system.getName(),
        system.getPoNumber(),
        system.getSystemType(),
        system.getEstimatedDeliveryDate(),
        system.getActualDeliveryDate(),
        system.getEmployeeResponsible(),
        system.getTestTask(),
        system.getConstructionTask(),
        system.getNotes(),
        system.getCustomerContactInformation(),
        system.getProjectInformation(),
        system.isSchemeApproved(),
        system.isSpecsheetApproved(),
        system.getStatus().toString(),
        system.isDelayCheckedBySupervisor());
  }
}
