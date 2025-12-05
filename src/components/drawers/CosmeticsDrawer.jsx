import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { THEMES_LIST } from '../../constants/gameData';

const BORDER_EFFECTS = [
    { id: 'solid', name: 'Solid Color', tier: 1, description: 'Classic solid glow' },
    { id: 'rainbow', name: 'Rainbow', tier: 2, description: 'Animated rainbow outline' },
    { id: 'gradient', name: 'Gradient Sweep', tier: 3, description: 'Animated gradient rotation' },
    { id: 'sparkle', name: 'Particle Sparkle', tier: 4, description: 'Sparkling particles' },
    { id: 'electric', name: 'Electric', tier: 5, description: 'Crackling lightning' },
    { id: 'fire', name: 'Fire', tier: 6, description: 'Dancing flames' },
    { id: 'frost', name: 'Frost', tier: 7, description: 'Crystalline ice shimmer' },
    { id: 'shadow', name: 'Shadow Aura', tier: 7, description: 'Dark smoky tendrils' }
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
    
    const isBorderUnlocked = (tier) => {
        return unlockedBorders.includes(tier);
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
                        Unlock borders by earning badges! Each tier unlocks new border effects.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {BORDER_EFFECTS.map(border => {
                            const unlocked = isBorderUnlocked(border.tier);
                            const isSelected = selectedBorder === border.id;
                            const isSolid = border.id === 'solid';
                            const showPicker = isSolid && isSelected && showColorPicker;
                            
                            return (
                                <button
                                    key={border.id}
                                    onClick={() => {
                                        if (unlocked) {
                                            if (isSolid && isSelected) {
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
                                            ? 'bg-slate-800/50 border-slate-600 opacity-50 cursor-not-allowed grayscale' 
                                            : isSelected
                                                ? 'bg-yellow-900/30 border-yellow-400 ring-2 ring-yellow-400/20'
                                                : 'bg-slate-800/70 border-slate-600 hover:border-yellow-400/50 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div 
                                            className={`w-16 h-16 mb-2 rounded border-4 ${
                                                unlocked 
                                                    ? `border-effect-${border.id}` 
                                                    : 'border-gray-600'
                                            }`}
                                            style={
                                                unlocked && isSolid 
                                                    ? { borderColor: borderColor, boxShadow: `0 0 20px ${borderColor}` }
                                                    : unlocked && (border.id === 'gradient' || border.id === 'sparkle') 
                                                        ? { '--border-color': borderColor } 
                                                        : {}
                                            }
                                        >
                                            {/* Preview area */}
                                        </div>
                                        <div className="text-center">
                                            <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                                                {border.name}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {border.description}
                                            </div>
                                            {!unlocked && (
                                                <div className="text-xs text-red-400 mt-1">
                                                    Requires Tier {border.tier} Badge
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                                                ACTIVE
                                            </div>
                                        )}
                                        
                                        {/* Inline Color Picker for Solid Color */}
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
