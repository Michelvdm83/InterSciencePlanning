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
  public ResponseEntity<Void> createTask() {
    return ResponseEntity.ok().build();
  }
}
