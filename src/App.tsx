import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Hammer, 
  ShieldCheck, 
  Truck, 
  Construction, 
  Layers, 
  Droplets, 
  Building2, 
  Wrench,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Clock,
  Bot,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatBot } from './components/ChatBot';
import { CinematicBanner } from './components/CinematicBanner';
import { AdminDashboard } from './components/AdminDashboard';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { LOCAL_IMAGES, getLocalImagePath } from './constants/localImages';

// --- Constants & Data ---

const SERVICES = [
  {
    id: 'steel-structures',
    title: 'Steel Structures',
    description: 'Custom-engineered steel frameworks for industrial and commercial buildings.',
    icon: <Building2 className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'underground-tanks',
    title: 'Underground Tanks',
    description: 'High-capacity storage solutions engineered for safety and environmental protection.',
    icon: <Droplets className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'surface-tanks',
    title: 'Surface Tanks',
    description: 'Durable surface storage tanks for farms, factories, and industrial sites.',
    icon: <Layers className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'filling-station-canopies',
    title: 'Fill Station Canopies',
    description: 'Professional canopy construction and maintenance for fuel stations.',
    icon: <Construction className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1542362567-b051c63b9a27?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'billboard-frames',
    title: 'Billboard Frames',
    description: 'Robust steel frameworks for large-scale outdoor advertising.',
    icon: <Layers className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bugler-proof',
    title: 'Bugler Proof',
    description: 'High-security metal reinforcements for windows, doors, and perimeters.',
    icon: <ShieldCheck className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
  }
];

const PORTFOLIO = [
  { title: 'Modern Main Gate', category: 'Residential', img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=800' },
  { title: 'Industrial Storage Tank', category: 'Industrial', img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800' },
  { title: 'Fuel Station Canopy', category: 'Commercial', img: 'https://images.unsplash.com/photo-1542362567-b051c63b9a27?auto=format&fit=crop&q=80&w=800' },
  { title: 'Stainless Steel Railings', category: 'Interior', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
  { title: 'Steel Billboard Frame', category: 'Advertising', img: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=800' },
  { title: 'Custom Metal Enclosure', category: 'Specialized', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800' },
];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="w-full px-4 md:px-8 flex items-center justify-between">
        {/* Logo at extreme left corner - Protected from overlap */}
        <div className="flex items-center pt-2 md:pt-0">
          {LOCAL_IMAGES.logo.length > 0 ? (
            <img 
              src={getLocalImagePath('logo', LOCAL_IMAGES.logo[0])} 
              alt="Adonai Logo" 
              className="w-20 h-20 md:w-32 md:h-32 object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-xl">
              <span className="text-white font-bold text-2xl">AM</span>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-end gap-8">
          {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-semibold transition-colors hover:text-primary ${isScrolled ? 'text-secondary' : 'text-white'}`}
            >
              {item}
            </a>
          ))}
          <a href="#contact" className="bg-primary text-white font-bold py-2.5 px-6 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 text-sm">
            Get a Quote
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu className={isScrolled ? 'text-secondary' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 md:hidden flex flex-col gap-4"
          >
            {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-secondary hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-adonai-chat'));
              }}
              className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg"
            >
              <Bot className="w-6 h-6" /> Talk to our AI Agent
            </button>
            <a href="#contact" className="btn-primary w-full text-center">Get a Quote</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Our Premium Services</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of metal engineering services tailored to meet the specific needs of our industrial, commercial, and residential clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="service-card group"
            >
              <div className="mb-6 text-primary bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-bold flex items-center">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl mb-4">Masterpieces in Metal</h2>
            <div className="w-20 h-1.5 bg-primary rounded-full" />
          </div>
          <p className="text-gray-600 max-w-md">
            A showcase of our dedication to precision, durability, and aesthetic excellence in every project we undertake.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block py-1 px-3 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                  {item.category}
                </span>
                <h4 className="text-2xl text-white font-bold">{item.title}</h4>
                <div className="h-0.5 w-0 bg-white mt-4 group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8">Let's Build Something <span className="text-primary">Exceptional</span></h2>
            <p className="text-gray-400 mb-12 text-lg leading-relaxed">
              Ready to start your next metal engineering project? Contact us today for a consultation and a free quote. Our experts are ready to bring your vision to life.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <a href="https://wa.me/233502787990" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 hover:bg-primary hover:text-white transition-all">
                  <Phone className="w-6 h-6" />
                </a>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call or WhatsApp Us</h4>
                  <p className="text-gray-400">0549025412 / 0241763340 / 0502787990</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-gray-400">info.adonaimetalengineering@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                  <p className="text-gray-400">Somanya, Tema Com. 12, Ghana</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Working Hours</h4>
                  <p className="text-gray-400">Mon - Sat: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Full Name</label>
                  <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Email Address</label>
                  <input type="email" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Service Required</label>
                <select className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option className="bg-secondary">Steel Structures</option>
                  <option className="bg-secondary">Industrial Tanks</option>
                  <option className="bg-secondary">Gates & Railings</option>
                  <option className="bg-secondary">Canopies</option>
                  <option className="bg-secondary">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Message</label>
                <textarea rows={4} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Tell us about your project..."></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg">Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              {LOCAL_IMAGES.logo.length > 0 ? (
                <img 
                  src={getLocalImagePath('logo', LOCAL_IMAGES.logo[0])} 
                  alt="Adonai Logo" 
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                  <span className="text-white font-bold text-xl">AM</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-none">ADONAI</span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary">Metal Works</span>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed mb-8">
              Excellence in delivery. We are leaders in metal engineering and construction, providing durable and aesthetic solutions for over 15 years.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ashong.michael.52?igsh=MXN1ajJqbGU5aThnOA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1E1fQCyj2F/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@adonaimetalworks?_r=1&_t=ZS-95K8PcWoGO8" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.01.23 2.08.94 2.79.73.82 1.84 1.26 2.92 1.11 1.12-.05 2.11-.74 2.63-1.72.13-.33.2-.69.21-1.05.03-5.45-.01-10.88.02-16.32z"/>
                </svg>
              </a>
              <a href="https://wa.me/233502787990" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-500">
              {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
              <li>
                <button onClick={onAdminClick} className="hover:text-primary transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Admin Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4 text-gray-500">
              {['Steel Structures', 'Industrial Tanks', 'Gates & Railings', 'Canopies', 'Maintenance'].map((item) => (
                <li key={item}>
                  <a href="#services" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-gray-500 mb-6">Subscribe to get the latest news and project updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary w-full" />
              <button className="bg-primary p-2 rounded-lg hover:bg-primary-dark transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Adonai Metal Works Enterprise. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Constants & Data ---

const TESTIMONIALS = [
  // Tema, Ghana
  { name: "Kofi Mensah", location: "Tema Community 1, Ghana", flag: "🇬🇭", text: "Adonai didn't just install a gate; they gave my family a sense of security we've never had. Their precision is a work of heart.", img: "https://images.unsplash.com/photo-1541888941259-7724ed240321?auto=format&fit=crop&q=80&w=300" }, // Metal work/Gate
  { name: "Abena Osei", location: "Tema Community 4, Ghana", flag: "🇬🇭", text: "The underground tank they built for my business is a masterpiece of engineering. I can finally sleep knowing our resources are safe.", img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=300" }, // Tank
  { name: "Kwame Appiah", location: "Tema Community 9, Ghana", flag: "🇬🇭", text: "Every weld, every joint—you can see the passion. They treat your project like it's their own. Truly exceptional people.", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=300" }, // Steel work
  { name: "Esi Boateng", location: "Tema Community 12, Ghana", flag: "🇬🇭", text: "Their consultancy saved us from a major design flaw. They don't just work with metal; they work with wisdom and care.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300" }, // Engineering/Industrial
  
  // Accra, Ghana
  { name: "Yaw Antwi", location: "East Legon, Accra", flag: "🇬🇭", text: "The stainless steel railings in our new home are breathtaking. Adonai brings an artistic touch to heavy engineering.", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300" }, // Railings
  { name: "Ama Serwaa", location: "Cantonments, Accra", flag: "🇬🇭", text: "Professional, respectful, and incredibly skilled. They transformed our industrial site with their steel structures.", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=300" }, // Steel structure
  { name: "Kojo Adu", location: "Labone, Accra", flag: "🇬🇭", text: "I've worked with many contractors, but Adonai's commitment to excellence is on another level. They are the pride of Ghana.", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300" }, // Workshop
  { name: "Efua Dankwa", location: "Spintex, Accra", flag: "🇬🇭", text: "Their maintenance team is a godsend. They fixed our factory tanks with such care and speed. Simply the best.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300" }, // Factory/Tank

  // Kenya
  { name: "Samuel Kamau", location: "Nairobi, Kenya", flag: "🇰🇪", text: "Even across borders, their reputation holds true. The canopy they designed for our station is the talk of the city.", img: "https://images.unsplash.com/photo-1542362567-b051c63b9a27?auto=format&fit=crop&q=80&w=300" }, // Canopy
  { name: "Zuri Njeri", location: "Mombasa, Kenya", flag: "🇰🇪", text: "The emotional investment they put into their work is rare. They didn't just build a structure; they built a legacy.", img: "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&q=80&w=300" }, // Person/Business

  // South Africa
  { name: "Thabo Mbeki", location: "Johannesburg, South Africa", flag: "🇿🇦", text: "Precision engineering at its finest. Adonai's steel works are a testament to African excellence.", img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=300" }, // Industrial
  { name: "Lindiwe Sisulu", location: "Cape Town, South Africa", flag: "🇿🇦", text: "They understood our vision perfectly. The custom metal works they provided are both strong and beautiful.", img: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=300" }, // Gate

  // Brazil
  { name: "Ricardo Silva", location: "São Paulo, Brazil", flag: "🇧🇷", text: "The quality of their export-grade tanks is world-class. A partnership built on trust and superior metal work.", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300" }, // Metal work
  { name: "Isabella Costa", location: "Rio de Janeiro, Brazil", flag: "🇧🇷", text: "Adonai's attention to detail is unmatched. They brought our architectural metal designs to life with grace.", img: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=300" }, // Person

  // Europe (Collaborators/Partners)
  { name: "Hans Müller", location: "Berlin, Germany", flag: "🇩🇪", text: "Working hand-in-hand with Adonai on the underground storage project was a revelation. Their technical prowess is elite.", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=300" }, // Technical work
  { name: "Jean-Pierre", location: "Lyon, France", flag: "🇫🇷", text: "The way they piece metal together is like poetry. Our collaboration on the tank designs was seamless and inspiring.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300" }, // Tank design
  { name: "Marco Rossi", location: "Milan, Italy", flag: "🇮🇹", text: "Adonai's engineers are true masters. Their performance on the industrial tank project exceeded all European standards.", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=300" }, // Engineering
  { name: "Elena Schmidt", location: "Vienna, Austria", flag: "🇦🇹", text: "Their dedication to structural integrity is profound. A truly reliable partner in complex metal engineering.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300" }, // Person
  { name: "David Wilson", location: "London, UK", flag: "🇬🇧", text: "The underground tanks they delivered are flawless. Their team works with a level of respect and skill that is rare today.", img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=300" }, // Tank

  // More Global
  { name: "Fatima Zahra", location: "Casablanca, Morocco", flag: "🇲🇦", text: "They turned our industrial challenges into elegant solutions. Their work is as durable as it is impressive.", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300" }, // Industrial
  { name: "Chen Wei", location: "Shanghai, China", flag: "🇨🇳", text: "Superior engineering and a heart for the customer. Adonai is a global leader in metal works.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" }, // Person
  { name: "Sofia Hernandez", location: "Mexico City, Mexico", flag: "🇲🇽", text: "The emotional appeal of their designs is what sets them apart. They build with love and precision.", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300" }, // Person
  { name: "Ahmed Hassan", location: "Cairo, Egypt", flag: "🇪🇬", text: "A truly professional team. Their work on our storage tanks was perfect in every sense of the word.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300" }, // Tank work
  { name: "Yuki Tanaka", location: "Tokyo, Japan", flag: "🇯🇵", text: "The precision of their welds is incredible. They bring a level of discipline to metal work that is world-class.", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=300" }, // Metal work/Welding
  { name: "Amara Diallo", location: "Dakar, Senegal", flag: "🇸🇳", text: "Adonai is more than a company; they are partners in progress. Their metal works are the foundation of our growth.", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=300" }, // Steel structure
];

// --- Components ---

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Global Trust</span>
          <h2 className="text-4xl md:text-5xl mb-4">Voices of Satisfaction</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            From the heart of Ghana to the industrial hubs of Europe and Brazil, our commitment to excellence resonates across the globe.
          </p>
        </div>
      </div>

      {/* Marquee Effect for Testimonials */}
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-6 py-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="inline-block w-[350px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 whitespace-normal shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" referrerPolicy="no-referrer" />
                  <span className="absolute -bottom-1 -right-1 text-xl bg-white rounded-full shadow-sm w-7 h-7 flex items-center justify-center border border-gray-100">
                    {t.flag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary">{t.name}</h4>
                  <p className="text-xs text-primary font-medium">{t.location}</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="mt-6 flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-6 py-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={`dup-${i}`} className="inline-block w-[350px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 whitespace-normal shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" referrerPolicy="no-referrer" />
                  <span className="absolute -bottom-1 -right-1 text-xl bg-white rounded-full shadow-sm w-7 h-7 flex items-center justify-center border border-gray-100">
                    {t.flag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary">{t.name}</h4>
                  <p className="text-xs text-primary font-medium">{t.location}</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="mt-6 flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [dynamicPortfolio, setDynamicPortfolio] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudImgs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        title: doc.data().title || 'Project', 
        category: doc.data().category, 
        img: doc.data().url 
      }));

      // Combine with local images from all portfolio categories
      const localPortfolio: any[] = [];
      (['gates', 'steel-structures', 'underground-tanks', 'surface-tanks', 'filling-station-canopies', 'billboard-frames', 'bugler-proof'] as const).forEach(cat => {
        LOCAL_IMAGES[cat].forEach((filename, idx) => {
          localPortfolio.push({
            id: `local-${cat}-${idx}`,
            title: `${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Project`,
            category: cat,
            img: getLocalImagePath(cat, filename)
          });
        });
      });

      const combined = [...localPortfolio, ...cloudImgs];
      // Filter out banner images for the portfolio
      setDynamicPortfolio(combined.filter(img => img.category !== 'banner'));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'images');
      
      // Fallback to local images
      const localPortfolio: any[] = [];
      (['gates', 'steel-structures', 'underground-tanks', 'surface-tanks', 'filling-station-canopies', 'billboard-frames', 'bugler-proof'] as const).forEach(cat => {
        LOCAL_IMAGES[cat].forEach((filename, idx) => {
          localPortfolio.push({
            id: `local-${cat}-${idx}`,
            title: `${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Project`,
            category: cat,
            img: getLocalImagePath(cat, filename)
          });
        });
      });
      setDynamicPortfolio(localPortfolio);
    });

    return () => unsubscribe();
  }, []);

  const displayPortfolio = dynamicPortfolio.length > 0 ? dynamicPortfolio : PORTFOLIO;

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="font-bold text-secondary">Adonai Admin</span>
          </div>
          <button 
            onClick={() => setShowAdmin(false)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            Back to Website
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CinematicBanner />
      <Services />
      
      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl mb-4">Masterpieces in Metal</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>
            <p className="text-gray-600 max-w-md">
              A showcase of our dedication to precision, durability, and aesthetic excellence in every project we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPortfolio.map((item, i) => (
              <motion.div 
                key={item.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block py-1 px-3 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                    {item.category}
                  </span>
                  <h4 className="text-2xl text-white font-bold">{item.title}</h4>
                  <div className="h-0.5 w-0 bg-white mt-4 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section / Why Choose Us */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1200" 
                  alt="Our Workshop" 
                  className="w-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-3xl -z-0 hidden md:block" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-100 rounded-full -z-10" />
            </motion.div>

            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">About Our Enterprise</span>
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight">Leading the Industry with <span className="text-primary">Precision</span> Engineering</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                At Adonai Metal Works Enterprise, we believe that strength and beauty should go hand in hand. With over 15 years of experience in the metal engineering industry, we have built a reputation for delivering high-quality, durable, and aesthetically pleasing metal works.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: 'Quality Materials', desc: 'We use only the finest grade steel and alloys for maximum durability.', icon: <ShieldCheck className="w-6 h-6" /> },
                  { title: 'Expert Craftsmanship', desc: 'Our team consists of certified engineers and master welders.', icon: <Hammer className="w-6 h-6" /> },
                  { title: 'Timely Delivery', desc: 'We respect your timelines and ensure projects are completed on schedule.', icon: <Truck className="w-6 h-6" /> },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                      <p className="text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="btn-primary">Learn More About Us</a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Contact />
      <Footer onAdminClick={() => setShowAdmin(true)} />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/233502787990" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 md:bottom-28"
        title="Chat on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <ChatBot />
    </div>
  );
}
