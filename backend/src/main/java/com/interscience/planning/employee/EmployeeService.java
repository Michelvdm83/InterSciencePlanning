package com.interscience.planning.employee;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
  private final EmployeeRepository employeeRepository;
  private final PasswordEncoder passwordEncoder;

  public List<EmployeeResponseDTO> findAll() {
    return employeeRepository.findAllByEnabledTrue().stream()
        .map(EmployeeResponseDTO::from)
        .collect(Collectors.toList());
  }

  public List<EmployeeResponseDTO> findAllByFunctionOrFunction(
      Function function1, Function function2) {
    return employeeRepository.findAllByFunctionOrFunction(function1, function2).stream()
        .map(EmployeeResponseDTO::from)
        .toList();
  }

  public EmployeeResponseDTO createEmployee(EmployeeDTO employeeDTO) {
    if (employeeDTO.name() == null || employeeDTO.name().isBlank()) {
      throw new BadRequestException("Name is required");
    }
    if (employeeDTO.email() == null || employeeDTO.email().isBlank()) {
      throw new BadRequestException("Email is required");
    }
    if (!isValidEmail(employeeDTO.email())) {
      throw new BadRequestException("Email is not valid");
    }
    if (employeeDTO.function() == null) {
      throw new BadRequestException("Function is required");
    }
    if (employeeRepository.findByEmail(employeeDTO.email()).isPresent()) {
      throw new BadRequestException("Employee with this email already exists");
    }

    Employee newEmployee =
        new Employee(employeeDTO.name(), employeeDTO.email(), null, employeeDTO.function());
    employeeRepository.save(newEmployee);
    return EmployeeResponseDTO.from(newEmployee);
  }

  public EmployeeResponseDTO editEmployee(
      EmployeeDTO employeeDTO, UUID id, Authentication authentication) {
    Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);
    Employee loggedInEmployee = (Employee) authentication.getPrincipal();

    if (employeeDTO.name() != null) {
      if (employeeDTO.name().isBlank()) {
        throw new BadRequestException("Name is required");
      }
      employee.setName(employeeDTO.name());
    }

    if (employeeDTO.email() != null) {
      if (!isValidEmail(employeeDTO.email())) {
        throw new BadRequestException("Email is not valid");
      }
      employee.setEmail(employeeDTO.email());
    }
    if (employeeDTO.function() != null) {
      if (employee.equals(loggedInEmployee)) {
        throw new BadRequestException("You can't edit your own function");
      }
      employee.setFunction(employeeDTO.function());
    }
    employeeRepository.save(employee);
    return EmployeeResponseDTO.from(employee);
  }

  public void setPassword(PasswordDTO passwordDTO, UUID id) {
    Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);

    if (passwordDTO.password() == null || passwordDTO.password().isBlank()) {
      throw new BadRequestException("Password is required");
    }
    if (!isValidPassword(passwordDTO.password())) {
      throw new BadRequestException("Password is invalid");
    }
    employee.setPassword(passwordEncoder.encode(passwordDTO.password()));
    employeeRepository.save(employee);
  }

  public void deleteEmployee(UUID id, Authentication authentication) {
    Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);
    Employee loggedInEmployee = (Employee) authentication.getPrincipal();

    if (employee.equals(loggedInEmployee)) {
      throw new BadRequestException("You can't delete yourself");
    }

    employee.setEnabled(false);
    employeeRepository.save(employee);
  }

  public boolean isValidPassword(String password) {
    if (password == null || password.isBlank()) return false;
    if (password.length() < 8) return false;

    boolean hasUppercaseLetter = false;
    boolean hasLowercaseLetter = false;
    boolean hasNumber = false;
    boolean hasSpecialCharacter = false;

    for (char chr : password.toCharArray()) {
      if (Character.isUpperCase(chr)) {
        hasUppercaseLetter = true;
      } else if (Character.isLowerCase(chr)) {
        hasLowercaseLetter = true;
      } else if (Character.isDigit(chr)) {
        hasNumber = true;
      } else {
        hasSpecialCharacter = true;
      }
    }

    return hasUppercaseLetter && hasLowercaseLetter && hasNumber && hasSpecialCharacter;
  }

  public boolean isValidEmail(String email) {
    try {
      InternetAddress internetAddress = new InternetAddress(email);
      internetAddress.validate();
      return true;
    } catch (AddressException e) {
      return false;
    }
  }
}
