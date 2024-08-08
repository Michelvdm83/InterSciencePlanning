package com.interscience.planning.ssptask;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class SSPTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID taskId;

    private UUID constructionTask;

    private UUID task;

    private int index;
}
