import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import DataTable from '../components/DataTable.jsx';
import NumberInput from '../components/NumberInput.jsx';

export default function Labor() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name:'', days_worked:'', daily_wage:'', paid:'' });

  const load = async () => setRows(await apiFetch('/api/labor'));
  useEffect(() => { load(); }, []);

  const total = (Number(form.days_worked||0) * Number(form.daily_wage||0)) || 0;
  const pending = total - Number(form.paid||0);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiFetch('/api/labor', { method:'POST', body: JSON.stringify(form) });
    setForm({ name:'', days_worked:'', daily_wage:'', paid:'' });
    await load();
  };

  const onDelete = async (row) => {
    await apiFetch(`/api/labor/${row.id}`, { method:'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('laborManagement')}</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded shadow">
        <input className="border rounded px-3 py-2" placeholder={t('name')} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <NumberInput placeholder={t('days')} value={form.days_worked} onChange={v=>setForm({...form,days_worked:v})}/>
        <NumberInput placeholder={t('dailyWage')} value={form.daily_wage} onChange={v=>setForm({...form,daily_wage:v})}/>
        <NumberInput placeholder={t('paid')} value={form.paid} onChange={v=>setForm({...form,paid:v})}/>
        <input className="border rounded px-3 py-2 bg-gray-100" value={`${t('pending')}: ₹ ${(pending||0).toFixed(2)}`} readOnly/>
        <button className="bg-green-700 text-white rounded px-4 py-2 md:col-span-5">{t('add')}</button>
      </form>

      <DataTable
        columns={[
          { key:'name', header: t('name') },
          { key:'days_worked', header: t('days') },
          { key:'daily_wage', header: t('dailyWage') },
          { key:'total', header: t('total') },
          { key:'paid', header: t('paid') },
          { key:'pending', header: t('pending') }
        ]}
        data={rows}
        onDelete={onDelete}
      />
    </div>
  );
}


