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
export default function Logo({ height = 56 }: { height?: number }) {
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
