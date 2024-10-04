package com.interscience.planning.task;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
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

  public void updateTask(TaskDTO taskDTO, UUID id) {
    Task task = taskRepository.findById(id).orElseThrow(NotFoundException::new);
    if (taskDTO.name() != null && !taskDTO.name().isBlank()) {
      task.setName(taskDTO.name());
    }

    if (taskDTO.estimatedTime() != null) {
      if (taskDTO.estimatedTime() <= 0) {
        throw new BadRequestException("Estimated time must be higher than 0");
      }
      task.getSspTask().setEstimatedTime(taskDTO.estimatedTime());
    }

    if (taskDTO.employee() != null) {
      Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);
      task.getSspTask().setEmployee(employee);
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
        throw new BadRequestException("Start date must be before end date");
      }
      task.getSspTask().setDateStarted(taskDTO.dateStarted());
      task.setStatus(TaskStatus.IN_PROGRESS);
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
        throw new BadRequestException("End date must be after start date");
      }
      task.getSspTask().setDateCompleted(taskDTO.dateCompleted());
      task.setStatus(TaskStatus.FINISHED);
    }

    taskRepository.save(task);
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
