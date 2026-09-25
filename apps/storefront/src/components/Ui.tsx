export function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

export function ErrorMessage({ message }: { message: string }) {
  return <div className="alert alert-error">{message}</div>;
}
