from __future__ import annotations

from pathlib import Path

import pandas as pd


def write_report(path: Path, shock_status: dict[str, str], signals: pd.DataFrame, metrics: dict[str, float], events: pd.DataFrame) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Shock Alpha Report (America/Guayaquil)",
        "",
        "## Brief",
        "Sistema educativo shock-aware. No asesoría financiera.",
        "",
        "## Estado SHOCK",
    ]
    for k, v in shock_status.items():
        lines.append(f"- {k}: {v}")
    lines += ["", "## Tabla de eventos", "", events.head(20).to_markdown(index=False) if not events.empty else "Sin eventos."]
    lines += ["", "## Señales", "", signals.head(20).to_markdown(index=False)]
    lines += ["", "## Métricas backtest", ""]
    for k, v in metrics.items():
        lines.append(f"- {k}: {v:.4f}")
    lines += ["", "## Figuras", "- outputs/figures/*.png"]
    path.write_text("\n".join(lines), encoding="utf-8")
