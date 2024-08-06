package com.interscience.planning.security;

import java.util.Date;

public record TokenData(String email, String[] roles, Date issueDate, Date expirationDate) {
  public boolean isExpired() {
    return expirationDate.before(new Date());
  }
}
