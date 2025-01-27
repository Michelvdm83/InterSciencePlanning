package com.interscience.planning.security;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
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
                    .requestMatchers(HttpMethod.POST, "api/v1/employees/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.PATCH, "api/v1/employees/*/password")
                    .permitAll()
                    .requestMatchers(HttpMethod.PATCH, "api/v1/employees/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.DELETE, "api/v1/employees/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.GET, "api/v1/employees")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers("api/v1/tasks")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.POST, "/api/v1/systems/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.GET, "/api/v1/systems/**")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers(HttpMethod.GET, "/api/v1/systems/search")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers(HttpMethod.PATCH, "/api/v1/systems/**")
                    .hasAnyRole("TEAM_LEADER", "SSP", "FT")
                    .requestMatchers("/api/v1/systems/delayed")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("/api/v1/systems/delayed/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/employees/ssp-planning")
                    .hasAnyRole("TEAM_LEADER", "SSP")
                    .requestMatchers("api/v1/employees/ft-planning")
                    .hasAnyRole("TEAM_LEADER", "FT")
                    .requestMatchers("api/v1/ssptasks/unplanned")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/ssptasks/by-employee/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/ssptasks/update-order/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.POST, "/api/v1/tasks/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers(HttpMethod.PATCH, "/api/v1/tasks/**")
                    .hasAnyRole("TEAM_LEADER", "SSP")
                    .requestMatchers(HttpMethod.GET, "/api/v1/tasks/**")
                    .hasAnyRole("TEAM_LEADER", "SSP")
                    .requestMatchers("api/v1/holidays/**")
                    .hasRole("TEAM_LEADER")
                    .requestMatchers("api/v1/fttasks/by-employee/**")
                    .hasAnyRole("TEAM_LEADER", "FT")
                    .requestMatchers("api/v1/fttasks/unassigned")
                    .hasAnyRole("TEAM_LEADER", "FT")
                    .requestMatchers("api/v1/fttasks")
                    .hasAnyRole("TEAM_LEADER", "FT")
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

  @Bean
  public UserDetailsService userDetailsService(DataSource dataSource){
    return new JdbcUserDetailsManager(dataSource);
  }
}
