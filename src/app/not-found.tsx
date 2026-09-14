export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "var(--g-sans)",
      }}
    >
      <h1
        style={{
          margin: "0 20px 0 0",
          padding: "0 23px 0 0",
          borderRight: "1px solid currentColor",
          fontFamily: "inherit",
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.75,
        }}
      >
        404
      </h1>
      <h2
        style={{
          margin: 0,
          fontFamily: "inherit",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.75,
        }}
      >
        This page could not be found.
      </h2>
    </main>
  );
}
