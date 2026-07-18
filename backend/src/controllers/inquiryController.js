const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');

// POST /api/inquiries
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, budget, preferredDate, preferredTime, source, propertyId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone number are required' });
    }

    // Save Inquiry Record
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        budget: budget ? parseFloat(budget) : null,
        preferredDate,
        preferredTime,
        source: source || 'Website',
        propertyId: propertyId || null,
      }
    });

    let propertyTitle = 'General Inquiry';
    let property = null;

    if (propertyId) {
      property = await prisma.property.findUnique({
        where: { id: propertyId }
      });
      if (property) {
        propertyTitle = property.title;
      }
    }

    // Deduplication check: Same phone AND same property
    let existingLead = null;
    if (propertyId) {
      existingLead = await prisma.lead.findFirst({
        where: {
          phone,
          propertyId
        }
      });
    } else {
      // General inquiries check by phone and null property
      existingLead = await prisma.lead.findFirst({
        where: {
          phone,
          propertyId: null
        }
      });
    }

    let leadId = null;

    if (!existingLead) {
      // Create new Lead
      const newLead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          source: source || 'Website',
          status: 'New Inquiry',
          propertyId: propertyId || null,
        }
      });
      leadId = newLead.id;

      // Log Lead Activity
      await prisma.activity.create({
        data: {
          leadId: newLead.id,
          action: 'Inquiry Submitted',
          details: `Inquiry submitted via ${source || 'Website'} for ${propertyTitle}. Message: ${message || 'No message'}`,
        }
      });

      logger.info(`New lead created: ${name} (${phone}) via ${source || 'Website'}`);
    } else {
      leadId = existingLead.id;
      // If lead exists, log a repeat activity under it
      await prisma.activity.create({
        data: {
          leadId: existingLead.id,
          action: 'Repeat Inquiry',
          details: `User submitted another inquiry via ${source || 'Website'} for ${propertyTitle}. Message: ${message || 'No message'}`,
        }
      });
      logger.info(`Linked repeat inquiry from ${name} (${phone}) to existing lead ID ${existingLead.id}`);
    }

    // Create system-wide Notification for Admins/Agents
    await prisma.notification.create({
      data: {
        title: `New Inquiry: ${name}`,
        message: `Inquiry received via ${source || 'Website'} for ${propertyTitle}. Contact: ${phone}`,
        isRead: false,
      }
    });

    return res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry,
      leadCreated: !existingLead,
      leadId
    });
  } catch (error) {
    logger.error('Error creating inquiry: %o', error);
    return res.status(500).json({ message: 'Internal server error processing inquiry' });
  }
};

module.exports = {
  createInquiry
};
