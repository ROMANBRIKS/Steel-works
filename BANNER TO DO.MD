# Banner Optimization To-Do List

## Banner Code Backup (Restore Point: 2026-04-16)
*This section preserves the code state before removing the welding action and implementing the floating image logic.*

```tsx
// WELDING ACTION (ON ICE)
// 1. ArcIgnition component
// 2. Spark particle system logic
// 3. triggerTransition phase switching ('welding' state)

// CURRENT RENDERER (AS OF BACKUP)
// Uses independently managed mobileSlides (1-2 imgs) and desktopSlides (2-3 imgs).
// Has a static Unsplash background as the base layer.
```

## User Requirements & Feedback
- **Mobile Transition:** Simplify transitions, remove desktop-specific effects (welding/sparks) for mobile, and implement faster cross-fades.
- **Image Display:** 
    - Use one image per session/slide (not stacks).
    - Portrait/Vertical images: Enlarge/squeeze to fit the banner screen without being "zoomed out."
    - Landscape/Horizontal images: Stack them on top of each other to fit the vertical screen.
- **Separation:** Ensure mobile changes do NOT affect the desktop version. Desktop should remain "good enough" with its original cinematic effects.
- **Seamlessness:** Improve loading and animation smoothness on mobile. Eliminate the "black screen gap" during transitions.

## Technical Solutions (from User Guide)
1. **Static Background + Floating Images:** Use the original welding placeholder as a permanent background. User images float on top.
2. **"Smart Scale" Animation:** 
   - Start small/invisible.
   - Expand slowly on screen.
   - Fade out when they reach 60-70% size.
   - Large images can cover more but follow a similar slow-drift logic.
3. **Fluid Sizing:** Use `width: 100%` and `height: auto` for natural scaling.
4. **Aspect Ratio Boxes:** Use a container with `padding-bottom` (e.g., 16:9 or 4:3) and `object-fit: cover` to maintain shape.
5. **Responsive Images:** Use the `<picture>` element to serve different crops for mobile vs. desktop.
6. **Background Positioning:** Use `background-size: cover` and `background-position: center` for decorative banners.
7. **Object-Fit:** Use `object-fit: cover` to fill the banner without distortion.

## Agent Findings & Response
- **New Architecture:** Implementing a static background (welding scene) with floating user images. This solves the "black gap" issue and allows smaller/portrait images to fit perfectly.
- **Current State:** The banner logic currently attempts to separate mobile and desktop using independent slide arrays and indices.
- **Security Score:** Firestore rules are rated **5/5 (Secure)**.
- **Identified Issue:** The "mixing" of versions occurred due to shared styling classes and overlapping transition logic.
- **Proposed Fix:** Implement **Option #2 (Aspect Ratio Boxes)** and **Option #5 (Object-Fit)** from the user guide to stabilize the mobile layout and ensure full-bleed coverage without distortion.

## Pending Tasks
- [x] Implement Static Welding Background (Unsplash Placeholder).
- [x] Make 'Our Impact' stats card permanent and transparent.
- [x] Implement 'Deep Zoom' (0.05 -> 5.0) transition.
- [x] Update timing to 15s expansion + 2s fade.
- [x] Ensure absolute centering (starts directly in the middle).
- [x] Use all 46 project images in an infinite loop.
- [x] Implement background pre-loading to prevent 'blocky' or 'invisible' image loading.
- [ ] Update `AnimatePresence` to only transition the floating images.
- [ ] Refine floating image containers to use `object-contain` for portrait shots on top of the background.
- [x] Delete old banner images.
- [x] Re-upload 18+ new images.
- [ ] Implement "Smart Scale" one-image-at-a-time transition logic.
- [ ] Suspend Welding Logic (Move to restore point).
- [ ] Final verification of "Hand-in-Hand" transition timing to ensure zero black-screen gaps.
- [ ] Verify complete isolation between `md:block` (Desktop) and `md:hidden` (Mobile) rendering paths.
