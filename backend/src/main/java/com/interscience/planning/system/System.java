package com.interscience.planning.system;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class System {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID systemId;

  private String name;

  private String poNumber;

  private String systemType;

  private Date estimatedDeliveryDate;

  private Date actualDeliveryDate;

  private UUID employeeResponsible;

  private UUID testTask;

  private UUID constructionTask;

  private String notes;

  private String customerContactInformation;

  private String projectInformation;

  private boolean schemeApproved;

  private boolean specsheetApproved;

  @Enumerated(EnumType.STRING)
  private SystemStatus status;

  private boolean delayCheckedBySupervisor = true;
}