import { useState, useEffect } from 'react';
import VolunteerTeamCard from '../components/volunteers/VolunteerTeamCard';
import ReliefCampaignCard from '../components/volunteers/ReliefCampaignCard';
import DeliveryPipeline from '../components/volunteers/DeliveryPipeline';
import TeamDetailsModal from '../components/volunteers/TeamDetailsModal';
import JoinTeamModal from '../components/volunteers/JoinTeamModal';
import RegisterVolunteerModal from '../components/volunteers/RegisterVolunteerModal';
import CreateTeamModal from '../components/volunteers/CreateTeamModal';
import DonateFundsModal from '../components/volunteers/DonateFundsModal';
import SponsorSuppliesModal from '../components/volunteers/SponsorSuppliesModal';

import {
  getVolunteerTeams,
  getReliefCampaigns,
  getReliefSuppliers,
  getSupplyOrders,
  claimDeliveryOrder,
  getReliefCommandOverview,
} from '../services/volunteerService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function VolunteersPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  // Location State
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [locationName, setLocationName] = useState('Prayagraj, Uttar Pradesh');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  // Active Main Tab on Volunteers Page
  const [pageTab, setPageTab] = useState('teams'); // 'teams' | 'campaigns' | 'shops' | 'deliveries'

  // Data States
  const [teams, setTeams] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedTeamForDetails, setSelectedTeamForDetails] = useState(null);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState(null);
  const [isRegisterVolunteerOpen, setIsRegisterVolunteerOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [selectedCampaignForSponsor, setSelectedCampaignForSponsor] = useState(null);

  // Geolocation detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('granted');
        setLocationName('Current Detected Location');
        loadData(coords);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        setLocationStatus('denied');
        loadData();
      },
      { timeout: 8000 }
    );
  };

  const loadData = async (coords = userLocation) => {
    setLoading(true);
    try {
      const params = {};
      if (coords?.lat && coords?.lng) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }
      if (selectedDisaster !== 'all') params.disasterType = selectedDisaster;
      if (selectedSpecialization !== 'all') params.specialization = selectedSpecialization;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [teamsList, campsList, supsList, ordsList, ovData] = await Promise.all([
        getVolunteerTeams(params),
        getReliefCampaigns(),
        getReliefSuppliers(),
        getSupplyOrders(),
        getReliefCommandOverview(),
      ]);

      setTeams(teamsList || []);
      setCampaigns(campsList || []);
      setSuppliers(supsList || []);
      setSupplyOrders(ordsList || []);
      setOverviewStats(ovData);
    } catch (err) {
      console.error('Error fetching volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, [selectedDisaster, selectedSpecialization]);

  const handleClaimOrder = async (orderId) => {
    const volName = prompt('Enter volunteer name claiming this delivery:', user?.name || 'Rapid Response Volunteer');
    if (!volName) return;
    try {
      await claimDeliveryOrder(orderId, { volunteerName: volName });
      alert('Delivery order claimed! Marked in-transit.');
      loadData();
    } catch (err) {
      alert('Failed to claim order: ' + err.message);
    }
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <span>🛡️</span>
            <span>National Disaster Relief & Verified Volunteer Grid</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t('volunteers.title') || 'Disaster Volunteer Network'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time disaster relief grid connecting on-ground citizen volunteers, specialized medical & rescue teams, certified local suppliers, and direct disaster relief campaigns with 100% transparent audit trails.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterVolunteerOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2"
            >
              <span>🙋</span>
              <span>Register as Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateTeamOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-2"
            >
              <span>👥</span>
              <span>Create Volunteer Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: LOCATION & METRICS CONTROL STRIP */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Location Status Pill & Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-teal-500/10 text-teal-800 dark:text-teal-200 border border-teal-500/30 text-xs font-bold">
              <span>📍</span>
              <span>{locationName}</span>
              {locationStatus === 'granted' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono">
                  GPS Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={detectLocation}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              🔄 Refresh Coordinates
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 flex-wrap">
            <span>
              Teams: <strong className="text-teal-600">{overviewStats?.teams?.verified || teams.length}</strong>
            </span>
            <span>·</span>
            <span>
              Volunteers: <strong className="text-emerald-600">{overviewStats?.volunteers?.total || 140}</strong>
            </span>
            <span>·</span>
            <span>
              Disaster Campaigns: <strong className="text-blue-600">{campaigns.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Area / City</label>
            <input
              type="text"
              placeholder="e.g. Prayagraj, Haridwar, Sangam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Disaster Type</label>
            <select
              value={selectedDisaster}
              onChange={(e) => setSelectedDisaster(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="all">All Disaster Scenarios</option>
              <option value="Flood Relief">Flood Relief</option>
              <option value="Mela Heatwave">Mela Heatwave</option>
              <option value="Stampede Medical Response">Stampede Medical Response</option>
              <option value="Earthquake Relief">Earthquake Relief</option>
              <option value="Cyclone Emergency">Cyclone Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skill Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="all">All Specializations</option>
              <option value="Medical assistance">Medical Support & First Aid</option>
              <option value="Rescue assistance">Search & Rescue Operations</option>
              <option value="Food distribution">Food & Clean Water Supply</option>
              <option value="Transportation">Emergency Transport & Evacuation</option>
              <option value="Elderly assistance">Elderly & Child Protection</option>
              <option value="Crowd management">Crowd & Stampede Management</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => loadData()}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-sm"
            >
              Apply Filter Grid
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Feature Views */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'teams', label: `👥 Nearby Volunteer Teams (${teams.length})` },
          { id: 'campaigns', label: `🎯 Verified Relief Campaigns (${campaigns.length})` },
          { id: 'shops', label: `🏪 Certified Local Shops (${suppliers.length})` },
          { id: 'deliveries', label: `📦 Emergency Supply Pipeline (${supplyOrders.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPageTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              pageTab === tab.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW 1: VOLUNTEER TEAMS GRID */}
      {pageTab === 'teams' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t('volunteers.teamsNearYou') || 'Verified Teams Near Your Location'}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Sorted by closest GPS proximity
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-bold">
              Scanning real-time MongoDB volunteer team coordinates...
            </div>
          ) : teams.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No verified volunteer teams found near your location.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Be the first to step up. Create a verified volunteer team or register yourself as an independent first responder.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateTeamOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Create a Team for This Area
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {teams.map((team) => (
                <VolunteerTeamCard
                  key={team._id || team.id}
                  team={team}
                  onJoin={(tm) => setSelectedTeamForJoin(tm)}
                  onViewDetails={(tm) => setSelectedTeamForDetails(tm)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: RELIEF CAMPAIGNS GRID */}
      {pageTab === 'campaigns' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Verified Disaster Relief Campaigns
              </h2>
              <p className="text-xs text-slate-500">
                Direct disaster campaigns authorized by disaster administration. Donate funds or sponsor supplies fulfilled by verified local medical shops.
              </p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              No active disaster campaigns found in database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {campaigns.map((camp) => (
                <ReliefCampaignCard
                  key={camp._id}
                  campaign={camp}
                  onDonateFunds={(c) => setSelectedCampaignForDonation(c)}
                  onSponsorSupplies={(c) => setSelectedCampaignForSponsor(c)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW 3: CERTIFIED LOCAL SHOPS & SUPPLIERS */}
      {pageTab === 'shops' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Certified Local Relief Shops & Essential Suppliers
              </h2>
              <p className="text-xs text-slate-500">
                Certified medical stores and grocery shops providing disaster rations, ORS, medicines, and water.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((s) => (
              <div key={s._id} className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      {s.category}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">{s.businessName}</h3>
                    <p className="text-xs text-slate-500">📍 {s.address}, {s.city}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ✓ Verified Shop
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Available Relief Stock:</span>
                  <div className="flex flex-wrap gap-1">
                    {s.catalog?.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                        {item.name} (₹{item.price}/{item.unit})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  License: {s.licenseNumber || 'DL-GOV-2026-UP'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIEW 4: ESSENTIAL SUPPLIES DISPATCH & DELIVERY PIPELINE */}
      {pageTab === 'deliveries' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Live Emergency Supply Deliveries
            </h2>
            <p className="text-xs text-slate-500">
              Orders sponsored by donors, packaged by certified local stores, and delivered to relief camps by volunteers.
            </p>
          </div>

          <div className="space-y-4">
            {supplyOrders.map((ord) => (
              <div key={ord._id} className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-mono font-black text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-200 border border-teal-500/30">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fulfilling Store: {ord.supplierId?.businessName || 'Certified Partner'} · Destination: {ord.deliveryLocation?.dropPoint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                      ₹{ord.totalAmount}
                    </span>
                    {!ord.volunteerId && ord.status !== 'Delivered' && (
                      <button
                        type="button"
                        onClick={() => handleClaimOrder(ord._id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                      >
                        Claim for Delivery
                      </button>
                    )}
                  </div>
                </div>

                {/* 10-Step Progress Pipeline */}
                <DeliveryPipeline
                  requestId={ord.orderNumber}
                  volunteer={ord.volunteerId?.fullName || ord.assignedVolunteerName || 'Unassigned'}
                  eta="25 min"
                  activeStageIndex={
                    ord.status === 'Requested' ? 0 :
                    ord.status === 'Paid' ? 1 :
                    ord.status === 'Accepted' ? 2 :
                    ord.status === 'Preparing' ? 3 :
                    ord.status === 'Ready for Pickup' ? 4 :
                    ord.status === 'Assigned for Delivery' ? 5 :
                    ord.status === 'Dispatched' ? 6 :
                    ord.status === 'Delivered' ? 7 : 2
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ALL MODALS */}
      {selectedTeamForDetails && (
        <TeamDetailsModal
          team={selectedTeamForDetails}
          onClose={() => setSelectedTeamForDetails(null)}
          onJoinClick={(tm) => {
            setSelectedTeamForDetails(null);
            setSelectedTeamForJoin(tm);
          }}
        />
      )}

      {selectedTeamForJoin && (
        <JoinTeamModal
          team={selectedTeamForJoin}
          onClose={() => setSelectedTeamForJoin(null)}
          onSuccess={() => {
            setSelectedTeamForJoin(null);
            loadData();
          }}
        />
      )}

      {isRegisterVolunteerOpen && (
        <RegisterVolunteerModal
          onClose={() => setIsRegisterVolunteerOpen(false)}
          onSuccess={() => {
            setIsRegisterVolunteerOpen(false);
            loadData();
          }}
        />
      )}

      {isCreateTeamOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateTeamOpen(false)}
          onSuccess={() => {
            setIsCreateTeamOpen(false);
            loadData();
          }}
        />
      )}

      {selectedCampaignForDonation && (
        <DonateFundsModal
          campaign={selectedCampaignForDonation}
          onClose={() => setSelectedCampaignForDonation(null)}
          onSuccess={() => {
            setSelectedCampaignForDonation(null);
            loadData();
          }}
        />
      )}

      {selectedCampaignForSponsor && (
        <SponsorSuppliesModal
          campaign={selectedCampaignForSponsor}
          onClose={() => setSelectedCampaignForSponsor(null)}
          onSuccess={() => {
            setSelectedCampaignForSponsor(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
