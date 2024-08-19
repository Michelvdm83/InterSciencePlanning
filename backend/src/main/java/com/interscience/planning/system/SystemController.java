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
  private final SystemRepository systemRepository;

  //  @GetMapping("/{id}")
  //  public ResponseEntity<SystemDto> getSystem(@PathVariable UUID id) {
  //    var possibleSystem = systemRepository.findById(id);
  //    if (possibleSystem.isEmpty()) {
  //      return ResponseEntity.notFound().build();
  //    }
  //
  //    return ResponseEntity.ok(SystemDto.from(possibleSystem.get()));
  //  }

  @GetMapping("/{systemName}")
  public ResponseEntity<SystemDto> getSystem(@PathVariable String systemName) {
    var possibleSystem = systemRepository.findByName(systemName);
    if (possibleSystem.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(SystemDto.from(possibleSystem.get()));
  }

  @PostMapping
  public ResponseEntity<?> createNewSystem(@RequestBody SystemDto systemDto) {
    systemService.createNewSystem(systemDto);
    return ResponseEntity.status(201).build();
  }
}
