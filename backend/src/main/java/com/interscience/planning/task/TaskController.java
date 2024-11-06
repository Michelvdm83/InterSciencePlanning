package com.interscience.planning.task;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class TaskController {
  private final TaskService taskService;

  @PostMapping
  public ResponseEntity<?> createTask(@RequestBody CreateTaskDTO createTaskDTO) {
    taskService.createTask(createTaskDTO);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("{id}")
  public ResponseEntity<?> deleteTask(@PathVariable UUID id) {
    taskService.deleteTask(id);
    return ResponseEntity.noContent().build();
  }
}
