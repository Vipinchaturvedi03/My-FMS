import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import DataTable from '../components/DataTable.jsx';
import NumberInput from '../components/NumberInput.jsx';

export default function Stock() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({ name:'', unit:'', threshold:'', opening_qty:'' });
  const [txForm, setTxForm] = useState({ item_id:'', type:'in', quantity:'', note:'' });

  const loadItems = async () => setItems(await apiFetch('/api/stock/items'));

  useEffect(() => { loadItems(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    await apiFetch('/api/stock/items', { method:'POST', body: JSON.stringify(itemForm) });
    setItemForm({ name:'', unit:'', threshold:'', opening_qty:'' });
    await loadItems();
  };

  const addTx = async (e) => {
    e.preventDefault();
    await apiFetch('/api/stock/tx', { method:'POST', body: JSON.stringify(txForm) });
    setTxForm({ item_id:'', type:'in', quantity:'', note:'' });
    await loadItems();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">स्टॉक प्रबंधन</h1>

      <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded shadow">
        <input className="border rounded px-3 py-2" placeholder="आइटम" value={itemForm.name} onChange={e=>setItemForm({...itemForm,name:e.target.value})} required/>
        <input className="border rounded px-3 py-2" placeholder="यूनिट" value={itemForm.unit} onChange={e=>setItemForm({...itemForm,unit:e.target.value})}/>
        <NumberInput placeholder="थ्रेशोल्ड" value={itemForm.threshold} onChange={v=>setItemForm({...itemForm,threshold:v})}/>
        <NumberInput placeholder="ओपनिंग Qty" value={itemForm.opening_qty} onChange={v=>setItemForm({...itemForm,opening_qty:v})}/>
        <button className="bg-green-700 text-white rounded px-4 py-2">Add Item</button>
      </form>

      <form onSubmit={addTx} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded shadow">
        <select className="border rounded px-3 py-2" value={txForm.item_id} onChange={e=>setTxForm({...txForm,item_id:e.target.value})} required>
          <option value="">आइटम चुनें</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={txForm.type} onChange={e=>setTxForm({...txForm,type:e.target.value})}>
          <option value="in">स्टॉक इन</option>
          <option value="out">स्टॉक आउट</option>
        </select>
        <NumberInput placeholder="मात्रा" value={txForm.quantity} onChange={v=>setTxForm({...txForm,quantity:v})}/>
        <input className="border rounded px-3 py-2" placeholder="नोट" value={txForm.note} onChange={e=>setTxForm({...txForm,note:e.target.value})}/>
        <button className="bg-green-700 text-white rounded px-4 py-2">Add Tx</button>
      </form>

      <DataTable
        columns={[
          { key:'name', header:'Item' },
          { key:'current_qty', header:'Qty' },
          { key:'unit', header:'Unit' },
          { key:'threshold', header:'Threshold' },
          { key:'below_threshold', header:'Alert' }
        ]}
        data={items.map(i => ({...i, below_threshold: i.below_threshold ? t('below') : '' }))}
      />
    </div>
  );
}


