package com.interscience.planning.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
@RequestMapping("/api/v1/systems")
public class SystemController {

  private final SystemService systemService;

  @GetMapping("/{systemName}")
  public ResponseEntity<SystemDTO> getSystem(@PathVariable String systemName) {
    System system = systemService.getSystem(systemName);
    return ResponseEntity.ok(SystemDTO.from(system));
  }

  @PostMapping
  public ResponseEntity<?> createNewSystem(@RequestBody SystemPostPatchDTO systemPostPatchDTO) {
    systemService.createNewSystem(systemPostPatchDTO);
    return ResponseEntity.status(201).build();
  }

  @PatchMapping("{systemName}")
  public ResponseEntity<?> updateSystem(
      @RequestBody SystemPostPatchDTO systemPostPatchDTO, @PathVariable String systemName) {
    systemService.updateSystem(systemPostPatchDTO, systemName);
    return ResponseEntity.ok().build();
  }
}
