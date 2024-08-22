export function translateError(error) {
  switch (error.toString()) {
    case "System name already exists":
      return "Systeemnaam bestaat al";
    case "System name is required":
      return "Systeemnaam is verplicht";
    case "Employee responsible can't be an SSP employee":
      return "Eindverantwoordelijke mag geen SSP medewerker zijn";
    case "Estimated construction days are required for assigning an SSP employee":
      return "Productiedagen vereist om een SSP-medewerker toe te wijzen";
    case "SSP employee needs to have function SSP":
      return "SSP-medewerker moet de functie SSP hebben";
    case "Estimated construction days required for setting construction start date":
      return "Productiedagen vereist om startdatum productie in te stellen";
    case "SSP employee required for setting construction start date":
      return "SSP-medewerker vereist om startdatum productie in te stellen";
    case "Estimated test days are required for assigning an FT employee":
      return "Testdagen vereist om een FT-medewerker toe te wijzen";
    case "FT employee needs to have function FT":
      return "FT-medewerker moet de functie FT hebben";
    case "Estimated test days required for setting test start date":
      return "Testdagen vereist om startdatum test in te stellen";
    case "FT employee required for setting test start date":
      return "FT-medewerker vereist om startdatum test in te stellen";
    default:
      return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
  }
}

export function validateSystemData(system, setError) {
  if (!system.name || system.name.trim().length === 0) {
    setError("Systeemnaam is verplicht");
    return false;
  }

  if (system.startOfConstruction != null) {
    if (system.estimatedConstructionDays == null) {
      setError("Productiedagen vereist om startdatum productie in te stellen");
      return false;
    }
    if (system.employeeSSP == null) {
      setError("SSP-medewerker vereist om startdatum productie in te stellen");
      return false;
    }
  }

  if (system.startOfTest != null) {
    if (system.estimatedTestDays == null) {
      setError("Testdagen vereist om startdatum test in te stellen");
      return false;
    }
    if (system.employeeFT == null) {
      setError("FT-medewerker vereist om startdatum test in te stellen");
      return false;
    }
  }
  if (system.employeeSSP != null) {
    if (system.estimatedConstructionDays == null) {
      setError("Productiedagen vereist om een SSP-medewerker toe te wijzen");
      return false;
    }
  }
  if (system.employeeFT != null) {
    if (system.estimatedTestDays == null) {
      setError("Testdagen vereist om een FT-medewerker toe te wijzen");
      return false;
    }
  }
  return true;
}
