package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Holiday {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne private Employee employee;

  private LocalDate startDate;

  private LocalDate endDate;

  public Holiday(Employee employee, LocalDate startDate, LocalDate endDate) {
    this.employee = employee;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
