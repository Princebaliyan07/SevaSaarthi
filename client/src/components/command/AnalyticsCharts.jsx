import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

export default function AnalyticsCharts({ incidentsByType = [], responseTimeTrend = [] }) {
  const { lang, t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Incidents by Type Bar Chart */}
      <div className="card p-5 bg-white space-y-3">
        <h3 className="text-base font-bold text-ink">
          {t('command.incidentsByType')}
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidentsByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#0F766E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Trend Line Chart */}
      <div className="card p-5 bg-white space-y-3">
        <h3 className="text-base font-bold text-ink">
          {t('command.responseTime')}
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis unit="m" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#0F766E"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0F766E' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
