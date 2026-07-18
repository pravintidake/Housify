const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'];
const isAdmin = (role) => ['SUPER_ADMIN', 'ADMIN'].includes(role);
const canManageCatalog = (role) => ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(role);

const teamIds = async (user) => {
  if (isAdmin(user.role)) return null;
  if (user.role !== 'SALES_MANAGER') return [user.id];
  const members = await prisma.user.findMany({ where: { managerId: user.id }, select: { id: true } });
  return [user.id, ...members.map(member => member.id)];
};

const leadScope = async (user) => {
  const ids = await teamIds(user);
  return ids ? { assignedAgentId: { in: ids } } : {};
};

const makeSlug = (title) => `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
const normalizeProperty = (body) => ({
  title: body.title,
  slug: body.slug || makeSlug(body.title),
  description: body.description || '',
  price: Number(body.price || 0), type: body.type || 'RESIDENTIAL', status: body.status || 'AVAILABLE',
  address: body.address || '', city: body.city || '', area: body.area || '',
  bedrooms: Number(body.bedrooms || 0), bathrooms: Number(body.bathrooms || 0), sqft: Number(body.sqft || 0),
  images: JSON.stringify(Array.isArray(body.images) ? body.images : (body.images || '').split(',').filter(Boolean)),
  amenities: JSON.stringify(Array.isArray(body.amenities) ? body.amenities : (body.amenities || '').split(',').filter(Boolean)),
  ownerName: body.ownerName || null, ownerPhone: body.ownerPhone || null,
  brokerName: body.brokerName || null, brokerPhone: body.brokerPhone || null,
  googleMapsUrl: body.googleMapsUrl || null, isFeatured: Boolean(body.isFeatured),
});

const dashboard = async (req, res) => {
  const scope = await leadScope(req.user);
  const [properties, projects, leads, customers, recentLeads, tasks] = await Promise.all([
    prisma.property.count(), prisma.project.count(), prisma.lead.count({ where: scope }),
    prisma.customer.count({ where: isAdmin(req.user.role) ? {} : { assignedAgentId: { in: await teamIds(req.user) } } }),
    prisma.lead.findMany({ where: scope, take: 6, orderBy: { createdAt: 'desc' }, include: { property: { select: { title: true } }, assignedAgent: { select: { firstName: true, lastName: true } } } }),
    prisma.task.findMany({ where: isAdmin(req.user.role) ? {} : { userId: { in: await teamIds(req.user) } }, take: 8, orderBy: { dueAt: 'asc' }, include: { lead: { select: { name: true } } } }),
  ]);
  res.json({ counts: { properties, projects, leads, customers }, recentLeads, tasks });
};

const listProperties = async (_req, res) => res.json(await prisma.property.findMany({ orderBy: { createdAt: 'desc' } }));
const createProperty = async (req, res) => {
  if (!canManageCatalog(req.user.role)) return res.status(403).json({ message: 'You have view-only access to properties.' });
  if (!req.body.title) return res.status(400).json({ message: 'Property title is required.' });
  res.status(201).json(await prisma.property.create({ data: normalizeProperty(req.body) }));
};
const updateProperty = async (req, res) => {
  if (!canManageCatalog(req.user.role)) return res.status(403).json({ message: 'You have view-only access to properties.' });
  res.json(await prisma.property.update({ where: { id: req.params.id }, data: normalizeProperty(req.body) }));
};
const deleteProperty = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can delete properties.' });
  await prisma.property.delete({ where: { id: req.params.id } }); res.status(204).end();
};

const listProjects = async (_req, res) => res.json(await prisma.project.findMany({ orderBy: { createdAt: 'desc' } }));
const saveProject = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can manage projects.' });
  const data = { title: req.body.title, description: req.body.description || '', status: req.body.status || 'UPCOMING', location: req.body.location || '', image: req.body.image || null };
  const project = req.params.id ? await prisma.project.update({ where: { id: req.params.id }, data }) : await prisma.project.create({ data });
  res.status(req.params.id ? 200 : 201).json(project);
};
const deleteProject = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can delete projects.' });
  await prisma.project.delete({ where: { id: req.params.id } }); res.status(204).end();
};

const listLeads = async (req, res) => res.json(await prisma.lead.findMany({ where: await leadScope(req.user), orderBy: { updatedAt: 'desc' }, include: { property: { select: { title: true } }, assignedAgent: { select: { id: true, firstName: true, lastName: true } }, activities: { orderBy: { createdAt: 'desc' }, take: 5 } } }));
const updateLead = async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  const ids = await teamIds(req.user);
  if (!lead || (ids && (!lead.assignedAgentId || !ids.includes(lead.assignedAgentId)))) return res.status(403).json({ message: 'You cannot update this lead.' });
  const data = {};
  ['name', 'email', 'phone', 'status'].forEach(key => { if (req.body[key] !== undefined) data[key] = req.body[key]; });
  if (req.body.assignedAgentId !== undefined) {
    if (!['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(req.user.role)) return res.status(403).json({ message: 'You cannot assign leads.' });
    if (req.user.role === 'SALES_MANAGER' && !ids.includes(req.body.assignedAgentId)) return res.status(403).json({ message: 'Managers can only assign their own team.' });
    data.assignedAgentId = req.body.assignedAgentId || null;
  }
  const updated = await prisma.lead.update({ where: { id: lead.id }, data });
  if (req.body.note) await prisma.activity.create({ data: { leadId: lead.id, action: 'Lead updated', details: req.body.note } });
  res.json(updated);
};
const deleteLead = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can delete leads.' });
  await prisma.lead.delete({ where: { id: req.params.id } }); res.status(204).end();
};
const convertLead = async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  const ids = await teamIds(req.user);
  if (!lead || (ids && lead.assignedAgentId && !ids.includes(lead.assignedAgentId))) return res.status(403).json({ message: 'You cannot convert this lead.' });
  const customer = await prisma.customer.create({ data: { name: lead.name, email: lead.email, phone: lead.phone, budget: req.body.budget ? Number(req.body.budget) : null, timeline: req.body.timeline || null, assignedAgentId: lead.assignedAgentId, propertyId: lead.propertyId } });
  await prisma.lead.update({ where: { id: lead.id }, data: { status: 'Converted' } });
  await prisma.activity.create({ data: { leadId: lead.id, action: 'Converted to customer', details: `Customer ID: ${customer.id}` } });
  res.status(201).json(customer);
};

const listCustomers = async (req, res) => res.json(await prisma.customer.findMany({ where: isAdmin(req.user.role) ? {} : { assignedAgentId: { in: await teamIds(req.user) } }, orderBy: { updatedAt: 'desc' }, include: { assignedAgent: { select: { firstName: true, lastName: true } }, property: { select: { id: true, title: true, city: true, price: true } } } }));
const saveCustomer = async (req, res) => {
  const data = { name: req.body.name, email: req.body.email, phone: req.body.phone, budget: req.body.budget ? Number(req.body.budget) : null, timeline: req.body.timeline || null, assignedAgentId: req.body.assignedAgentId || req.user.id, propertyId: req.body.propertyId || null };
  if (req.params.id) {
    const existing = await prisma.customer.findUnique({ where: { id: req.params.id } }); const ids = await teamIds(req.user);
    if (!isAdmin(req.user.role) && (!existing || !ids.includes(existing.assignedAgentId))) return res.status(403).json({ message: 'You cannot update this customer.' });
    return res.json(await prisma.customer.update({ where: { id: req.params.id }, data }));
  }
  res.status(201).json(await prisma.customer.create({ data }));
};

const listUsers = async (req, res) => {
  if (!['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(req.user.role)) return res.status(403).json({ message: 'You cannot view the team directory.' });
  const where = req.user.role === 'SALES_MANAGER' ? { OR: [{ id: req.user.id }, { managerId: req.user.id }] } : {};
  res.json(await prisma.user.findMany({ where, select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, managerId: true, createdAt: true }, orderBy: { createdAt: 'desc' } }));
};
const createUser = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can add users.' });
  const role = ROLES.includes(req.body.role) ? req.body.role : 'AGENT';
  if (req.user.role !== 'SUPER_ADMIN' && ['SUPER_ADMIN', 'ADMIN'].includes(role)) return res.status(403).json({ message: 'Only Super Admin can create administrators.' });
  const password = await bcrypt.hash(req.body.password || 'Welcome@123', 10);
  res.status(201).json(await prisma.user.create({ data: { email: req.body.email, password, firstName: req.body.firstName, lastName: req.body.lastName, role, managerId: req.body.managerId || null }, select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, managerId: true } }));
};
const updateUser = async (req, res) => {
  if (!isAdmin(req.user.role)) return res.status(403).json({ message: 'Only administrators can manage users.' });
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target || (req.user.role !== 'SUPER_ADMIN' && ['SUPER_ADMIN', 'ADMIN'].includes(target.role))) return res.status(403).json({ message: 'You cannot manage this user.' });
  const data = {}; ['firstName', 'lastName', 'isActive', 'managerId'].forEach(key => { if (req.body[key] !== undefined) data[key] = req.body[key]; });
  if (req.body.role && ROLES.includes(req.body.role) && req.user.role === 'SUPER_ADMIN') data.role = req.body.role;
  res.json(await prisma.user.update({ where: { id: target.id }, data, select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, managerId: true } }));
};

const listTasks = async (req, res) => res.json(await prisma.task.findMany({ where: isAdmin(req.user.role) ? {} : { userId: { in: await teamIds(req.user) } }, orderBy: { dueAt: 'asc' }, include: { lead: { select: { name: true } }, user: { select: { firstName: true, lastName: true } } } }));
const listInquiries = async (req, res) => {
  if (!['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(req.user.role)) return res.status(403).json({ message: 'You cannot view inquiries.' });
  res.json(await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, include: { property: { select: { title: true } } } }));
};
const saveTask = async (req, res) => {
  const data = { title: req.body.title, type: req.body.type || 'FOLLOW_UP', dueAt: new Date(req.body.dueAt), notes: req.body.notes || null, leadId: req.body.leadId || null, userId: req.body.userId || req.user.id, completed: Boolean(req.body.completed) };
  if (req.params.id) return res.json(await prisma.task.update({ where: { id: req.params.id }, data }));
  res.status(201).json(await prisma.task.create({ data }));
};

module.exports = { dashboard, listProperties, createProperty, updateProperty, deleteProperty, listProjects, saveProject, deleteProject, listLeads, updateLead, deleteLead, convertLead, listCustomers, saveCustomer, listUsers, createUser, updateUser, listTasks, saveTask, listInquiries };
