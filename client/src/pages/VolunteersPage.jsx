import { useState } from 'react';
import VolunteerTeamCard from '../components/volunteers/VolunteerTeamCard';
import ReliefCampaignCard from '../components/volunteers/ReliefCampaignCard';
import DeliveryPipeline from '../components/volunteers/DeliveryPipeline';
import { useLanguage } from '../context/LanguageContext';

const SKILLS = [
  'Medical support',
  'Food distribution',
  'Rescue',
  'Transport',
  'Translation',
  'Elderly care',
  'Crowd management',
];

export default function VolunteersPage() {
  const { lang, t } = useLanguage();
  const [selectedSkills, setSelectedSkills] = useState(['Medical support', 'Rescue']);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
          {t('volunteers.title')}
        </h1>
      </div>

      {/* Main Two Column Layout matching Page 7 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Teams near you & Become a volunteer */}
        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              {t('volunteers.teamsNearYou')}
            </h2>
            <div className="space-y-3">
              <VolunteerTeamCard
                teamName="Flood Relief Team, Delhi"
                badgeType="verified"
                badgeLabel="Verified team"
                memberCount={42}
              />
              <VolunteerTeamCard
                teamName="Kumbh Medical Support"
                badgeType="verified"
                badgeLabel="Verified team"
                memberCount={118}
              />
              <VolunteerTeamCard
                teamName="Medicine Delivery Group"
                badgeType="pending"
                badgeLabel="Pending check"
                memberCount={15}
              />
            </div>
          </div>

          {/* Become a volunteer box */}
          <div className="card p-5 bg-white space-y-4">
            <h3 className="text-base font-bold text-ink">
              {t('volunteers.becomeVolunteer')}
            </h3>

            <div className="flex flex-wrap gap-2">
              {SKILLS.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand text-white shadow-sm'
                        : 'bg-surface text-ink hover:bg-slate-200'
                    }`}
                  >
                    {sk}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert('Registered as volunteer in selected skills!')}
                className="btn-primary text-xs font-bold"
              >
                {t('volunteers.registerBtn')}
              </button>
              <button
                type="button"
                onClick={() => alert('Open team formation dialog.')}
                className="btn-outline text-xs font-bold"
              >
                {t('volunteers.createTeamBtn')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Relief campaigns & Delivery tracker */}
        <div className="space-y-6 lg:col-span-6">
          {/* Relief Campaigns */}
          <div className="card p-5 bg-white space-y-4">
            <h2 className="text-xl font-bold text-ink">
              {t('volunteers.reliefCampaigns')}
            </h2>

            <div className="space-y-4 pt-1">
              <ReliefCampaignCard title="Flood relief support" percent={62} />
              <ReliefCampaignCard title="Kumbh medical support" percent={40} />
              <ReliefCampaignCard title="Emergency shelter" percent={80} />
            </div>

            <p className="text-xs text-ink-soft pt-2 border-t border-line">
              {t('volunteers.demoPayments')}
            </p>
          </div>

          {/* Medicine & Essentials Delivery Pipeline */}
          <DeliveryPipeline />
        </div>
      </div>
    </div>
  );
}
