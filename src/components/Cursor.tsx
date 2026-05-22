import type { ReactNode } from "react";

/**
 * Layout passthrough. The prototype drew a custom mix-blend cursor and hid the
 * native one (`cursor: none`), which made the pointer appear to vanish over
 * certain backgrounds. For a real site we keep the native cursor — this wrapper
 * stays so pages don't need restructuring.
 */
export default function Cursor({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
