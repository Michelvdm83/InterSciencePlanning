package com.interscience.planning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PlanningApplication {

  public static void main(String[] args) {
    SpringApplication.run(PlanningApplication.class, args);
  }
}
