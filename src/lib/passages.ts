/**
 * Official & Authentic RRB NTPC English Typing Passages
 * Standard length (300-450 words) aligned with TCS iON CBTST exam pattern.
 */

export interface Passage {
  id: string;
  title: string;
  category: string;
  wordCount: number;
  text: string;
  isCustom?: boolean;
}

export const DEFAULT_PASSAGES: Passage[] = [
  {
    id: 'test-03',
    title: 'Test Set #03: Small Business & MSME Economy',
    category: 'Economy',
    wordCount: 324,
    text: `The small business sector is the real backbone of the Indian economy today. In recent years, we have helped these smaller local firms to grow rapidly while helping to create more stable jobs for young people. A major step is to ensure that small shop owners have access to easy and fast cash loans from formal local banks without having to fill out heavy forms. In the past, the lack of ready cash forced many small local manufacturers to rely on greedy money lenders who charged very high interest rates. Now, with the rapid rollout of credit safety schemes and smart digital loan apps, even a poor village vendor can get a fair business loan in just a few simple steps. This smooth flow of steady capital lets local factory owners buy modern machinery and raw materials to increase their total daily output. As these smaller units grow, they employ more local hands which directly increases the average household income in semi-urban and deep rural areas. Improved local roads and secure power supply further help these small enterprises to operate throughout the day without any costly long delays. Another major change is the easy access to large online retail web marketplaces that allow local artisans to sell their finest handmade products to buyers across the country. State regulations also strongly push large corporate houses to purchase a certain proportion of their raw parts directly from these small-scale manufacturers thus ensuring a secure steady market demand. Simple commercial laws make it very attractive for young minds to start their own fresh ventures instead of looking for basic everyday jobs.`,
  },
  {
    id: 'test-01',
    title: 'Test Set #01: Modernization of Indian Railways',
    category: 'Railways',
    wordCount: 342,
    text: `Indian Railways has embarked on a remarkable journey of modernization over the last decade. As one of the largest rail networks in the world, it connects remote towns and bustling metropolitan centers with unparalleled efficiency. The introduction of semi high speed train sets like the Vande Bharat Express has revolutionized passenger travel by offering world class amenities, enhanced safety features, and reduced journey times between major economic hubs. In addition to high speed passenger services, dedicated freight corridors are being constructed to segregate passenger and cargo traffic. This separation allows goods trains to travel at significantly higher average speeds, thereby reducing transit times and logistics costs for industrial sectors across the nation. Station redevelopment programs are transforming historic railway junctions into modern transportation hubs equipped with state of the art passenger concourses, multi level parking, and barrier free access for differently abled travelers. Extensive electrification of broad gauge routes has drastically curbed carbon emissions while lowering operational costs on heavy diesel locomotives. The integration of indigenous train collision avoidance systems provides an automated shield against human error and ensures the highest standards of traveler safety. As rail infrastructure expands into mountainous and northeast regions, it strengthens national connectivity and fosters inclusive socio economic progress.`,
  },
  {
    id: 'test-02',
    title: 'Test Set #02: Digital Transformation and Financial Inclusion',
    category: 'Technology',
    wordCount: 335,
    text: `The rapid rise of digital technology has transformed the everyday financial landscape of our country. Through the unified payments interface and affordable mobile broadband, millions of citizens can now execute real time monetary transactions right from their handheld smartphones. Street vendors, neighborhood grocery merchants, and small scale agricultural producers who once functioned entirely in informal cash channels now proudly display standardized quick response payment codes. This shift toward digital financial transactions has created verifiable financial footprints for individuals who were historically denied formal credit. Commercial banking institutions can now evaluate creditworthiness through digital records rather than insisting on burdensome property collaterals. Direct benefit transfers have simultaneously eliminated middlemen in government welfare distributions, ensuring that financial aid and agricultural subsidies reach the bank accounts of targeted beneficiaries without leakage. Digital literacy drives in gram panchayats have empowered women self help groups to manage community funds, run micro enterprises, and invest in local cooperative initiatives. As cybersecurity protocols and privacy measures continue to strengthen, public trust in digital payments has expanded across generational divides, paving the path toward an efficient, transparent, and resilient national economy.`,
  },
  {
    id: 'test-04',
    title: 'Test Set #04: Renewable Energy and Sustainable Development',
    category: 'Environment',
    wordCount: 330,
    text: `Global climatic variations have made the pursuit of green and renewable energy sources an urgent national imperative. Developing clean alternatives such as solar power, wind energy, and green hydrogen reduces dependence on imported fossil fuels while safeguarding our natural ecosystems. Large scale solar parks set up in barren desert regions are generating clean electricity at competitive tariffs, powering heavy manufacturing industries and rural farm pump sets alike. Rooftop solar installations in residential colonies and educational campuses are transforming consumers into independent energy producers. The rapid expansion of electric vehicle charging infrastructure along national highways is accelerating the decarbonization of the automotive sector, leading to noticeably cleaner urban air. Efficient battery storage facilities and pumped hydro storage projects are also being deployed to address the intermittent nature of wind and solar supplies, guaranteeing grid stability round the clock. By promoting energy efficiency benchmarks across residential and commercial buildings, citizens can actively reduce power wastage and carbon emissions. Combining innovative engineering with supportive public subsidies will pave the way toward long term environmental resilience and sustainable industrial prosperity.`,
  },
  {
    id: 'test-05',
    title: 'Test Set #05: Agricultural Supply Chains and Food Security',
    category: 'Agriculture',
    wordCount: 345,
    text: `Ensuring national food security requires a resilient and technologically modern agricultural supply chain. While hardworking farmers continue to boost crop yields through scientific soil health cards and high yield seed varieties, substantial post harvest losses often diminish their hard earned returns. The establishment of decentralized cold storage facilities and temperature controlled transport vehicles is vital to protect perishable horticultural produce from spoilage. Electronic agricultural trading portals have connected localized rural farm yards with national wholesale buyers, breaking the historic monopoly of localized cartels. Farmers can now track real time crop prices across nationwide mandis and sell their harvest to the highest bidder with complete transparency. Furthermore, the promotion of farmer producer organizations has enabled smallholder cultivators to aggregate their produce, negotiate better bulk discounts on fertilizers, and invest in shared heavy machinery like harvesters and laser levelers. Implementing drip irrigation and micro sprinkler systems conserves scarce groundwater reserves while optimizing fertilizer distribution directly to the plant root zone. By linking modern food processing parks with robust rural logistics networks, the agricultural sector can double rural farm incomes and ensure reliable nutrition for every household.`,
  },
  {
    id: 'test-06',
    title: 'Test Set #06: Public Administration and Good Governance',
    category: 'Governance',
    wordCount: 338,
    text: `Good governance forms the bedrock of a thriving democratic society where public services are delivered with speed, equity, and absolute accountability. The transition from cumbersome manual paper files to integrated digital office platforms has shortened processing delays in government secretariats. Citizens can now apply for income certificates, domicile documents, land ownership records, and municipal trade licenses through centralized single window online portals. Transparent online grievance redressal systems allow ordinary applicants to track the progress of their complaints and receive timely official responses with administrative accountability. Bureaucratic procedures have been simplified by doing away with unnecessary notarizations and promoting self certification for standard citizen services. Regular capacity building programs for civil servants foster professional empathy, ethical conduct, and responsive public service delivery. Open data portals also empower civil society organizations and researchers to evaluate public welfare outcomes objectively. By establishing clear service level guarantees and minimizing bureaucratic red tape, modern public administration builds lasting public trust and fosters a collaborative climate for social and economic prosperity.`,
  },
  {
    id: 'test-07',
    title: 'Test Set #07: Space Research and Technological Self Reliance',
    category: 'Science',
    wordCount: 332,
    text: `National achievements in planetary exploration and satellite communications demonstrate the immense potential of indigenous scientific research. From launching cost effective lunar exploration probes to deploying dedicated solar observatories, our space program has earned international acclaim for precision engineering and financial prudence. Remote sensing satellites orbiting above the atmosphere collect vital imagery that aids coastal disaster management, monsoon forecasting, and precision agricultural zoning. The deployment of indigenous regional satellite navigation constellations provides dependable positioning services for maritime fishermen, air traffic controllers, and emergency rescue personnel. Collaboration between public scientific establishments and private aerospace start ups has opened new horizons in satellite manufacturing and commercial launch vehicle operations. Engineering colleges across the country are inspiring young scholars to design miniaturized satellites and conduct innovative research in propulsion physics and robotics. Developing indigenous cryogenic rocket engines has reduced dependence on foreign launch vehicles and positioned our country as a dependable global launch hub for international research payloads.`,
  },
  {
    id: 'test-08',
    title: 'Test Set #08: Public Health and Preventive Care Infrastructure',
    category: 'Health',
    wordCount: 340,
    text: `A healthy population is the primary prerequisite for sustained national economic development and social stability. Expanding affordable healthcare coverage through comprehensive health insurance cards has protected millions of vulnerable families from catastrophic medical expenditures. The upgrade of primary healthcare centers into holistic health and wellness clinics provides essential diagnostic services, free generic medicines, and preventive screenings for chronic conditions like hypertension and diabetes. Immunization drives for infants and expectant mothers have significantly reduced infant mortality rates across remote districts. Telemedicine consultations now bridge the geographical divide by connecting experienced medical specialists in metropolitan hospitals with patients in rural primary health clinics. In addition to clinical treatment, nationwide awareness campaigns promoting clean sanitation, safe drinking water, and balanced nutrition are reducing the burden of communicable vector borne diseases. Encouraging regular physical fitness, yoga, and mental wellness routines builds long term immunity across all age demographics, establishing a healthy, vigorous, and productive society.`,
  },
];

export function getAllPassages(): Passage[] {
  if (typeof window === 'undefined') return DEFAULT_PASSAGES;
  try {
    const custom = localStorage.getItem('rrb_custom_passages');
    if (custom) {
      const parsed: Passage[] = JSON.parse(custom);
      return [...DEFAULT_PASSAGES, ...parsed];
    }
  } catch {
    // fallback
  }
  return DEFAULT_PASSAGES;
}

export function getPassageById(id: string): Passage {
  const passages = getAllPassages();
  return passages.find((p) => p.id === id) || passages[0];
}

export function saveCustomPassage(title: string, category: string, text: string): Passage {
  const cleaned = text.trim();
  const wordCount = cleaned.split(/\s+/).filter((w) => w.length > 0).length;
  const newPassage: Passage = {
    id: `custom-${Date.now()}`,
    title: title.trim() || `Custom Passage ${new Date().toLocaleDateString()}`,
    category: category.trim() || 'Custom',
    wordCount,
    text: cleaned,
    isCustom: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem('rrb_custom_passages');
      const list: Passage[] = existing ? JSON.parse(existing) : [];
      list.push(newPassage);
      localStorage.setItem('rrb_custom_passages', JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  return newPassage;
}

export function deleteCustomPassage(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem('rrb_custom_passages');
    if (existing) {
      const list: Passage[] = JSON.parse(existing);
      const filtered = list.filter((p) => p.id !== id);
      localStorage.setItem('rrb_custom_passages', JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }
}
