package com.interscience.planning.system;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interscience.planning.employee.Employee;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    return ResponseEntity.ok(systemService.getSystem(systemName));
  }

  @GetMapping("/search")
  public List<String> searchByName(@RequestParam String contains) {
    return systemService.searchByName(contains);
  }

  @GetMapping("/delayed")
  public List<SystemDelayedDTO> getDelayedSystems() {
    return systemService.getDelayedSystems();
  }

  // endpoint that returns a list with all the systems that ssp finished building in the selected
  // year in the needed format to convert to a csv file on the front end
  @GetMapping("/year-overview/{year}")
  public ResponseEntity<List<YearOverviewDTO>> getSystemsBuildInACertainYear(
      @PathVariable String year) {
    int intYear;
    try {
      intYear = Integer.parseInt(year);
    } catch (NumberFormatException e) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(systemService.getSystemsBuildInACertainYear(intYear));
  }

  @PatchMapping("/delayed")
  public ResponseEntity<?> setDelayChecked(@RequestBody SystemSetCheckedDTO dto) {
    systemService.setDelayChecked(dto);
    return ResponseEntity.ok().build();
  }

  @PostMapping
  public ResponseEntity<?> createNewSystem(@RequestBody SystemPostPatchDTO systemPostPatchDTO) {
    systemService.createNewSystem(systemPostPatchDTO);
    return ResponseEntity.status(201).build();
  }

  @PatchMapping("{systemName}")
  public ResponseEntity<?> updateSystem(
      @RequestBody JsonNode jsonNode,
      @PathVariable String systemName,
      Authentication authentication) {
    Map<String, Boolean> nullValues = systemService.checkForExplicitNullValues(jsonNode);

    SystemPostPatchDTO dto = objectMapper.convertValue(jsonNode, SystemPostPatchDTO.class);

    Employee employee = (Employee) authentication.getPrincipal();

    if (dto.status() == SystemStatus.DONE) {
      if (!employee.getFunction().name().contains("TEAM_LEADER")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
    }

    if (dto.orderPickedByWarehouse() != null) {
      if (!employee.getFunction().name().contains("TEAM_LEADER")
          || !employee.getFunction().name().contains("WAREHOUSE")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
    }

    systemService.updateSystem(dto, systemName, nullValues);
    return ResponseEntity.ok().build();
  }
}
