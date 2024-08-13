package com.interscience.planning.holiday;

import com.interscience.planning.employee.Employee;
import jakarta.persistence.*;
import java.util.Date;
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

  @Temporal(TemporalType.DATE)
  private Date startDate;

  @Temporal(TemporalType.DATE)
  private Date endDate;

  public Holiday(Employee employee, Date startDate, Date endDate) {
    this.employee = employee;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
