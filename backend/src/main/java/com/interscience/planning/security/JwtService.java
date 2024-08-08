package com.interscience.planning.security;

import com.interscience.planning.employee.Employee;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.*;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {
  private final SecretKey jwtSecretKey;

  @Value("${interscience.authentication.jwt-expiration-ms}")
  private int JWT_EXPIRATION_MS;

  private static final String ROLES_CLAIM_NAME = "roles";

  public String generateTokenForUser(Employee employee) {
    return buildToken(employee);
  }

  public Optional<TokenData> readToken(String token) {
    try {
      Claims claims =
          Jwts.parser().verifyWith(jwtSecretKey).build().parseSignedClaims(token).getPayload();

      return Optional.of(
          new TokenData(
              claims.getSubject(),
              getRolesFromClaims(claims),
              claims.getIssuedAt(),
              claims.getExpiration()));
    } catch (RuntimeException ex) {
      System.out.println(
          "Exception reading JWT-token: TYPE: '"
              + ex.getClass().getName()
              + "', MESSAGE: '"
              + ex.getMessage()
              + "'");

      return Optional.empty();
    }
  }

  private String buildToken(Employee employee) {
    long currentTimeMillis = System.currentTimeMillis();

    return Jwts.builder()
        .claims(Map.of(ROLES_CLAIM_NAME, employee.getAuthorities()))
        .subject(employee.getUsername())
        .issuedAt(new Date(currentTimeMillis))
        .expiration(new Date(currentTimeMillis + JWT_EXPIRATION_MS))
        .signWith(jwtSecretKey)
        .compact();
  }

  private String[] getRolesFromClaims(Claims claims) {
    Object rolesObject = claims.get(ROLES_CLAIM_NAME);

    if (rolesObject == null) {
      throw new IllegalArgumentException("'" + ROLES_CLAIM_NAME + "' claim not found");
    }

    if (!(rolesObject instanceof Iterable<?> rawRoles)) {
      throw new IllegalArgumentException("claims '" + ROLES_CLAIM_NAME + "' value is invalid");
    }

    List<String> parsedRoles = new LinkedList<>();

    for (Object o : rawRoles) {
      if (o instanceof LinkedHashMap<?, ?> map) {
        map.values()
            .forEach(
                t -> {
                  if (t instanceof String) {
                    parsedRoles.add((String) t);
                  }
                });
      }
    }

    return parsedRoles.toArray(new String[0]);
  }
}
