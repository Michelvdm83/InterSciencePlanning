package com.interscience.planning.constructiontask;

import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.system.System;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ConstructionTask {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID taskId;

  @OneToOne private System system;

  @OneToOne(mappedBy = "constructionTask")
  private SSPTask sspTask;

  private Integer estimatedTime;

  private LocalDate dateStarted;
}
