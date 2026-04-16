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
}

const Spark: React.FC<SparkProps> = ({ id, originX, originY, velocityX, velocityY, size, color, duration }) => {
  return (
    <motion.div
      key={id}
      initial={{ 
        left: `${originX}vw`, 
        top: `${originY}vh`, 
        opacity: 1,
        scale: 1,
      }}
      animate={{ 
        left: `${originX + velocityX}vw`, 
        top: `${originY + velocityY}vh`,
        opacity: [1, 1, 0],
        scale: [1, 1.5, 0],
      }}
      transition={{ 
        duration, 
        ease: "linear"
      }}
      className="absolute rounded-full z-[60]"
      style={{ 
        width: size, 
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 4}px ${color}`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

const ArcIgnition: React.FC<{ x: number, y: number }> = ({ x, y }) => {
  return (
    <div className="absolute z-[58]" style={{ left: `${x}vw`, top: `${y}vh`, transform: 'translate(-50%, -50%)' }}>
      {/* The "Wide Sun" Core - Decreased size by half */}
      <motion.div
        animate={{ 
          scale: [1, 1.5, 0.9, 1.8, 1],
          opacity: [0.8, 1, 0.7, 1, 0.9],
        }}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="absolute inset-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-90"
      />
      <motion.div
        animate={{ 
          scale: [1, 2, 1.2, 2.5, 1.5],
        }}
        transition={{ duration: 0.05, repeat: Infinity }}
        className="absolute inset-0 w-12 h-12 bg-white rounded-full blur-xl"
      />
      {/* Electric Flicker - Decreased size by half */}
      <motion.div
        animate={{ 
          opacity: [0, 0.7, 0, 1, 0.4],
        }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute inset-0 w-48 h-48 bg-blue-50 rounded-full blur-[75px] mix-blend-screen"
      />
    </div>
  );
};

export const CinematicBanner: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [desktopSlides, setDesktopSlides] = useState<any[][]>([]);
  const [mobileSlides, setMobileSlides] = useState<any[][]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'welding'>('idle');
  const [showText, setShowText] = useState(true);
  const [imagesVisible, setImagesVisible] = useState(true);
  const [sparks, setSparks] = useState<any[]>([]);
  const [arcPoint, setArcPoint] = useState({ x: 50, y: 50 });
  const [isWelding, setIsWelding] = useState(false);
  const [weldingStartTime, setWeldingStartTime] = useState(0);
  const sparkIdRef = useRef(0);
  const isInitialRef = useRef(true);

  // Desktop: Always 2 or 3 images per slide
  const createDesktopSlides = (allImgs: any[]) => {
    const newSlides: any[][] = [];
    let i = 0;
    while (i < allImgs.length) {
      const size = newSlides.length % 2 === 0 ? 3 : 2;
      newSlides.push(allImgs.slice(i, i + size));
      i += size;
    }
    return newSlides;
  };

  // Mobile: Mix of 1 (for portrait) and 2 (for landscape stacking)
  const createMobileSlides = (allImgs: any[]) => {
    const newSlides: any[][] = [];
    let i = 0;
    while (i < allImgs.length) {
      // 70% chance of single image (portrait focus), 30% chance of 2 images (stacking)
      const size = Math.random() > 0.7 ? 2 : 1;
      newSlides.push(allImgs.slice(i, i + size));
      i += size;
    }
    return newSlides;
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
      setDesktopSlides(createDesktopSlides(all));
      setMobileSlides(createMobileSlides(all));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'images');
      
      const localImgs = LOCAL_IMAGES.banner.map((filename, idx) => ({
        id: `local-banner-${idx}`,
        url: getLocalImagePath('banner', filename),
        category: 'banner',
        createdAt: new Date()
      }));
      setDesktopSlides(createDesktopSlides(localImgs));
      setMobileSlides(createMobileSlides(localImgs));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const triggerTransition = useCallback(() => {
    const jointPoints = [
      { x: 30, y: 40 }, { x: 70, y: 40 },
      { x: 50, y: 30 }, { x: 50, y: 70 },
      { x: 25, y: 60 }, { x: 75, y: 60 },
      { x: 40, y: 50 }, { x: 60, y: 50 }
    ];
    const point = jointPoints[Math.floor(Math.random() * jointPoints.length)];
    setArcPoint(point);
    
    setWeldingStartTime(Date.now());
    setIsWelding(true);
    setTransitionPhase('welding');
    
    // Hand-in-hand transition:
    // 1. Start fading in text immediately
    setShowText(true); 

    // 2. Wait a bit, then start fading out images (they overlap)
    setTimeout(() => {
      setImagesVisible(false);
    }, 1000); 

    // 3. Prepare next slide and start fading it in
    setTimeout(() => {
      const activeSlides = isMobile ? mobileSlides : desktopSlides;
      if (activeSlides.length > 0) {
        if (isInitialRef.current) {
          isInitialRef.current = false;
        } else {
          setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
        }
      }
      
      // 4. Fade in new images while text is still visible
      setImagesVisible(true);
      
      // 5. Finally fade out text once images are established
      setTimeout(() => {
        setShowText(false);
      }, 2500);
    }, 2500);
  }, [desktopSlides.length, mobileSlides.length, isMobile]);

  useEffect(() => {
    if (!isWelding) return;

    const totalDuration = 25000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - weldingStartTime;
      const progress = elapsed / totalDuration;

      if (progress >= 1) {
        setIsWelding(false);
        setTimeout(() => {
          setTransitionPhase('idle');
          setSparks([]);
        }, 1000);
        return;
      }

      // Emission peaks during the "burst" phase (around 5s in)
      const burstIntensity = Math.exp(-Math.pow(elapsed - 5000, 2) / 2000000);
      const emissionRate = Math.floor(progress * 100) + 30 + Math.floor(burstIntensity * 150);
      
      const newSparks = Array.from({ length: emissionRate }, () => {
        const targetX = Math.random() * 140 - 20; 
        const targetY = 130; 
        
        const velocityX = targetX - arcPoint.x;
        const velocityY = targetY - arcPoint.y;
        
        const sparkId = ++sparkIdRef.current;
        
        const rand = Math.random();
        let color = '#ffffff'; 
        if (rand < 0.7) color = '#ffffff'; 
        else color = '#fbbf24'; 
        
        return {
          id: sparkId,
          originX: arcPoint.x,
          originY: arcPoint.y,
          velocityX,
          velocityY,
          size: Math.random() * 5 + 2, 
          color,
          duration: Math.random() * 3 + 2,
        };
      });

      setSparks(prev => [...prev.slice(-1200), ...newSparks]);
    }, 100);

    return () => clearInterval(interval);
  }, [isWelding, weldingStartTime, arcPoint.x, arcPoint.y]);

  useEffect(() => {
    // Initial trigger after a short delay to show the text first
    if (transitionPhase === 'idle' && (desktopSlides.length > 0 || mobileSlides.length > 0) && isInitialRef.current) {
      const initialTimer = setTimeout(() => {
        triggerTransition();
      }, 500); // Faster initial load
      return () => clearTimeout(initialTimer);
    }

    const timer = setInterval(() => {
      if (transitionPhase === 'idle') {
        triggerTransition();
      }
    }, 20000); 

    return () => clearInterval(timer);
  }, [transitionPhase, triggerTransition, desktopSlides.length, mobileSlides.length]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-secondary flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const currentSlide = isMobile 
    ? (mobileSlides.length > 0 ? mobileSlides[currentSlideIndex % mobileSlides.length] : [])
    : (desktopSlides.length > 0 ? desktopSlides[currentSlideIndex % desktopSlides.length] : []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pb-20 md:py-0">
      {/* Dynamic Background with Welding Transition */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence>
          {imagesVisible && (
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Mobile Layout: Smart Stacking - Full Bleed */}
              <div className="md:hidden absolute inset-0 w-full h-full flex flex-col">
                {currentSlide.length > 0 && (
                  <div className="relative w-full h-full flex flex-col bg-black">
                    {currentSlide.map((img) => (
                      <div key={img.id} className="relative flex-1 w-full overflow-hidden">
                        <img 
                          src={img.url} 
                          alt="Adonai Metal Works" 
                          className={`w-full h-full ${currentSlide.length === 1 ? 'object-contain' : 'object-cover'} brightness-110 contrast-105`}
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Layout: Original multi-image behavior */}
              <div className="hidden md:flex absolute inset-0 items-center justify-center gap-4 p-4">
                {currentSlide.map((img, idx) => (
                  <motion.div 
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.2, duration: 1.5, ease: "easeOut" }}
                    className="relative flex-1 h-full w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl will-change-[opacity,transform]"
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    <img 
                      src={img.url} 
                      alt="Adonai Metal Works" 
                      className={`relative z-10 w-full h-full object-contain brightness-125 contrast-110 transition-transform duration-700 ${img.url.includes('1776048891420.png') ? 'scale-[1.18] origin-top' : ''}`}
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-20 pointer-events-none" />
      </div>

      {/* Welding Arc Ignition */}
      {transitionPhase === 'welding' && (
        <ArcIgnition x={arcPoint.x} y={arcPoint.y} />
      )}

      {/* Sparks Particles */}
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

      <motion.div 
        animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 md:pt-32 will-change-[opacity,transform]"
      >
        {/* Top Header Section (Badge Only) */}
        <div className="flex items-start justify-between mb-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1] font-display font-bold">
                Where <span className="text-primary relative inline-block">
                  Precision
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-4 md:-bottom-2 left-0 h-4 bg-primary rounded-full"
                  />
                </span> Meets <br />
                <span className="font-serif italic font-normal text-white/90">Architectural</span> Art.
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-sans">
                Adonai Metal Works Enterprise transforms raw steel into enduring legacies. From massive industrial frameworks to bespoke luxury gates, we forge the future of African engineering.
              </p>

              {/* Bottom Banner Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new CustomEvent('open-adonai-chat'))}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/20 transition-all"
                >
                  <Bot className="w-5 h-5" /> Talk to our AI Agent
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#services"
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  Our Expertise <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Hero Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-4 md:col-span-5 w-full lg:mt-12"
          >
            <div className="bg-black/15 backdrop-blur-xl p-5 md:p-8 rounded-[25px] md:rounded-[35px] border border-white/20 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
      </motion.div>

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
