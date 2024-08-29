export function validateHolidayData(holiday, setError) {
  if (!holiday.employeeId) {
    setError("Medewerker moet gekozen worden");
    return false;
  }
  if (!holiday.startDate) {
    setError("Begindatum moet gekozen worden");
    return false;
  }
  if (!holiday.endDate) {
    setError("Einddatum moet gekozen worden");
    return false;
  }
  if (holiday.startDate > holiday.endDate) {
    setError("De begindatum mag niet na de einddatum zijn");
    return false;
  }
  return true;
}

export function translateError(error) {
  switch (error.toString()) {
    case "EmployeeId can't be null":
      return "Medewerker moet gekozen worden";
    case "Start date can't be null":
      return "Begindatum moet gekozen worden";
    case "End date can't be null":
      return "Einddatum moet gekozen worden";
    case "Start date can't be after end date":
      return "De begindatum mag niet na de einddatum zijn";
    default:
      return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
  }
}
