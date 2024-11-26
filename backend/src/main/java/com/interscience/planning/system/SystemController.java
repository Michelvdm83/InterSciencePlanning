package com.interscience.planning.system;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
@RequestMapping("/api/v1/systems")
public class SystemController {

  private final SystemService systemService;
  private final ObjectMapper objectMapper;

  @GetMapping("/{systemName}")
  public ResponseEntity<SystemDTO> getSystem(@PathVariable String systemName) {
    System system = systemService.getSystem(systemName);
    return ResponseEntity.ok(SystemDTO.from(system));
  }

  @GetMapping("/search")
  public List<String> searchByName(@RequestParam String contains) {
    return systemService.searchByName(contains);
  }

  @GetMapping("/delayed")
  public List<SystemDTO> getDelayedSystems() {
    return systemService.getDelayedSystems();
  }

  @PatchMapping("/delayed/{systemName}")
  public ResponseEntity<?> setDelayChecked(@PathVariable String systemName) {
    systemService.setDelayCheckedTrue(systemName);
    return ResponseEntity.ok().build();
  }

  @PostMapping
  public ResponseEntity<?> createNewSystem(@RequestBody SystemPostPatchDTO systemPostPatchDTO) {
    systemService.createNewSystem(systemPostPatchDTO);
    return ResponseEntity.status(201).build();
  }

  @PatchMapping("{systemName}")
  public ResponseEntity<?> updateSystem(
      @RequestBody JsonNode jsonNode, @PathVariable String systemName) {
    Map<String, Boolean> nullValues = systemService.checkForExplicitNullValues(jsonNode);

    SystemPostPatchDTO dto = objectMapper.convertValue(jsonNode, SystemPostPatchDTO.class);

    systemService.updateSystem(dto, systemName, nullValues);
    return ResponseEntity.ok().build();
  }
}
