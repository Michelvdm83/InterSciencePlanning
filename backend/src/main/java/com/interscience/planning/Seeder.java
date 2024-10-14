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
import com.interscience.planning.task.TaskService;
import com.interscience.planning.testtask.TestTask;
import com.interscience.planning.testtask.TestTaskRepository;
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
  private final TaskService taskService;

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
      Employee employee4 =
          new Employee(
              "SSP Medewerker2",
              "ssp2@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee5 =
          new Employee(
              "SSP Medewerker3",
              "ssp3@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee6 =
          new Employee(
              "SSP Medewerker4",
              "ssp4@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee7 =
          new Employee(
              "SSP Medewerker5",
              "ssp5@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee8 =
          new Employee(
              "SSP Medewerker6",
              "ss6p@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      Employee employee9 =
          new Employee(
              "SSP Medewerker7",
              "ssp7@interscience.nl",
              passwordEncoder.encode("Wachtwoord123!"),
              Function.SSP);
      employeeRepository.saveAll(
          List.of(
              employee1, employee2, employee3, employee4, employee5, employee6, employee7,
              employee8, employee9));
    }
    if (sspTaskRepository.findAll().isEmpty()) {
      createSSPTasks();
    }
    if (systemRepository.findAll().isEmpty()) {
      createSystem();
    }
  }

  private void createSSPTasks() {
    Task task1 = new Task("opruimen");
    Task task2 = new Task("klaarzetten");
    Task task3 = new Task("afstoffen");

    taskRepository.saveAll(List.of(task1, task2, task3));

    SSPTask ssp1 = new SSPTask();
    ssp1.setEstimatedTime(2);
    ssp1.setTask(task1);

    SSPTask ssp2 = new SSPTask();
    ssp2.setEstimatedTime(1);
    ssp2.setTask(task2);

    SSPTask ssp3 = new SSPTask();
    ssp3.setEstimatedTime(1);
    ssp3.setTask(task3);

    sspTaskRepository.saveAll(List.of(ssp1, ssp2, ssp3));
  }

  private void createSystem() {
    System system = new System();
    system.setName("brt-001");
    system.setSystemType("big");

    LocalDate today = LocalDate.now();
    system.setAgreedDate(today.plusDays(7));
    system.setActualDeliveryDate(today);

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

    SSPTask sspTask = new SSPTask();
    sspTask.setConstructionTask(constructionTask);
    sspTask.setEstimatedTime(2);

    systemRepository.save(system);
    testTaskRepository.save(testTask);
    constructionTaskRepository.save(constructionTask);
    sspTaskRepository.save(sspTask);
  }
}
