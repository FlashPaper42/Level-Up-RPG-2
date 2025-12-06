import React, { useState } from 'react';
import { Sparkles, Flame, Snowflake, Zap, Skull, Star, Activity, Atom, Droplet, Grid3x3, Gem } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { THEMES_LIST, BASE_ASSETS } from '../../constants/gameData';
import { ACHIEVEMENTS } from '../../constants/achievements';

const BORDER_EFFECTS = [
    { id: 'solid', name: 'Default', badge: null, description: 'Eternal golden radiance', icon: Star },
    { id: 'solid-picker', name: 'Default', badge: 'Wood', description: 'Customizable eternal glow', icon: Star },
    { id: 'gradient', name: 'Copper', badge: 'Stone', description: 'Mesmerizing arcane rotation', icon: Atom },
    { id: 'sparkle', name: 'Cloudy', badge: 'Gold', description: 'Celestial stardust shimmer', icon: Sparkles },
    { id: 'electric', name: 'Lightning Rod', badge: 'Iron', description: 'Thunderous plasma surge', icon: Zap },
    { id: 'lifestream', name: 'Lifestream', badge: 'Emerald', description: 'Flowing ethereal energy', icon: Activity },
    { id: 'frost', name: 'Frost', badge: 'Diamond', description: 'Glacial crystal majesty', icon: Snowflake },
    { id: 'fire', name: 'Lava', badge: 'Netherite', description: 'Infernal blazing fury', icon: Flame },
    { id: 'shadow', name: 'Nether Portal', badge: 'Obsidian', description: 'Abyssal void whispers', icon: Skull },
    { id: 'rainbow', name: 'Legendary!', badge: 'Star', description: 'Prismatic legendary aura', icon: Gem }
];

// Achievement-unlocked border effects
const ACHIEVEMENT_EFFECTS = [
    { id: 'livewire', name: 'Live Wire', achievement: 'speed_demon', description: 'Volatile electric arcs', icon: Zap },
    { id: 'void', name: 'Cosmic Void', achievement: 'world_ender', description: 'Infinite starlit expanse', icon: Atom },
    { id: 'toxic', name: 'Toxin', achievement: 'monster_manual', description: 'Caustic acid drip', icon: Droplet },
    { id: 'holo', name: 'Hologram', achievement: 'perfectionist', description: 'Digital reality glitch', icon: Grid3x3 },
    { id: 'crystal', name: 'Crystalline', achievement: 'full_set', description: 'Prismatic shard array', icon: Gem }
];

const CosmeticsDrawer = ({ 
    isOpen, 
    activeTheme, 
    setActiveTheme, 
    selectedBorder, 
    setSelectedBorder, 
    borderColor, 
    setBorderColor, 
    unlockedBorders,
    unlockedAchievements = [] // New prop for unlocked achievements
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    const isBorderUnlocked = (badge) => {
        // Default (locked on yellow) is always unlocked
        if (badge === null) return true;
        // Check if the badge is unlocked
        return unlockedBorders.includes(badge);
    };
    
    const isAchievementEffectUnlocked = (achievementId) => {
        return unlockedAchievements.includes(achievementId);
    };
    
    const getAchievementName = (achievementId) => {
        const achievement = ACHIEVEMENTS[achievementId];
        return achievement ? achievement.name : achievementId;
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
                    <h3 className="text-xl text-blue-300 mb-4 font-bold flex items-center gap-3 uppercase tracking-wider">
                        <Sparkles size={20} /> Border Effects
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Unlock borders by earning badges! Each badge unlocks a new border effect.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {BORDER_EFFECTS.map(border => {
                            const unlocked = isBorderUnlocked(border.badge);
                            const isSelected = selectedBorder === border.id;
                            const isSolid = border.id === 'solid' || border.id === 'solid-picker';
                            const showPicker = border.id === 'solid-picker' && isSelected && showColorPicker;
                            
                            // Get badge image if badge is specified
                            // Note: 'Star' badge is stored as 'Legendary' in BASE_ASSETS.badges
                            const badgeImg = border.badge ? BASE_ASSETS.badges[border.badge === 'Star' ? 'Legendary' : border.badge] : null;
                            const IconComponent = border.icon;
                            
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
                                    className={`relative p-2 rounded-lg border-2 transition-all duration-300 ${
                                        !unlocked 
                                            ? 'bg-slate-800/50 border-slate-600 opacity-70 cursor-not-allowed' 
                                            : isSelected
                                                ? 'bg-yellow-900/30 border-yellow-400 ring-2 ring-yellow-400/20'
                                                : 'bg-slate-800/70 border-slate-600 hover:border-yellow-400/50 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        {/* Badge Icon and Effect Preview Container */}
                                        <div className="flex items-start justify-center gap-2 mb-2">
                                            {/* Badge Icon */}
                                            {badgeImg && (
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <SafeImage 
                                                        src={badgeImg} 
                                                        alt={`${border.badge} Badge`}
                                                        className={`w-12 h-12 ${!unlocked ? 'opacity-30 grayscale' : ''}`}
                                                    />
                                                    <div className={`text-[10px] font-bold uppercase tracking-wide ${!unlocked ? 'text-slate-500' : 'text-slate-300'}`}>
                                                        {border.badge}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Effect Preview Square */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div 
                                                    className={`w-12 h-12 rounded border-4 flex items-center justify-center ${
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
                                                    {/* Icon inside preview */}
                                                    <IconComponent 
                                                        size={20} 
                                                        className={`${!unlocked ? 'text-slate-600' : 'text-slate-300'}`}
                                                    />
                                                </div>
                                                <div className={`font-bold text-[10px] uppercase tracking-wide ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                                                    {border.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] text-slate-400">
                                                {border.description}
                                            </div>
                                            {!unlocked && border.badge && (
                                                <div className="text-[10px] text-red-400 mt-1">
                                                    Requires {border.badge}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                ACTIVE
                                            </div>
                                        )}
                                        
                                        {/* Inline Color Picker for Solid Color with Picker */}
                                        {showPicker && (
                                            <div className="mt-2 p-2 bg-slate-900/80 rounded border border-slate-600 w-full">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={borderColor}
                                                        onChange={(e) => setBorderColor(e.target.value)}
                                                        className="w-10 h-10 rounded cursor-pointer border-2 border-slate-600"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-[9px] text-slate-400 mb-0.5">Color</div>
                                                        <div className="text-[11px] font-mono text-white">{borderColor.toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Achievement-Unlocked Effects Section */}
                    <h3 className="text-lg text-purple-300 mt-6 mb-3 font-bold flex items-center gap-2 uppercase tracking-wider">
                        <Sparkles size={18} /> Achievement Unlocks
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                        Unlock these special effects by completing achievements!
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {ACHIEVEMENT_EFFECTS.map(effect => {
                            const unlocked = isAchievementEffectUnlocked(effect.achievement);
                            const isSelected = selectedBorder === effect.id;
                            const IconComponent = effect.icon;
                            const achievementName = getAchievementName(effect.achievement);
                            
                            return (
                                <div
                                    key={effect.id}
                                    className="relative group"
                                >
                                    <button
                                        onClick={() => {
                                            if (unlocked) {
                                                setSelectedBorder(effect.id);
                                                setShowColorPicker(false);
                                            }
                                        }}
                                        disabled={!unlocked}
                                        className={`w-full relative p-2 rounded-lg border-2 transition-all duration-300 ${
                                            !unlocked 
                                                ? 'bg-slate-800/50 border-slate-600 opacity-70 cursor-not-allowed' 
                                                : isSelected
                                                    ? 'bg-purple-900/30 border-purple-400 ring-2 ring-purple-400/20'
                                                    : 'bg-slate-800/70 border-slate-600 hover:border-purple-400/50 hover:scale-105'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            {/* Effect Preview Square - Centered */}
                                            <div className="flex flex-col items-center gap-0.5 mb-1">
                                                <div 
                                                    className={`w-12 h-12 rounded border-4 border-effect-${effect.id} flex items-center justify-center`}
                                                >
                                                    <IconComponent 
                                                        size={20} 
                                                        className={`${!unlocked ? 'text-slate-600' : 'text-slate-300'}`}
                                                    />
                                                </div>
                                                <div className={`font-bold text-[10px] uppercase tracking-wide ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                                                    {effect.name}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[10px] text-slate-400">
                                                    {effect.description}
                                                </div>
                                                {!unlocked && (
                                                    <div className="text-[9px] text-red-400 mt-0.5">
                                                        Requires: {achievementName}
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 bg-purple-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                    ACTIVE
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CosmeticsDrawer;
