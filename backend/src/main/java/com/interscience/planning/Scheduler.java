package com.interscience.planning;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.holiday.Holiday;
import com.interscience.planning.holiday.HolidayRepository;
import com.interscience.planning.ssptask.SSPTask;
import com.interscience.planning.ssptask.SSPTaskRepository;
import com.interscience.planning.system.SystemRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Scheduler {
  private final SSPTaskRepository sspTaskRepository;
  private final HolidayRepository holidayRepository;
  private final SystemRepository systemRepository;

  // om te kunnen zien dat scheduled werkt. Na testen/pull request review deze functie verwijderen
  @Scheduled(cron = "*/10 * * * * *")
  public void checkForDelayedSystemsTest() {
    System.out.println(LocalDateTime.now());
  }

  @Scheduled(cron = "0 0 1 * * MON-FRI")
  public void checkForDelayedSystems() {

    List<SSPTask> tasksInProgress =
        sspTaskRepository.findByEmployeeNotNullAndDateStartedNotNullAndDateCompletedNull();
    tasksInProgress.forEach(
        (sspTask -> {
          if (sspTask.getConstructionTask() != null
              && sspTask.getConstructionTask().getSystem() != null) {
            var system = sspTask.getConstructionTask().getSystem();
            if (system.getDelayCheckedBySupervisor() == null && isDelayed(sspTask)) {
              system.setDelayCheckedBySupervisor(false);
              systemRepository.save(system);
            }
          }
        }));
  }

  private boolean isDelayed(SSPTask sspTask) {
    LocalDate today = LocalDate.now();
    Employee employee = sspTask.getEmployee();

    List<Holiday> holidays =
        holidayRepository.findAllByEmployeeAndBetween(employee, sspTask.getDateStarted(), today);
    List<LocalDate> holidayDays = new ArrayList<>();
    holidays.forEach(
        holiday -> {
          var daysInHoliday =
              holiday.getStartDate().datesUntil(holiday.getEndDate().plusDays(1)).toList();
          holidayDays.addAll(daysInHoliday);
        });

    LocalDate expectedEndDate =
        addActualWorkingDays(sspTask.getDateStarted(), sspTask.getEstimatedTime(), holidayDays);
    return today.isAfter(expectedEndDate);
  }

  private LocalDate addActualWorkingDays(
      LocalDate startDate, int daysToAdd, List<LocalDate> holidays) {
    Predicate<LocalDate> isBusinessDay =
        date ->
            date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY;
    Predicate<LocalDate> isWorkingDay = isBusinessDay.and(date -> !holidays.contains(date));

    LocalDate returnDate = startDate;
    while (daysToAdd > 0) {
      returnDate = returnDate.plusDays(1);
      if (isWorkingDay.test(returnDate)) {
        daysToAdd--;
      }
    }
    return returnDate;
  }
}
