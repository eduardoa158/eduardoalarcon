import { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return <main className="relative">{children}</main>;
}
