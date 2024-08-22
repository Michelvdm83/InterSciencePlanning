package com.interscience.planning.security;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration {
  @Bean
  public SecretKey secretKey() {
    return Jwts.SIG.HS256.key().build();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
    return httpSecurity
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers("api/v1/employees")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/tasks")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("/api/v1/systems/**")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers("api/v1/employees/ssp-planning")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers("api/v1/ssptasks/unplanned")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/employees/ssp")
                    .hasRole("TEAM_LEADER")
                    .anyRequest()
                    .permitAll())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(
            exceptionHandlingConfigurer ->
                exceptionHandlingConfigurer.authenticationEntryPoint(new UnauthorizedEntryPoint()))
        .build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}
