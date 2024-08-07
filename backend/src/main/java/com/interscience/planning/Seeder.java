package com.interscience.planning;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final EmployeeRepository employeeRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    if (employeeRepository.count() == 0) {
      Employee employee1 =
          new Employee(
              "Teamleider",
              "teamleider@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.TEAM_LEADER);
      Employee employee2 =
          new Employee(
              "SSP Medewerker",
              "ssp@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee3 =
          new Employee(
              "Final Test Medewerker",
              "ft@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.FT);
      employeeRepository.saveAll(List.of(employee1, employee2, employee3));
    }
  }
}
