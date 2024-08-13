package com.interscience.planning.task;

import com.interscience.planning.ssptask.SSPTask;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;
  private Integer estimatedTime;
  private Date dateStarted;

  @OneToOne(mappedBy = "task")
  private SSPTask sspTask;

  public Task(String name, Integer estimatedTime) {
    this.name = name;
    this.estimatedTime = estimatedTime;
  }
}
