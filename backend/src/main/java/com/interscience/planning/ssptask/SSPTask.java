package com.interscience.planning.ssptask;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.employee.Employee;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class SSPTask {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID taskId;

  @ManyToOne private Employee employee;

  @OneToOne private ConstructionTask constructionTask;

  //    @OneToOne
  private String task;

  private int index;
}
