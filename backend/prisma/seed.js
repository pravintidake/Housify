const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Super Admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@housify.com' }
  });

  let adminUser;
  if (!existingAdmin) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('AdminPassword123', saltRounds);

    adminUser = await prisma.user.create({
      data: {
        email: 'admin@housify.com',
        password: hashedPassword,
        firstName: 'Housify',
        lastName: 'SuperAdmin',
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });
    console.log('Created default Super Admin user: admin@housify.com');
  } else {
    adminUser = existingAdmin;
    console.log('Super Admin user already exists.');
  }

  // 2. Seed Properties
  const propertiesCount = await prisma.property.count();
  if (propertiesCount === 0) {
    console.log('Seeding properties...');
    const propertiesData = [
      {
        title: "Luxury 3 BHK Apartment in Baner",
        slug: "luxury-3bhk-apartment-baner-pune",
        description:
          "Premium 3 BHK apartment in Baner with spacious interiors, modular kitchen, smart home features, clubhouse, swimming pool, gym, children's play area, and excellent connectivity to Hinjewadi IT Park.",
        price: 16500000,
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        address: "Baner Road",
        city: "Pune",
        area: "Baner",
        bedrooms: 3,
        bathrooms: 3,
        sqft: 1650,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
          "https://images.unsplash.com/photo-1600607687644-c7f34b5063ec"
        ]),
        amenities: JSON.stringify([
          "Swimming Pool",
          "Club House",
          "Gym",
          "Garden",
          "Kids Play Area",
          "Covered Parking",
          "24x7 Security"
        ]),
        ownerName: "Rahul Deshmukh",
        ownerPhone: "+919876543210",
        brokerName: "Amit Patil",
        brokerPhone: "+919988776655",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: true,
      },

      {
        title: "Premium 2 BHK in Kharadi",
        slug: "premium-2bhk-kharadi-pune",
        description:
          "Modern apartment near EON IT Park with excellent rental potential and premium lifestyle amenities.",
        price: 9800000,
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        address: "Kharadi",
        city: "Pune",
        area: "Kharadi",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1150,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
        ]),
        amenities: JSON.stringify([
          "Gym",
          "Clubhouse",
          "Swimming Pool",
          "Power Backup",
          "Security"
        ]),
        ownerName: "Snehal Joshi",
        ownerPhone: "+919876500001",
        brokerName: "Pratik Kulkarni",
        brokerPhone: "+919988700002",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: true,
      },

      {
        title: "Commercial Office at BKC",
        slug: "commercial-office-bkc-mumbai",
        description:
          "Grade A office space in Bandra Kurla Complex suitable for startups and enterprises.",
        price: 65000000,
        type: "COMMERCIAL",
        status: "AVAILABLE",
        address: "Bandra Kurla Complex",
        city: "Mumbai",
        area: "BKC",
        bedrooms: 0,
        bathrooms: 4,
        sqft: 4500,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
          "https://images.unsplash.com/photo-1497366412874-3415097a27e7"
        ]),
        amenities: JSON.stringify([
          "Meeting Rooms",
          "High Speed Internet",
          "Parking",
          "Reception",
          "24x7 Security"
        ]),
        ownerName: "Vikas Shah",
        ownerPhone: "+919999112233",
        brokerName: "Kunal Mehta",
        brokerPhone: "+918888112233",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: true,
      },

      {
        title: "Luxury Villa in Bavdhan",
        slug: "luxury-villa-bavdhan-pune",
        description:
          "Independent luxury villa with landscaped garden, private parking and rooftop terrace.",
        price: 42000000,
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        address: "Bavdhan",
        city: "Pune",
        area: "Bavdhan",
        bedrooms: 4,
        bathrooms: 5,
        sqft: 3800,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
        ]),
        amenities: JSON.stringify([
          "Private Garden",
          "Swimming Pool",
          "Home Theatre",
          "Parking",
          "Solar Power"
        ]),
        ownerName: "Sanjay Kulkarni",
        ownerPhone: "+919877111222",
        brokerName: "Rohit Jadhav",
        brokerPhone: "+919900111333",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: true,
      },

      {
        title: "Residential Plot in Wagholi",
        slug: "residential-plot-wagholi-pune",
        description:
          "NA residential plot suitable for bungalow construction in a rapidly developing area.",
        price: 5200000,
        type: "PLOT",
        status: "AVAILABLE",
        address: "Wagholi",
        city: "Pune",
        area: "Wagholi",
        bedrooms: 0,
        bathrooms: 0,
        sqft: 3000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        ]),
        amenities: JSON.stringify([
          "Road Touch",
          "Electricity",
          "Water Connection",
          "Gated Society"
        ]),
        ownerName: "Mahesh Patil",
        ownerPhone: "+919988665544",
        brokerName: "Swapnil Shinde",
        brokerPhone: "+919944332211",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: false,
      },

      {
        title: "3 BHK Apartment in CIDCO",
        slug: "3bhk-cidco-sambhajinagar",
        description:
          "Spacious family apartment located in CIDCO with schools, hospitals and shopping nearby.",
        price: 8900000,
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        address: "CIDCO",
        city: "Chhatrapati Sambhajinagar",
        area: "CIDCO",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1450,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198",
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154"
        ]),
        amenities: JSON.stringify([
          "Garden",
          "Parking",
          "Lift",
          "Security",
          "Power Backup"
        ]),
        ownerName: "Ajay Pawar",
        ownerPhone: "+919811223344",
        brokerName: "Nitin More",
        brokerPhone: "+919822334455",
        googleMapsUrl: "https://maps.google.com",
        isFeatured: false,
      }
    ];

    for (const p of propertiesData) {
      await prisma.property.create({ data: p });
    }
    console.log('Seeded properties.');
  }

  // 3. Seed Projects
  const projectsCount = await prisma.project.count();
  if (projectsCount === 0) {
    console.log('Seeding development projects...');
    const projectsData = [
      {
        title: "Housify Green Valley",
        description:
          "Premium township with 2 & 3 BHK homes near Hinjewadi IT Park.",
        status: "ONGOING",
        location: "Hinjewadi, Pune",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      },
      {
        title: "Skyline Business Hub",
        description:
          "Commercial office spaces for startups and enterprises.",
        status: "UPCOMING",
        location: "BKC, Mumbai",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      },
      {
        title: "Godavari Residency",
        description:
          "Completed premium residential project with modern amenities.",
        status: "COMPLETED",
        location: "Nashik",
        image:
          "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb",
      },
      {
        title: "Elite Residency",
        description:
          "Luxury apartments designed for modern families.",
        status: "ONGOING",
        location: "Chhatrapati Sambhajinagar",
        image:
          "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      },
      {
        title: "Riverfront Heights",
        description:
          "Luxury riverside apartments with premium lifestyle amenities.",
        status: "UPCOMING",
        location: "Nagpur",
        image:
          "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
      }
    ];

    for (const pr of projectsData) {
      await prisma.project.create({ data: pr });
    }
    console.log('Seeded development projects.');
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
