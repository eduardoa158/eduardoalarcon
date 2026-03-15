'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchForm(): JSX.Element {
  const router = useRouter();
  const [query, setQuery] = useState('Quiero predecir el partido entre FC Barcelona y Real Madrid en LaLiga');

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push(`/result?query=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-700" htmlFor="query">Consulta del partido</label>
      <input
        id="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 p-3"
        placeholder="Ej: Quiero predecir el partido entre FC Barcelona y Real Madrid en LaLiga"
      />
      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">
        Predecir partido
      </button>
    </form>
  );
}
