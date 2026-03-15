import React from 'react';
import { SearchForm } from '@/components/SearchForm';

export default function HomePage(): JSX.Element {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">MVP Predictor de Partidos</h1>
      <p className="text-gray-600">Escribe una consulta en lenguaje natural para obtener la predicción.</p>
      <SearchForm />
    </section>
  );
}
