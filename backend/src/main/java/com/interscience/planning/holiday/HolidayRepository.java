package com.interscience.planning.holiday;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, UUID> {
  List<Holiday> findAllByEnabledTrue();
}
