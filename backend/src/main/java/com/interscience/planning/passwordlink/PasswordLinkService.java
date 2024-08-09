package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import java.time.Duration;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordLinkService {
  private static final int PASSWORD_LINK_EXPIRATION_DAYS = 2;

  public void sendEmail(PasswordLink passwordLink, Employee employee) {
    String email = employee.getEmail();
    String setPasswordLink =
        "http://localhost:5173/wachtwoord-instellen"
            + employee.getId()
            + "/"
            + passwordLink.getId();
    String message =
        "Stel via deze link eenmalig je wachtwoord in. Deze link is "
            + PASSWORD_LINK_EXPIRATION_DAYS
            + " dagen geldig.";
  }

  public boolean linkHasExpired(PasswordLink passwordLink) {
    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(passwordLink.getDateCreated(), now);
    return duration.toDays() > PASSWORD_LINK_EXPIRATION_DAYS;
  }
}
