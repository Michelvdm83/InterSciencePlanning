package com.interscience.planning.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class TaskController {
  private final TaskRepository taskRepository;

  @PostMapping
  public ResponseEntity<?> createTask(@RequestBody CreateTaskDTO createTaskDTO) {

    if (createTaskDTO.name() == null || createTaskDTO.name().isEmpty()) {
      return ResponseEntity.badRequest().body("Name is required");
    }

    if (createTaskDTO.estimatedTime() == null || createTaskDTO.estimatedTime().equals("")) {
      return ResponseEntity.badRequest().body("Estimated time is required");
    }

    taskRepository.save(new Task(createTaskDTO.name(), createTaskDTO.estimatedTime()));
    return ResponseEntity.ok().build();
  }
}
