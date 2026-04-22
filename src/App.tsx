import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Hammer, 
  Shield, 
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Menu, 
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Quote,
  CheckCircle2,
  Globe,
  Building2,
  Droplets,
  MessageCircle,
  ShieldCheck,
  Layers,
  Star,
  Truck,
  Send,
  User,
  Bot,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// --- Types ---
interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  avatar: string;
  countryCode: string;
  stars: number;
}

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  icon: React.ElementType;
}

interface ProjectImage {
  id: string;
  url: string;
  category: string;
  title?: string;
}

const Logo = ({ className = "w-[150px]", variant = "default" }: { className?: string, variant?: "default" | "footer" | "mobile" }) => {
  const [logoError, setLogoError] = useState(false);
  const logoPath = "/logo/logo.png"; // User can upload logo.png to public/logo/

  if (!logoError) {
    return (
      <img 
        src={logoPath} 
        alt="Adonai Metal Works" 
        className={`${className} object-contain`}
        onError={() => setLogoError(true)}
      />
    );
  }

  // Fallback to original SVG
  if (variant === "footer") {
    return (
      <svg className="w-[180px]" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 10L10 60H30L40 40L50 60H70L40 10Z" fill="#C8102E"/>
        <path d="M60 10L30 60H50L60 40L70 60H90L60 10Z" fill="#888"/>
        <text x="0" y="70" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="18">ADONAI</text>
        <text x="0" y="82" fill="#C8102E" fontFamily="Arial" fontSize="11" fontWeight="bold">METAL WORKS</text>
      </svg>
    );
  }

  return (
    <svg className={`${className} drop-shadow-[0_0_10px_rgba(200,16,46,0.5)]`} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10L10 60H30L40 40L50 60H70L40 10Z" fill="#C8102E"/>
      <path d="M60 10L30 60H50L60 40L70 60H90L60 10Z" fill="#888"/>
      <text x="0" y="75" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="14">ADONAI</text>
      <text x="0" y="85" fill="#888" fontFamily="Arial" fontSize="8">METAL WORKS ENTERPRISE</text>
    </svg>
  );
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Esi Boateng",
    location: "Tema Community 12, Ghana",
    countryCode: "GH",
    text: "The precision they brought to our fuel station canopies was remarkable. Their structures stand firm against the elements, combining safety with architectural elegance.",
    avatar: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=200",
    stars: 5
  },
  {
    id: 2,
    name: "Yaw Antwi",
    location: "Tema Community 25, Ghana",
    countryCode: "GH",
    text: "Working with Adonai for our industrial storage tanks was the best decision. Their engineering integrity is unmatched in the region.",
    avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200",
    stars: 5
  },
  {
    id: 3,
    name: "Ama Serwaa",
    location: "Cantonments, Accra",
    countryCode: "GH",
    text: "They forged a legacy for our project with their industrial steel structures. Excellence in every weld and massive structural strength.",
    avatar: "",
    stars: 5
  },
  {
    id: 4,
    name: "Mensa Benjamin",
    location: "Kumasi, Ghana",
    countryCode: "GH",
    text: "Professionalism and mastery in metal works. They delivered international standards for our warehouse frameworks with local heart.",
    avatar: "",
    stars: 5
  },
  {
    id: 5,
    name: "Heidi Schmidt",
    location: "Berlin, Germany",
    countryCode: "DE",
    text: "Adonai's technical standards in industrial metal works surpassed our expectations. Their precision engineering projects are world-class.",
    avatar: "https://i.pravatar.cc/150?u=heidi",
    stars: 5
  },
  {
    id: 6,
    name: "Zanele Mkhize",
    location: "Sandton, South Africa",
    countryCode: "ZA",
    text: "The industrial storage tanks delivered to our site in Johannesburg are built like fortresses. Exceptional durability for heavy-duty needs.",
    avatar: "https://img.freepik.com/free-icon/user_318-159711.jpg",
    stars: 5
  },
  {
    id: 7,
    name: "Chen Wei",
    location: "Guangzhou, China",
    countryCode: "CN",
    text: "Impressive craftsmanship on the billboard frames and massive steel components. They managed our complex metal logistics with precision.",
    avatar: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=200",
    stars: 5
  },
  {
    id: 8,
    name: "John Mutua",
    location: "Nairobi, Kenya",
    countryCode: "KE",
    text: "A leader in fuel station canopy design. Their team brought structural innovation to our petrol stations that simply exceeded all benchmarks.",
    avatar: "https://img.freepik.com/free-icon/user_318-159711.jpg",
    stars: 5
  },
  {
    id: 9,
    name: "Fatima Al-Sayed",
    location: "Dubai, UAE",
    countryCode: "AE",
    text: "Their stainless steel railings and custom metal fixtures for our luxury complex were staggering. Absolute industrial perfection.",
    avatar: "https://i.pravatar.cc/150?u=fatima",
    stars: 5
  }
];

const portfolioCategories = [
  "View All",
  "Precision Morden Gates",
  "Industrial Steel Structures",
  "Underground Storage Tanks",
  "Surface Storage Tanks",
  "Industrial Storage Tanks",
  "Fuel Station Canopies",
  "Billboard Frames",
  "Burglarproof",
  "Stainless Steel Railings"
];

const portfolioItems: Service[] = [
  {
    id: 1,
    title: "Surface Storage Tanks",
    category: "Surface Storage Tanks",
    description: "High-capacity storage solutions engineered for industrial and agricultural needs.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000",
    icon: Layers
  },
  {
    id: 2,
    title: "Industrial Storage Tanks",
    category: "Industrial Storage Tanks",
    description: "Custom-built industrial tanks for large-scale storage and chemical processing.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000",
    icon: Droplets
  },
  {
    id: 3,
    title: "Industrial Steel Structures",
    category: "Industrial Steel Structures",
    description: "Robust steel frameworks for factories, warehouses, and commercial infrastructures.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
    icon: Building2
  },
  {
    id: 5,
    title: "Underground Storage Tanks",
    category: "Underground Storage Tanks",
    description: "Precision-engineered tanks designed for subterranean fuel and liquid storage.",
    image: "https://images.unsplash.com/photo-1517420812314-854e488667c4?auto=format&fit=crop&q=80&w=1000",
    icon: Settings
  },
  {
    id: 6,
    title: "Fuel Station Canopies",
    category: "Fuel Station Canopies",
    description: "Structural canopies designed for safety and architectural elegance at fuel stations.",
    image: "https://images.unsplash.com/photo-1504328345606-17b27c9b0185?auto=format&fit=crop&q=80&w=1000",
    icon: Hammer
  },
  {
    id: 7,
    title: "Billboard Frames",
    category: "Billboard Frames",
    description: "Durable and precisely engineered steel frames for large-scale outdoor advertising.",
    image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000",
    icon: Layers
  },
  {
    id: 8,
    title: "Stainless Steel Railings",
    category: "Stainless Steel Railings",
    description: "High-grade stainless steel railing systems for high-end residential and commercial interiors.",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1000",
    icon: Settings
  },
  {
    id: 9,
    title: "Burglarproof",
    category: "Burglarproof",
    description: "Reinforced metal reinforcements for windows and doors, providing ultimate security.",
    image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=1000",
    icon: ShieldCheck
  },
  {
    id: 10,
    title: "Precision Morden Gates",
    category: "Precision Morden Gates",
    description: "Custom-designed high-security gates combining modern aesthetics with heavy-duty metal engineering.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
    icon: Shield
  },
  {
    id: 11,
    title: "Warehouse Framework",
    category: "Industrial Steel Structures",
    description: "Large-scale structural steel solutions for logistics centers and massive warehouse facilities.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
    icon: Building2
  },
  {
    id: 12,
    title: "Chemical Storage",
    category: "Industrial Storage Tanks",
    description: "Specialized tanks designed for the safe and durable storage of industrial chemicals and fuel.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
    icon: Droplets
  }
];

  const servicesData: Service[] = [
    {
      id: 1,
      title: "Precision Morden Gates",
      category: "GATES",
      description: "Custom-designed high-security gates combining modern aesthetics with heavy-duty metal engineering.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      icon: Shield
    },
    {
      id: 2,
      title: "Industrial Steel Structures",
      category: "STEEL STRUCTURES",
      description: "Robust steel frameworks and heavy-duty infrastructures for factories and massive commercial centers.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
      icon: Building2
    },
    {
      id: 3,
      title: "Industrial Storage Tanks",
      category: "TANKS",
      description: "Massive scale industrial tanks designed for safe and durable storage of fuel and chemicals.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
      icon: Droplets
    },
    {
      id: 4,
      title: "Underground Storage Tanks",
      category: "TANKS",
      description: "Precision-engineered subterranean storage solutions for fuel and water with maximum safety.",
      image: "https://images.unsplash.com/photo-1517420812314-854e488667c4?auto=format&fit=crop&q=80&w=800",
      icon: Settings
    },
    {
      id: 5,
      title: "Surface Storage Tanks",
      category: "TANKS",
      description: "Durable above-ground tanks engineered for easy maintenance and industrial efficiency.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
      icon: Layers
    },
    {
      id: 6,
      title: "Fuel Station Canopies",
      category: "STRUCTURES",
      description: "Weather-resistant and architecturally bold canopies for modern fuel stations across the region.",
      image: "https://images.unsplash.com/photo-1504328345606-17b27c9b0185?auto=format&fit=crop&q=80&w=800",
      icon: Hammer
    },
    {
      id: 7,
      title: "Billboard Frames",
      category: "ADVERTISING",
      description: "High-grade structural steel frames for large-scale outdoor advertising and display systems.",
      image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800",
      icon: Layers
    },
    {
      id: 8,
      title: "Stainless Steel Railings",
      category: "BALUSTRADES",
      description: "Elegant and rust-proof stainless steel railing systems for luxury modern architectures.",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800",
      icon: Settings
    },
    {
      id: 9,
      title: "Burglarproof",
      category: "SECURITY",
      description: "Heavy-duty reinforced window and door security designs without compromising aesthetics.",
      image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=800",
      icon: ShieldCheck
    }
  ];

// Placeholder for banner images if firebase list is empty
const fallBackBannerImages = [
  "https://images.unsplash.com/photo-1504328345606-17b27c9b0185?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1517420812314-854e488667c4?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=2070"
];

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allImages, setAllImages] = useState<ProjectImage[]>([]);
  const [bannerImages, setBannerImages] = useState<ProjectImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("View All");
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);

  // Navigation Items
  const navItems = ["Home", "Services", "Portfolio", "About", "Contact"];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'images'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const imagesData: ProjectImage[] = [];
        querySnapshot.forEach((doc) => {
          imagesData.push({ id: doc.id, ...doc.data() } as ProjectImage);
        });
        
        setAllImages(imagesData);
        const bannerList = imagesData.filter(img => img.category === 'banner');
        if (bannerList.length > 0) {
          setBannerImages(bannerList);
        } else {
          setBannerImages(fallBackBannerImages.map((url, i) => ({ id: `fallback-${i}`, url, category: 'banner' })));
        }
      } catch (error) {
        console.error("Error fetching images from Firebase:", error);
        setBannerImages(fallBackBannerImages.map((url, i) => ({ id: `fallback-${i}`, url, category: 'banner' })));
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (bannerImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Welcome to Adonai Metal Works. I am your AI engineering assistant. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Create a visual context string from project images
      const visualContext = allImages.length > 0 
        ? `\nAvailable Project Images for you to display (use Markdown syntax ![Title](URL)): \n${allImages.map(img => `- ${img.title || img.category}: ${img.url}`).join('\n')}`
        : '';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `You are the specialized AI Agent for Adonai Metal Works Enterprise, a premier Ghanaian metal engineering firm with 15+ years of experience.
          Guidelines:
          1. Be professional, technical, and helpful.
          2. Knowledge Base:
             - Services: Precision Morden Gates, Industrial Steel Structures, Industrial/Underground/Surface Storage Tanks, Fuel Station Canopies, Billboard Frames, Burglar Proof, Stainless Steel Railings.
             - Stats: 500+ projects delivered, 25+ global partners.
             - Founded: 2009.
             - Locations: Based in Ghana (Tema, Accra, Kumasi).
             - Motto: "Where Precision Meets Architectural Art".
             - Contact: Phone (+233 502 787 990), Email (info@adonaimetalworks.com).
          3. Tone: Confident in engineering integrity.
          4. Visual Support: You have access to a library of project images. When relevant, you MUST show images of our work to the client using Markdown syntax: ![Image Title](Image URL). PROACTIVELY show pictures when users ask about specific products like "tanks", "gates", "canopies", or "railings".
          5. If asked about prices or specific quotes, advise the user to use the "Get a Quote" button or contact via WhatsApp/Email for a precision assessment.
          6. Keep responses concise and formatted with clarity.${visualContext}`
        }
      });

      const botResponse = response.text || "I apologize, but I am having trouble processing that request right now. Please try again or contact our support team directly.";
      setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "Error connecting to service. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const currentImage = bannerImages.length > 0 ? bannerImages[currentSlide] : null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      {/* Navigation Bar - Exact user code match */}
      <nav className={`flex justify-between items-center py-4 px-[5%] z-50 fixed top-0 left-0 right-0 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent'}`}>
        <div className="flex items-center gap-[10px]">
          <Logo className="w-[150px]" />
        </div>
        <div className="hidden md:flex gap-[30px] items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-white no-underline font-medium text-[0.7rem] transition-colors hover:text-primary uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('Contact')}
            className="bg-primary text-white px-6 py-3 rounded-[50px] no-underline font-bold transition-transform hover:scale-105 uppercase text-[0.6rem]"
          >
            Get a Quote
          </button>
        </div>
        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black md:hidden"
          >
            {/* Mobile Header (Repeated for consistency) */}
            <div className="flex justify-between items-center py-5 px-[5%]">
              <div className="flex items-center gap-[10px]">
                <Logo className="w-[120px]" variant="mobile" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center h-[calc(100%-80px)] gap-10">
              {navItems.map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center gap-4"
                >
                  <span className="text-primary italic text-sm font-serif">0{i + 1}</span>
                  {item}
                </motion.button>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                onClick={() => scrollToSection('Contact')}
                className="mt-8 bg-primary text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-[0_10px_30px_rgba(200,16,46,0.5)]"
              >
                Get a Quote
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section */}
      <section id="home" className="relative w-full min-h-screen flex flex-col pt-24 pb-16 overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover block"
            alt="Welding in Dark Workshop"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>

        {/* Hero Content & Impact Wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-[5%] max-w-[1400px] mx-auto w-full relative z-20 pb-32 lg:pb-0">
          <div className="w-full lg:max-w-[60%] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-primary px-6 py-2.5 rounded-[50px] text-[0.61rem] font-bold tracking-[2px] mb-8 w-fit shadow-[0_0_15px_rgba(200,16,46,0.6)] before:content-[''] before:w-2 before:h-2 before:bg-white before:rounded-full before:mr-[12px]"
            >
              EXCELLENCE IN DELIVERY
            </motion.div>
            
            <h1 className="text-[2.3rem] md:text-[4.5rem] leading-[0.9] font-black mb-10 uppercase tracking-tighter overflow-hidden relative">
              {/* Forge Aura Background */}
              <div className="forge-aura animate-pulse" />

              <motion.div 
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-wrap items-baseline gap-x-4 mb-2"
              >
                <span>WHERE</span>
                <span className="text-primary border-b-[4px] md:border-b-[6px] border-primary pb-1 md:pb-2 animate-shimmer animate-glint">PRECISION</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-white/40 mb-2 md:ml-[15%]"
              >
                MEETS
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.6 }}
                className="font-serif italic font-bold text-shadow-glow leading-tight"
              >
                ARCHITECTURAL ART.
              </motion.div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-[0.76rem] md:text-[0.9rem] text-[#D0D0D0] max-w-[650px] font-medium leading-relaxed mb-12"
            >
              Adonai Metal Works Enterprise transforms raw steel into enduring legacies. From massive industrial frameworks to bespoke luxury gates, we forge the future of African engineering.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[300px] bg-transparent backdrop-blur-[4px] border border-white/30 rounded-[24px] p-8 lg:absolute lg:right-[5%] lg:bottom-[10%] shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />
            
            <h3 className="relative z-10 text-[1.25rem] font-bold mb-6">Our Impact</h3>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-primary text-[1.25rem]">⏱</div>
                <div className="flex flex-col">
                  <h4 className="text-[1.5rem] font-bold leading-none">15+</h4>
                  <p className="text-[0.6rem] text-[#B0B0B0] uppercase tracking-[1px] mt-1">Years of Mastery</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-primary text-[1.25rem]">🏗</div>
                <div className="flex flex-col">
                  <h4 className="text-[1.5rem] font-bold leading-none">500+</h4>
                  <p className="text-[0.6rem] text-[#B0B0B0] uppercase tracking-[1px] mt-1">Projects Delivered</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-primary text-[1.25rem]">🤝</div>
                <div className="flex flex-col">
                  <h4 className="text-[1.5rem] font-bold leading-none">25+</h4>
                  <p className="text-[0.6rem] text-[#B0B0B0] uppercase tracking-[1px] mt-1">Global Partners</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/233502787990" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] rounded-[20px] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform active:scale-95 mb-1"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* AI Agent Group */}
        <div className="relative flex items-center group">
          {/* Tooltip/Tag */}
          <div className="absolute right-[110%] top-1/2 -translate-y-1/2 bg-white px-6 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 whitespace-nowrap opacity-100 transition-all duration-300">
            <span className="text-[0.95rem] font-bold text-secondary tracking-tight">Talk to our AI Agent</span>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center"
          >
            <div className="relative">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-16 h-16 bg-[#C8102E] rounded-full flex items-center justify-center text-white shadow-2xl transition-transform active:scale-95 z-[101]"
              >
                {isChatOpen ? <X size={32} /> : <MessageCircle size={32} strokeWidth={2.5} />}
              </button>
              <div className="absolute top-0 right-0 w-4.5 h-4.5 bg-[#00FF00] border-3 border-white rounded-full shadow-sm z-[102]" />
            </div>
          </motion.div>
        </div>

        {/* --- Chat Window Overlay --- */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed bottom-24 md:bottom-28 right-4 md:right-8 w-[calc(100vw-2rem)] bg-[#121212] rounded-[30px] border border-white/10 z-[110] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
                isChatExpanded 
                ? 'md:w-[600px] h-[600px] md:h-[700px]' 
                : 'md:w-[380px] h-[450px] md:h-[550px]'
              }`}
            >
              {/* Header - Static height */}
              <div className="bg-primary p-4 md:p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="text-white w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold leading-tight text-sm md:text-base">Adonai AI Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00FF00] rounded-full" />
                      <span className="text-white/70 text-[0.6rem] md:text-[0.7rem] uppercase font-bold tracking-wider">Expert Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Expand / Minimize Controls */}
                <button 
                  onClick={() => setIsChatExpanded(!isChatExpanded)}
                  className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  title={isChatExpanded ? "Minimize Chat" : "Expand Chat"}
                >
                  {isChatExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 CustomScrollbar">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[0.8rem] leading-relaxed shadow-sm markdown-container ${
                      msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/[0.05] text-[#D0D0D0] border border-white/5 rounded-tl-none'
                    }`}>
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.05] border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-0" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area - Static height */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02] flex-shrink-0">
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your engineering needs..."
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-4 pr-14 text-[0.8rem] text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 shadow-inner"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                    <button 
                      disabled={!chatInput.trim() || isTyping}
                      onClick={handleSendMessage}
                      className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
                    >
                      {isTyping ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-[0.6rem] text-white/20 uppercase font-black tracking-widest leading-none">Powered by Adonai Intelligence</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </section>

      <main>
{/* --- Services Section (Missing Piece) --- */}
        <section id="services" className="py-24 md:py-32 bg-[#F8F8F8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-[2.2rem] md:text-[5.5rem] font-display font-black text-secondary leading-[0.85] uppercase tracking-tighter mb-8">
                OUR <span className="text-primary italic">PREMIUM</span> <br />
                ENGINEERING
              </h2>
              <p className="text-[0.9rem] md:text-[1.1rem] text-secondary/60 font-medium leading-relaxed max-w-2xl mx-auto italic">
                Tap on any service to explore our dedicated project gallery. Each masterpiece is engineered for durability and aesthetic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {servicesData.map((service, i) => (
                 <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-md flex flex-col group hover:shadow-2xl transition-all duration-500">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={service.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={service.title}
                        referrerPolicy="no-referrer"
                      />
                      {/* Floating Red Icon Box */}
                      <div className="absolute top-5 left-5 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl z-20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                         <service.icon size={26} />
                      </div>
                      {/* Overlay Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                         <h3 className="text-white text-xl font-bold uppercase tracking-tight leading-none">{service.title}</h3>
                      </div>
                    </div>
                    
                    <div className="bg-[#1A1A1A] p-8 flex-grow flex flex-col">
                       <p className="text-white/60 text-[0.75rem] font-medium leading-relaxed mb-8 flex-grow">
                         {service.description}
                       </p>
                       <div className="flex items-center justify-between">
                          <button 
                            onClick={() => {
                              setActiveCategory(service.title === "Precision Morden Gates" ? "Precision Morden Gates" : service.title);
                              scrollToSection('portfolio');
                            }}
                            className="bg-primary text-white py-3 px-8 rounded-full text-[0.65rem] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                          >
                            See More
                          </button>
                          <span className="text-white/20 text-[0.65rem] font-black uppercase tracking-[0.3em]">{service.category}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* --- Portfolio / Masterpieces Section --- */}
        <section id="portfolio" className="py-24 md:py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
              <div className="max-w-3xl">
                 <h2 className="text-[2.1rem] md:text-[4.2rem] font-display font-black text-secondary uppercase tracking-tighter leading-none mb-8">
                   Masterpieces <br />
                   <span className="text-primary italic">in Metal</span>
                 </h2>
                 <div className="w-24 h-1.5 bg-primary mb-8" />
              </div>
              <div className="max-w-xl">
                 <p className="text-[0.87rem] text-secondary/50 font-medium leading-relaxed">
                   A showcase of our dedication to precision, durability, and aesthetic excellence in every project we undertake.
                 </p>
              </div>
            </div>

            {/* Filter Bar (Screenshot 4) */}
            <div className="flex overflow-x-auto pb-8 mb-16 no-scrollbar gap-4">
               {portfolioCategories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-8 py-4 rounded-full whitespace-nowrap text-[0.61rem] font-black uppercase tracking-widest transition-all duration-300 border ${
                     activeCategory === cat 
                     ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                     : "bg-white border-gray-100 text-secondary hover:border-primary/30"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

             {/* Project Grid (Screenshot 1, 2, 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               <AnimatePresence mode="popLayout">
                 {(allImages.length > 0 ? allImages : portfolioItems)
                   .filter(item => activeCategory === "View All" || item.category === activeCategory)
                   .map((item, idx) => {
                     // Determine icon based on category or use default
                     const IconComponent = (item as any).icon || (idx % 2 === 0 ? Layers : Shield);
                     
                     return (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="bg-white rounded-[3rem] p-5 shadow-sm border border-gray-100 h-full flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8">
                            <img 
                              src={(item as any).image || (item as any).url} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              alt={(item as any).title || "Metal Work"}
                              referrerPolicy="no-referrer"
                            />
                            {/* Portfolio Badges from Screenshot 1, 2, 3 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                               <div className="bg-primary px-4 py-2 w-fit mb-3">
                                  <span className="text-[0.6rem] font-black tracking-widest text-white uppercase whitespace-nowrap">
                                     {item.category}
                                  </span>
                               </div>
                               <h4 className="text-white text-xl font-bold uppercase tracking-tight leading-none drop-shadow-md">
                                  {(item as any).title || "Industrial Project"}
                               </h4>
                            </div>
                            {/* Floating Red Icon Box */}
                            <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 z-20 transition-all group-hover:bg-primary group-hover:border-transparent">
                               <IconComponent size={24} />
                            </div>
                          </div>
                          
                          <div className="px-5 pb-5 flex-grow flex flex-col">
                            <h3 className="text-[1.05rem] font-display font-black text-secondary mb-4 uppercase tracking-tighter leading-[0.9]">
                              {(item as any).title || "Industrial Project"}
                            </h3>
                            <p className="text-secondary/50 text-[0.61rem] font-medium leading-relaxed mb-10 flex-grow">
                              {(item as any).description || "Specialized metal fabrication project delivered with absolute precision and industrial grade durability."}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                               <button className="btn-primary py-4 px-10 text-[7.5px] uppercase tracking-[0.2em] font-black">
                                 See More
                               </button>
                               <span className="text-[7.5px] font-black text-secondary/20 uppercase tracking-[0.3em]">
                                 {item.category.split(' ').pop()}
                               </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                     );
                   })}
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* --- About Us Section (Precision & Legacy) --- */}
        <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-[5%]">
            <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
              {/* Image Grid / Visual Column */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group">
                  <img 
                    src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1200" 
                    alt="Stainless Steel Railings" 
                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                
                {/* Red Accent Shape (From Screenshot) */}
                <div className="absolute -bottom-8 -right-8 w-4/5 h-1/2 bg-primary rounded-[3rem] -z-10 transform translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8" />
                
                {/* Floating Experience Badge */}
                <div className="absolute top-10 -left-6 md:-left-12 bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl z-20 flex items-center gap-5 border border-gray-100 animate-bounce-slow">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <span className="text-3xl md:text-4xl font-black">15+</span>
                  </div>
                  <div>
                    <p className="text-secondary/50 text-xs font-black uppercase tracking-widest leading-none mb-1">Years of</p>
                    <p className="text-secondary font-display font-black text-xl md:text-2xl leading-none">Legacy</p>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-8 h-[2px] bg-primary rounded-full" />
                  <span className="text-primary font-black uppercase tracking-[0.4em] text-[0.7rem]">About Adonai Metal Works</span>
                </div>
                
                <h2 className="text-4xl md:text-[4.5rem] font-bold text-secondary leading-[0.95] tracking-tighter mb-8">
                  Forging the Future of <span className="text-primary">Industrial</span> Infrastructure.
                </h2>
                
                <p className="text-secondary/70 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl">
                  As Ghana's premier metal engineering firm, we combine deep industrial mastery with cutting-edge technology to deliver structures that stand as testaments to durability and precision.
                </p>

                <div className="grid gap-8 w-full max-w-lg mb-12">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-secondary mb-2 uppercase tracking-wide">Superior Engineering</h4>
                      <p className="text-secondary/50 text-sm leading-relaxed">
                        Every structure we build is backed by rigorous calculations and international safety standards for maximum structural integrity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <Truck size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-secondary mb-2 uppercase tracking-wide">Timely Delivery</h4>
                      <p className="text-secondary/50 text-sm leading-relaxed">
                        We respect your timelines and ensure projects are completed on schedule, maintaining zero-tolerance for operational delays.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsJourneyModalOpen(true)}
                  className="bg-primary text-white py-6 px-12 rounded-full font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(198,40,40,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(198,40,40,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                >
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Testimonials Section (Cinematic Marquee Design) --- */}
        <section className="py-24 bg-[#F8F8F8] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-[5%] mb-24 text-center">
            <span className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Global Trust</span>
            <h2 className="text-[2.5rem] md:text-[5rem] font-bold text-black leading-none mb-8 tracking-tight">
              Voices of Satisfaction & Trust
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mb-10 rounded-full" />
            <p className="max-w-3xl mx-auto text-[1.1rem] md:text-[1.2rem] text-[#666] leading-relaxed font-medium">
              Built over years of dedicated operations, our commitment to excellence resonates across the globe—from the heart of Ghana to the industrial powerhouses of Europe and beyond.
            </p>
          </div>

          <div className="relative flex flex-col gap-10">
            {/* First Row - Left to Right */}
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-6 pr-6 py-4"
                animate={{
                  x: [0, "-50%"]
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {[...testimonials, ...testimonials].map((t, i) => {
                  const getFlagEmoji = (countryCode: string) => {
                    const codePoints = countryCode
                      .toUpperCase()
                      .split('')
                      .map(char => 127397 + char.charCodeAt(0));
                    return String.fromCodePoint(...codePoints);
                  };

                  return (
                    <div 
                      key={`${t.id}-${i}`} 
                      className="w-[320px] md:w-[450px] bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col shrink-0"
                    >
                      <div className="flex items-center gap-5 mb-8">
                        <div className="relative">
                          {t.avatar ? (
                            <img 
                              src={t.avatar} 
                              alt={t.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-gray-100"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#E9EBEF] flex items-center justify-center text-[#90949C] overflow-hidden border-2 border-white shadow-md">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mt-auto translate-y-1">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[1.2rem] shadow-sm border border-gray-100">
                            {getFlagEmoji(t.countryCode)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[1.1rem] font-bold text-black leading-none mb-1">{t.name}</div>
                          <div className="text-[0.8rem] font-bold text-primary uppercase tracking-wider">{t.location}</div>
                        </div>
                      </div>

                      <p className="text-[1rem] md:text-[1.1rem] text-[#444] italic leading-relaxed mb-8 flex-grow font-medium">
                        "{t.text}"
                      </p>

                      <div className="flex gap-1 mt-auto">
                        {[...Array(t.stars)].map((_, j) => (
                          <Star key={j} size={14} fill="#C8102E" className="text-primary" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- About Section & Testimonials --- */}
        <section id="about" className="py-24 md:py-40 bg-[#0A0A0A] relative overflow-hidden">
          {/* Background Decorative Text */}
          <div className="absolute top-0 left-0 text-[20rem] font-black text-white/[0.02] leading-none select-none pointer-events-none -ml-40 -mt-20 uppercase tracking-tighter">
            ADONAI
          </div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
             <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
                <div className="relative">
                   <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border border-white/10">
                      <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="Expertise" />
                      {/* Floating Overlay Badge on Image */}
                      <div className="absolute bottom-10 left-10 right-10 p-10 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 flex items-center justify-between">
                         <div>
                            <div className="text-4xl font-display font-black text-white">Steel</div>
                            <div className="text-xs font-black uppercase tracking-widest text-primary">Mastery</div>
                         </div>
                         <Shield size={40} className="text-primary" />
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-full h-full bg-primary/20 rounded-[4rem] -z-10 blur-3xl opacity-50" />
                   <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-xl z-20">
                      <div className="text-center">
                         <div className="text-4xl font-display font-black text-white">15+</div>
                         <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Years</div>
                      </div>
                   </div>
                </div>
                <div>
                  <div className="badge-red mb-8">
                    <span>Our Legacy</span>
                  </div>
                   <h2 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter mb-12 leading-[0.85]">
                     Engineered for <br />
                     <span className="text-primary italic">Generations.</span>
                   </h2>
                   <p className="text-xl text-white/50 font-medium leading-relaxed mb-12">
                     At Adonai Metal Works Enterprise, we believe metal isn't just about strength—it's about the legacy it builds. Since our inception, we have redefined structural integrity across Ghana, delivering excellence in every weld and every structural frame.
                   </p>
                   <div className="grid grid-cols-2 gap-12 mb-16">
                      <div className="group">
                         <div className="text-3xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">Durability</div>
                         <div className="w-12 h-1 bg-white/10 mb-4 group-hover:w-full transition-all duration-500" />
                         <p className="text-sm text-white/30 leading-relaxed">Using high-grade alloys and specifically treated steel to maximize lifespan in harsh environments.</p>
                      </div>
                      <div className="group">
                         <div className="text-3xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">Artistry</div>
                         <div className="w-12 h-1 bg-white/10 mb-4 group-hover:w-full transition-all duration-500" />
                         <p className="text-sm text-white/30 leading-relaxed">Every weld is a stroke of architectural precision, blending artistic vision with industrial-grade strength.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setIsJourneyModalOpen(true)}
                     className="flex items-center space-x-6 text-white group"
                   >
                      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                         <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">Discover Our Journey</span>
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="contact" className="py-16 md:py-32 bg-[#121212] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-[5%] relative z-10">
             <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
                <div className="px-1 md:px-0">
                   <h2 className="text-[2.8rem] md:text-[4.8rem] font-bold text-white leading-[1.1] mb-6 md:mb-8">
                     Let's Build Something<br />
                     <span className="text-primary">Exceptional</span>
                   </h2>
                   <p className="text-[1rem] md:text-[1.1rem] text-[#888] leading-relaxed mb-10 md:mb-16 max-w-[500px]">
                     Ready to start your next metal engineering project? Contact us today for a consultation and a free quote. Our experts are ready to bring your vision to life.
                   </p>
                   
                   <div className="space-y-6 md:space-y-8">
                      {[
                        { icon: Phone, title: "Call or WhatsApp Us", detail: "0549025412 / 0241763340 / 0502787990" },
                        { icon: Mail, title: "Email Us", detail: "info.adonaimetalengineering@gmail.com" },
                        { icon: MapPin, title: "Visit Us", detail: "Somanya, Tema Com. 12, Ghana" },
                        { icon: Clock, title: "Working Hours", detail: "Mon - Sat: 8:00 AM - 6:00 PM" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 md:gap-6 group">
                           <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1A1112] rounded-xl flex items-center justify-center text-primary border border-white/[0.03] shrink-0">
                              <item.icon size={22} />
                           </div>
                           <div>
                              <div className="text-[1rem] md:text-[1.1rem] font-bold text-white mb-0.5">{item.title}</div>
                              <div className="text-[0.9rem] md:text-[1rem] text-[#888]">{item.detail}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#1A1A1A] p-6 sm:p-8 md:p-12 rounded-[24px] md:rounded-[32px] border border-white/[0.05] shadow-2xl mb-24 lg:mb-0 mx-auto w-full max-w-[550px] lg:max-w-none">
                  <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                       <div className="space-y-2 md:space-y-3">
                          <label className="text-[0.8rem] md:text-[0.95rem] font-bold text-white ml-1">Full Name</label>
                          <input type="text" className="w-full bg-[#2A2A2A] border-none rounded-xl px-5 md:px-6 py-3.5 md:py-4 text-white outline-none placeholder:text-[#555] font-medium text-[0.85rem] md:text-base transition-all focus:ring-2 focus:ring-primary/20" placeholder="John Doe" />
                       </div>
                       <div className="space-y-2 md:space-y-3">
                          <label className="text-[0.8rem] md:text-[0.95rem] font-bold text-white ml-1">Email Address</label>
                          <input type="email" className="w-full bg-[#2A2A2A] border-none rounded-xl px-5 md:px-6 py-3.5 md:py-4 text-white outline-none placeholder:text-[#555] font-medium text-[0.85rem] md:text-base transition-all focus:ring-2 focus:ring-primary/20" placeholder="john@example.com" />
                       </div>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3">
                       <label className="text-[0.8rem] md:text-[0.95rem] font-bold text-white ml-1">Service Required</label>
                       <div className="relative">
                          <select className="w-full bg-[#2A2A2A] border-none rounded-xl px-5 md:px-6 py-3.5 md:py-4 text-white outline-none font-medium appearance-none text-[0.85rem] md:text-base cursor-pointer">
                             <option>Steel Structures</option>
                             <option>Industrial Tanks</option>
                             <option>Gates & Railings</option>
                             <option>Canopies</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
                             <ChevronRight size={16} className="rotate-90" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                       <label className="text-[0.8rem] md:text-[0.95rem] font-bold text-white ml-1">Message</label>
                       <textarea rows={4} className="w-full bg-[#2A2A2A] border-none rounded-xl px-5 md:px-6 py-3.5 md:py-4 text-white outline-none placeholder:text-[#555] font-medium resize-none text-[0.85rem] md:text-base transition-all focus:ring-2 focus:ring-primary/20" placeholder="Tell us about your project..."></textarea>
                    </div>

                    <button className="w-full py-4 md:py-5 bg-primary text-white rounded-full font-bold text-[0.9rem] md:text-[1.1rem] transition-all hover:brightness-110 shadow-lg active:scale-[0.98] mt-2">
                       Send Message
                    </button>
                  </form>
                </div>
             </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="bg-black text-white py-20 px-[5%] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Branding Column */}
            <div className="flex flex-col">
              <div className="mb-8">
                <Logo variant="footer" />
              </div>
              <p className="text-[#888] text-[0.95rem] leading-relaxed mb-10 max-w-[320px]">
                Excellence in delivery. We are leaders in metal engineering and construction, providing durable and aesthetic solutions for over 15 years.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/ashong.michael.52?igsh=MXN1ajJqbGU5aThnOA%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-all"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/share/1E1fQCyj2F/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-all"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://www.tiktok.com/@adonaimetalworks?_r=1&t=ZS-95K8PcWoGO8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/233502787990" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-all"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-xl font-bold mb-8">Quick Links</h3>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => scrollToSection(item)}
                      className="text-[#888] hover:text-white transition-colors text-[0.95rem] font-medium"
                    >
                      {item}
                    </button>
                  </li>
                ))}
                <li>
                  <button className="text-[#888] hover:text-white transition-colors text-[0.95rem] font-medium flex items-center gap-2">
                    <Settings size={16} />
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="text-xl font-bold mb-8">Services</h3>
              <ul className="space-y-4">
                {["Steel Structures", "Industrial Tanks", "Gates & Railings", "Canopies", "Maintenance"].map((service) => (
                  <li key={service}>
                    <button className="text-[#888] hover:text-white transition-colors text-[0.95rem] font-medium">
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h3 className="text-xl font-bold mb-8">Newsletter</h3>
              <p className="text-[#888] text-[0.95rem] mb-8 leading-relaxed">
                Subscribe to get the latest news and project updates.
              </p>
              <div className="relative max-w-[300px]">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-white/[0.02] border border-white/[0.1] rounded-xl px-6 py-4 text-sm outline-none text-white focus:border-primary/50 transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary px-4 rounded-lg flex items-center justify-center text-white hover:brightness-110 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* --- Global Journey Modal --- */}
        <AnimatePresence>
          {isJourneyModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8 md:p-12 overflow-y-auto bg-black/95 backdrop-blur-2xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#121212] w-full max-w-[1000px] min-h-[600px] rounded-[40px] border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setIsJourneyModalOpen(false)}
                  className="absolute top-8 right-8 z-50 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all duration-300"
                >
                  <X />
                </button>

                {/* Decorative Elements */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative p-8 md:p-16 h-full overflow-y-auto CustomScrollbar">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-[1px] bg-primary" />
                      <span className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-primary">The Adonai Story</span>
                    </div>
                    <h2 className="text-[3rem] md:text-[4.5rem] font-bold text-white leading-none mb-12 tracking-tight">
                      Our Journey <br /><span className="text-white/20">& Legacy.</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-16 mb-20">
                      <div>
                        <p className="text-[1.1rem] text-[#888] leading-relaxed mb-12">
                          From our humble beginnings in 2009, Adonai Metal Works has evolved into a symbol of precision and industrial mastery. Our story is written in steel and forged through decades of dedication.
                        </p>
                        
                        {/* Story Breakdown */}
                        <div className="space-y-10">
                          {[
                            { year: "2009", role: "Our Founding", desc: "Established with a bold vision to lead the metal engineering sector in Ghana through superior structural integrity." },
                            { year: "2015", role: "Industrial Expansion", desc: "Scaling our capabilities to handle massive warehouse frameworks and international-grade storage systems." },
                            { year: "2020", role: "Technical Mastery", desc: "Integrating cutting-edge fabrication technology and precision architectural design into our heavy-duty solutions." },
                            { year: "Today", role: "The Legacy Continues", desc: "Continuing to build the infrastructures that define the future of African engineering and beyond." }
                          ].map((milestone, i) => (
                            <div key={i} className="group">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[1.3rem] font-bold text-white group-hover:text-primary transition-colors">{milestone.role}</h4>
                                <span className="text-primary font-black text-sm italic">{milestone.year}</span>
                              </div>
                              <p className="text-[0.9rem] text-[#888] leading-relaxed">{milestone.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <div className="sticky top-0 aspect-square rounded-[3rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center p-8">
                          {/* Minimalist Map visualization */}
                          <div className="relative w-full h-full opacity-40">
                             <Globe className="w-full h-full text-white/10" strokeWidth={0.5} />
                             {/* Pulse Points */}
                             <div className="absolute top-[35%] left-[48%] w-3 h-3 bg-primary rounded-full animate-ping" title="Berlin" />
                             <div className="absolute top-[45%] left-[80%] w-3 h-3 bg-primary rounded-full animate-ping delay-700" title="China" />
                             <div className="absolute top-[75%] left-[52%] w-3 h-3 bg-primary rounded-full animate-ping delay-[1.4s]" title="South Africa" />
                             <div className="absolute top-[62%] left-[55%] w-3 h-3 bg-primary rounded-full animate-ping delay-[2.1s]" title="Kenya" />
                             
                             <div className="absolute top-[35%] left-[48%] w-2 h-2 bg-primary rounded-full" />
                             <div className="absolute top-[45%] left-[80%] w-2 h-2 bg-primary rounded-full" />
                             <div className="absolute top-[75%] left-[52%] w-2 h-2 bg-primary rounded-full" />
                             <div className="absolute top-[62%] left-[55%] w-2 h-2 bg-primary rounded-full" />
                          </div>
                          
                          <div className="absolute bottom-10 left-10 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                             <div className="text-[0.6rem] font-black uppercase tracking-widest text-primary mb-1">Global Status</div>
                             <div className="text-[1.2rem] font-bold text-white uppercase pr-8">Operational Network</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer of Modal */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div>
                          <div className="text-2xl font-bold text-white mb-2">15+ Years of Legacy</div>
                          <div className="text-[0.9rem] text-[#888]">From local mastery to global engineering partnerships.</div>
                       </div>
                       <button 
                        onClick={() => setIsJourneyModalOpen(false)}
                        className="bg-primary text-white px-10 py-5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
                       >
                         Continue Exploring
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
