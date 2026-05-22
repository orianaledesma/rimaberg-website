type Tone = "dark" | "light";

/**
 * Tracked wordmark used in the header. `tone` is the colour of the mark itself:
 * "dark" = near-black ink (on paper), "light" = off-white (on the noir hero).
 */
export default function Logo({ tone = "dark", size = 14 }: { tone?: Tone; size?: number }) {
  const color = tone === "dark" ? "var(--rb-ink)" : "#fafafa";
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        color,
        lineHeight: 1,
      }}
    >
      <div style={{ fontSize: size, letterSpacing: "0.42em", fontWeight: 400, paddingLeft: "0.42em" }}>
        RIMA BERG
      </div>
      <div style={{ fontSize: 9, letterSpacing: "0.32em", opacity: 0.55, paddingLeft: "0.32em" }}>
        JEWELLERY · KAUNAS
      </div>
    </div>
  );
}
