import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function IncidentQueueTable({
  incidents = [],
  selectedId,
  onSelectIncident,
  onStatusChange,
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="card overflow-hidden bg-white">
      <div className="border-b border-line p-4">
        <h3 className="text-base font-bold text-ink">
          {t('command.incidentQueue')}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface text-ink-soft uppercase tracking-wider font-semibold border-b border-line">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Incident</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {incidents.map((inc) => {
              const isSelected = selectedId === inc.id;
              return (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident?.(inc)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-soft/30 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4 text-ink font-semibold">
                    {inc.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge type={inc.severity}>
                      {inc.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inc.status}
                      onChange={(e) => onStatusChange?.(inc.id, e.target.value)}
                      className="rounded border border-line bg-surface px-2 py-1 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
                    >
                      <option value="Received">Received</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Responding">Responding</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
