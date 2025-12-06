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

// Combined unified array for 3x5 grid display
const ALL_BORDER_EFFECTS = [...BORDER_EFFECTS, ...ACHIEVEMENT_EFFECTS];

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

                {/* Border Effect Selection - Unified 3x5 Grid */}
                <div>
                    <h3 className="text-xl text-blue-300 mb-4 font-bold flex items-center gap-3 uppercase tracking-wider">
                        <Sparkles size={20} /> Border Effects
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {ALL_BORDER_EFFECTS.map(effect => {
                            // Determine if this is a badge-based or achievement-based effect
                            const isBadgeEffect = effect.badge !== undefined;
                            const unlocked = isBadgeEffect ? isBorderUnlocked(effect.badge) : isAchievementEffectUnlocked(effect.achievement);
                            const isSelected = selectedBorder === effect.id;
                            const isSolid = effect.id === 'solid' || effect.id === 'solid-picker';
                            const showPicker = effect.id === 'solid-picker' && isSelected && showColorPicker;
                            
                            // Get badge image if badge is specified
                            const badgeImg = effect.badge ? BASE_ASSETS.badges[effect.badge === 'Star' ? 'Legendary' : effect.badge] : null;
                            const IconComponent = effect.icon;
                            
                            // Determine unlock requirement text for tooltip
                            let unlockRequirement = '';
                            if (!unlocked) {
                                if (isBadgeEffect && effect.badge) {
                                    unlockRequirement = `Requires ${effect.badge} Badge`;
                                } else if (effect.achievement) {
                                    unlockRequirement = `Requires ${getAchievementName(effect.achievement)}`;
                                }
                            }
                            
                            return (
                                <button
                                    key={effect.id}
                                    onClick={() => {
                                        if (unlocked) {
                                            if (effect.id === 'solid-picker' && isSelected) {
                                                setShowColorPicker(!showColorPicker);
                                            } else {
                                                setSelectedBorder(effect.id);
                                                setShowColorPicker(false);
                                            }
                                        }
                                    }}
                                    disabled={!unlocked}
                                    title={`${effect.name} - ${effect.description}${unlockRequirement ? '\n' + unlockRequirement : ''}`}
                                    className={`relative p-1 rounded-lg border-2 transition-all duration-300 ${
                                        !unlocked 
                                            ? 'bg-slate-800/50 border-slate-600 opacity-70 cursor-not-allowed' 
                                            : isSelected
                                                ? 'bg-yellow-900/30 border-yellow-400 ring-2 ring-yellow-400/20'
                                                : 'bg-slate-800/70 border-slate-600 hover:border-yellow-400/50 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        {/* Badge Icon and Effect Preview Container */}
                                        <div className="flex items-center justify-center gap-1">
                                            {/* Badge Icon */}
                                            {badgeImg && (
                                                <SafeImage 
                                                    src={badgeImg} 
                                                    alt={`${effect.badge} Badge`}
                                                    className={`w-16 h-16 ${!unlocked ? 'opacity-30 grayscale' : ''}`}
                                                />
                                            )}
                                            {/* Effect Preview Square */}
                                            <div 
                                                className={`w-16 h-16 rounded border-4 flex items-center justify-center ${
                                                    !isSolid ? `border-effect-${effect.id}` : ''
                                                }`}
                                                style={
                                                    isSolid 
                                                        ? { borderColor: effect.id === 'solid' ? '#FFD700' : borderColor, boxShadow: `0 0 20px ${effect.id === 'solid' ? '#FFD700' : borderColor}` }
                                                        : (effect.id === 'gradient' || effect.id === 'sparkle') 
                                                            ? { '--border-color': borderColor } 
                                                            : {}
                                                }
                                            >
                                                {/* Icon inside preview */}
                                                <IconComponent 
                                                    size={24} 
                                                    className={`${!unlocked ? 'text-slate-600' : 'text-slate-300'}`}
                                                />
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-0.5 right-0.5 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
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
                </div>
            </div>
        </div>
    );
};

export default CosmeticsDrawer;
