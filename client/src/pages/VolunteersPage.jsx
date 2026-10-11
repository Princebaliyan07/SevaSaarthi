import { useState, useEffect } from 'react';
import VolunteerTeamCard from '../components/volunteers/VolunteerTeamCard';
import ReliefCampaignCard from '../components/volunteers/ReliefCampaignCard';
import DeliveryPipeline from '../components/volunteers/DeliveryPipeline';

// Modals
import TeamDetailsModal from '../components/volunteers/TeamDetailsModal';
import JoinTeamModal from '../components/volunteers/JoinTeamModal';
import RegisterVolunteerModal from '../components/volunteers/RegisterVolunteerModal';
import CreateTeamModal from '../components/volunteers/CreateTeamModal';
import DonateFundsModal from '../components/volunteers/DonateFundsModal';
import SponsorSuppliesModal from '../components/volunteers/SponsorSuppliesModal';
import CampaignDetailsModal from '../components/volunteers/CampaignDetailsModal';
import RegisterSupplierModal from '../components/volunteers/RegisterSupplierModal';
import ProductCatalogModal from '../components/volunteers/ProductCatalogModal';
import OrderTrackingModal from '../components/volunteers/OrderTrackingModal';
import DeliveryMissionModal from '../components/volunteers/DeliveryMissionModal';
import MyDonationsModal from '../components/volunteers/MyDonationsModal';
import JoinDeliveryFleetModal from '../components/volunteers/JoinDeliveryFleetModal';

import {
  getVolunteerTeams,
  createVolunteerTeam,
  requestJoinTeam,
  registerVolunteer,
  getReliefCampaigns,
  donateToCampaign,
  getReliefSuppliers,
  registerSupplier,
  createSupplyOrder,
  getSupplyOrders,
  updateSupplyOrderStatus,
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
  const [manualCity, setManualCity] = useState('Prayagraj');
  const [manualState, setManualState] = useState('Uttar Pradesh');
  const [manualPincode, setManualPincode] = useState('211001');
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  // 4 Primary Distinct Functional Sections
  // 'teams' | 'campaigns' | 'shops' | 'deliveries'
  const [activeSection, setActiveSection] = useState('teams');

  // Backend Data Collections
  const [teams, setTeams] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals Visibility
  const [selectedTeamForDetails, setSelectedTeamForDetails] = useState(null);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState(null);
  const [isRegisterVolunteerOpen, setIsRegisterVolunteerOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [selectedCampaignForSponsor, setSelectedCampaignForSponsor] = useState(null);
  const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState(null);
  const [isRegisterSupplierOpen, setIsRegisterSupplierOpen] = useState(false);
  const [selectedSupplierForCatalog, setSelectedSupplierForCatalog] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [isMyDonationsOpen, setIsMyDonationsOpen] = useState(false);
  const [isJoinDeliveryFleetOpen, setIsJoinDeliveryFleetOpen] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState(null); // 'shop' | 'fleet' | null


  // Geolocation Detection with explicit manual fallback
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
        setLocationName('Current Detected Coordinates (GPS Active)');
        loadData(coords);
      },
      (err) => {
        console.warn('Geolocation permission not granted or unavailable:', err.message);
        setLocationStatus('denied');
        loadData();
      },
      { timeout: 8000 }
    );
  };

  const handleApplyManualLocation = (e) => {
    e.preventDefault();
    setLocationName(`${manualCity}, ${manualState} (PIN: ${manualPincode})`);
    setIsChangingLocation(false);
    loadData();
  };

  const loadData = async (coords = userLocation) => {
    setLoading(true);
    try {
      const params = {};
      if (coords?.lat && coords?.lng) {
        params.userLat = coords.lat;
        params.userLng = coords.lng;
      }
      if (selectedDisaster !== 'all') params.disaster = selectedDisaster;
      if (selectedSpecialization !== 'all') params.skill = selectedSpecialization;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [teamsList, campsList, supsList, ordsList, ovData] = await Promise.all([
        getVolunteerTeams(params),
        getReliefCampaigns({ category: selectedDisaster !== 'all' ? selectedDisaster : undefined }),
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

  // Handle Team Creation
  const handleCreateTeamSubmit = async (formData) => {
    await createVolunteerTeam(formData);
    alert('Team proposed successfully! Status set to "Pending Verification". An authorized administrator will review it in the Command Centre.');
    loadData();
  };

  // Handle Join Team
  const handleJoinTeamSubmit = async (teamId, formData) => {
    await requestJoinTeam(teamId, formData);
    alert('Membership request submitted successfully! Team member count will update upon administrator or team leader approval.');
    loadData();
  };

  // Handle Volunteer Registration
  const handleRegisterVolunteerSubmit = async (formData) => {
    const res = await registerVolunteer(formData);
    alert('Volunteer registration submitted successfully! Assigned ID: ' + (res?.registrationId || 'VOL-REG'));
    loadData();
    return res;
  };

  // Handle Monetary Donation
  const handleDonationSubmit = async (campaignId, payload) => {
    const receipt = await donateToCampaign(campaignId, payload);
    alert(`Thank you for supporting disaster victims! Confirmed Receipt: ${receipt?.receiptNumber}`);
    loadData();
    return receipt;
  };

  // Handle Sponsoring Essential Supplies
  const handleSponsorSuppliesSubmit = async (payload) => {
    const res = await createSupplyOrder(payload);
    alert(`Supplies order ${res?.orderId} created! Assigned to local certified supplier.`);
    loadData();
    return res;
  };

  // Handle Register Local Supplier
  const handleRegisterSupplierSubmit = async (formData) => {
    await registerSupplier(formData);
    alert('Local shop application submitted! Awaiting license and administrative verification in the Command Centre.');
    loadData();
  };

  // Handle Claiming Delivery
  const handleClaimOrder = async (orderId) => {
    const volName = prompt('Enter your full name to accept this delivery assignment:', user?.name || 'Rapid Response Volunteer');
    if (!volName) return;
    try {
      await claimDeliveryOrder(orderId, { volunteerName: volName });
      alert('Delivery assignment accepted! Order status updated to "Assigned for Delivery".');
      loadData();
    } catch (err) {
      alert('Failed to claim delivery: ' + err.message);
    }
  };

  // Handle Pickup Confirmation
  const handleConfirmPickup = async (orderId) => {
    await updateSupplyOrderStatus(orderId, { orderStatus: 'Dispatched' });
    alert('Store pickup confirmed! Shipment marked as in-transit.');
    loadData();
  };

  // Handle Delivery Confirmation
  const handleConfirmDelivery = async (orderId, data) => {
    await updateSupplyOrderStatus(orderId, {
      orderStatus: 'Delivered',
      deliveryConfirmationNote: data.deliveryConfirmationNote,
      deliveryEvidenceUrl: data.deliveryEvidenceUrl,
    });
    alert('Delivery to relief victims confirmed! Campaign shortages and delivered counts have been automatically updated.');
    loadData();
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <span>🛡️</span>
            <span>National Disaster Relief & Verified Volunteer Grid</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t('volunteers.title') || 'Disaster Volunteer Network'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
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
            <button
              type="button"
              onClick={() => setIsRegisterSupplierOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 font-bold text-xs transition-all border border-emerald-500/30 flex items-center gap-2"
            >
              <span>🏪</span>
              <span>Register as a Local Supplier</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMyDonationsOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all border border-slate-700 flex items-center gap-2"
            >
              <span>📜</span>
              <span>View Contribution Receipts</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: LOCATION-BASED VOLUNTEER DASHBOARD & FILTERS */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Location Status & Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-500/10 text-teal-800 dark:text-teal-200 border border-teal-500/30 text-xs font-bold">
              <span>📍</span>
              <span>{locationName}</span>
              {locationStatus === 'granted' && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500 text-white font-mono">
                  GPS Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsChangingLocation(!isChangingLocation)}
              className="px-3 py-1.5 rounded-xl border border-teal-500/30 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all"
            >
              {isChangingLocation ? '✕ Cancel' : '📍 Change Location'}
            </button>

            <button
              type="button"
              onClick={detectLocation}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              🔄 Refresh Coordinates
            </button>
          </div>

          {/* Real Database Metrics Counters */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 flex-wrap">
            <span>
              Nearby Teams: <strong className="text-teal-600">{overviewStats?.teams?.verified || teams.length}</strong>
            </span>
            <span>·</span>
            <span>
              Volunteers: <strong className="text-emerald-600">{overviewStats?.volunteers?.total || 140}</strong>
            </span>
            <span>·</span>
            <span>
              Relief Campaigns: <strong className="text-blue-600">{campaigns.length}</strong>
            </span>
            <span>·</span>
            <span>
              Supply Pipeline: <strong className="text-amber-600">{supplyOrders.length}</strong>
            </span>
          </div>
        </div>

        {/* Change Location Drawer */}
        {isChangingLocation && (
          <form onSubmit={handleApplyManualLocation} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="block font-bold text-slate-500 mb-1">City</label>
              <input
                type="text"
                required
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 mb-1">State</label>
              <input
                type="text"
                required
                value={manualState}
                onChange={(e) => setManualState(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 mb-1">PIN Code</label>
              <input
                type="text"
                required
                value={manualPincode}
                onChange={(e) => setManualPincode(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all"
              >
                Set Location Coordinates
              </button>
            </div>
          </form>
        )}

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search City / District / Area</label>
            <input
              type="text"
              placeholder="e.g. Prayagraj, Haridwar, Naini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Disaster Scenario</label>
            <select
              value={selectedDisaster}
              onChange={(e) => setSelectedDisaster(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="all">All Disasters</option>
              <option value="Floods">Monsoon Flood Relief</option>
              <option value="Heatwaves">Heatwave & Sunstroke Emergency</option>
              <option value="Severe Storms">Cyclone & Thunderstorm</option>
              <option value="General Emergency">General Disaster Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skill Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="all">All Specializations</option>
              <option value="Triage First Aid">Triage & First Aid</option>
              <option value="Inflatable Boat Operations">Boat Rescue & Aquatic Evacuation</option>
              <option value="Deep Water Diving">Deep Water Diving</option>
              <option value="Medicine Doorstep Delivery">Medicine Doorstep Delivery</option>
              <option value="Food Distribution">Food & Clean Water Logistics</option>
              <option value="Elderly Escort">Elderly & Vulnerable Citizen Escort</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => loadData()}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all shadow-sm"
            >
              Apply Filter Grid
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: NEARBY VOLUNTEER TEAMS                         */}
      {/* ======================================================== */}
      <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <span className="p-3 rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 text-2xl shrink-0">
              👥
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  Section 1
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {teams.length} Verified Teams Nearby
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {t('volunteers.teamsNearYou') || 'Nearby Volunteer Teams'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Proximity-sorted disaster units & squads calculated by real GPS coordinates. Member counts update upon approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateTeamOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition-all shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Create a Team for This Area</span>
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400 font-bold">
            Scanning real-time MongoDB volunteer team coordinates...
          </div>
        ) : teams.length === 0 ? (
          <div className="p-10 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <span className="text-3xl">🛡️</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No verified volunteer teams found near your location.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Be the first to step up. Create a verified volunteer team or register yourself as an independent disaster volunteer.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateTeamOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
            >
              Create a Team for This Area
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team) => (
              <VolunteerTeamCard
                key={team._id || team.teamId}
                team={team}
                onJoin={(tm) => setSelectedTeamForJoin(tm)}
                onViewDetails={(tm) => setSelectedTeamForDetails(tm)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: VERIFIED RELIEF CAMPAIGNS & GOVERNMENT FUNDS    */}
      {/* ======================================================== */}
      <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <span className="p-3 rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-2xl shrink-0">
              🎯
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Section 2
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {campaigns.length} Active Campaigns
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Support Disaster Victims — Official Government Relief Funds
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                100% verified disaster relief campaigns administered by District Disaster Management Authorities (DDMA) and designated relief escrow accounts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMyDonationsOpen(true)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 transition-all shrink-0"
          >
            View Confirmed Receipts →
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-semibold">
            No active disaster campaigns found for this district filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((camp) => (
              <ReliefCampaignCard
                key={camp._id || camp.campaignId}
                campaign={camp}
                onDonateFunds={(c) => setSelectedCampaignForDonation(c)}
                onSponsorSupplies={(c) => setSelectedCampaignForSponsor(c)}
                onViewDetails={(c) => setSelectedCampaignForDetails(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* FUTURE SCOPE / CURRENTLY WORKING: DIRECT ESSENTIAL AID    */}
      {/* ======================================================== */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-teal-500/30 bg-gradient-to-br from-white via-teal-50/20 to-slate-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 space-y-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-5">
          <div className="flex items-start gap-3.5">
            <span className="p-3.5 rounded-2xl bg-teal-600 text-white text-3xl shadow-lg shadow-teal-600/20 shrink-0">
              🚀
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-200 bg-teal-500/20 px-3 py-0.5 rounded-full border border-teal-500/30">
                  Future Scope · Currently Working
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Active Deployment
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                Direct Essential Aid & Victim Sponsorship System
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                Don't just donate money to general funds. Choose the exact essential items disaster victims need — buy directly from registered local medical stores and food shops, and our volunteer teams deliver them straight to ground relief camps!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setComingSoonModal('shop')}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <span>🏪</span>
              <span>Register Medical / Food Shop</span>
            </button>
            <button
              type="button"
              onClick={() => setComingSoonModal('fleet')}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all"
            >
              🚚 Join Delivery Volunteer Fleet
            </button>
          </div>
        </div>

        {/* 4 Feature Points with Attractive Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Point 1: Direct Medicine Sponsorship */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xl font-bold">
                💊
              </span>
              <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md">
                Step 1
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Sponsor Specific Medicines
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select verified medicines such as <strong>1,000 tabs of Azithromycin</strong>, ORS rehydration packets, or paracetamol strips according to real-time ground demand lists.
            </p>
          </div>

          {/* Point 2: Registered Local Store Network */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xl font-bold">
                🏪
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Step 2
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Registered Medical & Food Stores
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We partner directly with certified local pharmacies and grocery stores near the affected disaster location. Zero inflated middleman transit delays or black marketing.
            </p>
          </div>

          {/* Point 3: Direct Payment & Instant Order Generation */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xl font-bold">
                💳
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Step 3
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Transparent Direct Payment
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your donation payment goes directly toward purchasing the verified goods from the registered store, generating an immutable audit receipt and instant stock order.
            </p>
          </div>

          {/* Point 4: Volunteer Fleet Delivery */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xl font-bold">
                🚚
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                Step 4
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Direct Handover to Victims
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our verified local volunteer team picks up the packaged medicines or food directly from the store and delivers them by hand to victim camps with digital proof.
            </p>
          </div>
        </div>

        {/* Real Example Workflow Banner — Two Examples */}
        <div className="rounded-2xl bg-slate-900 text-white shadow-inner overflow-hidden">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveSection('medicine-example')}
              className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSection !== 'food-example'
                  ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💊 Example 1 — Medicine Aid
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('food-example')}
              className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSection === 'food-example'
                  ? 'bg-orange-600/20 text-orange-300 border-b-2 border-orange-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🍞 Example 2 — Food Aid
            </button>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400">
                Live Example Simulation Workflow
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeSection === 'food-example' ? 'Food & Ration Distribution Protocol' : 'Medical & Ration Distribution Protocol'}
              </span>
            </div>

            {/* Medicine Example */}
            {activeSection !== 'food-example' && (
              <div className="flex items-center gap-2 overflow-x-auto text-xs py-2 flex-nowrap">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-6 w-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center text-[10px]">1</span>
                  <span>Donor selects <strong>1,000 tabs of Azithromycin</strong> (Rs. 2,500)</span>
                </div>
                <span className="text-teal-400 font-bold shrink-0">→</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-6 w-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center text-[10px]">2</span>
                  <span>Paid to Registered <strong>Sanjeevani Medical Store</strong></span>
                </div>
                <span className="text-teal-400 font-bold shrink-0">→</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-6 w-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center text-[10px]">3</span>
                  <span>Store packs batches for emergency dispatch</span>
                </div>
                <span className="text-teal-400 font-bold shrink-0">→</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-6 w-6 rounded-full bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-[10px]">4</span>
                  <span><strong>SevaSaarthi Volunteer</strong> hands over to flood victims</span>
                </div>
              </div>
            )}

            {/* Food Example */}
            {activeSection === 'food-example' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 overflow-x-auto py-2 flex-nowrap">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-6 w-6 rounded-full bg-orange-500 text-slate-950 font-black flex items-center justify-center text-[10px]">1</span>
                    <span>Donor selects <strong>1,000 Breads + 100 Biscuit Packs</strong> from food shop</span>
                  </div>
                  <span className="text-orange-400 font-bold shrink-0">→</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-6 w-6 rounded-full bg-orange-500 text-slate-950 font-black flex items-center justify-center text-[10px]">2</span>
                    <span>Payment to <strong>Annapurna Ration &amp; Grocery Hub</strong></span>
                  </div>
                  <span className="text-orange-400 font-bold shrink-0">→</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-6 w-6 rounded-full bg-orange-500 text-slate-950 font-black flex items-center justify-center text-[10px]">3</span>
                    <span>📱 <strong>Fleet volunteer gets notified</strong> on phone</span>
                  </div>
                  <span className="text-orange-400 font-bold shrink-0">→</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-6 w-6 rounded-full bg-orange-500 text-slate-950 font-black flex items-center justify-center text-[10px]">4</span>
                    <span>🚚 Volunteer picks up from shop, <strong>delivers to victim camp</strong></span>
                  </div>
                  <span className="text-orange-400 font-bold shrink-0">→</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-6 w-6 rounded-full bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-[10px]">5</span>
                    <span>📸 <strong>Photo proof</strong> sent — donor sees delivery confirmed</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-900/30 border border-orange-700/40 text-[11px] text-orange-200 flex items-start gap-2">
                  <span className="shrink-0">🍞</span>
                  <span><strong>Real Scenario:</strong> Donor Priya (Mumbai) pays Rs. 3,200 → Annapurna Grocery Prayagraj packs 1,000 breads + 100 biscuit packs → Volunteer Ravi picks up on his motorcycle → Delivers to Flood Relief Camp, Naini, Prayagraj → Photo proof sent to Priya instantly.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ALL MODALS                                               */}
      {/* ======================================================== */}
      {/* Team Details Modal */}
      <TeamDetailsModal
        team={selectedTeamForDetails}
        isOpen={Boolean(selectedTeamForDetails)}
        onClose={() => setSelectedTeamForDetails(null)}
        onJoinRequest={(tm) => {
          setSelectedTeamForDetails(null);
          setSelectedTeamForJoin(tm);
        }}
      />

      {/* Join Team Modal */}
      <JoinTeamModal
        team={selectedTeamForJoin}
        isOpen={Boolean(selectedTeamForJoin)}
        onClose={() => setSelectedTeamForJoin(null)}
        onSubmitJoin={handleJoinTeamSubmit}
      />

      {/* Volunteer Registration Modal */}
      <RegisterVolunteerModal
        isOpen={isRegisterVolunteerOpen}
        onClose={() => setIsRegisterVolunteerOpen(false)}
        onRegisterSuccess={handleRegisterVolunteerSubmit}
      />

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onCreateTeam={handleCreateTeamSubmit}
      />

      {/* Donate Funds to Campaign Modal */}
      <DonateFundsModal
        campaign={selectedCampaignForDonation}
        isOpen={Boolean(selectedCampaignForDonation)}
        onClose={() => setSelectedCampaignForDonation(null)}
        onConfirmDonation={handleDonationSubmit}
      />

      {/* Sponsor Supplies Modal */}
      <SponsorSuppliesModal
        campaign={selectedCampaignForSponsor}
        suppliers={suppliers}
        isOpen={Boolean(selectedCampaignForSponsor)}
        onClose={() => setSelectedCampaignForSponsor(null)}
        onSubmitSponsorship={handleSponsorSuppliesSubmit}
      />

      {/* Campaign Details & Progress Modal */}
      <CampaignDetailsModal
        campaign={selectedCampaignForDetails}
        isOpen={Boolean(selectedCampaignForDetails)}
        onClose={() => setSelectedCampaignForDetails(null)}
        onDonateClick={(c) => setSelectedCampaignForDonation(c)}
        onSponsorClick={(c) => setSelectedCampaignForSponsor(c)}
      />

      {/* Register Supplier Modal */}
      <RegisterSupplierModal
        isOpen={isRegisterSupplierOpen}
        onClose={() => setIsRegisterSupplierOpen(false)}
        onRegisterSuccess={handleRegisterSupplierSubmit}
      />

      {/* Product Catalog Modal */}
      <ProductCatalogModal
        supplier={selectedSupplierForCatalog}
        isOpen={Boolean(selectedSupplierForCatalog)}
        onClose={() => setSelectedSupplierForCatalog(null)}
        onSponsorProduct={handleSponsorSuppliesSubmit}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        order={selectedOrderForTracking}
        isOpen={Boolean(selectedOrderForTracking)}
        onClose={() => setSelectedOrderForTracking(null)}
      />

      {/* Delivery Mission Modal */}
      <DeliveryMissionModal
        order={selectedOrderForDispatch}
        isOpen={Boolean(selectedOrderForDispatch)}
        onClose={() => setSelectedOrderForDispatch(null)}
        onConfirmPickup={handleConfirmPickup}
        onConfirmDelivery={handleConfirmDelivery}
      />

      {/* Contribution Receipts & History Modal */}
      <MyDonationsModal
        isOpen={isMyDonationsOpen}
        onClose={() => setIsMyDonationsOpen(false)}
      />

      {/* Join Delivery Fleet Modal */}
      <JoinDeliveryFleetModal
        isOpen={isJoinDeliveryFleetOpen}
        onClose={() => setIsJoinDeliveryFleetOpen(false)}
      />

      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setComingSoonModal(null)}
        >
          <div
            className="glass-card w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl shadow-inner">
              🚧
            </div>
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-500 mb-1">
                Coming Soon
              </p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {comingSoonModal === 'shop'
                  ? 'Register Medical / Food Shop'
                  : 'Join Delivery Volunteer Fleet'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {comingSoonModal === 'shop'
                  ? 'Shop & supplier registration is not open yet. We are onboarding certified medical stores and food suppliers. Check back soon!'
                  : 'Delivery fleet registration is not started yet. We are building our volunteer logistics network. Stay tuned for updates!'}
              </p>
            </div>
            <div className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1 text-left">
              <p className="font-bold text-slate-700 dark:text-slate-300">What to expect:</p>
              {comingSoonModal === 'shop' ? (
                <>
                  <p>✦ Verified medical store & pharmacy onboarding</p>
                  <p>✦ Grocery & ration shop partnership program</p>
                  <p>✦ FSSAI / Drug License verification process</p>
                  <p>✦ Real-time inventory sync with SevaSaarthi</p>
                </>
              ) : (
                <>
                  <p>✦ Delivery volunteer sign-up & background check</p>
                  <p>✦ Vehicle registration & capacity profiling</p>
                  <p>✦ Mission notification system via SMS / app</p>
                  <p>✦ Digital delivery proof & photo upload</p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setComingSoonModal(null)}
              className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm transition-all shadow-md w-full"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
