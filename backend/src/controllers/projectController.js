const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(projects);
  } catch (error) {
    logger.error('Error fetching projects: %o', error);
    return res.status(500).json({ message: 'Internal server error fetching projects' });
  }
};

module.exports = {
  getProjects
};
