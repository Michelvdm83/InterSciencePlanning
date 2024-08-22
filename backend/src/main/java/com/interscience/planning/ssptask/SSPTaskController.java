package com.interscience.planning.ssptask;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
@RequestMapping("api/v1/ssptasks")
public class SSPTaskController {
  private final SSPTaskRepository sspTaskRepository;
  private final SSPTaskService sspTaskService;

  @GetMapping("/unplanned")
  public List<SSPTaskOverviewDTO> getUnplannedSSPTasks() {
    return sspTaskRepository.findByEmployeeIsNull().stream().map(SSPTaskOverviewDTO::from).toList();
  }

  @PatchMapping
  public ResponseEntity<?> assignEmployee(@RequestBody SSPTaskAssignDTO sspTaskAssignDTO) {
    sspTaskService.assignEmployee(sspTaskAssignDTO);
    return ResponseEntity.ok().build();
  }
}
