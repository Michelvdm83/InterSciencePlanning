package com.interscience.planning.task;

import com.fasterxml.jackson.databind.JsonNode;
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

  @GetMapping("{id}")
  public ResponseEntity<TaskDTO> getTask(@PathVariable UUID id) {
    Task task = taskService.getTask(id);
    return ResponseEntity.ok(TaskDTO.from(task));
  }

  @PostMapping
  public ResponseEntity<?> createTask(@RequestBody CreateTaskDTO createTaskDTO) {
    taskService.createTask(createTaskDTO);
    return ResponseEntity.ok().build();
  }

  @PatchMapping("{id}")
  public ResponseEntity<?> updateTask(@PathVariable UUID id, @RequestBody JsonNode jsonNode) {
    taskService.updateTask(jsonNode, id);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("{id}")
  public ResponseEntity<?> deleteTask(@PathVariable UUID id) {
    taskService.deleteTask(id);
    return ResponseEntity.noContent().build();
  }
}
