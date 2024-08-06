package com.interscience.planning.testtask;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.system.System;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class TestTask {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID taskId;

  @OneToOne private System system;

  @OneToMany private Employee employee;
}
