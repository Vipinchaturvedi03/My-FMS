import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import DataTable from '../components/DataTable.jsx';
import NumberInput from '../components/NumberInput.jsx';

const CATEGORIES = ['Seed','Cultivation','Fertilizer','Transport'];

export default function Expense() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category:'Seed', item_name:'', quantity:'', unit:'', rate:'' });

  const load = async () => {
    const rows = await apiFetch('/api/expenses');
    setItems(rows);
  };
  useEffect(() => { load(); }, []);

  const total = (Number(form.quantity||0) * Number(form.rate||0)) || 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiFetch('/api/expenses', { method:'POST', body: JSON.stringify(form) });
    setForm({ category:'Seed', item_name:'', quantity:'', unit:'', rate:'' });
    await load();
  };
  const onDelete = async (row) => {
    await apiFetch(`/api/expenses/${row.id}`, { method:'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('expenseManagement')}</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white p-4 rounded shadow">
        <select className="border rounded px-3 py-2 col-span-2" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="border rounded px-3 py-2 col-span-2" placeholder={t('item')} value={form.item_name} onChange={e=>setForm({...form,item_name:e.target.value})} required/>
        <NumberInput className="col-span-1" placeholder={t('quantity')} value={form.quantity} onChange={v=>setForm({...form,quantity:v})}/>
        <input className="border rounded px-3 py-2 col-span-1" placeholder={t('unit')} value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/>
        <NumberInput className="col-span-2" placeholder={t('rate')} value={form.rate} onChange={v=>setForm({...form,rate:v})}/>
        <input className="border rounded px-3 py-2 col-span-2 bg-gray-100" value={`${t('total')}: ₹ ${total.toFixed(2)}`} readOnly/>
        <button className="bg-green-700 text-white rounded px-4 py-2 col-span-2">{t('add')}</button>
      </form>

      <DataTable
        columns={[
          { key:'category', header: t('category') },
          { key:'item_name', header: t('item') },
          { key:'quantity', header: t('qty') },
          { key:'unit', header: t('unit') },
          { key:'rate', header: t('rate') },
          { key:'total', header: t('total') }
        ]}
        data={items}
        onDelete={onDelete}
      />
    </div>
  );
}


