package com.interscience.planning.system;

import java.util.List;

public record SystemDelayedDTO(String name, String employeeSSP, List<String> affectedSystems) {}
