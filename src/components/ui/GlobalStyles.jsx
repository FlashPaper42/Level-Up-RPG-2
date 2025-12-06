import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    body {
      margin: 0;
      font-family: 'VT323', monospace;
      overflow: hidden;
      background-color: #1c1917;
      user-select: none;
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    /* Animations */
    @keyframes toast-slide {
      0% { transform: translate(-50%, 150%); opacity: 0; }
      10% { transform: translate(-50%, 0); opacity: 1; }
      85% { transform: translate(-50%, 0); opacity: 1; }
      100% { transform: translate(-50%, 150%); opacity: 0; }
    }

    /* Achievement Toast Animation with Happy Dance */
    @keyframes achievement-toast {
      0% { transform: translate(-50%, 150%); opacity: 0; }
      8% { transform: translate(-50%, 0); opacity: 1; }
      /* Happy dance/shake phase */
      12% { transform: translate(-50%, 0) rotate(-2deg) scale(1.02); }
      16% { transform: translate(-50%, -5px) rotate(2deg) scale(1.05); }
      20% { transform: translate(-50%, 0) rotate(-2deg) scale(1.02); }
      24% { transform: translate(-50%, -3px) rotate(1deg) scale(1.03); }
      28% { transform: translate(-50%, 0) rotate(0deg) scale(1); }
      /* Hold phase */
      82% { transform: translate(-50%, 0); opacity: 1; }
      100% { transform: translate(-50%, 150%); opacity: 0; }
    }
    .animate-achievement-toast {
      animation: achievement-toast 6s ease-in-out;
    }

    @keyframes shake-flipped { 
        0%, 100% { transform: translateX(0) rotateY(180deg); } 
        25% { transform: translateX(-5px) rotateY(180deg); } 
        75% { transform: translateX(5px) rotateY(180deg); } 
    }
    .animate-shake-flipped { animation: shake-flipped 0.4s ease-in-out; }

    @keyframes scroll-left {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-scroll-left { animation: scroll-left 60s linear infinite; }
    
    @keyframes rainbow { 
        0% { color: #ff0000; } 15% { color: #ff7f00; } 30% { color: #ffff00; } 
        45% { color: #00ff00; } 60% { color: #0000ff; } 75% { color: #4b0082; } 
        90% { color: #8f00ff; } 100% { color: #ff0000; }
    }
    .text-rainbow { animation: rainbow 2s linear infinite; }

    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .animate-bob { animation: bob 2s ease-in-out infinite; }

    @keyframes knockback {
        0% { transform: scale(1) rotate(0deg); filter: none; }
        10% { transform: scale(0.9) rotate(-5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5) brightness(0.8); } 
        30% { transform: scale(0.85) rotate(5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5) brightness(0.8); }
        100% { transform: scale(1) rotate(0deg); filter: none; }
    }
    .animate-knockback { animation: knockback 0.4s ease-out forwards; }
    
    @keyframes shake { 
        0%, 100% { transform: translateX(0); } 
        25% { transform: translateX(-5px); } 
        75% { transform: translateX(5px); } 
    }
    .animate-shake { animation: shake 0.2s ease-in-out 3; }

    /* 3D Transform Classes */
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }

    /* Slider Styling */
    input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%;
        background: #FACC15; border: 2px solid #FFFFFF; cursor: pointer; margin-top: -8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    input[type=range]::-webkit-slider-runnable-track {
        width: 100%; height: 8px; cursor: pointer; background: #44403C;
        border-radius: 4px; border: 1px solid #78716C;
    }
    
    .gem-socket {
        position: absolute; top: -16px; left: 50%; transform: translateX(-50%); width: 32px; height: 32px;
        background: #222; border: 2px solid #FFD700; border-radius: 50%; z-index: 50;
        display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.5);
    }
    .gem-stone {
        width: 18px; height: 18px; border-radius: 2px; transform: rotate(45deg);
        box-shadow: inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.5), 0 0 4px currentColor;
        border: 1px solid rgba(0,0,0,0.5);
    }
    
    /* Card glow and border styles */
    .selected-card-glow {
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
    }
    
    .border-wood { border-color: #8B4513 !important; }
    .border-stone { border-color: #808080 !important; }
    .border-gold { border-color: #FFD700 !important; }
    .border-iron { border-color: #C0C0C0 !important; }
    .border-emerald { border-color: #50C878 !important; }
    .border-diamond { border-color: #00CED1 !important; }
    .border-netherite { border-color: #4A4A4A !important; }
    
    /* Rainbow ring animation for verified parents */
    @keyframes rainbow-ring {
        0% { box-shadow: 0 0 0 4px #ff0000, 0 0 15px #ff0000; }
        14% { box-shadow: 0 0 0 4px #ff7f00, 0 0 15px #ff7f00; }
        28% { box-shadow: 0 0 0 4px #ffff00, 0 0 15px #ffff00; }
        42% { box-shadow: 0 0 0 4px #00ff00, 0 0 15px #00ff00; }
        57% { box-shadow: 0 0 0 4px #0000ff, 0 0 15px #0000ff; }
        71% { box-shadow: 0 0 0 4px #4b0082, 0 0 15px #4b0082; }
        85% { box-shadow: 0 0 0 4px #8f00ff, 0 0 15px #8f00ff; }
        100% { box-shadow: 0 0 0 4px #ff0000, 0 0 15px #ff0000; }
    }
    .ring-rainbow {
        animation: rainbow-ring 3s linear infinite;
    }
    
    /* Border Effect Animations for Skill Cards */
    
    /* Rainbow Border */
    @keyframes border-rainbow {
        0% { border-color: #ff0000; box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
        14% { border-color: #ff7f00; box-shadow: 0 0 20px #ff7f00, 0 0 40px #ff7f00; }
        28% { border-color: #ffff00; box-shadow: 0 0 20px #ffff00, 0 0 40px #ffff00; }
        42% { border-color: #00ff00; box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00; }
        57% { border-color: #0000ff; box-shadow: 0 0 20px #0000ff, 0 0 40px #0000ff; }
        71% { border-color: #4b0082; box-shadow: 0 0 20px #4b0082, 0 0 40px #4b0082; }
        85% { border-color: #8f00ff; box-shadow: 0 0 20px #8f00ff, 0 0 40px #8f00ff; }
        100% { border-color: #ff0000; box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
    }
    .border-effect-rainbow {
        animation: border-rainbow 3s linear infinite;
    }
    
    /* Gradient Sweep */
    @keyframes border-gradient {
        0% { 
            border-image: linear-gradient(0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1;
            box-shadow: 0 0 20px #ff6b6b;
        }
        25% { 
            border-image: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1;
            box-shadow: 0 0 20px #4ecdc4;
        }
        50% { 
            border-image: linear-gradient(180deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1;
            box-shadow: 0 0 20px #45b7d1;
        }
        75% { 
            border-image: linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1;
            box-shadow: 0 0 20px #96ceb4;
        }
        100% { 
            border-image: linear-gradient(360deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1;
            box-shadow: 0 0 20px #ff6b6b;
        }
    }
    .border-effect-gradient {
        animation: border-gradient 3s linear infinite;
    }
    
    /* Particle Sparkle */
    @keyframes border-sparkle {
        0%, 100% { 
            box-shadow: 
                0 0 20px var(--border-color, #FFD700),
                10px 10px 5px rgba(255, 255, 255, 0.8),
                -10px -10px 5px rgba(255, 255, 255, 0.8);
        }
        25% { 
            box-shadow: 
                0 0 20px var(--border-color, #FFD700),
                -10px 10px 5px rgba(255, 255, 255, 0.8),
                10px -10px 5px rgba(255, 255, 255, 0.8);
        }
        50% { 
            box-shadow: 
                0 0 20px var(--border-color, #FFD700),
                0 15px 5px rgba(255, 255, 255, 0.8),
                0 -15px 5px rgba(255, 255, 255, 0.8);
        }
        75% { 
            box-shadow: 
                0 0 20px var(--border-color, #FFD700),
                15px 0 5px rgba(255, 255, 255, 0.8),
                -15px 0 5px rgba(255, 255, 255, 0.8);
        }
    }
    .border-effect-sparkle {
        animation: border-sparkle 1.5s linear infinite;
    }
    
    /* Electric/Lightning */
    @keyframes border-electric {
        0%, 100% { 
            box-shadow: 
                0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 30px #00ffff,
                2px 2px 2px rgba(255, 255, 255, 0.9);
            filter: brightness(1);
        }
        10%, 20%, 30%, 40% {
            box-shadow: 
                0 0 5px #00ffff,
                0 0 10px #00ffff,
                0 0 15px #00ffff;
            filter: brightness(1.3);
        }
        15%, 25%, 35%, 45% {
            box-shadow: 
                0 0 15px #00ffff,
                0 0 30px #00ffff,
                0 0 45px #00ffff,
                -2px -2px 2px rgba(255, 255, 255, 0.9);
            filter: brightness(1.5);
        }
    }
    .border-effect-electric {
        animation: border-electric 1s linear infinite;
        border-color: #00ffff;
    }
    
    /* Fire/Flame */
    @keyframes border-fire {
        0%, 100% { 
            box-shadow: 
                0 0 20px #ff4500,
                0 0 40px #ff8c00,
                0 0 60px #ffd700;
            filter: hue-rotate(0deg);
        }
        25% { 
            box-shadow: 
                0 0 30px #ff8c00,
                0 0 50px #ffd700,
                0 0 70px #ff4500;
            filter: hue-rotate(5deg);
        }
        50% { 
            box-shadow: 
                0 0 25px #ffd700,
                0 0 45px #ff4500,
                0 0 65px #ff8c00;
            filter: hue-rotate(-5deg);
        }
        75% { 
            box-shadow: 
                0 0 35px #ff4500,
                0 0 55px #ff8c00,
                0 0 75px #ffd700;
            filter: hue-rotate(5deg);
        }
    }
    .border-effect-fire {
        animation: border-fire 1s ease-in-out infinite;
        border-color: #ff4500;
    }
    
    /* Frost/Ice */
    @keyframes border-frost {
        0%, 100% { 
            box-shadow: 
                0 0 20px #00ffff,
                0 0 40px #87ceeb,
                inset 0 0 10px rgba(255, 255, 255, 0.3);
            filter: brightness(1);
        }
        50% { 
            box-shadow: 
                0 0 30px #87ceeb,
                0 0 50px #00ffff,
                inset 0 0 20px rgba(255, 255, 255, 0.5);
            filter: brightness(1.2);
        }
    }
    .border-effect-frost {
        animation: border-frost 3s ease-in-out infinite;
        border-color: #87ceeb;
    }
    
    /* Shadow/Dark Aura */
    @keyframes border-shadow {
        0%, 100% { 
            box-shadow: 
                0 0 20px #4b0082,
                0 0 40px #2f1847,
                0 0 60px rgba(0, 0, 0, 0.8);
            filter: contrast(1.1);
        }
        50% { 
            box-shadow: 
                0 0 30px #2f1847,
                0 0 50px #4b0082,
                0 0 70px rgba(0, 0, 0, 0.9);
            filter: contrast(1.2);
        }
    }
    .border-effect-shadow {
        animation: border-shadow 2s ease-in-out infinite;
        border-color: #4b0082;
    }
    
    /* Lifestream - Swirling emerald energy tendrils */
    @keyframes border-lifestream {
        0% { 
            box-shadow: 
                0 0 20px #50C878,
                5px 5px 15px #3cb371,
                -5px -5px 15px #2e8b57,
                10px -10px 20px rgba(80, 200, 120, 0.6),
                -10px 10px 20px rgba(60, 179, 113, 0.6);
            filter: brightness(1) hue-rotate(0deg);
        }
        25% { 
            box-shadow: 
                0 0 25px #3cb371,
                -5px 10px 15px #50C878,
                10px -5px 15px #2e8b57,
                -10px -10px 20px rgba(60, 179, 113, 0.6),
                10px 10px 20px rgba(80, 200, 120, 0.6);
            filter: brightness(1.1) hue-rotate(5deg);
        }
        50% { 
            box-shadow: 
                0 0 30px #2e8b57,
                -10px -5px 15px #3cb371,
                5px 10px 15px #50C878,
                10px 10px 20px rgba(46, 139, 87, 0.6),
                -10px -10px 20px rgba(80, 200, 120, 0.6);
            filter: brightness(1.2) hue-rotate(-5deg);
        }
        75% { 
            box-shadow: 
                0 0 25px #50C878,
                10px -5px 15px #2e8b57,
                -5px 5px 15px #3cb371,
                -10px 10px 20px rgba(80, 200, 120, 0.6),
                10px -10px 20px rgba(46, 139, 87, 0.6);
            filter: brightness(1.1) hue-rotate(5deg);
        }
        100% { 
            box-shadow: 
                0 0 20px #50C878,
                5px 5px 15px #3cb371,
                -5px -5px 15px #2e8b57,
                10px -10px 20px rgba(80, 200, 120, 0.6),
                -10px 10px 20px rgba(60, 179, 113, 0.6);
            filter: brightness(1) hue-rotate(0deg);
        }
    }
    .border-effect-lifestream {
        animation: border-lifestream 3s ease-in-out infinite;
        border-color: #50C878;
    }
    
    /* Chevron Ebb and Flow Animation - Enhanced for curved carousel */
    @keyframes chevron-float {
        0%, 100% { transform: translateX(0) translateY(0); opacity: 0.8; }
        50% { transform: translateX(-4px) translateY(-2px); opacity: 1; }
    }
    @keyframes chevron-float-right {
        0%, 100% { transform: translateX(0) translateY(0); opacity: 0.8; }
        50% { transform: translateX(4px) translateY(-2px); opacity: 1; }
    }
    .animate-chevron-left {
        animation: chevron-float 2s ease-in-out infinite;
    }
    .animate-chevron-right {
        animation: chevron-float-right 2s ease-in-out infinite;
    }
    
    /* Spinning Aura Animation for Battle Mob Display */
    @keyframes spin-aura {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .animate-spin-aura {
        animation: spin-aura 4s linear infinite;
    }
    
    /* Aura Circle Border Effects */
    .aura-rainbow {
        border: 4px solid transparent;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff, #ff0000) border-box;
    }
    
    .aura-frost {
        border: 4px solid #87ceeb;
        box-shadow: 0 0 20px #00ffff, 0 0 40px #87ceeb, inset 0 0 10px rgba(255, 255, 255, 0.3);
    }
    
    .aura-shadow {
        border: 4px solid #4b0082;
        box-shadow: 0 0 20px #4b0082, 0 0 40px #2f1847, 0 0 60px rgba(0, 0, 0, 0.8);
    }
    
    .aura-lava {
        border: 4px solid #ff4500;
        box-shadow: 0 0 20px #ff4500, 0 0 40px #ff8c00, 0 0 60px #ffd700;
    }
    
    .aura-gradient {
        border: 4px solid transparent;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) border-box;
    }
    
    .aura-sparkle {
        border: 4px solid #FFD700;
        box-shadow: 0 0 20px #FFD700, 10px 10px 5px rgba(255, 255, 255, 0.8), -10px -10px 5px rgba(255, 255, 255, 0.8);
    }
    
    .aura-plasma {
        border: 4px solid #00ffff;
        box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    }
    
    .aura-nature {
        border: 4px solid #50C878;
        box-shadow: 0 0 20px #50C878, 0 0 40px #3cb371, inset 0 0 10px rgba(80, 200, 120, 0.3);
    }
    
    /* New Achievement-Unlocked Border Effects */
    
    /* Live Wire - Electric sparks shooting out */
    @keyframes border-livewire {
        0%, 100% { 
            box-shadow: 
                0 0 15px #ffff00,
                3px 3px 8px rgba(255, 255, 0, 0.9),
                -3px -3px 8px rgba(255, 255, 0, 0.9),
                8px -8px 4px rgba(255, 255, 255, 0.8),
                -8px 8px 4px rgba(255, 255, 255, 0.8);
            filter: brightness(1.2);
        }
        10% {
            box-shadow: 
                0 0 25px #ffff00,
                -5px 5px 12px rgba(255, 255, 0, 0.9),
                5px -5px 12px rgba(255, 255, 0, 0.9),
                12px 12px 6px rgba(255, 255, 255, 0.9),
                -12px -12px 6px rgba(255, 255, 255, 0.9);
            filter: brightness(1.5);
        }
        20% {
            box-shadow: 
                0 0 15px #ffff00,
                5px -5px 8px rgba(255, 255, 0, 0.9),
                -5px 5px 8px rgba(255, 255, 0, 0.9),
                -8px 8px 4px rgba(255, 255, 255, 0.8),
                8px -8px 4px rgba(255, 255, 255, 0.8);
            filter: brightness(1.2);
        }
        35%, 65% {
            box-shadow: 
                0 0 20px #ffff00,
                0 10px 10px rgba(255, 255, 0, 0.9),
                0 -10px 10px rgba(255, 255, 0, 0.9);
            filter: brightness(1.3);
        }
    }
    .border-effect-livewire {
        animation: border-livewire 1.2s linear infinite;
        border-color: #ffff00;
    }
    
    /* Void/Cosmic - Stars and galaxies */
    @keyframes border-void {
        0%, 100% { 
            box-shadow: 
                0 0 20px #4b0082,
                0 0 40px #8b00ff,
                inset 0 0 15px rgba(138, 43, 226, 0.4),
                5px 5px 3px rgba(255, 255, 255, 0.8),
                -8px -8px 3px rgba(255, 255, 255, 0.6),
                10px -10px 3px rgba(255, 255, 255, 0.4);
            filter: brightness(1);
        }
        33% { 
            box-shadow: 
                0 0 25px #8b00ff,
                0 0 45px #4b0082,
                inset 0 0 20px rgba(75, 0, 130, 0.5),
                -5px 8px 3px rgba(255, 255, 255, 0.8),
                10px -5px 3px rgba(255, 255, 255, 0.6),
                -10px -10px 3px rgba(255, 255, 255, 0.4);
            filter: brightness(1.1);
        }
        66% { 
            box-shadow: 
                0 0 30px #4b0082,
                0 0 50px #8b00ff,
                inset 0 0 18px rgba(138, 43, 226, 0.45),
                8px -8px 3px rgba(255, 255, 255, 0.8),
                -5px 5px 3px rgba(255, 255, 255, 0.6),
                10px 10px 3px rgba(255, 255, 255, 0.4);
            filter: brightness(1.15);
        }
    }
    .border-effect-void {
        animation: border-void 4s ease-in-out infinite;
        border-color: #8b00ff;
    }
    
    /* Toxic/Acid - Dripping corrosive effect */
    @keyframes border-toxic {
        0%, 100% { 
            box-shadow: 
                0 0 20px #39ff14,
                0 5px 25px #7fff00,
                0 -2px 15px #32cd32,
                inset 0 3px 10px rgba(57, 255, 20, 0.3);
            filter: brightness(1) saturate(1.2);
        }
        25% { 
            box-shadow: 
                0 0 25px #7fff00,
                0 8px 30px #39ff14,
                0 0 15px #32cd32,
                inset 0 5px 15px rgba(127, 255, 0, 0.4);
            filter: brightness(1.1) saturate(1.3);
        }
        50% { 
            box-shadow: 
                0 0 30px #32cd32,
                0 10px 35px #7fff00,
                0 2px 20px #39ff14,
                inset 0 8px 20px rgba(50, 205, 50, 0.5);
            filter: brightness(1.2) saturate(1.4);
        }
        75% { 
            box-shadow: 
                0 0 25px #39ff14,
                0 6px 28px #32cd32,
                0 -2px 18px #7fff00,
                inset 0 4px 12px rgba(57, 255, 20, 0.35);
            filter: brightness(1.05) saturate(1.25);
        }
    }
    .border-effect-toxic {
        animation: border-toxic 2.5s ease-in-out infinite;
        border-color: #39ff14;
    }
    
    /* Holographic/Glitch - Digital cyberpunk feel */
    @keyframes border-holo {
        0%, 100% { 
            box-shadow: 
                0 0 20px #00ffff,
                2px 0 15px #ff00ff,
                -2px 0 15px #ffff00;
            filter: brightness(1);
            transform: translateX(0);
        }
        10% {
            box-shadow: 
                0 0 25px #ff00ff,
                3px 0 20px #00ffff,
                -3px 0 20px #ffff00;
            filter: brightness(1.3);
            transform: translateX(2px);
        }
        20% {
            box-shadow: 
                0 0 20px #ffff00,
                -2px 0 15px #ff00ff,
                2px 0 15px #00ffff;
            filter: brightness(1);
            transform: translateX(-2px);
        }
        30% {
            box-shadow: 
                0 0 22px #00ffff,
                1px 0 18px #ff00ff,
                -1px 0 18px #ffff00;
            filter: brightness(1.1);
            transform: translateX(0);
        }
        35%, 95% {
            box-shadow: 
                0 0 20px #00ffff,
                2px 0 15px #ff00ff,
                -2px 0 15px #ffff00;
            filter: brightness(1);
            transform: translateX(0);
        }
        96% {
            box-shadow: 
                0 0 30px #ff00ff,
                4px 0 25px #ffff00,
                -4px 0 25px #00ffff;
            filter: brightness(1.5);
            transform: translateX(3px);
        }
        98% {
            box-shadow: 
                0 0 20px #00ffff,
                -2px 0 15px #ff00ff,
                2px 0 15px #ffff00;
            filter: brightness(1);
            transform: translateX(-1px);
        }
    }
    .border-effect-holo {
        animation: border-holo 3s linear infinite;
        border-color: #00ffff;
    }
    
    /* Crystalline - Prismatic crystal formations */
    @keyframes border-crystal {
        0%, 100% { 
            box-shadow: 
                0 0 20px #b9f2ff,
                5px 5px 15px rgba(138, 43, 226, 0.6),
                -5px -5px 15px rgba(255, 105, 180, 0.6),
                10px -10px 10px rgba(0, 255, 255, 0.5),
                -10px 10px 10px rgba(255, 215, 0, 0.5);
            filter: brightness(1) hue-rotate(0deg);
        }
        20% { 
            box-shadow: 
                0 0 25px #b9f2ff,
                -5px 8px 15px rgba(255, 105, 180, 0.6),
                8px -5px 15px rgba(138, 43, 226, 0.6),
                -10px -10px 10px rgba(255, 215, 0, 0.5),
                10px 10px 10px rgba(0, 255, 255, 0.5);
            filter: brightness(1.1) hue-rotate(15deg);
        }
        40% { 
            box-shadow: 
                0 0 30px #b9f2ff,
                8px -8px 15px rgba(0, 255, 255, 0.6),
                -8px 8px 15px rgba(255, 215, 0, 0.6),
                5px 10px 10px rgba(138, 43, 226, 0.5),
                -5px -10px 10px rgba(255, 105, 180, 0.5);
            filter: brightness(1.2) hue-rotate(30deg);
        }
        60% { 
            box-shadow: 
                0 0 25px #b9f2ff,
                -8px -5px 15px rgba(255, 215, 0, 0.6),
                5px 8px 15px rgba(0, 255, 255, 0.6),
                -10px 5px 10px rgba(255, 105, 180, 0.5),
                10px -5px 10px rgba(138, 43, 226, 0.5);
            filter: brightness(1.1) hue-rotate(45deg);
        }
        80% { 
            box-shadow: 
                0 0 22px #b9f2ff,
                5px -8px 15px rgba(255, 105, 180, 0.6),
                -5px 5px 15px rgba(138, 43, 226, 0.6),
                8px 8px 10px rgba(255, 215, 0, 0.5),
                -8px -8px 10px rgba(0, 255, 255, 0.5);
            filter: brightness(1.05) hue-rotate(20deg);
        }
    }
    .border-effect-crystal {
        animation: border-crystal 5s ease-in-out infinite;
        border-color: #b9f2ff;
    }
  `}</style>
);

export default GlobalStyles;
