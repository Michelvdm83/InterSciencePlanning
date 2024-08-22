package com.interscience.planning;

import com.interscience.planning.constructiontask.ConstructionTask;
import com.interscience.planning.constructiontask.ConstructionTaskRepository;
import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.employee.Function;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.system.System;
import com.interscience.planning.system.SystemRepository;
import com.interscience.planning.system.SystemStatus;
import com.interscience.planning.task.Task;
import com.interscience.planning.task.TaskRepository;
import com.interscience.planning.testtask.TestTask;
import com.interscience.planning.testtask.TestTaskRepository;
import java.sql.Date;
import java.time.LocalDate;
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

  private final SystemRepository systemRepository;
  private final TestTaskRepository testTaskRepository;
  private final ConstructionTaskRepository constructionTaskRepository;
  private final SSPTaskRepository sspTaskRepository;
  private final TaskRepository taskRepository;

  @Override
  public void run(String... args) throws Exception {
    if (employeeRepository.count() == 0) {
      Employee employee1 =
          new Employee(
              "Teamleider",
              "teamleider@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP_TEAM_LEADER);
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
    if (sspTaskRepository.findAll().isEmpty()) {
      createSSPTasks();
    }
    if (systemRepository.findAll().isEmpty()) {
      createSystem();
    }
  }

  private void createSSPTasks() {
    Task task1 = new Task("opruimen", 2);
    Task task2 = new Task("klaarzetten", 1);
    Task task3 = new Task("afstoffen", 1);

    taskRepository.saveAll(List.of(task1, task2, task3));

    SSPTask ssp1 = new SSPTask();
    ssp1.setTask(task1);
    ssp1.setEmployee(employeeRepository.findByEmail("teamleider@interscience.nl").orElse(null));

    SSPTask ssp2 = new SSPTask();
    ssp2.setTask(task2);

    SSPTask ssp3 = new SSPTask();
    ssp3.setTask(task3);

    sspTaskRepository.saveAll(List.of(ssp1, ssp2, ssp3));
  }

  private void createSystem() {
    System system = new System();
    system.setName("brt-001");
    system.setSystemType("big");

    LocalDate today = LocalDate.now();
    system.setAgreedDate(Date.valueOf(today.plusDays(7)));
    system.setActualDeliveryDate(Date.valueOf(today));

    system.setStatus(SystemStatus.BUILDING);

    Employee responsiblePerson =
        employeeRepository.findByEmail("teamleider@interscience.nl").orElse(null);
    system.setEmployeeResponsible(responsiblePerson);

    TestTask testTask = new TestTask();
    testTask.setSystem(system);
    testTask.setEstimatedTime(3);

    Employee ftEmployee = employeeRepository.findByEmail("ft@interscience.nl").orElse(null);
    testTask.setEmployee(ftEmployee);

    ConstructionTask constructionTask = new ConstructionTask();
    constructionTask.setSystem(system);
    //    constructionTask.setEstimatedTime(2);

    SSPTask sspTask = new SSPTask();
    sspTask.setConstructionTask(constructionTask);
    sspTask.setIndex(1);

    Employee sspEmployee = employeeRepository.findByEmail("ssp@interscience.nl").orElse(null);
    //    sspTask.setEmployee(sspEmployee);

    systemRepository.save(system);
    testTaskRepository.save(testTask);
    constructionTaskRepository.save(constructionTask);
    sspTaskRepository.save(sspTask);
  }
}
