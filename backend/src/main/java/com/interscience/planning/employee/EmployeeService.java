package com.interscience.planning.employee;

import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
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
}