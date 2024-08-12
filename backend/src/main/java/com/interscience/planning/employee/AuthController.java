package com.interscience.planning.employee;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.security.AuthDTO;
import com.interscience.planning.security.JwtService;
import com.interscience.planning.security.TokenDTO;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${interscience.cors}")
public class AuthController {
  private final JwtService jwtService;
  private final EmployeeRepository employeeRepository;
  private final PasswordEncoder passwordEncoder;

  @PostMapping("login")
  public ResponseEntity<TokenDTO> login(@RequestBody AuthDTO authDTO) {
    String email = authDTO.email();
    String password = authDTO.password();
    if (email == null) throw new BadRequestException("Email is required");
    if (password == null) throw new BadRequestException("Password is required");

    Optional<Employee> possibleEmployee = employeeRepository.findByEmail(email);
    if (possibleEmployee.isEmpty()) throw new BadRequestException("User doesn't exist");
    Employee employee = possibleEmployee.get();

    if (!passwordEncoder.matches(password, employee.getPassword())) {
      throw new BadRequestException("Password is incorrect");
    }

    return ResponseEntity.ok(
        new TokenDTO(jwtService.generateTokenForUser(employee), EmployeeDTO.from(employee)));
  }
}
