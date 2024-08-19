package com.interscience.planning.system;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.testtask.TestTask;
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

  @Column(unique = true, nullable = false)
  private String name;

  private String poNumber;

  private String systemType;

  @Temporal(TemporalType.DATE)
  private Date agreedDate;

  @Temporal(TemporalType.DATE)
  private Date actualDeliveryDate;

  @ManyToOne private Employee employeeResponsible;

  @OneToOne(mappedBy = "system")
  private TestTask testTask;

  @OneToOne(mappedBy = "system")
  private ConstructionTask constructionTask;

  private String notes;

  private String customerContactInformation;

  private String projectInformation;

  private boolean schemeApproved;

  private boolean specsheetApproved;

  @Enumerated(EnumType.STRING)
  private SystemStatus status;

  private boolean delayCheckedBySupervisor = true;

  public System(String name) {
    this.name = name;
  }
}
