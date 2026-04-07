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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    id: 'tanks',
    title: 'Industrial Tanks',
    description: 'Underground, surface, and factory tanks built to highest safety standards.',
    icon: <Droplets className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gates-railings',
    title: 'Gates & Railings',
    description: 'Modern main gates, bugler proofs, and stainless steel barristers.',
    icon: <ShieldCheck className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'canopies',
    title: 'Filling Station Canopies',
    description: 'Professional canopy construction and maintenance for fuel stations.',
    icon: <Layers className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1542362567-b051c63b9a27?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'maintenance',
    title: 'Repairs & Maintenance',
    description: 'Comprehensive renovation and repair services for all metal works.',
    icon: <Wrench className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'consultancy',
    title: 'Expert Consultancy',
    description: 'Professional advice and planning for your metal engineering projects.',
    icon: <Construction className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-white font-bold text-xl">AM</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-bold text-xl leading-none ${isScrolled ? 'text-secondary' : 'text-white'}`}>ADONAI</span>
            <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${isScrolled ? 'text-primary' : 'text-white/80'}`}>Metal Works</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-semibold transition-colors hover:text-primary ${isScrolled ? 'text-secondary' : 'text-white'}`}
            >
              {item}
            </a>
          ))}
          <a href="#contact" className="btn-primary py-2 px-5 text-sm">
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
            <a href="#contact" className="btn-primary w-full text-center">Get a Quote</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-secondary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1920" 
          alt="Metal Works Background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-transparent to-secondary/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-bold tracking-wider uppercase mb-6">
            Excellence in Delivery
          </span>
          <h1 className="text-5xl md:text-8xl text-white mb-6 leading-tight">
            Engineering <span className="text-primary">Strength</span>,<br />
            Forging <span className="text-primary italic">Future</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Adonai Metal Works Enterprise provides premium metal engineering solutions, from industrial steel structures to bespoke residential gates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#services" className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
              Explore Services <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="#portfolio" className="btn-secondary bg-white/10 backdrop-blur-sm border border-white/20 text-lg px-10 py-4 w-full sm:w-auto hover:bg-white/20">
              View Our Work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-10 left-0 right-0 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {[
            { label: 'Years Experience', value: '15+' },
            { label: 'Projects Completed', value: '500+' },
            { label: 'Expert Engineers', value: '25+' },
            { label: 'Happy Clients', value: '100%' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-primary tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call Us</h4>
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

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-none">ADONAI</span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary">Metal Works</span>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed mb-8">
              Excellence in delivery. We are leaders in metal engineering and construction, providing durable and aesthetic solutions for over 15 years.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
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

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      
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

      <Contact />
      <Footer />
    </div>
  );
}
