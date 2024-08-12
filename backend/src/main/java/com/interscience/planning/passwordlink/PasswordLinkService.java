package com.interscience.planning.passwordlink;

import com.interscience.planning.employee.Employee;
import com.interscience.planning.mail.EmailServiceImpl;
import java.time.Duration;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordLinkService {
  private static final int PASSWORD_LINK_EXPIRATION_DAYS = 2;
  private final EmailServiceImpl emailServiceImpl;

  public void sendEmail(PasswordLink passwordLink, Employee employee) {
    String email = employee.getEmail();
    String employeeName = employee.getName().split(" ")[0];

    String setPasswordLink =
        "http://localhost:5173/wachtwoord-instellen/"
            + employee.getId()
            + "/"
            + passwordLink.getId();
    String message =
        "<html><body>Beste "
            + employeeName
            + ","
            + "<br><br>Stel via deze link eenmalig je wachtwoord in van je Interscience account. Deze link is "
            + PASSWORD_LINK_EXPIRATION_DAYS
            + " dagen geldig. <br><br><a href='"
            + setPasswordLink
            + "'>"
            + setPasswordLink
            + "</a></body></html>";
    emailServiceImpl.sendEmail(email, "Interscience wachtwoord instellen", message);
  }

  public boolean linkHasExpired(PasswordLink passwordLink) {
    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(passwordLink.getDateCreated(), now);
    return duration.toDays() > PASSWORD_LINK_EXPIRATION_DAYS;
  }
}
