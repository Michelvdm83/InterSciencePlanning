import DeleteButton from "../../../components/DeleteButton";
import ApiService from "../../../services/ApiService";

export default function DeleteTaskButton({
  question,
  afterDelete,
  taskId,
  error,
}) {
  function deleteTask(e) {
    e.preventDefault();

    ApiService.delete(`tasks/${taskId}`)
      .then(() => {
        afterDelete();
      })
      .catch(() => {
        setError("Er is een fout opgetreden bij het verwijderen");
      });
  }

  return (
    <DeleteButton
      question={question}
      onClick={deleteTask}
      id={taskId}
      error={error}
    />
  );
}
