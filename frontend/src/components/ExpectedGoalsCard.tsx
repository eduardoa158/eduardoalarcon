import React from 'react';
interface Props {
  team: string;
  xg: number;
}

export function ExpectedGoalsCard({ team, xg }: Props): JSX.Element {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Goles esperados</p>
      <p className="text-lg font-semibold">{team}</p>
      <p className="text-3xl font-bold text-blue-600">{xg.toFixed(2)}</p>
    </div>
  );
}
