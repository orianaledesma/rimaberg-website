import Image from "next/image";

// Source dimensions of /public/logo/logo.png — used to keep the rendered
// wordmark in its natural aspect ratio (horizontal lockup).
const SRC_W = 1092;
const SRC_H = 358;

/**
 * Brand wordmark (white art on a transparent background). Lives in
 * /public/logo/logo.png — designed for dark surfaces. The component takes a
 * `height` and computes the width from the source aspect ratio so the mark
 * never gets squished.
 */
export default function Logo({ height = 80 }: { height?: number }) {
  // The component renders at the largest size we use anywhere (--rb-logo-h
  // desktop default). The actual display size is driven by CSS — the .rb-logo-img
  // rule scales height via the --rb-logo-h token, which the Header toggles on
  // scroll and the responsive query shrinks on mobile.
  const width = Math.round(height * (SRC_W / SRC_H));
  return (
    <Image
      src="/logo/logo.png"
      alt="Rima Berg"
      width={width}
      height={height}
      priority
      className="rb-logo-img"
      style={{ display: "block", width: "auto" }}
    />
  );
}
