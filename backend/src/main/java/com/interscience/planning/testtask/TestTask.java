package com.interscience.planning.testtask;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.system.System;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class TestTask {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID taskId;

  @OneToOne private System system;

  @ManyToOne private Employee employee;

  private Integer estimatedTime;

  private LocalDate dateStarted;

  private LocalDate dateCompleted;
}
