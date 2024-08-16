export function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export function translateError(error) {
  switch (error.toString()) {
    case "Name is required":
      return "Naam is verplicht";
    case "Email is required":
      return "E-mailadres is verplicht";
    case "Email is not valid":
      return "E-mailadres is niet geldig";
    case "Employee with this email already exists":
      return "Medewerker met dit e-mailadres bestaat al";
    case "You can't edit your own function":
      return "Je kunt je eigen functie niet aanpassen";
    default:
      return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
  }
}

export function validateEmployeeData(employee, setError) {
  if (!employee.name.trim()) {
    setError("Naam is verplicht");
    return false;
  } else if (!employee.email.trim()) {
    setError("E-mailadres is verplicht");
    return false;
  } else if (!isValidEmail(employee.email)) {
    setError("E-mailadres is niet geldig");
    return false;
  } else if (!employee.function) {
    setError("Functie is verplicht");
    return false;
  }
  return true;
}
