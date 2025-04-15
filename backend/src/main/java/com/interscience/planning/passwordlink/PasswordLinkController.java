package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.employee.EmployeeRepository;
import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/password-links")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class PasswordLinkController {
  private final PasswordLinkRepository passwordLinkRepository;
  private final EmployeeRepository employeeRepository;
  private final PasswordLinkService passwordLinkService;

  @PostMapping("{employeeId}")
  public ResponseEntity<PasswordLink> createLink(@PathVariable UUID employeeId) {
    Employee employee = employeeRepository.findById(employeeId).orElseThrow(NotFoundException::new);
    if (!employee.isEnabled()) {
      throw new NotFoundException();
    }
    if (passwordLinkRepository.findByEmployee(employee).isPresent()) {
      throw new BadRequestException("A password link for this employee already exists");
    }

    PasswordLink passwordLink = new PasswordLink(employee, LocalDateTime.now());
    passwordLinkRepository.save(passwordLink);
    passwordLinkService.sendEmail(passwordLink, employee);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/send-reset-link")
  public ResponseEntity<PasswordLink> createResetLink(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    if (email == null) {
      throw new BadRequestException("Email is required");
    }
    Employee employee =
        employeeRepository.findByEmail(email.toLowerCase()).orElseThrow(NotFoundException::new);
    if (!employee.isEnabled()) {
      throw new NotFoundException();
    }
    if (passwordLinkRepository.findByEmployee(employee).isPresent()) {
      throw new BadRequestException("A password link for this employee already exists");
    }

    PasswordLink passwordLink = new PasswordLink(employee, LocalDateTime.now());
    passwordLinkRepository.save(passwordLink);
    passwordLinkService.sendEmail(passwordLink, employee);

    return ResponseEntity.ok().build();
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteLink(@PathVariable UUID id) {
    PasswordLink passwordLink =
        passwordLinkRepository.findById(id).orElseThrow(NotFoundException::new);
    passwordLinkRepository.delete(passwordLink);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("{id}")
  public ResponseEntity<Void> checkIfLinkIsValid(@PathVariable UUID id) {
    PasswordLink passwordLink =
        passwordLinkRepository.findById(id).orElseThrow(NotFoundException::new);
    if (passwordLinkService.linkHasExpired(passwordLink)) {
      passwordLinkRepository.delete(passwordLink);
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok().build();
  }
}
