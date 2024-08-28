export function translateError(error) {
  switch (error.toString()) {
    case "System name already exists":
      return "Systeemnaam bestaat al";
    case "System name is required":
      return "Systeemnaam is verplicht";
    case "Employee responsible can't be an SSP employee":
      return "Eindverantwoordelijke mag geen SSP medewerker zijn";
    case "Estimated construction days required for assigning an SSP employee":
      return "Productiedagen vereist om een SSP-medewerker toe te wijzen";
    case "SSP employee needs to have function SSP or SSP team leader":
      return "SSP-medewerker moet de functie SSP of SSP-teamleider hebben";
    case "Estimated construction days required for setting construction start date":
      return "Productiedagen vereist om startdatum productie in te stellen";
    case "SSP employee required for setting construction start date":
      return "SSP-medewerker vereist om startdatum productie in te stellen";
    case "Estimated test days required for assigning an FT employee":
      return "Testdagen vereist om een FT-medewerker toe te wijzen";
    case "FT employee needs to have function FT":
      return "FT-medewerker moet de functie FT hebben";
    case "Estimated test days required for setting test start date":
      return "Testdagen vereist om startdatum test in te stellen";
    case "FT employee required for setting test start date":
      return "FT-medewerker vereist om startdatum test in te stellen";
    case "Construction end date must be after construction start date":
      return "Einddatum productie moet na startdatum productie zijn";
    case "Construction start date required for setting construction end date":
      return "Startdatum productie vereist om einddatum productie in te stellen";
    case "Test end date must be after test start date":
      return "Einddatum test moet na startdatum test zijn";
    case "Test start date required for setting test end date":
      return "Startdatum test vereist om einddatum test in te stellen";
    case "Construction end date required for setting test start date":
      return "Einddatum productie vereist om startdatum test in te stellen";
    case "Test start date must be after construction end date":
      return "Startdatum test moet na einddatum productie zijn";
    case "Construction end date must be before test start date":
      return "Einddatum productie moet voor startdatum test zijn";
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

  if (system.endOfConstruction != null) {
    if (system.startOfConstruction == null) {
      setError(
        "Startdatum productie vereist om einddatum productie in te stellen",
      );
      return false;
    }
    let startOfConstruction = new Date(system.startOfConstruction);
    let endOfConstruction = new Date(system.endOfConstruction);

    if (endOfConstruction < startOfConstruction) {
      setError("Einddatum productie moet na startdatum productie zijn");
      return false;
    }
    if (system.startOfTest != null) {
      let startOftest = new Date(system.startOfTest);
      if (endOfConstruction > startOftest) {
        setError("Einddatum productie moet voor startdatum test zijn");
        return false;
      }
    }
  }

  if (system.startOfTest != null) {
    if (system.endOfConstruction == null) {
      setError("Einddatum productie vereist om startdatum test in te stellen");
      return false;
    }
    let startOfTest = new Date(system.startOfTest);
    let endOfConstruction = new Date(system.endOfConstruction);
    if (startOfTest < endOfConstruction) {
      setError("Startdatum test moet na einddatum productie zijn");
      return false;
    }
  }

  if (system.endOfTest != null) {
    if (system.startOfTest == null) {
      setError("Startdatum test vereist om einddatum test in te stellen");
      return false;
    }
    let endOfTest = new Date(system.endOfTest);
    let startOfTest = new Date(system.startOfTest);
    if (endOfTest < startOfTest) {
      setError("Einddatum test moet na startdatum test zijn");
      return false;
    }
  }

  return true;
}
