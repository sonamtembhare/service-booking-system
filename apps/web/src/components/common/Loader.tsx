export default function Loader({ fullPage = false }: { fullPage?: boolean }) {
  if (fullPage) {
    return (
      <div className="loader-overlay">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="spinner" />
    </div>
  );
}
