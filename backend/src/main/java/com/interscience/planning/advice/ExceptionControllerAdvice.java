package com.interscience.planning.advice;

import com.interscience.planning.exceptions.BadRequestException;
import com.interscience.planning.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionControllerAdvice {
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ProblemDetail> badRequestHandler(BadRequestException exception) {
    ProblemDetail problemDetail =
        ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    return ResponseEntity.badRequest().body(problemDetail);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Void> notFoundHandler() {
    return ResponseEntity.notFound().build();
  }
}
