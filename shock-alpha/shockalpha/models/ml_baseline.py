from __future__ import annotations

import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier


def fit_predict_prob(train_x: pd.DataFrame, train_y: pd.Series, test_x: pd.DataFrame) -> pd.Series:
    clf = HistGradientBoostingClassifier(max_depth=3, random_state=42)
    clf.fit(train_x.fillna(0), (train_y > 0).astype(int))
    p = clf.predict_proba(test_x.fillna(0))[:, 1]
    return pd.Series(p, index=test_x.index)
