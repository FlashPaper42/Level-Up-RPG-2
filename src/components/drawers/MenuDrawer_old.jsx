import React, { useState } from 'react';
import { Lock, Trophy, Target, Zap } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { BADGE_TIERS, BASE_ASSETS, SKILL_DATA } from '../../constants/gameData';
import { calculateXPToLevel } from '../../utils/gameUtils';

// Placeholder achievements data structure
const SPECIAL_ACHIEVEMENTS = [
    {
        id: 'phantom_hunter',
        name: 'Phantom Hunter',
        description: 'Collect 10 Phantoms',
        icon: Trophy,
        unlocked: false,
        progress: 0,
        target: 10
    },
    {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Defeat your first mob',
        icon: Target,
        unlocked: false,
        progress: 0,
        target: 1
    },
    {
        id: 'completionist',
        name: 'Completionist',
        description: 'Unlock all badges for one skill',
        icon: Zap,
        unlocked: false,
        progress: 0,
        target: 1
    }
];

const MenuDrawer = ({ isOpen, skills }) => {
    const [activeTab, setActiveTab] = useState('badges');
    const totalLevels = Object.values(skills).reduce((acc, s) => acc + s.level, 0);
    
    // Calculate total badges earned
    const totalBadges = Object.values(skills).reduce((acc, skill) => {
        let count = BADGE_TIERS.filter(tier => skill.level >= tier.level).length;
        if (skill.level >= 180) {
            const legendaryCount = Math.floor((skill.level - 160) / 20);
            count += legendaryCount;
        }
        return acc + count;
    }, 0);
    
    return (
        <div 
            className={`fixed h-full w-[75%] md:w-[60%] bg-[#1a1a1a]/95 backdrop-blur-md z-50 border-l-4 border-stone-600 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ top: 0, right: 0 }}
        >
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="shrink-0 border-b-4 border-stone-600 pb-4 mb-4">
                    <h2 className="text-5xl text-yellow-400 font-bold uppercase tracking-widest mb-2 drop-shadow-md">Achievements</h2>
                    <div className="flex gap-6 text-stone-400 text-2xl">
                        <p>Total Level: <span className="text-white font-bold">{totalLevels}</span></p>
                        <p>Badges: <span className="text-yellow-400 font-bold">{totalBadges}</span></p>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="shrink-0 flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('badges')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold uppercase text-2xl transition-all ${
                            activeTab === 'badges'
                                ? 'bg-yellow-600 text-white border-2 border-yellow-400'
                                : 'bg-stone-800 text-stone-400 border-2 border-stone-600 hover:bg-stone-700'
                        }`}
                    >
                        Skill Badges
                    </button>
                    <button
                        onClick={() => setActiveTab('special')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold uppercase text-2xl transition-all ${
                            activeTab === 'special'
                                ? 'bg-yellow-600 text-white border-2 border-yellow-400'
                                : 'bg-stone-800 text-stone-400 border-2 border-stone-600 hover:bg-stone-700'
                        }`}
                    >
                        Special
                    </button>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {activeTab === 'badges' ? (
                        /* Skill Badges Section */
                        <div className="space-y-4">
                            {Object.keys(skills).map(key => {
                                const userSkill = skills[key];
                                const skillDifficulty = userSkill.difficulty || 1;
                                const xpToLevel = calculateXPToLevel(skillDifficulty, userSkill.level);
                                const xpPercent = Math.min(100, (userSkill.xp / xpToLevel) * 100);
                                const skillConfig = SKILL_DATA.find(s => s.id === key);
                                const legendaryCount = userSkill.level >= 180 ? Math.floor((userSkill.level - 160) / 20) : 0;
                                
                                return (
                                    <div key={key} className="bg-black/40 p-4 rounded-xl border-2 border-stone-700">
                                        {/* Compact Skill Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            {skillConfig && <SafeImage src={skillConfig.img} alt={key} className="w-12 h-12 object-contain shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-2xl font-bold text-white tracking-wide truncate">{key.toUpperCase()}</h3>
                                                    <span className="text-stone-400 text-xl font-bold ml-2 shrink-0">Lvl {userSkill.level}</span>
                                                </div>
                                                <div className="w-full h-3 bg-stone-900 rounded-full border border-stone-600 relative overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Compact Badge Row */}
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {BADGE_TIERS.map((tier) => {
                                                const isUnlocked = userSkill.level >= tier.level;
                                                return (
                                                    <div 
                                                        key={tier.level}
                                                        className="group relative"
                                                        title={`${tier.title} - Level ${tier.level}`}
                                                    >
                                                        <div className={`w-11 h-11 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                            isUnlocked 
                                                                ? 'border-yellow-500 bg-stone-800 shadow-md hover:scale-110' 
                                                                : 'border-stone-600 bg-stone-900/50 opacity-50 grayscale'
                                                        }`}>
                                                            {isUnlocked ? (
                                                                <SafeImage src={BASE_ASSETS.badges[tier.title]} className="w-8 h-8 object-contain" />
                                                            ) : (
                                                                <Lock size={16} className="text-stone-500" />
                                                            )}
                                                        </div>
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                            {tier.title} (Lvl {tier.level})
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* LEGENDARY Badge(s) */}
                                            {legendaryCount > 0 && (
                                                <div 
                                                    className="group relative"
                                                    title="LEGENDARY!"
                                                >
                                                    <div className="w-11 h-11 border-2 rounded-lg flex items-center justify-center border-yellow-500 bg-gradient-to-br from-yellow-900 to-stone-800 shadow-lg relative hover:scale-110 transition-all duration-300">
                                                        <SafeImage src={BASE_ASSETS.badges.Legendary} className="w-8 h-8 object-contain" />
                                                        {legendaryCount >= 2 && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border border-yellow-400 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">{legendaryCount}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        LEGENDARY! (Lvl 180+)
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Special Achievements Section */
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {SPECIAL_ACHIEVEMENTS.map(achievement => {
                                const Icon = achievement.icon;
                                return (
                                    <div 
                                        key={achievement.id}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            achievement.unlocked
                                                ? 'bg-gradient-to-br from-yellow-900/40 to-stone-800/40 border-yellow-500'
                                                : 'bg-black/40 border-stone-600'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                                                achievement.unlocked
                                                    ? 'border-yellow-400 bg-yellow-900/50'
                                                    : 'border-stone-600 bg-stone-900/50'
                                            }`}>
                                                {achievement.unlocked ? (
                                                    <Icon size={32} className="text-yellow-400" />
                                                ) : (
                                                    <Lock size={32} className="text-stone-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-bold ${
                                                    achievement.unlocked ? 'text-yellow-400' : 'text-stone-500'
                                                }`}>
                                                    {achievement.unlocked ? achievement.name : '???'}
                                                </h4>
                                                <p className="text-sm text-stone-400 mt-1">
                                                    {achievement.unlocked ? achievement.description : 'Locked'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Placeholder for more achievements */}
                            <div className="p-4 rounded-xl border-2 border-dashed border-stone-700 bg-stone-900/20">
                                <div className="flex flex-col items-center justify-center text-center gap-2 h-full">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-stone-700 flex items-center justify-center">
                                        <span className="text-stone-600 text-2xl">+</span>
                                    </div>
                                    <p className="text-sm text-stone-600">More Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuDrawer;
