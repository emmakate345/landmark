// Approximate center coordinates [lat, lng] for direction calculation
// Source: mledoze/countries
export const countryCoordinates: Record<string, [number, number]> = {
  'Afghanistan': [33, 65], 'Albania': [41, 20], 'Algeria': [28, 3], 'Andorra': [42.5, 1.5],
  'Angola': [-12.5, 18.5], 'Antigua and Barbuda': [17.05, -61.8], 'Argentina': [-34, -64],
  'Armenia': [40, 45], 'Australia': [-27, 133], 'Austria': [47.33, 13.33], 'Azerbaijan': [40.5, 47.5],
  'Bahamas': [24.25, -76], 'Bahrain': [26, 50.55], 'Bangladesh': [24, 90], 'Barbados': [13.17, -59.53],
  'Belarus': [53, 28], 'Belgium': [50.83, 4], 'Belize': [17.25, -88.75], 'Benin': [9.5, 2.25],
  'Bhutan': [27.5, 90.5], 'Bolivia': [-17, -65], 'Bosnia and Herzegovina': [44, 18],
  'Botswana': [-22, 24], 'Brazil': [-10, -55], 'Brunei': [4.5, 114.67], 'Bulgaria': [43, 25],
  'Burkina Faso': [13, -2], 'Burundi': [-3.5, 30], 'Cambodia': [13, 105], 'Cameroon': [6, 12],
  'Canada': [60, -95], 'Cape Verde': [16, -24], 'Central African Republic': [7, 21],
  'Chad': [15, 19], 'Chile': [-35, -71], 'China': [35, 105], 'Colombia': [4, -72],
  'Comoros': [-12.17, 44.25], 'Congo': [-1, 15], 'Costa Rica': [10, -84], 'Croatia': [45.17, 15.5],
  'Cuba': [21.5, -80], 'Cyprus': [35, 33], 'Czech Republic': [49.75, 15.5],
  'Democratic Republic of the Congo': [0, 25], 'Denmark': [56, 10], 'Djibouti': [11.5, 43],
  'Dominica': [15.42, -61.33], 'Dominican Republic': [19, -70.67], 'East Timor': [-8.83, 125.92],
  'Ecuador': [-2, -77.5], 'Egypt': [27, 30], 'El Salvador': [13.83, -88.92], 'Equatorial Guinea': [2, 10],
  'Eritrea': [15, 39], 'Estonia': [59, 26], 'Eswatini': [-26.5, 31.5], 'Ethiopia': [8, 38],
  'Fiji': [-18, 175], 'Finland': [64, 26], 'France': [46, 2], 'Gabon': [-1, 11.75],
  'Gambia': [13.47, -16.57], 'Georgia': [42, 43.5], 'Germany': [51, 9], 'Ghana': [8, -2],
  'Greece': [39, 22], 'Grenada': [12.12, -61.67], 'Guatemala': [15.5, -90.25], 'Guinea': [11, -10],
  'Guinea-Bissau': [12, -15], 'Guyana': [5, -59], 'Haiti': [19, -72.42], 'Honduras': [15, -86.5],
  'Hungary': [47, 20], 'Iceland': [65, -18], 'India': [20, 77], 'Indonesia': [-5, 120],
  'Iran': [32, 53], 'Iraq': [33, 44], 'Ireland': [53, -8], 'Israel': [31.5, 34.75],
  'Italy': [42.83, 12.83], 'Ivory Coast': [8, -5], 'Jamaica': [18.25, -77.5], 'Japan': [36, 138],
  'Jordan': [31, 36], 'Kazakhstan': [48, 68], 'Kenya': [1, 38], 'Kiribati': [1.42, 173],
  'Kosovo': [42.58, 20.92], 'Kuwait': [29.5, 45.75], 'Kyrgyzstan': [41, 75], 'Laos': [18, 105],
  'Latvia': [57, 25], 'Lebanon': [33.83, 35.83], 'Lesotho': [-29.5, 28.5], 'Liberia': [6.5, -9.5],
  'Libya': [25, 17], 'Liechtenstein': [47.17, 9.53], 'Lithuania': [56, 24], 'Luxembourg': [49.75, 6.17],
  'Madagascar': [-20, 47], 'Malawi': [-13.5, 34], 'Malaysia': [4.21, 101.98], 'Maldives': [3.25, 73],
  'Mali': [17, -4], 'Malta': [35.83, 14.58], 'Marshall Islands': [9.82, 168.1], 'Mauritania': [20, -12],
  'Mauritius': [-20.28, 57.55], 'Mexico': [23, -102], 'Micronesia': [6.92, 158.25], 'Moldova': [47, 29],
  'Monaco': [43.73, 7.42], 'Mongolia': [46, 105], 'Montenegro': [42.5, 19.3], 'Morocco': [32, -5],
  'Mozambique': [-18.25, 35], 'Myanmar': [22, 98], 'Namibia': [-22, 17], 'Nauru': [-0.52, 166.93],
  'Nepal': [28, 84], 'Netherlands': [52.5, 5.75], 'New Zealand': [-41, 174], 'Nicaragua': [13, -85],
  'Niger': [16, 8], 'Nigeria': [10, 8], 'North Korea': [40, 127], 'North Macedonia': [41.83, 21.75],
  'Norway': [62, 10], 'Oman': [21, 56], 'Pakistan': [30, 70], 'Palau': [7.5, 134.5], 'Palestine': [31.9, 35.2],
  'Panama': [9, -80], 'Papua New Guinea': [-6, 147], 'Paraguay': [-23, -58], 'Peru': [-10, -76],
  'Philippines': [13, 122], 'Poland': [52, 20], 'Portugal': [39.5, -8], 'Qatar': [25.29, 51.53],
  'Romania': [46, 25], 'Russia': [60, 100], 'Rwanda': [-2, 30], 'Saint Kitts and Nevis': [17.33, -62.75],
  'Saint Lucia': [13.88, -60.97], 'Saint Vincent and the Grenadines': [12.98, -61.29],
  'Samoa': [-13.58, -172.33], 'San Marino': [43.77, 12.42], 'Saudi Arabia': [25, 45], 'Senegal': [14, -14],
  'Serbia': [44, 21], 'Seychelles': [-4.58, 55.67], 'Sierra Leone': [8.5, -11.5], 'Singapore': [1.37, 103.8],
  'Slovakia': [48.67, 19.5], 'Slovenia': [46.12, 14.82], 'Solomon Islands': [-8, 159], 'Somalia': [10, 49],
  'South Africa': [-29, 24], 'South Korea': [37, 127.5], 'South Sudan': [7, 30], 'Spain': [40, -4],
  'Sri Lanka': [7, 81], 'Sudan': [15, 30], 'Suriname': [4, -56], 'Sweden': [62, 15], 'Switzerland': [47, 8],
  'Syria': [35, 38], 'Taiwan': [23.5, 121], 'Tajikistan': [39, 71], 'Tanzania': [-6, 35], 'Thailand': [15, 100],
  'Togo': [8, 1.17], 'Tonga': [-20, -175], 'Trinidad and Tobago': [11, -61], 'Tunisia': [34, 9],
  'Turkey': [39, 35], 'Turkmenistan': [38.97, 59.56], 'Tuvalu': [-8, 178], 'Uganda': [1, 32],
  'Ukraine': [49, 32], 'United Arab Emirates': [24, 54], 'United Kingdom': [55, -3], 'United States': [38, -97],
  'Uruguay': [-33, -56], 'Uzbekistan': [41, 64], 'Vanuatu': [-16, 167], 'Vatican City': [41.9, 12.45],
  'Venezuela': [8, -66], 'Vietnam': [16, 108], 'Yemen': [15, 48], 'Zambia': [-15, 30], 'Zimbabwe': [-20, 30],
};

function getBearing(from: [number, number], to: [number, number]): number {
  // Use a simple planar approximation so directions feel intuitive
  // on a flat map (N/S/E/W based on lat/lng deltas), rather than
  // great-circle bearings that can point unexpectedly over the pole.
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // angle where 0° = east, 90° = north
  const angle = Math.atan2(dLat, dLon) * 180 / Math.PI;
  // convert to compass bearing where 0° = north
  const bearing = (90 - angle + 360) % 360;
  return bearing;
}

const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const arrows: Record<string, string> = {
  'N': '↑', 'NE': '↗', 'E': '→', 'SE': '↘', 'S': '↓', 'SW': '↙', 'W': '←', 'NW': '↖',
};

function findCountryKey(name: string): string | undefined {
  const normalized = name.trim().toLowerCase();
  return Object.keys(countryCoordinates).find(
    key => key.toLowerCase() === normalized
  );
}

export function getDirectionArrow(guessedCountry: string, correctCountry: string): string | null {
  const fromKey = findCountryKey(guessedCountry);
  const toKey = findCountryKey(correctCountry);
  if (!fromKey || !toKey) return null;
  const from = countryCoordinates[fromKey];
  const to = countryCoordinates[toKey];
  if (!from || !to) return null;
  const bearing = getBearing(from, to);
  const index = Math.round(bearing / 45) % 8;
  return arrows[directions[index]] ?? '→';
}
