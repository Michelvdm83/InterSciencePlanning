package com.interscience.planning.system;

import java.time.LocalDate;
import java.util.UUID;

public record SystemPostPatchDTO(
    String name,
    String poNumber,
    Boolean orderPickedByWarehouse,
    String systemType,
    String employeeResponsible,
    LocalDate agreedDate,
    LocalDate actualDeliveryDate,
    SystemStatus status,
    UUID employeeSSP,
    LocalDate startOfConstruction,
    LocalDate endOfConstruction,
    Integer estimatedConstructionDays,
    UUID employeeFT,
    LocalDate startOfTest,
    LocalDate endOfTest,
    Integer estimatedTestDays,
    String customerContactInformation,
    String projectInformation,
    String notes,
    String seller) {}
