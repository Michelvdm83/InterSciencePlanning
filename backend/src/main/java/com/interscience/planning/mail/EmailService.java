package com.interscience.planning.mail;

public interface EmailService {
  void sendEmail(String to, String subject, String htmlContent);
}
