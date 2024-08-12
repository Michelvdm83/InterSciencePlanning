package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class PasswordLink {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne private Employee employee;

  private LocalDateTime dateCreated;

  public PasswordLink(Employee employee, LocalDateTime dateCreated) {
    this.employee = employee;
    this.dateCreated = dateCreated;
  }
}
