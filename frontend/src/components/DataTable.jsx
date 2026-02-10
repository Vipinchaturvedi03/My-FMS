import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';

export default function DataTable({ columns, data, onDelete }) {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                {col.header}
              </th>
            ))}
            {onDelete && <th className="px-4 py-2"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map(row => (
            <tr key={row.id || JSON.stringify(row)}>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2 text-sm">{row[col.key]}</td>
              ))}
              {onDelete && (
                <td className="px-4 py-2">
                  <button onClick={() => onDelete(row)} className="text-red-600 hover:underline">{t('delete')}</button>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td className="px-4 py-3 text-gray-500" colSpan={columns.length + (onDelete ? 1 : 0)}>{t('noData')}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


