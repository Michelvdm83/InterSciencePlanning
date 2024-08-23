package com.interscience.planning.task;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {
  private final TaskRepository taskRepository;
  private final SSPTaskRepository sspTaskRepository;

  public void createTask(CreateTaskDTO createTaskDTO) {
    if (createTaskDTO.name() == null || createTaskDTO.name().isEmpty()) {
      throw new BadRequestException("Name is required");
    }
    if (createTaskDTO.estimatedTime() == null) {
      throw new BadRequestException("Estimated time is required");
    }

    Task newTask = new Task(createTaskDTO.name(), createTaskDTO.estimatedTime());
    taskRepository.save(newTask);

    SSPTask newSSPTask = new SSPTask();
    newSSPTask.setTask(newTask);
    sspTaskRepository.save(newSSPTask);
  }
}
