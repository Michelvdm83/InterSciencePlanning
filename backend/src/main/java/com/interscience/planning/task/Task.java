package com.interscience.planning.task;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;
  private Integer estimatedTime;
  private Date dateStarted;

  public Task(String name, Integer estimatedTime) {
    this.name = name;
    this.estimatedTime = estimatedTime;
  }
}
