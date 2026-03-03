export function GradientBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1d4ed8_0%,#020617_40%,#020617_100%)]" />
      <div className="absolute inset-0 bg-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
    </div>
  );
}
