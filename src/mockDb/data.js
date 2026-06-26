// Mock Database for PinkBasket

export const categories = [
  { id: 'c1', name: 'Fashion', icon: 'Shirt' },
  { id: 'c2', name: 'Beauty', icon: 'Sparkles' },
  { id: 'c3', name: 'Electronics', icon: 'Smartphone' },
  { id: 'c4', name: 'Home & Kitchen', icon: 'Home' },
  { id: 'c5', name: 'Accessories', icon: 'Watch' },
  { id: 'c6', name: 'Offers & Deals', icon: 'Tag' }
];

export const products = [
  {
    id: 'p1',
    name: 'Pastel Summer Floral Dress',
    categoryId: 'c1',
    price: 3999,
    originalPrice: 4800,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    reviewBreakdown: { 5: 80, 4: 15, 3: 3, 2: 1, 1: 1 },
    stockStatus: 'In Stock',
    pinkPassEligible: true,
    images: [
      '/images/floral_dress.png',
      '/images/floral_dress.png'
    ],
    description: 'A beautiful pastel floral dress perfect for summer outings. Lightweight and breathable fabric.',
    specifications: { 'Material': 'Cotton Blend', 'Care': 'Machine Wash', 'Fit': 'Regular' },
    variants: [
      { type: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { type: 'Color', options: ['Pastel Pink', 'Soft Yellow'] }
    ],
    questions: [
      { q: 'Is this dress true to size?', a: 'Yes, it fits perfectly according to the size chart.' },
      { q: 'Does it shrink after washing?', a: 'No, but we recommend cold wash to maintain the fabric.' }
    ],
    frequentlyBoughtTogether: ['p2', 'p8'],
    isMystery: false
  },
  {
    id: 'p2',
    name: 'Premium Leather Crossbody Bag',
    categoryId: 'c5',
    price: 9600,
    originalPrice: 12000,
    discount: 20,
    rating: 4.9,
    reviews: 89,
    reviewBreakdown: { 5: 90, 4: 8, 3: 2, 2: 0, 1: 0 },
    stockStatus: 'Low Stock',
    pinkPassEligible: false,
    images: [
      '/images/crossbody_bag.png',
      '/images/crossbody_bag.png'
    ],
    description: 'Elegant leather crossbody bag with adjustable strap and multiple compartments.',
    specifications: { 'Material': 'Genuine Leather', 'Dimensions': '10x8x3 inches' },
    variants: [
      { type: 'Color', options: ['Blush Pink', 'Mustard Yellow', 'Classic Brown'] }
    ],
    questions: [],
    frequentlyBoughtTogether: ['p1'],
    isMystery: false
  },
  {
    id: 'p3',
    name: 'Rose Gold Smartwatch',
    categoryId: 'c3',
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.7,
    reviews: 342,
    stockStatus: 'In Stock',
    images: [
      '/images/smartwatch.png',
      '/images/smartwatch.png'
    ],
    description: 'Track your fitness, notifications, and health with this stunning rose gold smartwatch.',
    specifications: { 'Battery': 'Up to 7 days', 'Water Resistance': '5ATM' },
    isMystery: false
  },
  {
    id: 'p4',
    name: 'Mystery Beauty Box',
    categoryId: 'c2',
    price: 2399,
    originalPrice: 8000,
    discount: 70,
    rating: 5.0,
    reviews: 56,
    stockStatus: 'In Stock',
    images: [
      '/images/mystery_box.png',
      '/images/mystery_box.png'
    ],
    description: 'A surprise selection of premium beauty products worth over ₹8000!',
    specifications: { 'Items': '5-7 full size products' },
    isMystery: true
  },
  {
    id: 'p5',
    name: 'Silk Sleep Mask & Pillowcase Set',
    categoryId: 'c4',
    price: 2800,
    originalPrice: 4000,
    discount: 30,
    rating: 4.6,
    reviews: 210,
    stockStatus: 'In Stock',
    images: [
      '/images/sleep_mask.png',
      '/images/sleep_mask.png'
    ],
    description: '100% pure mulberry silk pillowcase and sleep mask for the ultimate beauty sleep.',
    specifications: { 'Material': 'Mulberry Silk', 'Color': 'Champagne Pink' },
    isMystery: false
  },
  {
    id: 'p6',
    name: 'Wireless Noise-Canceling Earbuds',
    categoryId: 'c3',
    price: 11999,
    originalPrice: 15999,
    discount: 25,
    rating: 4.8,
    reviews: 450,
    stockStatus: 'In Stock',
    images: [
      '/images/earbuds.png',
      '/images/earbuds.png'
    ],
    description: 'Premium pastel pink earbuds with active noise cancellation and 24h battery life.',
    specifications: { 'Battery': '24 Hours', 'Bluetooth': '5.2' },
    isMystery: false
  },
  {
    id: 'p7',
    name: 'Minimalist Ceramic Vase',
    categoryId: 'c4',
    price: 2240,
    originalPrice: 2240,
    discount: 0,
    rating: 4.4,
    reviews: 34,
    stockStatus: 'Out of Stock',
    images: [
      '/images/vase.png',
      '/images/vase.png'
    ],
    description: 'A beautiful matte ceramic vase to hold your favorite fresh or dried flowers.',
    specifications: { 'Material': 'Ceramic', 'Height': '8 inches' },
    isMystery: false
  },
  {
    id: 'p8',
    name: 'Hydrating Rose Face Mist',
    categoryId: 'c2',
    price: 1440,
    originalPrice: 1920,
    discount: 25,
    rating: 4.9,
    reviews: 512,
    stockStatus: 'In Stock',
    images: [
      '/images/face_mist.png',
      '/images/face_mist.png'
    ],
    description: 'Refresh and hydrate your skin on the go with this soothing rosewater facial mist.',
    specifications: { 'Volume': '100ml', 'Skin Type': 'All Skin Types' },
    isMystery: false
  },
  {
    id: 'p9',
    name: 'Luxury Glow Skincare Set',
    categoryId: 'c6',
    price: 3999,
    originalPrice: 8000,
    discount: 50,
    rating: 4.9,
    reviews: 420,
    stockStatus: 'In Stock',
    pinkPassEligible: true,
    images: [
      '/images/skincare_set.png',
      '/images/skincare_set.png'
    ],
    description: 'A massive 50% discount on our award-winning premium 3-step glow skincare routine.',
    specifications: { 'Skin Type': 'All', 'Includes': 'Cleanser, Serum, Moisturizer' },
    isMystery: false
  },
  {
    id: 'p10',
    name: 'Pastel Mechanical Keyboard',
    categoryId: 'c6',
    price: 5599,
    originalPrice: 7999,
    discount: 30,
    rating: 4.8,
    reviews: 185,
    stockStatus: 'In Stock',
    pinkPassEligible: true,
    images: [
      '/images/keyboard.png',
      '/images/keyboard.png'
    ],
    description: 'A beautiful pastel pink wireless mechanical keyboard perfect for your aesthetic desk setup.',
    specifications: { 'Switches': 'Silent Red', 'Connectivity': 'Bluetooth / USB-C' },
    isMystery: false
  },
  {
    id: 'p11',
    name: 'Designer Sunglasses (Flash Sale)',
    categoryId: 'c6',
    price: 1999,
    originalPrice: 4999,
    discount: 60,
    rating: 4.5,
    reviews: 92,
    stockStatus: 'Low Stock',
    pinkPassEligible: false,
    images: [
      '/images/sunglasses.png',
      '/images/sunglasses.png'
    ],
    description: 'Premium polarized sunglasses at an unbeatable 60% off during our Flash Sale event!',
    specifications: { 'Lenses': 'Polarized', 'Frame': 'Rose Gold Metal' },
    isMystery: false
  },
  {
    id: 'p12',
    name: 'Smart Home Speaker (Pink Edition)',
    categoryId: 'c6',
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    rating: 4.6,
    reviews: 310,
    stockStatus: 'In Stock',
    pinkPassEligible: true,
    images: [
      '/images/speaker.png',
      '/images/speaker.png'
    ],
    description: 'A voice-controlled smart speaker wrapped in premium pink fabric. Deep bass and crystal clear vocals at 50% off.',
    specifications: { 'Connectivity': 'WiFi / Bluetooth', 'Audio': '360° Sound' },
    isMystery: false
  },
  {
    id: 'p13',
    name: 'Aesthetic Leather Desk Mat',
    categoryId: 'c6',
    price: 1199,
    originalPrice: 1999,
    discount: 40,
    rating: 4.8,
    reviews: 145,
    stockStatus: 'In Stock',
    pinkPassEligible: true,
    images: [
      '/images/desk_mat.png',
      '/images/desk_mat.png'
    ],
    description: 'Protect your desk and elevate your workspace with this oversized pastel desk mat.',
    specifications: { 'Material': 'Vegan Leather', 'Size': '90x40 cm' },
    isMystery: false
  }
];

export const mockCoupons = [
  { code: 'PINK10', discountPercent: 10 },
  { code: 'WELCOME50', discountFlat: 50 }
];

// AI Chatbot logic simulation
export const getAiResponse = (query) => {
  const q = query.toLowerCase();
  
  // Greetings
  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return "Hello there! I'm Pinky. How can I assist you with your PinkBasket shopping today?";
  }
  
  // Budget & Affordability
  if (q.includes('budget') || q.includes('cheap') || q.includes('affordable') || q.includes('under')) {
    return "I found some great items that won't break the bank! Check out our Hydrating Face Mist (₹1440) or the Mystery Beauty Box which is a massive steal at ₹2399!";
  }
  
  // Alternatives & Recommendations
  if (q.includes('alternative') || q.includes('similar') || q.includes('recommend')) {
    return "If you're looking for recommendations, our 'Pastel Summer Floral Dress' is a top-seller right now! The 'Rose Gold Smartwatch' is also highly rated.";
  }
  
  // Gifting
  if (q.includes('gift') || q.includes('present') || q.includes('wrapping')) {
    return "Shopping for a gift? The Silk Sleep Mask Set or the Minimalist Ceramic Vase are perfect, thoughtful gifts! We also offer premium Pink gift wrapping at checkout for just ₹99.";
  }
  
  // Order Tracking
  if (q.includes('order') || q.includes('track') || q.includes('status') || q.includes('where is')) {
    return "To track your order, simply navigate to your 'Profile' dashboard and click on the 'Orders' section. You'll see real-time updates and an estimated delivery date there!";
  }
  
  // Shipping & Delivery
  if (q.includes('shipping') || q.includes('delivery') || q.includes('international')) {
    if (q.includes('international')) {
      return "Yes, we ship globally! International shipping usually takes 7-14 business days depending on customs.";
    }
    return "We offer Standard Delivery for ₹499. However, if the item is 'PinkPass' eligible, you get FREE next-day delivery!";
  }
  
  // Returns & Exchanges
  if (q.includes('return') || q.includes('refund') || q.includes('exchange') || q.includes('cancel')) {
    return "We offer a hassle-free 10-day return policy. You can easily initiate a return or cancel an unfulfilled order directly from your Orders dashboard.";
  }
  
  // PinkPass Subscription
  if (q.includes('pinkpass') || q.includes('prime') || q.includes('subscription') || q.includes('membership')) {
    return "PinkPass is our premium feature! For ₹5000, you get a flat 10% discount on ALL orders, FREE Next-Day Delivery, and a shiny golden crown on your profile!";
  }
  
  // Discounts & Promo Codes
  if (q.includes('discount') || q.includes('coupon') || q.includes('promo') || q.includes('offer') || q.includes('sale')) {
    return "You're in luck! Try using the coupon code 'PINK10' at checkout for 10% off your entire order, or 'WELCOME50' for a flat ₹50 discount!";
  }
  
  // Mystery Box
  if (q.includes('mystery') || q.includes('surprise') || q.includes('box')) {
    return "Our Mystery Beauty Box is a fan favorite! It contains 5-7 surprise premium products worth over ₹8000, but you can grab it today for just ₹2399.";
  }
  
  // Payments & EMI
  if (q.includes('pay') || q.includes('card') || q.includes('emi') || q.includes('cash on delivery') || q.includes('cod')) {
    return "We accept all major Credit/Debit cards securely via Stripe. We also offer Cash on Delivery (COD) for orders under ₹10,000, and flexible EMI options on select credit cards.";
  }
  
  // Sizing & Fit
  if (q.includes('size') || q.includes('fit') || q.includes('chart') || q.includes('measurements')) {
    return "Our apparel usually runs true to size. You can find a detailed size chart and fabric measurements on every clothing product page to ensure the perfect fit!";
  }
  
  // Support & Contact
  if (q.includes('support') || q.includes('contact') || q.includes('help') || q.includes('human')) {
    return "You can reach our 24/7 human support team at support@pinkbasket.com or call us at 1-800-PINK-O.";
  }

  // Generic Shopping Catch-all
  if (q.includes('buy') || q.includes('shop') || q.includes('looking for') || q.includes('find') || q.includes('product') || q.includes('item')) {
    return "That's a great shopping question! Our catalog is always expanding. Try using the search bar at the top of the page to find exactly what you're looking for, or browse our Fashion and Beauty categories!";
  }
  
  // Default Fallback
  return "I'm sorry, I didn't quite catch that. As your shopping assistant, I can help you with product recommendations (try 'gift'), track orders (try 'track'), explain features (try 'pinkpass'), or answer questions about sizing and returns!";
};
