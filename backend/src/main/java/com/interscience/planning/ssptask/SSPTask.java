package com.interscience.planning.ssptask;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.task.Task;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class SSPTask {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne private Employee employee;

  @OneToOne private ConstructionTask constructionTask;

  @OneToOne private Task task;

  private Integer estimatedTime;

  private LocalDate dateStarted;

  private LocalDate dateCompleted;

  private Integer index;
}
