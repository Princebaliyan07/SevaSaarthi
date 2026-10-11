import { Router } from 'express';
import {
  // Teams
  getVolunteerTeams,
  getVolunteerTeamDetails,
  createVolunteerTeam,
  requestJoinTeam,
  getTeamJoinRequests,
  reviewTeamJoinRequest,
  reviewVolunteerTeam,
  deleteVolunteerTeam,
  unlockTeamContacts,
  // Volunteer Registration
  registerVolunteer,
  getVolunteerApplications,
  reviewVolunteerApplication,
  // Campaigns & Donations
  getReliefCampaigns,
  createReliefCampaign,
  deleteReliefCampaign,
  donateToCampaign,
  getCampaignDonations,
  // Suppliers
  getReliefSuppliers,
  registerSupplier,
  reviewSupplier,
  // Supply Orders
  createSupplyOrder,
  getSupplyOrders,
  updateSupplyOrderStatus,
  claimDeliveryOrder,
  // Command & Audit
  getReliefCommandOverview,
  getAuditLogs,
  // Legacy Deliveries
  getDeliveryRequests,
  createDeliveryRequest,
  claimDeliveryRequest,
  updateDeliveryStatus,
} from '../controllers/volunteer.controller.js';

const router = Router();

// 1. Volunteer Teams & Memberships
router.get('/teams', getVolunteerTeams);
router.get('/teams/:teamId', getVolunteerTeamDetails);
router.post('/teams', createVolunteerTeam);
router.delete('/teams/:teamId', deleteVolunteerTeam);
router.post('/teams/:teamId/join', requestJoinTeam);
router.post('/teams/:teamId/unlock', unlockTeamContacts);
router.get('/team-requests', getTeamJoinRequests);
router.patch('/team-requests/:requestId', reviewTeamJoinRequest);
router.patch('/teams/:teamId/review', reviewVolunteerTeam);

// 2. Individual Volunteer Applications
router.post('/register', registerVolunteer);
router.get('/applications', getVolunteerApplications);
router.patch('/applications/:regId/review', reviewVolunteerApplication);

// 3. Disaster Relief Campaigns & Donations
router.get('/campaigns', getReliefCampaigns);
router.post('/campaigns', createReliefCampaign);
router.delete('/campaigns/:campaignId', deleteReliefCampaign);
router.post('/campaigns/:campaignId/donate', donateToCampaign);
router.get('/donations', getCampaignDonations);

// 4. Certified Local Shops & Suppliers
router.get('/suppliers', getReliefSuppliers);
router.post('/suppliers', registerSupplier);
router.patch('/suppliers/:supplierId/review', reviewSupplier);

// 5. Essential Goods Supply Orders & Deliveries
router.post('/orders', createSupplyOrder);
router.get('/orders', getSupplyOrders);
router.patch('/orders/:orderId/status', updateSupplyOrderStatus);
router.patch('/orders/:orderId/claim', claimDeliveryOrder);

// 6. Command Center Operations & Audits
router.get('/command-overview', getReliefCommandOverview);
router.get('/audit-logs', getAuditLogs);

// 7. Legacy Medicine Delivery Requests
router.get('/deliveries', getDeliveryRequests);
router.post('/deliveries', createDeliveryRequest);
router.patch('/deliveries/:id/claim', claimDeliveryRequest);
router.patch('/deliveries/:id/status', updateDeliveryStatus);

export default router;
