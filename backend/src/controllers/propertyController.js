const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');

// GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { type, city, area, minPrice, maxPrice, bedrooms, status, sort, search } = req.query;

    const where = {};

    // Filter by type
    if (type && type !== 'ALL') {
      where.type = type;
    }

    // Filter by city
    if (city && city !== 'ALL') {
      where.city = { contains: city };
    }

    // Filter by area
    if (area) {
      where.area = { contains: area };
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Filter by bedrooms
    if (bedrooms && bedrooms !== 'ALL') {
      const bedCount = parseInt(bedrooms);
      if (bedCount === 4) {
        where.bedrooms = { gte: 4 }; // 4+ bedrooms
      } else {
        where.bedrooms = bedCount;
      }
    }

    // Free text search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
        { area: { contains: search } }
      ];
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      else if (sort === 'price_desc') orderBy = { price: 'desc' };
      else if (sort === 'title_asc') orderBy = { title: 'asc' };
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy,
    });

    // Parse image and amenity strings if they are stored as JSON strings
    const formattedProperties = properties.map(p => {
      let parsedImages = [];
      let parsedAmenities = [];
      try {
        parsedImages = p.images ? JSON.parse(p.images) : [];
      } catch (e) {
        parsedImages = p.images ? p.images.split(',') : [];
      }
      try {
        parsedAmenities = p.amenities ? JSON.parse(p.amenities) : [];
      } catch (e) {
        parsedAmenities = p.amenities ? p.amenities.split(',') : [];
      }

      return {
        ...p,
        images: parsedImages,
        amenities: parsedAmenities
      };
    });

    return res.status(200).json(formattedProperties);
  } catch (error) {
    logger.error('Error fetching properties: %o', error);
    return res.status(500).json({ message: 'Internal server error while fetching properties' });
  }
};

// GET /api/properties/:slug
const getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const property = await prisma.property.findUnique({
      where: { slug }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Parse JSON arrays
    let parsedImages = [];
    let parsedAmenities = [];
    try {
      parsedImages = property.images ? JSON.parse(property.images) : [];
    } catch (e) {
      parsedImages = property.images ? property.images.split(',') : [];
    }
    try {
      parsedAmenities = property.amenities ? JSON.parse(property.amenities) : [];
    } catch (e) {
      parsedAmenities = property.amenities ? property.amenities.split(',') : [];
    }

    const formattedProperty = {
      ...property,
      images: parsedImages,
      amenities: parsedAmenities
    };

    return res.status(200).json(formattedProperty);
  } catch (error) {
    logger.error('Error fetching property by slug: %o', error);
    return res.status(500).json({ message: 'Internal server error fetching property details' });
  }
};

module.exports = {
  getProperties,
  getPropertyBySlug,
};
