package com.interscience.planning.task;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.ssptask.SSPTaskService;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
  private final TaskRepository taskRepository;
  private final SSPTaskRepository sspTaskRepository;
  private final SSPTaskService sspTaskService;

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
    taskRepository.save(newTask);

    SSPTask newSSPTask = new SSPTask();
    newSSPTask.setEstimatedTime(createTaskDTO.estimatedTime());
    newSSPTask.setTask(newTask);
    sspTaskRepository.save(newSSPTask);
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
