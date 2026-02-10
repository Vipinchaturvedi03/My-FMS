import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import { CROP_CALENDAR, SEASONS, GROWTH_STAGES, FARMING_TIPS } from '../data/cropCalendar';
import NumberInput from '../components/NumberInput.jsx';

const TABS = [
  { id: 'planning', labelKey: 'cropPlanning', icon: '📋' },
  { id: 'calendar', labelKey: 'cropCalendar', icon: '📅' },
  { id: 'monitoring', labelKey: 'cropMonitoring', icon: '🌱' },
  { id: 'tips', labelKey: 'farmingTips', icon: '💡' }
];

const TASK_TYPES = [
  { value: 'fertilizer', labelKey: 'fertilizer', icon: '🧪' },
  { value: 'pesticide', labelKey: 'pesticide', icon: '🦠' },
  { value: 'irrigation', labelKey: 'irrigation', icon: '💧' },
  { value: 'weeding', labelKey: 'weeding', icon: '🌿' },
  { value: 'other', labelKey: 'other', icon: '📌' }
];

export default function Crop() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [activeTab, setActiveTab] = useState('planning');
  const [plantings, setPlantings] = useState([]);
  const [form, setForm] = useState({
    crop_name: '', variety: '', sown_date: '', area_acres: 1, expected_duration_days: 120, notes: ''
  });
  const [selectedPlanting, setSelectedPlanting] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ task_type: 'fertilizer', scheduled_date: '', notes: '' });
  const [tipIndex, setTipIndex] = useState(0);
  const [plantingError, setPlantingError] = useState('');
  const [isAddingCrop, setIsAddingCrop] = useState(false);

  const loadPlantings = async () => {
    const data = await apiFetch('/api/crops/plantings');
    setPlantings(data);
  };

  useEffect(() => { loadPlantings(); }, []);

  useEffect(() => {
    if (selectedPlanting) {
      apiFetch(`/api/crops/plantings/${selectedPlanting.id}/tasks`).then(setTasks);
    } else {
      setTasks([]);
    }
  }, [selectedPlanting]);

  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % FARMING_TIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const onSubmitPlanting = async (e) => {
    e.preventDefault();
    setPlantingError('');
    setIsAddingCrop(true);
    try {
      const payload = {
        crop_name: form.crop_name.trim(),
        variety: form.variety?.trim() || null,
        sown_date: form.sown_date,
        area_acres: Number(form.area_acres) || 1,
        expected_duration_days: Number(form.expected_duration_days) || 120,
        notes: form.notes?.trim() || null
      };
      await apiFetch('/api/crops/plantings', { method: 'POST', body: JSON.stringify(payload) });
      setForm({ crop_name: '', variety: '', sown_date: '', area_acres: 1, expected_duration_days: 120, notes: '' });
      await loadPlantings();
    } catch (err) {
      const msg = err?.message || 'Failed to add crop';
      setPlantingError(msg.includes('JSON') ? msg : (lang === 'hi' ? 'फसल जोड़ने में त्रुटि: ' : 'Error adding crop: ') + msg);
    } finally {
      setIsAddingCrop(false);
    }
  };

  const onDeletePlanting = async (p) => {
    if (!confirm(t('confirmDeleteCrop'))) return;
    await apiFetch(`/api/crops/plantings/${p.id}`, { method: 'DELETE' });
    if (selectedPlanting?.id === p.id) setSelectedPlanting(null);
    await loadPlantings();
  };

  const onMarkHarvested = async (p) => {
    await apiFetch(`/api/crops/plantings/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'harvested' })
    });
    await loadPlantings();
  };

  const onSubmitTask = async (e) => {
    e.preventDefault();
    if (!selectedPlanting) return;
    await apiFetch(`/api/crops/plantings/${selectedPlanting.id}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskForm)
    });
    setTaskForm({ task_type: 'fertilizer', scheduled_date: '', notes: '' });
    apiFetch(`/api/crops/plantings/${selectedPlanting.id}/tasks`).then(setTasks);
  };

  const onCompleteTask = async (task) => {
    await apiFetch(`/api/crops/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed_date: new Date().toISOString().slice(0, 10) })
    });
    apiFetch(`/api/crops/plantings/${selectedPlanting.id}/tasks`).then(setTasks);
  };

  const getHarvestDate = (sown, days) => {
    if (!sown || !days) return null;
    const d = new Date(sown);
    d.setDate(d.getDate() + parseInt(days, 10));
    return d.toISOString().slice(0, 10);
  };

  const getGrowthStage = (sown, days, totalDays) => {
    if (!sown || !totalDays) return GROWTH_STAGES[0];
    const d = new Date(sown);
    const elapsed = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
    const percent = (elapsed / totalDays) * 100;
    for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
      if (percent >= GROWTH_STAGES[i].percent) return GROWTH_STAGES[i];
    }
    return GROWTH_STAGES[0];
  };

  const getDaysRemaining = (harvestDate) => {
    if (!harvestDate) return null;
    const d = new Date(harvestDate);
    const today = new Date();
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">🌱 फसल प्रबंधन</h1>
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Planning Tab */}
      {activeTab === 'planning' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span> {t('addNewCrop')}
            </h2>
            <form onSubmit={onSubmitPlanting} className="space-y-4">
              {plantingError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                  {plantingError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">फसल का नाम *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.crop_name}
                  onChange={e => setForm({ ...form, crop_name: e.target.value })}
                  placeholder="जैसे: गेहूं, धान"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('variety')} ({t('optional')})</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.variety}
                  onChange={e => setForm({ ...form, variety: e.target.value })}
                  placeholder="जैसे: HD-2967"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('sowingDate')} *</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.sown_date}
                    onChange={e => setForm({ ...form, sown_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('areaAcres')}</label>
                  <NumberInput
                    className="w-full"
                    value={form.area_acres}
                    onChange={v => setForm({ ...form, area_acres: v })}
                    min={0.1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('expectedDuration')}</label>
                <NumberInput
                  className="w-full"
                  value={form.expected_duration_days}
                  onChange={v => setForm({ ...form, expected_duration_days: v })}
                  min={30}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">नोट्स</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder={t('extraInfo')}
                />
              </div>
              <button
                type="submit"
                disabled={isAddingCrop}
                className="w-full bg-emerald-600 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAddingCrop ? (lang === 'hi' ? 'जोड़ रहे हैं...' : 'Adding...') : t('add')}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🌾</span> {t('myCrops')} ({plantings.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {plantings.map(p => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlanting?.id === p.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                  }`}
                  onClick={() => setSelectedPlanting(p)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{p.crop_name}</p>
                      <p className="text-sm text-gray-500">
                        {t('sowing')}: {new Date(p.sown_date).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')} | {t('harvest')}: {getHarvestDate(p.sown_date, p.expected_duration_days) ? new Date(getHarvestDate(p.sown_date, p.expected_duration_days)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : '-'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.status === 'active' ? t('active') : t('harvested')}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {p.status === 'active' && (
                      <button
                        onClick={(ev) => { ev.stopPropagation(); onMarkHarvested(p); }}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        {t('markHarvested')}
                      </button>
                    )}
                    <button
                      onClick={(ev) => { ev.stopPropagation(); onDeletePlanting(p); }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      {t('deleteCrop')}
                    </button>
                  </div>
                </div>
              ))}
              {plantings.length === 0 && (
                <p className="text-gray-500 text-center py-8">{t('noCrops')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <p className="text-gray-600">{t('whichCropWhen')}</p>
          {Object.entries(SEASONS).map(([key, season]) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className={`bg-gradient-to-r ${
                key === 'KHARIF' ? 'from-emerald-500 to-teal-600' :
                key === 'RABI' ? 'from-amber-500 to-orange-600' : 'from-sky-500 to-blue-600'
              } text-white px-6 py-4`}>
                <h3 className="text-xl font-bold">{season.name}</h3>
                <p className="text-white/90 text-sm">{season.months}</p>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {CROP_CALENDAR.filter(c => c.season === key).map(c => (
                  <div key={c.name} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                    <span className="text-2xl">{c.icon}</span>
                    <p className="font-semibold text-gray-800 mt-1">{c.name}</p>
                    <p className="text-sm text-gray-600">{t('sowingWindow')}: {c.sowStart} - {c.sowEnd}</p>
                    <p className="text-sm text-gray-500">{t('duration')}: ~{c.duration} {t('days')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>🌱</span> {t('activeCrops')}
            </h2>
            {plantings.filter(p => p.status === 'active').length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
                {t('noActiveCrops')}
              </div>
            ) : (
              plantings.filter(p => p.status === 'active').map(p => {
                const stage = getGrowthStage(p.sown_date, null, p.expected_duration_days);
                const harvestDate = getHarvestDate(p.sown_date, p.expected_duration_days);
                const daysLeft = getDaysRemaining(harvestDate);
                const isSelected = selectedPlanting?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl shadow-lg p-5 border-2 transition-all cursor-pointer ${
                      isSelected ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                    onClick={() => setSelectedPlanting(p)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{p.crop_name}</h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                        {stage.name}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>📅 {t('estimatedHarvest')}: {harvestDate ? new Date(harvestDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : '-'}</p>
                      {daysLeft !== null && (
                        <p className={daysLeft <= 0 ? 'text-green-600 font-medium' : ''}>
                          {daysLeft > 0 ? `⏳ ${daysLeft} ${t('daysRemaining')}` : `✅ ${t('harvestTime')}`}
                        </p>
                      )}
                      <p>🧪 {t('fertilizerSuggestion')}: {stage.fertilizer}</p>
                      <p>🦠 {t('pesticideSuggestion')}: {stage.pesticide}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPlanting(p)}
                      className="mt-3 text-emerald-600 text-sm font-medium hover:underline"
                    >
                      {t('viewAddTasks')} →
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span> {t('fertilizerSchedule')}
              {selectedPlanting && <span className="text-sm font-normal text-gray-500">({selectedPlanting.crop_name})</span>}
            </h2>
            {selectedPlanting ? (
              <>
                <form onSubmit={onSubmitTask} className="flex flex-wrap gap-2 mb-4">
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={taskForm.task_type}
                    onChange={e => setTaskForm({ ...taskForm, task_type: e.target.value })}
                  >
                    {TASK_TYPES.map(taskType => (
                      <option key={taskType.value} value={taskType.value}>{taskType.icon} {t(taskType.labelKey)}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={taskForm.scheduled_date}
                    onChange={e => setTaskForm({ ...taskForm, scheduled_date: e.target.value })}
                    required
                  />
                  <input
                    className="border rounded-lg px-3 py-2 flex-1 min-w-[120px]"
                    placeholder={t('notes')}
                    value={taskForm.notes}
                    onChange={e => setTaskForm({ ...taskForm, notes: e.target.value })}
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium">
                    {t('addTask')}
                  </button>
                </form>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        task.completed_date ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div>
                        <span className="font-medium">
                          {TASK_TYPES.find(x => x.value === task.task_type)?.icon} {t(TASK_TYPES.find(x => x.value === task.task_type)?.labelKey)}
                        </span>
                        <p className="text-sm text-gray-600">
                          {new Date(task.scheduled_date).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')}
                          {task.completed_date && <span className="text-green-600 ml-2">✓ {t('completed')}</span>}
                        </p>
                      </div>
                      {!task.completed_date && (
                        <button
                          onClick={() => onCompleteTask(task)}
                          className="text-emerald-600 text-sm font-medium hover:underline"
                        >
                          {t('markComplete')}
                        </button>
                      )}
                    </div>
                  ))}
                  {tasks.length === 0 && <p className="text-gray-500 text-center py-4">कोई कार्य नहीं</p>}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">{t('selectCropForTasks')}</p>
            )}
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>💡</span> {t('farmingTips')}
          </h2>
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
              <p className="text-lg text-gray-800 font-medium">{FARMING_TIPS[tipIndex]}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {FARMING_TIPS.map((tip, i) => (
                <div
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    tipIndex === i ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
