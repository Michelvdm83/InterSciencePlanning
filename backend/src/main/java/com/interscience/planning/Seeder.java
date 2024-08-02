package com.interscience.planning;

import com.interscience.planning.system.System;
import com.interscience.planning.system.SystemRepository;
import com.interscience.planning.system.SystemStatus;
import java.sql.Date;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {

  private final SystemRepository systemRepository;

  @Override
  public void run(String... args) {
    if (systemRepository.findAll().isEmpty()) {
      createSystem();
    }
  }

  private void createSystem() {
    System system = new System();
    system.setName("brt-001");
    system.setSystemType("big");

    LocalDate today = LocalDate.now();
    system.setEstimatedDeliveryDate(Date.valueOf(today.plusDays(7)));

    system.setStatus(SystemStatus.BUILDING);

    systemRepository.save(system);
  }
}
