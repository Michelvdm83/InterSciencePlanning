package com.interscience.planning.system;

// this DTO gives back the system name and system type to be used in the overview of what systems
// are created in a year, so it can be converted into a csv file on the frontend
public record YearOverviewDTO(String name, String systemType) {}
