from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd


def plot_price_signal(df: pd.DataFrame, asset: str, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=(10, 4))
    df["close"].plot(ax=ax, title=f"{asset} Close")
    ax.set_ylabel("Price")
    fig.tight_layout()
    fig.savefig(out_path)
    plt.close(fig)
