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
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// 1. Volunteer Teams & Memberships
router.get('/teams', getVolunteerTeams);
router.get('/teams/:teamId', getVolunteerTeamDetails);
router.post('/teams', createVolunteerTeam);
router.delete('/teams/:teamId', verifyJwt, authorizeRoles('admin'), deleteVolunteerTeam);
router.post('/teams/:teamId/join', requestJoinTeam);
router.post('/teams/:teamId/unlock', unlockTeamContacts);
router.get('/team-requests', verifyJwt, authorizeRoles('admin'), getTeamJoinRequests);
router.patch('/team-requests/:requestId', verifyJwt, authorizeRoles('admin'), reviewTeamJoinRequest);
router.patch('/teams/:teamId/review', verifyJwt, authorizeRoles('admin'), reviewVolunteerTeam);

// 2. Individual Volunteer Applications
router.post('/register', registerVolunteer);
router.get('/applications', verifyJwt, authorizeRoles('admin'), getVolunteerApplications);
router.patch('/applications/:regId/review', verifyJwt, authorizeRoles('admin'), reviewVolunteerApplication);

// 3. Disaster Relief Campaigns & Donations
router.get('/campaigns', getReliefCampaigns);
router.post('/campaigns', verifyJwt, authorizeRoles('admin'), createReliefCampaign);
router.delete('/campaigns/:campaignId', verifyJwt, authorizeRoles('admin'), deleteReliefCampaign);
router.post('/campaigns/:campaignId/donate', donateToCampaign);
router.get('/donations', getCampaignDonations);

// 4. Certified Local Shops & Suppliers
router.get('/suppliers', getReliefSuppliers);
router.post('/suppliers', registerSupplier);
router.patch('/suppliers/:supplierId/review', verifyJwt, authorizeRoles('admin'), reviewSupplier);

// 5. Essential Goods Supply Orders & Deliveries
router.post('/orders', createSupplyOrder);
router.get('/orders', getSupplyOrders);
router.patch('/orders/:orderId/status', verifyJwt, authorizeRoles('admin', 'responder'), updateSupplyOrderStatus);
router.patch('/orders/:orderId/claim', claimDeliveryOrder);

// 6. Command Center Operations & Audits (Protected Admin Operations)
router.get('/command-overview', verifyJwt, authorizeRoles('admin'), getReliefCommandOverview);
router.get('/audit-logs', verifyJwt, authorizeRoles('admin'), getAuditLogs);

// 7. Legacy Medicine Delivery Requests
router.get('/deliveries', getDeliveryRequests);
router.post('/deliveries', createDeliveryRequest);
router.patch('/deliveries/:id/claim', claimDeliveryRequest);
router.patch('/deliveries/:id/status', verifyJwt, authorizeRoles('admin', 'responder'), updateDeliveryStatus);

export default router;
