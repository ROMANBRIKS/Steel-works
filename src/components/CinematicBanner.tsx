import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, Bot, Clock, Construction, Layers, ShieldCheck } from 'lucide-react';
import { LOCAL_IMAGES, getLocalImagePath } from '../constants/localImages';

interface SparkProps {
  id: number;
  originX: number;
  originY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  color: string;
  duration: number;
  isDebris?: boolean;
}

const Spark: React.FC<SparkProps> = React.memo(({ id, originX, originY, velocityX, velocityY, size, color, duration, isDebris }) => {
  return (
    <motion.div
      key={id}
      style={{ 
        width: size, 
        height: size,
        boxShadow: isDebris 
          ? `0 0 ${size * 3}px #FFF, 0 0 ${size * 6}px #FBBF24`
          : `0 0 ${size * 5}px ${color}`,
        transform: 'translate(-50%, -50%)',
        backfaceVisibility: 'hidden', // GPU boost
      }}
      initial={{ 
        left: `${originX}vw`, 
        top: `${originY}vh`, 
        opacity: 1,
        scale: isDebris ? 1 : 0.5,
        rotate: 0,
        backgroundColor: '#FFFFFF',
      }}
      animate={{ 
        left: `${originX + velocityX}vw`, 
        // Parabolic arc for fallout: starts at point, shoots slightly up/sideways, then drops heavily
        top: isDebris 
          ? [`${originY}vh`, `${originY + velocityY * 0.4}vh`, `${originY + velocityY + 50}vh`] 
          : `${originY + velocityY + 15}vh`,
        opacity: [1, 1, 0.6, 0],
        scale: isDebris ? [1, 1.4, 0.8, 0.4] : [0.5, 1.2, 0.6, 0],
        rotate: isDebris ? [0, 720, 1440] : 0, // Spiraling motion for chips
        backgroundColor: isDebris 
          ? ['#FFFFFF', '#FEF3C7', '#FBBF24', '#B91C1C'] // Cooling from white-hot to deep red slag
          : ['#FFFFFF', '#E0F2FE', '#FBBF24'],
      }}
      transition={{ 
        duration, 
        ease: isDebris ? "easeIn" : "easeOut"
      }}
      className="absolute rounded-full z-[65]"
    />
  );
});

const ArcIgnition: React.FC<{ x: number, y: number }> = React.memo(({ x, y }) => {
  return (
    <div className="absolute z-[70]" style={{ left: `${x}vw`, top: `${y}vh`, transform: 'translate(-50%, -50%)', backfaceVisibility: 'hidden' }}>
      {/* The Intense Electric Core */}
      <motion.div
        animate={{ 
          scale: [1, 2, 1.5, 2.5, 1.2],
          opacity: [1, 0.8, 1, 0.9, 1],
        }}
        transition={{ duration: 0.05, repeat: Infinity }}
        className="absolute inset-0 w-16 h-16 bg-white rounded-full blur-md shadow-[0_0_50px_#fff]"
      />
      {/* High-voltage Blue Flicker */}
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1, 1.8, 1.3],
          opacity: [0.5, 1, 0.6, 1, 0.5],
        }}
        transition={{ duration: 0.08, repeat: Infinity }}
        className="absolute inset-0 w-32 h-32 bg-cyan-300 rounded-full blur-2xl mix-blend-screen overflow-visible"
      />
      {/* Wide Exposure Flash */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.4, 0.2, 0.5, 0.1],
        }}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="absolute inset-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px] opacity-20 pointer-events-none"
      />
    </div>
  );
});

export const CinematicBanner: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [desktopSlides, setDesktopSlides] = useState<any[][]>([]);
  const [mobileSlides, setMobileSlides] = useState<any[][]>([]);
  const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'welding'>('idle');
  const [showContent, setShowContent] = useState(true);
  const [sparks, setSparks] = useState<any[]>([]);
  const [arcPoint, setArcPoint] = useState({ x: 50, y: 50 });
  const [isWelding, setIsWelding] = useState(false);
  const [weldingStartTime, setWeldingStartTime] = useState(0);
  const sparkIdRef = useRef(0);
  const isInitialRef = useRef(true);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Image preloader for the next TWO slides to ensure buffer
  useEffect(() => {
    const slides = isMobile ? mobileSlides : desktopSlides;
    const currentIndex = isMobile ? currentMobileIndex : currentDesktopIndex;
    
    if (slides.length > 0) {
      // Preload next 2 indices to be extra safe
      [1, 2].forEach(offset => {
        const nextIndex = (currentIndex + offset) % slides.length;
        const nextSlide = slides[nextIndex];
        
        if (nextSlide && nextSlide.length > 0) {
          nextSlide.forEach((imgData: any) => {
            if (!preloadedImages.current.has(imgData.url)) {
              const img = new Image();
              img.src = imgData.url;
              img.onload = () => preloadedImages.current.add(imgData.url);
            }
          });
        }
      });
    }
  }, [currentDesktopIndex, currentMobileIndex, desktopSlides, mobileSlides, isMobile]);

  // Dedicated One-Image logic for both Desktop and Mobile
  const createSingleImageSlides = (allImgs: any[]) => {
    return allImgs.map(img => [img]);
  };

  useEffect(() => {
    const q = query(
      collection(db, 'images'),
      where('category', '==', 'banner'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudImgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const localImgs = LOCAL_IMAGES.banner.map((filename, idx) => ({
        id: `local-banner-${idx}`,
        url: getLocalImagePath('banner', filename),
        category: 'banner',
        createdAt: new Date()
      }));

      const all = [...localImgs, ...cloudImgs];
      setDesktopSlides(createSingleImageSlides(all));
      setMobileSlides(createSingleImageSlides(all));
      
      // Preload first few images immediately
      (all as any[]).slice(0, 3).forEach(imgData => {
        const img = new Image();
        img.src = imgData.url;
        img.onload = () => preloadedImages.current.add(imgData.url);
      });

      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'images');
      
      const localImgs = LOCAL_IMAGES.banner.map((filename, idx) => ({
        id: `local-banner-${idx}`,
        url: getLocalImagePath('banner', filename),
        category: 'banner',
        createdAt: new Date()
      }));
      setDesktopSlides(createSingleImageSlides(localImgs));
      setMobileSlides(createSingleImageSlides(localImgs));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const triggerTransition = useCallback(() => {
    if (isMobile) {
      if (mobileSlides.length > 0) {
        setCurrentMobileIndex((prev) => (prev + 1) % mobileSlides.length);
      }
    } else {
      if (desktopSlides.length > 0) {
        setCurrentDesktopIndex((prev) => (prev + 1) % desktopSlides.length);
      }
    }
  }, [mobileSlides.length, desktopSlides.length, isMobile]);

  useEffect(() => {
    // 17-second cycle: 15s showing/growing + 2s fade out
    const timer = setInterval(triggerTransition, 17000);
    return () => clearInterval(timer);
  }, [triggerTransition]);

  // Sync welding effects with the image cycle
  useEffect(() => {
    if (loading) return;

    // Phase 1: Reset for start of new image
    setShowContent(true);
    setTransitionPhase('idle');
    setSparks([]);

    // Phase 2: Start Welding (+30-35% of zoom, approx 5 seconds in)
    const weldingStartTimer = setTimeout(() => {
      setShowContent(false);
      setTransitionPhase('welding');
      setIsWelding(true);
      setWeldingStartTime(Date.now());
      setArcPoint({ 
        x: 40 + Math.random() * 20, 
        y: 40 + Math.random() * 20 
      });
    }, 5000);

    // Phase 3: Stop Welding (lasts 6 seconds)
    const weldingEndTimer = setTimeout(() => {
      setTransitionPhase('idle');
      setIsWelding(false);
    }, 11000);

    return () => {
      clearTimeout(weldingStartTimer);
      clearTimeout(weldingEndTimer);
    };
  }, [currentDesktopIndex, currentMobileIndex, loading]);

  // Spark and Slag Generator Logic - Targeting 1000+ persistent particles
  useEffect(() => {
    if (transitionPhase !== 'welding') return;

    const interval = setInterval(() => {
      // 35 particles per burst for extreme density
      const newSparks = Array.from({ length: 35 }).map(() => {
        const isDebris = Math.random() > 0.5; // 50% are heavy fallout chips/slag
        
        return {
          id: sparkIdRef.current++,
          originX: arcPoint.x,
          originY: arcPoint.y,
          // Debris has more lateral spread but less speed than light sparks
          velocityX: (Math.random() - 0.5) * (isDebris ? 45 : 75),
          // Debris shoots up slightly then falls (handled in animate keyframes)
          velocityY: (Math.random() - 1) * (isDebris ? 25 : 40),
          size: isDebris ? Math.random() * 5 + 1.5 : Math.random() * 2 + 0.3,
          color: isDebris ? '#FBBF24' : '#E0F2FE',
          duration: isDebris ? 1.0 + Math.random() * 1.5 : 0.4 + Math.random() * 0.8,
          isDebris
        };
      });

      // Maintain up to 1200 particles for that "thick glass" requirement density
      setSparks(prev => [...prev.slice(-1200), ...newSparks]);
    }, 45);

    return () => clearInterval(interval);
  }, [transitionPhase, arcPoint.x, arcPoint.y]);

  if (loading) {
    return (
      <section className="h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </section>
    );
  }

  const currentDesktopSlide = desktopSlides.length > 0 ? desktopSlides[currentDesktopIndex % desktopSlides.length] : [];
  const currentMobileSlide = mobileSlides.length > 0 ? mobileSlides[currentMobileIndex % mobileSlides.length] : [];

  return (
    <section id="home" className="relative min-h-[900px] md:h-screen md:min-h-[700px] flex items-center justify-center bg-black overflow-hidden pt-20 md:pt-0">
      {/* Static Welding Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80" 
          alt="" 
          className="w-full h-full object-cover opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      </div>

      {/* Floating Images with Sequential Exponential Zoom & Fade */}
      <div className={`absolute inset-0 z-10 flex ${isMobile ? 'items-center -translate-y-[20%]' : 'items-center'} justify-center overflow-hidden pointer-events-none`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isMobile ? `mob-${currentMobileIndex}` : `desk-${currentDesktopIndex}`}
            initial={{ 
              opacity: 0, 
              scale: 0.1, 
            }}
            animate={{ 
              opacity: 1, 
              scale: 4, 
            }}
            exit={{ 
              opacity: 0,
              scale: 5, 
              transition: { duration: 2, ease: "easeIn" } // Explicit 2-second fade out as requested
            }}
            transition={{ 
              opacity: { duration: 2, ease: "easeOut" }, 
              scale: { duration: 15, ease: "linear" } 
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center will-change-[transform,opacity] [backface-visibility:hidden]"
          >
            {(isMobile ? currentMobileSlide : currentDesktopSlide).map((img) => (
              <div key={img.id} className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <img 
                  src={img.url} 
                  alt="Adonai Metal Works Project" 
                  className="w-full h-full object-contain brightness-110 contrast-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/15" />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        {/* Protection Gradients for Logo and Content - Ensures visibility and survival */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-20 pointer-events-none" />
      </div>

      {/* Welding Action */}
      {transitionPhase === 'welding' && (
        <ArcIgnition x={arcPoint.x} y={arcPoint.y} />
      )}
      <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden will-change-transform">
        {sparks.map(s => <Spark key={s.id} {...s} />)}
      </div>

      {/* Decorative Geometric Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: 360,
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 border border-primary/10 rounded-full"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] border border-primary/5 rounded-full"
        />
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 w-full pt-12 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content - Synced with Welding Phase */}
          <motion.div 
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-8 text-left will-change-[opacity,transform]"
          >
            {/* Top Header Section (Badge Only) */}
            <div className="flex items-start justify-between mb-8 md:mb-12">
              <div className="flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-primary text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase w-fit shadow-lg shadow-primary/30"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Excellence in Metal Engineering
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-6xl lg:text-7xl text-white mb-6 md:mb-8 leading-[1.1] font-display font-bold">
                Where <span className="text-primary relative inline-block">
                  Precision
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-1 md:-bottom-2 left-0 h-1 md:h-2 bg-primary rounded-full"
                  />
                </span> Meets <br />
                <span className="font-serif italic font-normal text-white/90">Architectural</span> Art.
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-sans">
                Adonai Metal Works Enterprise transforms raw steel into enduring legacies. From massive industrial frameworks to bespoke luxury gates, we forge the future of African engineering.
              </p>

              {/* Bottom Banner Buttons - Stacked on mobile for visibility */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 md:gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new CustomEvent('open-adonai-chat'))}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/20 transition-all"
                >
                  <Bot className="w-5 h-5" /> Talk to our AI Agent
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#services"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  Our Expertise <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Stats Card - Permanent and Transparent */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-4 md:col-span-5 w-full lg:mt-12 z-20"
          >
            <div className="bg-transparent p-5 md:p-8 rounded-[25px] md:rounded-[35px] border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-white font-display font-bold text-xl md:text-2xl mb-5 md:mb-8 relative z-10">Our Impact</h3>
              <div className="space-y-5 md:space-y-8 relative z-10">
                {[
                  { label: 'YEARS OF MASTERY', value: '15+', icon: <Clock className="w-5 h-5" /> },
                  { label: 'PROJECTS DELIVERED', value: '500+', icon: <Construction className="w-5 h-5" /> },
                  { label: 'GLOBAL PARTNERS', value: '25+', icon: <Layers className="w-5 h-5" /> },
                  { label: 'CLIENT SATISFACTION', value: '100%', icon: <ShieldCheck className="w-5 h-5" /> },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/10 shadow-inner">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-xl md:text-3xl font-bold text-white leading-none mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-[8px] md:text-[10px] font-extrabold text-gray-400 tracking-[0.25em] uppercase">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] text-white font-bold tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};
