package com.interscience.planning.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender emailSender;

  @Value("${mail.from.address}")
  private String fromAddress;

  @Override
  public void sendEmail(String to, String subject, String htmlContent) {
    try {
      MimeMessage mimeMessage = emailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

      helper.setFrom(fromAddress);
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(htmlContent, true);

      emailSender.send(mimeMessage);
    } catch (MessagingException e) {
      System.out.println("Error occurred while creating email message: " + e.getMessage());
      e.printStackTrace();
    } catch (MailException e) {
      System.out.println("Error occurred while sending email: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
