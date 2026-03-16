export function Loader() {
  return <div className="loader" aria-label="Loading" />;
}

export function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
      <Loader />
    </div>
  );
}
