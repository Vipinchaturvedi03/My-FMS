import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import DataTable from '../components/DataTable.jsx';

export default function Reports() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [byCat, setByCat] = useState([]);
  const [labor, setLabor] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    (async () => {
      const [a,b,c] = await Promise.all([
        apiFetch('/api/reports/expenses-by-category'),
        apiFetch('/api/reports/pending-labor'),
        apiFetch('/api/reports/current-stock')
      ]);
      setByCat(a); setLabor(b); setStock(c);
    })();
  }, []);

  const dlCsv = () => {
    window.open((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/reports/export/csv', '_blank');
  };
  const dlPdf = () => {
    window.open((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/reports/export/pdf', '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('reports')}</h1>

      <div className="flex gap-3">
        <button onClick={dlCsv} className="bg-blue-600 text-white px-4 py-2 rounded">{t('exportCsv')}</button>
        <button onClick={dlPdf} className="bg-purple-600 text-white px-4 py-2 rounded">{t('exportPdf')}</button>
      </div>

      <Section title={t('expensesByCategory')}>
        <DataTable columns={[{key:'category',header: t('category')},{key:'total',header: t('total')}]} data={byCat}/>
      </Section>
      <Section title={t('pendingLabor')}>
        <DataTable columns={[
          {key:'name',header: t('name')},
          {key:'days_worked',header: t('days')},
          {key:'daily_wage',header: t('wage')},
          {key:'total',header: t('total')},
          {key:'paid',header: t('paid')},
          {key:'pending',header: t('pending')}
        ]} data={labor}/>
      </Section>
      <Section title={t('currentStock')}>
        <DataTable columns={[
          {key:'name',header: t('item')},
          {key:'current_qty',header: t('qty')},
          {key:'unit',header: t('unit')},
          {key:'threshold',header: t('threshold')},
          {key:'below_threshold',header: t('alert')}
        ]} data={stock.map(s => ({...s, below_threshold: s.below_threshold ? t('below') : ''}))}/>
      </Section>
    </div>
  );
}

function Section({title, children}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}


