package com.interscience.planning.employee;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Employee implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;

  private String email;

  private Function function;

  private String password;

  public Employee(String name, String email, String password, Function function) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.function = function;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(function.name()));
  }

  @Override
  public String getUsername() {
    return name;
  }

  @Override
  public boolean equals(Object other) {
    if (!(other instanceof Employee otherEmployee)) return false;
    return id.equals(otherEmployee.id);
  }
}
