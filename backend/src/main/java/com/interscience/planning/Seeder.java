package com.interscience.planning;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
import java.util.List;
import com.interscience.planning.system.System;
import com.interscience.planning.system.SystemRepository;
import com.interscience.planning.system.SystemStatus;
import java.sql.Date;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final EmployeeRepository employeeRepository;
  private final PasswordEncoder passwordEncoder;

  private final SystemRepository systemRepository;

  @Override
  public void run(String... args) throws Exception {
    if (employeeRepository.count() == 0) {
      Employee employee1 =
          new Employee(
              "Employee1",
              "employee1@gmail.com",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.TEAM_LEADER);
      Employee employee2 =
          new Employee(
              "Employee2",
              "employee2@gmail.com",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee3 =
          new Employee(
              "Employee3",
              "employee3@gmail.com",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.FT);
      employeeRepository.saveAll(List.of(employee1, employee2, employee3));
  public void run(String... args) {
    if (systemRepository.findAll().isEmpty()) {
      createSystem();
    }
  }

  private void createSystem() {
    System system = new System();
    system.setName("brt-001");
    system.setSystemType("big");

    LocalDate today = LocalDate.now();
    system.setEstimatedDeliveryDate(Date.valueOf(today.plusDays(7)));
    system.setActualDeliveryDate(Date.valueOf(today));

    system.setStatus(SystemStatus.BUILDING);

    systemRepository.save(system);
  }
}
