const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const crm = require('../controllers/crmController');

const router = express.Router();
router.use(authenticate);

router.get('/dashboard', crm.dashboard);

router.route('/properties').get(crm.listProperties).post(crm.createProperty);
router.route('/properties/:id').put(crm.updateProperty).delete(crm.deleteProperty);
router.route('/projects').get(crm.listProjects).post(crm.saveProject);
router.route('/projects/:id').put(crm.saveProject).delete(crm.deleteProject);

router.get('/leads', crm.listLeads);
router.get('/inquiries', crm.listInquiries);
router.put('/leads/:id', crm.updateLead);
router.delete('/leads/:id', crm.deleteLead);
router.post('/leads/:id/convert', crm.convertLead);

router.route('/customers').get(crm.listCustomers).post(crm.saveCustomer);
router.put('/customers/:id', crm.saveCustomer);

router.route('/users').get(crm.listUsers).post(crm.createUser);
router.put('/users/:id', crm.updateUser);

router.route('/tasks').get(crm.listTasks).post(crm.saveTask);
router.put('/tasks/:id', crm.saveTask);

module.exports = router;
