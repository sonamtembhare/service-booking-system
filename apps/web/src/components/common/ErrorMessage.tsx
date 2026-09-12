export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message">
      <span>!</span>
      <span>{message}</span>
    </div>
  );
}
