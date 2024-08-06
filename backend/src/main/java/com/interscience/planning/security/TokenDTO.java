package com.interscience.planning.security;

import com.interscience.planning.employee.EmployeeDTO;

public record TokenDTO(String token, EmployeeDTO employee) {}
