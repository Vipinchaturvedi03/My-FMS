/**
 * Crop Calendar Data - Indian Seasons (Kharif, Rabi, Zaid)
 * Kaun si fasal kab boni - Reference data
 * FMS - Vipin Chaturvedi
 */

// Season definitions - Hindi names
export const SEASONS = {
  KHARIF: { name: 'खरीफ', months: 'जून - अक्टूबर', color: 'emerald' },
  RABI: { name: 'रबी', months: 'अक्टूबर - मार्च', color: 'amber' },
  ZAID: { name: 'जायद', months: 'मार्च - जून', color: 'sky' }
};

// Crop list - sowing window aur duration
export const CROP_CALENDAR = [
  { name: 'धान (Rice)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 120, icon: '🌾' },
  { name: 'मक्का (Maize)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 100, icon: '🌽' },
  { name: 'कपास (Cotton)', season: 'KHARIF', sowStart: 'May', sowEnd: 'Jul', duration: 180, icon: '☁️' },
  { name: 'सोयाबीन (Soybean)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 100, icon: '🫘' },
  { name: 'बाजरा (Pearl Millet)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 90, icon: '🌾' },
  { name: 'ज्वार (Sorghum)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 100, icon: '🌾' },
  { name: 'मूंग (Green Gram)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 65, icon: '🫘' },
  { name: 'उड़द (Black Gram)', season: 'KHARIF', sowStart: 'Jun', sowEnd: 'Jul', duration: 90, icon: '🫘' },
  { name: 'गन्ना (Sugarcane)', season: 'KHARIF', sowStart: 'Feb', sowEnd: 'Apr', duration: 365, icon: '🎋' },
  { name: 'गेहूं (Wheat)', season: 'RABI', sowStart: 'Nov', sowEnd: 'Dec', duration: 120, icon: '🌾' },
  { name: 'सरसों (Mustard)', season: 'RABI', sowStart: 'Oct', sowEnd: 'Nov', duration: 120, icon: '🟡' },
  { name: 'चना (Gram)', season: 'RABI', sowStart: 'Oct', sowEnd: 'Nov', duration: 110, icon: '🫘' },
  { name: 'मटर (Pea)', season: 'RABI', sowStart: 'Oct', sowEnd: 'Nov', duration: 90, icon: '🫛' },
  { name: 'जौ (Barley)', season: 'RABI', sowStart: 'Nov', sowEnd: 'Dec', duration: 120, icon: '🌾' },
  { name: 'मसूर (Lentil)', season: 'RABI', sowStart: 'Oct', sowEnd: 'Nov', duration: 100, icon: '🫘' },
  { name: 'आलू (Potato)', season: 'RABI', sowStart: 'Oct', sowEnd: 'Nov', duration: 90, icon: '🥔' },
  { name: 'प्याज (Onion)', season: 'RABI', sowStart: 'Nov', sowEnd: 'Dec', duration: 120, icon: '🧅' },
  { name: 'खीरा (Cucumber)', season: 'ZAID', sowStart: 'Feb', sowEnd: 'Mar', duration: 60, icon: '🥒' },
  { name: 'तरबूज (Watermelon)', season: 'ZAID', sowStart: 'Feb', sowEnd: 'Mar', duration: 90, icon: '🍉' },
  { name: 'कद्दू (Pumpkin)', season: 'ZAID', sowStart: 'Feb', sowEnd: 'Apr', duration: 90, icon: '🎃' },
  { name: 'भिंडी (Okra)', season: 'ZAID', sowStart: 'Feb', sowEnd: 'Apr', duration: 60, icon: '🥬' },
  { name: 'मूंगफली (Groundnut)', season: 'ZAID', sowStart: 'Apr', sowEnd: 'May', duration: 120, icon: '🥜' }
];

// Growth stages - fertilizer/pesticide suggestions
export const GROWTH_STAGES = [
  { id: 'germination', name: 'अंकुरण', percent: 5, fertilizer: 'बीज उपचार', pesticide: '-' },
  { id: 'vegetative', name: 'वानस्पतिक वृद्धि', percent: 30, fertilizer: 'नाइट्रोजन (यूरिया)', pesticide: 'नीम तेल (कीट नियंत्रण)' },
  { id: 'flowering', name: 'फूल आना', percent: 50, fertilizer: 'फॉस्फोरस, पोटाश', pesticide: 'फूलों की सुरक्षा' },
  { id: 'fruiting', name: 'फल/बीज बनना', percent: 75, fertilizer: 'पोटाश, सूक्ष्म पोषक', pesticide: 'फल छेदक नियंत्रण' },
  { id: 'ripening', name: 'पकना', percent: 95, fertilizer: '-', pesticide: 'कटाई पूर्व छिड़काव' },
  { id: 'harvest', name: 'कटाई', percent: 100, fertilizer: '-', pesticide: '-' }
];

// Kisan tips - rotating display
export const FARMING_TIPS = [
  'बारिश से पहले खाद डालने से पोषक तत्व बेहतर अवशोषित होते हैं।',
  'फसल चक्रण से मिट्टी की उर्वरता बनी रहती है।',
  'ड्रिप सिंचाई से पानी की बचत होती है।',
  'जैविक खाद मिट्टी के लिए लाभदायक है।',
  'समय पर कीटनाशक छिड़काव करें।',
  'मौसम पूर्वानुमान देखकर खेती की योजना बनाएं।',
  'बीज की गुणवत्ता फसल उत्पादन को प्रभावित करती है।',
  'खरपतवार नियंत्रण समय पर करें।',
  'फसल अवशेष को जलाने के बजाय कम्पोस्ट बनाएं।',
  'सही समय पर बुवाई करने से उपज बढ़ती है।'
];
