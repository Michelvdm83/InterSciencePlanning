package com.interscience.planning.system;

import com.interscience.planning.exceptions.BadRequestException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class SystemService {
  private final SystemRepository systemRepository;

  public void createNewSystem(SystemDto systemDto) {
    if (systemRepository.findByName(systemDto.name()).isPresent()) {
      throw new BadRequestException("System name already exists");
    }
    System system = new System(systemDto.name());
    systemRepository.save(system);
  }
}
