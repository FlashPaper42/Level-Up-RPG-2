import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { THEMES_LIST, BASE_ASSETS } from '../../constants/gameData';

const BORDER_EFFECTS = [
    { id: 'solid', name: 'Default', badge: null, description: 'Classic solid glow (locked on yellow)' },
    { id: 'solid-picker', name: 'Default', badge: 'Wood', description: 'Classic solid glow with color picker' },
    { id: 'gradient', name: 'Copper', badge: 'Stone', description: 'Animated gradient rotation' },
    { id: 'sparkle', name: 'Cloudy', badge: 'Gold', description: 'Sparkling particles' },
    { id: 'electric', name: 'Lightning Rod', badge: 'Iron', description: 'Crackling lightning' },
    { id: 'placeholder', name: 'Placeholder', badge: 'Emerald', description: 'A cool design to be determined' },
    { id: 'frost', name: 'Frost', badge: 'Diamond', description: 'Crystalline ice shimmer' },
    { id: 'fire', name: 'Lava', badge: 'Netherite', description: 'Dancing flames' },
    { id: 'shadow', name: 'Nether Portal', badge: 'Obsidian', description: 'Dark smoky tendrils' },
    { id: 'rainbow', name: 'Legendary!', badge: 'Star', description: 'Animated rainbow outline' }
];

const CosmeticsDrawer = ({ 
    isOpen, 
    activeTheme, 
    setActiveTheme, 
    selectedBorder, 
    setSelectedBorder, 
    borderColor, 
    setBorderColor, 
    unlockedBorders 
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    const isBorderUnlocked = (badge) => {
        // Default (locked on yellow) is always unlocked
        if (badge === null) return true;
        // Check if the badge is unlocked
        return unlockedBorders.includes(badge);
    };

    return (
        <div 
            className={`fixed h-full w-[85%] md:w-[60%] bg-[#0f172a]/95 backdrop-blur-xl z-50 border-r-4 border-slate-700 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ top: 0, left: 0 }}
        >
            <div className="p-6 h-full flex flex-col justify-start gap-6 overflow-y-auto scrollbar-hide text-slate-200 font-sans">
                <div className="flex justify-between items-center border-b-2 border-slate-700 pb-4 shrink-0">
                    <h2 className="text-4xl text-yellow-400 font-bold uppercase tracking-widest drop-shadow-md" style={{ fontFamily: '"VT323", monospace' }}>
                        Themes & Cosmetics
                    </h2>
                </div>
                
                {/* Theme Selection */}
                <div>
                    <h3 className="text-xl text-blue-300 mb-5 font-bold flex items-center gap-3 uppercase tracking-wider">
                        <Sparkles size={20} /> Theme Select
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {THEMES_LIST.map(theme => (
                            <button 
                                key={theme.id} 
                                onClick={() => setActiveTheme(theme.id)} 
                                disabled={activeTheme === theme.id} 
                                className={`h-24 rounded-lg border-2 overflow-hidden relative transition-all duration-300 shadow-lg group ${
                                    activeTheme === theme.id 
                                        ? 'border-yellow-400 ring-2 ring-yellow-400/20 opacity-100 cursor-default' 
                                        : 'border-slate-600 hover:scale-105 hover:border-white opacity-60 hover:opacity-100'
                                }`}
                            >
                                <SafeImage 
                                    src={theme.img} 
                                    alt={theme.name} 
                                    className={`w-full h-full object-cover ${activeTheme === theme.id ? 'grayscale-0' : 'grayscale'}`} 
                                />
                                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${
                                    activeTheme === theme.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                    <span className={`text-lg font-bold uppercase tracking-widest ${
                                        activeTheme === theme.id ? 'text-yellow-400' : 'text-white'
                                    }`}>
                                        {theme.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Border Effect Selection */}
                <div>
                    <h3 className="text-xl text-blue-300 mb-5 font-bold flex items-center gap-3 uppercase tracking-wider">
                        <Sparkles size={20} /> Border Effects
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Unlock borders by earning badges! Each badge unlocks a new border effect.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {BORDER_EFFECTS.map(border => {
                            const unlocked = isBorderUnlocked(border.badge);
                            const isSelected = selectedBorder === border.id;
                            const isSolid = border.id === 'solid' || border.id === 'solid-picker';
                            const showPicker = border.id === 'solid-picker' && isSelected && showColorPicker;
                            
                            // Get badge image if badge is specified
                            // Note: 'Star' badge is stored as 'Legendary' in BASE_ASSETS.badges
                            const badgeImg = border.badge ? BASE_ASSETS.badges[border.badge === 'Star' ? 'Legendary' : border.badge] : null;
                            
                            return (
                                <button
                                    key={border.id}
                                    onClick={() => {
                                        if (unlocked) {
                                            if (border.id === 'solid-picker' && isSelected) {
                                                setShowColorPicker(!showColorPicker);
                                            } else {
                                                setSelectedBorder(border.id);
                                                setShowColorPicker(false);
                                            }
                                        }
                                    }}
                                    disabled={!unlocked}
                                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                                        !unlocked 
                                            ? 'bg-slate-800/50 border-slate-600 opacity-70 cursor-not-allowed' 
                                            : isSelected
                                                ? 'bg-yellow-900/30 border-yellow-400 ring-2 ring-yellow-400/20'
                                                : 'bg-slate-800/70 border-slate-600 hover:border-yellow-400/50 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        {/* Badge Icon and Effect Preview Container */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {/* Badge Icon */}
                                            {badgeImg && (
                                                <SafeImage 
                                                    src={badgeImg} 
                                                    alt={`${border.badge} Badge`}
                                                    className={`w-8 h-8 ${!unlocked ? 'opacity-30 grayscale' : ''}`}
                                                />
                                            )}
                                            {/* Effect Preview Square */}
                                            <div 
                                                className={`w-16 h-16 rounded border-4 ${
                                                    !isSolid ? `border-effect-${border.id}` : ''
                                                }`}
                                                style={
                                                    isSolid 
                                                        ? { borderColor: border.id === 'solid' ? '#FFD700' : borderColor, boxShadow: `0 0 20px ${border.id === 'solid' ? '#FFD700' : borderColor}` }
                                                        : (border.id === 'gradient' || border.id === 'sparkle') 
                                                            ? { '--border-color': borderColor } 
                                                            : {}
                                                }
                                            >
                                                {/* Preview area */}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                                                {border.name}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {border.description}
                                            </div>
                                            {!unlocked && border.badge && (
                                                <div className="text-xs text-red-400 mt-1">
                                                    Requires {border.badge} Badge
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                                                ACTIVE
                                            </div>
                                        )}
                                        
                                        {/* Inline Color Picker for Solid Color with Picker */}
                                        {showPicker && (
                                            <div className="mt-3 p-3 bg-slate-900/80 rounded border border-slate-600 w-full">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={borderColor}
                                                        onChange={(e) => setBorderColor(e.target.value)}
                                                        className="w-12 h-12 rounded cursor-pointer border-2 border-slate-600"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-xs text-slate-400 mb-1">Color</div>
                                                        <div className="text-sm font-mono text-white">{borderColor.toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CosmeticsDrawer;
