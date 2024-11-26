package com.interscience.planning.task;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskAssignDTO;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.ssptask.SSPTaskService;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
  private final TaskRepository taskRepository;
  private final SSPTaskRepository sspTaskRepository;
  private final EmployeeRepository employeeRepository;
  private final SSPTaskService sspTaskService;

  public Task getTask(UUID id) {
    return taskRepository.findById(id).orElseThrow(NotFoundException::new);
  }

  public void createTask(CreateTaskDTO createTaskDTO) {
    if (createTaskDTO.name() == null || createTaskDTO.name().isBlank()) {
      throw new BadRequestException("Name is required");
    }
    if (createTaskDTO.estimatedTime() == null) {
      throw new BadRequestException("Estimated time is required");
    } else if (createTaskDTO.estimatedTime() <= 0) {
      throw new BadRequestException("Estimated time must be higher than 0");
    }

    Task newTask = new Task(createTaskDTO.name());
    newTask.setStatus(TaskStatus.TO_BE_PLANNED);
    taskRepository.save(newTask);

    SSPTask newSSPTask = new SSPTask();
    newSSPTask.setEstimatedTime(createTaskDTO.estimatedTime());
    newSSPTask.setTask(newTask);
    sspTaskRepository.save(newSSPTask);
  }

  public void updateTask(
      TaskDTO taskDTO,
      UUID id,
      boolean dateStartedExplicitlyNull,
      boolean dateCompletedExplicitlyNull,
      boolean employeeExplicitlyNull) {
    Task task = taskRepository.findById(id).orElseThrow(NotFoundException::new);
    if (taskDTO.name() != null && !taskDTO.name().isBlank()) {
      task.setName(taskDTO.name());
    }

    if (taskDTO.estimatedTime() != null) {
      if (taskDTO.estimatedTime() <= 0) {
        throw new BadRequestException("Estimated time must be higher than 0");
      }
      if (task.getSspTask() == null) {
        throw new BadRequestException("SSP Task can't be null");
      }
      task.getSspTask().setEstimatedTime(taskDTO.estimatedTime());
    }

    if (employeeExplicitlyNull) {
      task.getSspTask().setEmployee(null);
    }
    if (taskDTO.employee() != null) {
      Employee employee =
          employeeRepository.findById(taskDTO.employee()).orElseThrow(NotFoundException::new);
      sspTaskService.assignEmployee(
          new SSPTaskAssignDTO(task.getSspTask().getId(), employee.getId()));
      task.setStatus(TaskStatus.PLANNED);
    }

    updateDateStarted(taskDTO, task, dateStartedExplicitlyNull);
    updateDateCompleted(taskDTO, task, dateCompletedExplicitlyNull);

    taskRepository.save(task);
  }

  private void updateDateStarted(TaskDTO taskDTO, Task task, boolean dateStartedExplicitlyNull) {
    if (dateStartedExplicitlyNull) {
      task.getSspTask().setDateStarted(null);
      task.setStatus(TaskStatus.PLANNED);
    }

    if (taskDTO.dateStarted() != null) {
      if (task.getSspTask().getEmployee() == null) {
        throw new BadRequestException("Employee required for setting start date");
      }
      LocalDate endDate =
          taskDTO.dateCompleted() != null
              ? taskDTO.dateCompleted()
              : task.getSspTask().getDateCompleted();
      if (endDate != null && taskDTO.dateStarted().isAfter(endDate)) {
        throw new BadRequestException("Start date must be on or before end date");
      }
      task.getSspTask().setDateStarted(taskDTO.dateStarted());
      task.setStatus(TaskStatus.IN_PROGRESS);
    }
  }

  private void updateDateCompleted(
      TaskDTO taskDTO, Task task, boolean dateCompletedExplicitlyNull) {
    if (dateCompletedExplicitlyNull) {
      task.getSspTask().setDateCompleted(null);
      if (task.getSspTask().getDateStarted() != null) {
        task.setStatus(TaskStatus.IN_PROGRESS);
      }
    }

    if (taskDTO.dateCompleted() != null) {
      LocalDate startDate =
          taskDTO.dateStarted() != null
              ? taskDTO.dateStarted()
              : task.getSspTask().getDateStarted();
      if (startDate == null) {
        throw new BadRequestException("Start date required for setting end date");
      }
      if (taskDTO.dateCompleted().isBefore(startDate)) {
        throw new BadRequestException("End date must be on or after start date");
      }
      task.getSspTask().setDateCompleted(taskDTO.dateCompleted());
      task.setStatus(TaskStatus.FINISHED);
    }
  }

  public void deleteTask(UUID id) {
    Task task = taskRepository.findById(id).orElseThrow(NotFoundException::new);
    SSPTask sspTask = task.getSspTask();
    if (sspTask != null) {
      if (sspTask.getIndex() != null && sspTask.getEmployee() != null) {
        sspTaskRepository
            .findByEmployeeAndIndexGreaterThan(sspTask.getEmployee(), sspTask.getIndex())
            .forEach(
                (sspT) -> {
                  sspT.setIndex(sspT.getIndex() - 1);
                  sspTaskRepository.save(sspT);
                });
      }
      sspTaskRepository.delete(sspTask);
    }
    taskRepository.delete(task);
  }
}
