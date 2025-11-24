// src/data/categoryData.ts (COMPLETE MOCK DATA)

// Define a structure for a product mock-up (for the slider content)
export interface ProductMock {
  id: string;
  name: string;
  image: string;
  price: number;
}

// Define the structure for a main category and its sub-categories
export interface SubCategory {
  title: string;
  subId: string; // Used for filtering URL, e.g., 'pants'
  products: ProductMock[];
}

export interface Category {
  id: string;
  title: string;
  heroSubtitle: string; // Editorial description for the page header
  subCategories: SubCategory[];
}

// MOCK DATA for all categories
export const CATEGORY_DATA: Category[] = [
  // --- 1. FASHION ---
  {
    id: 'fashion',
    title: 'THE FASHION COLLECTION',
    heroSubtitle: 'Timeless silhouettes designed for movement and modern elegance.',
    subCategories: [
      {
        title: 'Pants',
        subId: 'pants',
       products: [
        { name: 'Linen Trousers', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630399/tote-bags/picture6.png', price: 120 },
        { name: 'High-Waist Slacks', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630385/tote-bags/picture4.png', price: 95 },
        { name: 'Wide-Leg Silk', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630376/tote-bags/picture3.png', price: 150 },
        { name: 'Structured Palazzo', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630374/tote-bags/picture2.png', price: 165 },
      ]

      },
      {
        title: 'Skirts',
        subId: 'skirts',
        products: [
          { name: 'Pleated A-Line', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630394/tote-bags/picture5.png', price: 80 },
          { name: 'Silk Midi', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647667/tote-bags/Gemini_Generated_Image_iwtfv0iwtfv0iwtf%20%282%29.png', price: 110 },
          { name: 'Floral Wrap Skirt', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647670/tote-bags/Gemini_Generated_Image_iwtfv0iwtfv0iwtf%20%283%29.png', price: 95 },
          { name: 'Tailored Pencil Skirt', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647665/tote-bags/Gemini_Generated_Image_iwtfv0iwtfv0iwtf%20%281%29.png', price: 105 },
        ]

      },
      {
        title: 'Kaftans',
        subId: 'kaftans',
       products: [
      { name: 'Embroidered Kaftan', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630413/tote-bags/picture8.png', price: 180 },
      { name: 'Cotton Beach Kaftan', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647677/tote-bags/Gemini_Generated_Image_k7s641k7s641k7s6%20%282%29.png', price: 135 },
      { name: 'Monochrome Festival Kaftan', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647679/tote-bags/Gemini_Generated_Image_k7s641k7s641k7s6.png', price: 210 },
      { name: 'Three-Panel Silk Kaftan', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647702/tote-bags/Gemini_Generated_Image_s8oqls8oqls8oqls%20%281%29.png', price: 195 },
    ]

      },
      {
        title: 'Kimonos',
        subId: 'kimonos',
        products: [
        { name: 'Printed Silk Kimono', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630420/tote-bags/picture9.png', price: 210 },
        { name: 'Linen Dressing Kimono', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647675/tote-bags/Gemini_Generated_Image_k7s641k7s641k7s6%20%281%29.png', price: 175 },
        { name: 'Two-Tone Long Kimono', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647709/tote-bags/Gemini_Generated_Image_s8oqls8oqls8oqls%20%282%29.png', price: 225 },
        { name: 'Evening Embellished Kimono', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647710/tote-bags/Gemini_Generated_Image_s8oqls8oqls8oqls.png', price: 260 },
      ]

      },
      {
        title: 'Shirts',
        subId: 'shirts',
        products: [
        { name: 'Oversized Silk Shirt', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630420/tote-bags/picture10.png', price: 90 },
        { name: 'Classic Poplin', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647714/tote-bags/Gemini_Generated_Image_vbiugbvbiugbvbiu.png', price: 75 },
        { name: 'Structured Business Shirt', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647684/tote-bags/Gemini_Generated_Image_o3j1b4o3j1b4o3j1%20%281%29.png', price: 110 },
        { name: 'Relaxed Linen Shirt', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647690/tote-bags/Gemini_Generated_Image_o3j1b4o3j1b4o3j1.png', price: 95 },
      ]

      },
    ],
  },
  
  // --- 2. ACCESSORIES ---
  {
    id: 'accessories',
    title: 'THE ACCESSORIES EDIT',
    heroSubtitle: 'The perfect finishing pieces to refine and personalize your look.',
    subCategories: [
      {
        title: 'Bags',
        subId: 'bags',
        products: [
        { name: 'Leather Clutch', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630240/tote-bags/picture11.png', price: 180 },
        { name: 'Canvas Tote', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647658/tote-bags/Gemini_Generated_Image_f1zu1ff1zu1ff1zu.png', price: 55 },
        { name: 'Evening Pearl Bag', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647653/tote-bags/Gemini_Generated_Image_1goudl1goudl1gou.png', price: 140 },
        { name: 'Luxury Handbag', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647654/tote-bags/Gemini_Generated_Image_3r0e5h3r0e5h3r0e.png', price: 220 },
      ],
      },
      {
        title: 'Jewelry',
        subId: 'jewelry',
        products: [
        { name: 'Delicate Gold Studs', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630247/tote-bags/picture12.png', price: 45 },
        { name: 'Layered Necklace', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647662/tote-bags/Gemini_Generated_Image_gkqlnngkqlnngkql.png', price: 75 },
        { name: 'Onyx Bracelet', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647656/tote-bags/Gemini_Generated_Image_f1zu1ff1zu1ff1zu%20%281%29.png', price: 90 },
        { name: '18k Gold Rings', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647712/tote-bags/Gemini_Generated_Image_tcmt32tcmt32tcmt.png', price: 150 },
      ],
      },
      {
        title: 'Scarfs',
        subId: 'scarfs',
        products: [
        { name: 'Printed Silk Scarf', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630254/tote-bags/picture13.png', price: 65 },
        { name: 'Cashmere Wrap', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647730/tote-bags/red-winter-scarf-isolated-against-white-background.jpg', price: 140 },
        { name: 'Satin Evening Scarf', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647737/tote-bags/red-winter-scarf-isolated-white-background.jpg', price: 95 },
        { name: 'Linen Hand-Dyed Scarf', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647660/tote-bags/Gemini_Generated_Image_fojij5fojij5foji.png', price: 50 },
      ],
      },
    ],
  },
  
  // --- 3. GIFTS ---
  {
    id: 'gifts',
    title: 'THE ART OF GIVING',
    heroSubtitle: 'Thoughtful, personalized gifts that convey timeless luxury.',
    subCategories: [
      {
        title: 'For Her',
        subId: 'gifts-her',
        products: [
        { name: 'Luxury Candle Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630270/tote-bags/picture15.png', price: 50 },
        { name: 'Personalized Journal', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630283/tote-bags/picture17.png', price: 40 },
        { name: 'Sculpted Gold Bracelet', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647651/tote-bags/engin-akyurt-JWZe-4hg9aA-unsplash.jpg', price: 120 },
        { name: 'Velvet Fragrance Box', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630405/tote-bags/picture7.png', price: 165 },
      ],
      },
      {
        title: 'For Him',
        subId: 'gifts-him',
        products: [
        { name: 'Leather Travel Kit', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630275/tote-bags/picture16.png', price: 90 },
        { name: 'Monogrammed Cufflinks', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630262/tote-bags/picture14.png', price: 60 },
        { name: 'Luxury Fountain Pen', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630335/tote-bags/picture24.png', price: 120 },
        { name: 'Signature Grooming Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630372/tote-bags/picture29.png', price: 145 },
      ],
      },
      {
        title: 'New Home',
        subId: 'gifts-home',
        products: [
        { name: 'Coffee Table Book', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630226/tote-bags/picture1.png', price: 45 },
        { name: 'Crystal Decanter', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630372/tote-bags/picture29.png', price: 110 },
        { name: 'Marble Serving Board', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647718/tote-bags/lensabl-5pmpSRctZb0-unsplash.jpg', price: 95 },
        { name: 'Handcrafted Coaster Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647673/tote-bags/Gemini_Generated_Image_k1hcyjk1hcyjk1hc.png', price: 60 },
      ],
      },
    ],
  },
  
  // --- 4. PACKAGING ---
  {
    id: 'packaging',
    title: 'PRESENTATION PERFECTION',
    heroSubtitle: 'Elevate your gifts and products with custom, luxurious packaging solutions.',
    subCategories: [
      {
        title: 'Gift Boxes',
        subId: 'boxes',
        products: [
        { name: 'Matte Black Boxes', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630301/tote-bags/picture19.png', price: 15 },
        { name: 'Custom White Boxes', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630341/tote-bags/picture25.png', price: 12 },
        { name: 'Gold Foil Magnetic Box', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647680/tote-bags/Gemini_Generated_Image_l295hbl295hbl295.png', price: 20 },
        { name: 'Premium Linen Box', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647651/tote-bags/engin-akyurt-JWZe-4hg9aA-unsplash.jpg', price: 22 },
      ],
      },
      {
        title: 'Ribbons & Tags',
        subId: 'ribbons',
        products: [
        { name: 'Gold Satin Ribbon', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630347/tote-bags/picture26.png', price: 8 },
        { name: 'Customized Tags', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630335/tote-bags/picture24.png', price: 5 },
        { name: 'Silk Organza Ribbon', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763647656/tote-bags/Gemini_Generated_Image_f1zu1ff1zu1ff1zu%20%281%29.png', price: 10 },
        { name: 'Letter-Pressed Gift Tags', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630323/tote-bags/picture22.png', price: 7 },
      ],
      },
    ],
  },
  
  // --- 5. HOME ---
  {
    id: 'home',
    title: 'CURATED LIVING',
    heroSubtitle: 'Textiles and decor designed to bring serenity and elegance to your space.',
    subCategories: [
      {
        title: 'Sleep',
        subId: 'home-sleep',
        products: [
        { name: 'Linen Bedding Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630311/tote-bags/picture20.png', price: 250 },
        { name: 'Silk Pillowcase', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630318/tote-bags/picture21.png', price: 85 },
        { name: 'Weighted Sleep Blanket', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630329/tote-bags/picture23.png', price: 180 },
        { name: 'Aroma Sleep Diffuser', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630311/tote-bags/picture20.png', price: 75 },
      ],
      },
      {
        title: 'Living',
        subId: 'home-living',
        products: [
        { name: 'Knit Throw Blanket', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630318/tote-bags/picture21.png', price: 160 },
        { name: 'Ceramic Vase', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630329/tote-bags/picture23.png', price: 70 },
        { name: 'Minimal Wall Art Print', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630262/tote-bags/picture14.png', price: 90 },
        { name: 'Handwoven Rug Mat', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630283/tote-bags/picture17.png', price: 210 },
      ]

      },
      {
        title: 'Dining',
        subId: 'home-dining',
        products: [
        { name: 'Brass Cutlery Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630226/tote-bags/picture1.png', price: 95 },
        { name: 'Linen Napkins', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630363/tote-bags/picture28.png', price: 45 },
        { name: 'Hand-Carved Serving Bowl', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630270/tote-bags/picture15.png', price: 120 },
        { name: 'Marble Plate Set', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630184/tote-bags/lifestyle-carousel-3.png', price: 160 },
      ],
      },
    ],
  },
  
  // --- 6. EVENTS ---
  {
    id: 'events',
    title: 'THE ART OF CELEBRATION',
    heroSubtitle: 'Refined stationery and decor for your most important milestones.',
    subCategories: [
      {
        title: 'Invitations',
        subId: 'event-invites',
        products: [
        { name: 'Wedding Suite', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630283/tote-bags/picture17.png', price: 500 },
        { name: 'Party Announcements', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630355/tote-bags/picture27.png', price: 200 },
        { name: 'Save the Date Card', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630141/tote-bags/Events_image.png', price: 150 },
        { name: 'Baby Shower Invitations', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630131/tote-bags/Accessories_image.png', price: 185 },
      ],
      },
      {
        title: 'Table Decor',
        subId: 'event-table',
        products: [
        { name: 'Place Cards', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630323/tote-bags/picture22.png', price: 25 },
        { name: 'Menu Design', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630363/tote-bags/picture28.png', price: 40 },
        { name: 'Monogram Table Marker', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630226/tote-bags/picture1.png', price: 30 },
        { name: 'Custom Linen Table Runner', image: 'https://res.cloudinary.com/dhgkmjnvl/image/upload/v1763630301/tote-bags/picture19.png', price: 95 },
      ],
      },
    ],
  },
];