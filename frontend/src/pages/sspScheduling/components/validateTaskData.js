export function validateTaskData(task, setError) {
  if (!task.name) {
    setError("Taaknaam is verplicht");
    return false;
  }

  if (!task.estimatedTime) {
    setError("Aantal dagen is verplicht");
    return false;
  }

  if (task.estimatedTime <= 0) {
    setError("Aantal dagen moet hoger dan 0 zijn");
    return false;
  }

  if (task.dateCompleted && !task.dateStarted) {
    setError("Begindatum vereist om de einddatum in te vullen");
    return false;
  }

  if (task.dateStarted && task.dateStarted > task.dateCompleted) {
    setError("Begindatum moet voor de einddatum zijn");
    return false;
  }

  if (task.dateStarted && !task.employee) {
    setError("Medewerker vereist om de begindatum in te vullen");
    return false;
  }

  return true;
}

export function translateError(error) {
  switch (error.toString()) {
    case "Name is required":
      return "Taaknaam is verplicht";
    case "Estimated time is required":
      return "Aantal dagen is verplicht";
    case "Estimated time must be higher than 0":
      return "Aantal dagen moet hoger dan 0 zijn";
    case "Employee required for setting start date":
      return "Medewerker vereist om de startdatum in te vullen";
    case "Start date must be on or before end date":
      return "Begindatum moet op of voor de einddatum zijn";
    case "Start date required for setting end date":
      return "Begindatum vereist om de einddatum in te vullen";
    case "End date must be on or after start date":
      return "Einddatum moet op of voor na de begindatum zijn";
    default:
      return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
  }
}
