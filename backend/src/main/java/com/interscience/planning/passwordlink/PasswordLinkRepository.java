package com.interscience.planning.passwordlink;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PasswordLinkRepository extends CrudRepository<PasswordLink, UUID> {}
