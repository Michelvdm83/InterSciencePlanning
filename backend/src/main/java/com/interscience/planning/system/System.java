package com.interscience.planning.system;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.testtask.TestTask;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class System {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID systemId;

  @Column(unique = true, nullable = false)
  private String name;

  private String poNumber;

  private String systemType;

  private LocalDate agreedDate;

  private LocalDate actualDeliveryDate;

  private String employeeResponsible;

  @OneToOne(mappedBy = "system", cascade = CascadeType.PERSIST)
  private TestTask testTask;

  @OneToOne(mappedBy = "system", cascade = CascadeType.PERSIST)
  private ConstructionTask constructionTask;

  private String notes;

  private String customerContactInformation;

  private String projectInformation;

  private String seller;

  @Enumerated(EnumType.STRING)
  private SystemStatus status;

  private boolean delayCheckedBySupervisor = true;

  public System(String name) {
    this.name = name;
  }
}
