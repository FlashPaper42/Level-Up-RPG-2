import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Menu, Sparkles, ChevronLeft, ChevronRight, Gift, Heart
} from 'lucide-react';

// Modules
import GlobalStyles from './components/ui/GlobalStyles';
import SafeImage from './components/ui/SafeImage';
import ResetModal from './components/modals/ResetModal';
import SettingsDrawer from './components/drawers/SettingsDrawer';
import MenuDrawer from './components/drawers/MenuDrawer';
import SkillCard from './components/skills/SkillCard';
import PhantomEvent from './components/PhantomEvent';

// Utils & Constants
import { getRandomMob, getRandomFriendlyMob, getRandomAxolotl, getRandomMiniboss, getMobForSkill, getEncounterType, generateMathProblem, getReadingWord, getItemsForLength, calculateDamage, calculateMobHealth, calculateXPReward, calculateXPToLevel } from './utils/gameUtils';
import { 
    BASE_ASSETS, THEME_CONFIG, SKILL_DATA, 
    HOMOPHONES, DIFFICULTY_CONTENT, HOSTILE_MOBS
} from './constants/gameData';
import { 
    getBGMManager, setSfxVolume, 
    playActionCardLeft, playActionCardRight, playClick, 
    playDeath, playFail, playLevelUp, playNotification, playSuccessfulHit,
    playMobHurt, playMobDeath
} from './utils/soundManager';

// Parent verification privilege constants
const PARENT_PRIVILEGE_LEVEL = 200;
const PARENT_PRIVILEGE_DIFFICULTY = 7;
const PARENT_PRIVILEGE_BADGES = [1, 2, 3, 4, 5, 6, 7];

const App = () => {
    const [currentProfile, setCurrentProfile] = useState(() => localStorage.getItem('currentProfile_v1') ? parseInt(localStorage.getItem('currentProfile_v1')) : 1);
    const [profileNames, setProfileNames] = useState(() => localStorage.getItem('heroProfileNames_v1') ? JSON.parse(localStorage.getItem('heroProfileNames_v1')) : { 1: "Player 1", 2: "Player 2", 3: "Player 3" });
    const [parentStatus, setParentStatus] = useState(() => localStorage.getItem('heroParentStatus_v1') ? JSON.parse(localStorage.getItem('heroParentStatus_v1')) : { 1: false, 2: false, 3: false });
    const [playerHealth, setPlayerHealth] = useState(10);
    
    const getStorageKey = (profileId) => `heroSkills_v23_p${profileId}`;
    const loadSkills = (profileId) => {
        const initial = {};
        // Initialize each skill with level, xp, currentMob, difficulty (1-7), earnedBadges array,
        // mobHealth for HP-based combat, and death/recovery state
        SKILL_DATA.forEach(skill => { 
            const initialDifficulty = 1;
            initial[skill.id] = { 
                level: 1, 
                xp: 0, 
                currentMob: getRandomMob(null),
                difficulty: initialDifficulty,  // Per-skill difficulty (1-7)
                earnedBadges: [], // Array of earned badge tier numbers (1-7)
                mobHealth: calculateMobHealth(initialDifficulty), // Mob's current HP
                mobMaxHealth: calculateMobHealth(initialDifficulty), // Mob's max HP
                lostLevel: false, // True if player died and lost a level
                recoveryDifficulty: null, // Difficulty to suggest for recovery
                memoryMob: skill.id === 'memory' ? getRandomFriendlyMob() : null, // Stable mob for Memory card display
                patternMob: skill.id === 'patterns' ? getRandomAxolotl() : null, // Stable axolotl for Patterns card display
                currentMiniboss: getRandomMiniboss() // Stable miniboss for miniboss encounters
            }; 
        });
        let saved = localStorage.getItem(getStorageKey(profileId));
        if (!saved && profileId === 1) saved = localStorage.getItem('heroSkills_v23');
        try { 
            if (saved) { 
                const parsed = JSON.parse(saved); 
                const data = parsed.skills || parsed; 
                Object.keys(data).forEach(key => { 
                    initial[key] = { ...initial[key], ...data[key] };
                    // Ensure difficulty exists (backward compatibility)
                    if (typeof initial[key].difficulty !== 'number') {
                        initial[key].difficulty = 1;
                    }
                    // Ensure earnedBadges array exists (backward compatibility)
                    if (!Array.isArray(initial[key].earnedBadges)) {
                        initial[key].earnedBadges = [];
                    }
                    // Ensure mobHealth exists (backward compatibility)
                    if (typeof initial[key].mobHealth !== 'number') {
                        const diff = initial[key].difficulty || 1;
                        initial[key].mobHealth = calculateMobHealth(diff);
                        initial[key].mobMaxHealth = calculateMobHealth(diff);
                    }
                    // Ensure death/recovery state exists
                    if (typeof initial[key].lostLevel !== 'boolean') {
                        initial[key].lostLevel = false;
                    }
                    if (initial[key].recoveryDifficulty === undefined) {
                        initial[key].recoveryDifficulty = null;
                    }
                    // Ensure memoryMob exists for memory skill (backward compatibility)
                    if (key === 'memory' && !initial[key].memoryMob) {
                        initial[key].memoryMob = getRandomFriendlyMob();
                    }
                    // Ensure patternMob exists for patterns skill (backward compatibility)
                    if (key === 'patterns' && !initial[key].patternMob) {
                        initial[key].patternMob = getRandomAxolotl();
                    }
                }); 
                return initial; 
            } 
        } catch (e) {
            console.warn('Failed to parse saved skills:', e);
        }
        return initial;
    };
    const loadTheme = (profileId) => {
        let saved = localStorage.getItem(getStorageKey(profileId));
        if (!saved && profileId === 1) {
            saved = localStorage.getItem('heroSkills_v23');
        }
        try {
            return JSON.parse(saved).theme || 'minecraft';
        } catch (e) {
            console.warn('Failed to parse theme:', e);
        }
        return 'minecraft';
    };
    
    const getProfileStats = (id, liveSkills = null) => {
        const initial = {};
        SKILL_DATA.forEach(skill => { initial[skill.id] = { level: 1 }; });
        
        // Use live skills if provided (for current profile with pending state changes)
        if (liveSkills) {
            let totalLevel = 0;
            let highestLevel = 0;
            Object.values(liveSkills).forEach(s => {
                if (s && typeof s.level === 'number') {
                    totalLevel += s.level;
                    if (s.level > highestLevel) highestLevel = s.level;
                }
            });
            return { totalLevel, highestLevel, skills: liveSkills, theme: activeTheme };
        }
        
        const key = getStorageKey(id);
        let saved = localStorage.getItem(key);
        if (!saved && id === 1) saved = localStorage.getItem('heroSkills_v23');
        if (!saved) return null;
        try {
            const data = JSON.parse(saved);
            const skillsData = data.skills || data;
            const theme = data.theme || 'minecraft';
            let totalLevel = 0;
            let highestLevel = 0;
            Object.values(skillsData).forEach(s => {
                if (s && typeof s.level === 'number') {
                    totalLevel += s.level;
                    if (s.level > highestLevel) highestLevel = s.level;
                }
            });
            return { totalLevel, highestLevel, skills: skillsData, theme };
        } catch (e) {
            console.warn('Failed to parse profile stats:', e);
            return null;
        }
    };

    const [skills, setSkills] = useState(() => loadSkills(currentProfile));
    const [activeTheme, setActiveTheme] = useState(() => loadTheme(currentProfile));
    const [battlingSkillId, setBattlingSkillId] = useState(null);
    const [battleDifficulty, setBattleDifficulty] = useState(null); // Track battle's starting difficulty for consistent challenge generation
    const [challengeData, setChallengeData] = useState(null);
    const [lootBox, setLootBox] = useState(null); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [spokenText, setSpokenText] = useState("");
    const [damageNumbers, setDamageNumbers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [showDeathOverlay, setShowDeathOverlay] = useState(false);
    const [showLevelRestored, setShowLevelRestored] = useState(false);
    const recognitionRef = useRef(null);
    const challengeDataRef = useRef(null);
    const [bgmVol, setBgmVol] = useState(0.3);
    const [sfxVol, setSfxVolState] = useState(0.5);
    const bgmManager = useRef(getBGMManager());

    useEffect(() => { 
        const dataToSave = { skills: skills, theme: activeTheme };
        localStorage.setItem(getStorageKey(currentProfile), JSON.stringify(dataToSave)); 
        localStorage.setItem('currentProfile_v1', currentProfile);
        localStorage.setItem('heroProfileNames_v1', JSON.stringify(profileNames));
        localStorage.setItem('heroParentStatus_v1', JSON.stringify(parentStatus));
    }, [skills, currentProfile, activeTheme, profileNames, parentStatus]);

    // Update BGM volume
    useEffect(() => { 
        bgmManager.current.setVolume(bgmVol); 
    }, [bgmVol]);
    
    // Update SFX volume in sound manager
    useEffect(() => {
        setSfxVolume(sfxVol);
    }, [sfxVol]);
    
    // Keep challengeDataRef in sync with challengeData state for voice listener
    useEffect(() => {
        challengeDataRef.current = challengeData;
    }, [challengeData]);
    
    // Start BGM on first user interaction
    const startBGM = useCallback(() => {
        if (!bgmManager.current.isPlaying) {
            bgmManager.current.play();
        }
    }, []);

    const generateChallenge = (type, diff) => {
        // Math: Use difficulty-based problem generation
        if (type === 'math') {
            return generateMathProblem(diff);
        }
        // Patterns: Simon Says - no challenge data needed, handled in SkillCard
        if (type === 'patterns') {
            return { type: 'patterns', question: "Simon Says!", answer: "WIN" };
        }
        // Reading: Use difficulty-based word selection
        if (type === 'reading') {
            const word = getReadingWord(diff);
            return { type, question: word, answer: word };
        }
        // Writing: Use difficulty-based item selection
        if (type === 'writing') {
            const targetLength = DIFFICULTY_CONTENT.writing[diff]?.targetLength || 3;
            const itemData = getItemsForLength(targetLength);
            return { 
                type, 
                question: "Spell it!", 
                answer: itemData.combinedAnswer, 
                images: itemData.images,
                items: itemData.items,
                isMultiItem: itemData.items.length > 1
            };
        }
        // Memory: No specific challenge data, handled in SkillCard
        if (type === 'memory') return { type: 'memory', question: "Find Pairs!", answer: "WIN" };
        // Cleaning: Manual task
        return { type: 'manual', question: "Task Complete?", answer: "yes" };
    };

    // Regenerate challenge when difficulty or level changes during active battle
    // This fixes the issue where challenges use stale difficulty after leveling up
    useEffect(() => {
        if (!battlingSkillId) return;
        
        const skillConfig = SKILL_DATA.find(s => s.id === battlingSkillId);
        if (!skillConfig || !skillConfig.hasChallenge || skillConfig.id === 'memory' || skillConfig.id === 'patterns') return;
        
        const currentSkillState = skills[battlingSkillId];
        if (!currentSkillState) return;
        
        const currentDiff = currentSkillState.difficulty || 1;
        const playerLevel = currentSkillState.level;
        
        // Calculate what the challenge difficulty should be for the current encounter
        const encounterType = getEncounterType(playerLevel);
        const correctChallengeDiff = encounterType === 'miniboss'
            ? Math.min(7, currentDiff + 1)
            : currentDiff;
        
        // If the challenge difficulty needs to change, update it
        // Note: We compare with battleDifficulty but don't include it in deps to avoid re-render loop
        if (battleDifficulty !== correctChallengeDiff) {
            setBattleDifficulty(correctChallengeDiff);
            setChallengeData(generateChallenge(skillConfig.challengeType, correctChallengeDiff));
        }
    }, [battlingSkillId, skills]); // Intentionally exclude battleDifficulty to prevent infinite loop

    const handleSuccessHit = (skillId, isWrong) => {
        // Handle wrong answer - damage player
        if (isWrong === 'WRONG') {
            setPlayerHealth(h => {
                const newH = h - 1;
                if (newH <= 0) {
                    // Death sequence - play UI death sound
                    playDeath();
                    setShowDeathOverlay(true);
                    
                    // Reduce player level by 1 for the active skill (minimum level 1)
                    if (battlingSkillId) {
                        setSkills(prev => {
                            const current = prev[battlingSkillId];
                            const newLevel = Math.max(1, current.level - 1);
                            const currentDiff = current.difficulty || 1;
                            return {
                                ...prev,
                                [battlingSkillId]: {
                                    ...current,
                                    level: newLevel,
                                    lostLevel: current.level > 1, // Only true if we actually lost a level
                                    recoveryDifficulty: Math.max(1, currentDiff - 1)
                                }
                            };
                        });
                    }
                    
                    // End battle after short delay
                    setTimeout(() => {
                        setBattlingSkillId(null);
                        setShowDeathOverlay(false);
                    }, 2000);
                    
                    return 10; // Heal to full health
                }
                // Player takes damage but doesn't die - play fail sound
                playFail();
                return newH;
            });
            return;
        }
        
        if (!skillId) return;
        const skillConfig = SKILL_DATA.find(s => s.id === skillId);
        const currentSkillState = skills[skillId];
        const skillDifficulty = currentSkillState.difficulty || 1;
        const playerLevel = currentSkillState.level;
        const currentMobName = currentSkillState.currentMob;
        
        // Calculate damage using new RPG formulas
        const damage = calculateDamage(playerLevel, skillDifficulty);
        
        // Get encounter type for current level
        const encounterType = getEncounterType(playerLevel);
        
        // Cleaning/memory/miniboss are defeated in single hit
        const isMiniboss = encounterType === 'miniboss' && skillConfig.id !== 'cleaning';
        const isInstantDefeat = skillConfig.id === 'cleaning' || skillConfig.id === 'memory' || isMiniboss;
        const actualDamage = isInstantDefeat ? currentSkillState.mobHealth : damage;
        
        // Determine if this hit will defeat the mob
        const willDefeatMob = (currentSkillState.mobHealth - actualDamage) <= 0;
        
        // Show damage numbers and play sounds
        if (skillConfig.id !== 'memory') {
            const id = Date.now();
            setDamageNumbers(prev => [...prev, { id, skillId, val: actualDamage, x: Math.random() * 100 - 50, y: Math.random() * 50 - 25 }]);
            setTimeout(() => setDamageNumbers(prev => prev.filter(n => n.id !== id)), 800);
            
            // Play mob hurt or death sound based on if mob is defeated
            if (willDefeatMob) {
                playMobDeath(currentMobName);
            } else {
                playMobHurt(currentMobName);
            }
            
            // Play successful hit UI sound
            playSuccessfulHit();
        }
        
        setSkills(prev => {
            const current = prev[skillId];
            let newMobHealth = current.mobHealth - actualDamage;
            let newLevel = current.level;
            let newXp = current.xp;
            let leveledUp = false;
            let newMob = current.currentMob;
            let newDifficulty = current.difficulty || 1;
            let newBadges = [...(current.earnedBadges || [])];
            let newMobMaxHealth = current.mobMaxHealth;
            let newLostLevel = current.lostLevel;
            let newRecoveryDifficulty = current.recoveryDifficulty;
            let newMemoryMob = current.memoryMob;
            let newPatternMob = current.patternMob;
            let newMiniboss = current.currentMiniboss;
            
            // Calculate XP reward for this hit
            // Total XP is split evenly among all hits required to defeat the mob
            const totalXPReward = calculateXPReward(skillDifficulty);
            // For instant-defeat mobs (miniboss, cleaning, memory), actualDamage = full health, so hitsToKill = 1
            // For regular mobs, actualDamage = damage, so hitsToKill = mobMaxHealth / damage
            const effectiveDamage = isInstantDefeat ? current.mobMaxHealth : damage;
            const hitsToKill = Math.ceil(current.mobMaxHealth / effectiveDamage);
            const xpPerHit = Math.floor(totalXPReward / hitsToKill);
            
            // If this hit doesn't defeat the mob, award partial XP
            // If this hit defeats the mob, award any remaining XP (to account for rounding)
            const willDefeatMobInUpdate = newMobHealth <= 0;
            if (!willDefeatMobInUpdate) {
                // Award partial XP for non-killing hit
                newXp += xpPerHit;
            }
            
            // Mob defeated!
            if (newMobHealth <= 0) {
                // Calculate remaining XP to award (total - already awarded)
                const hitsDealt = Math.ceil((current.mobMaxHealth - current.mobHealth) / effectiveDamage);
                const xpAlreadyAwarded = hitsDealt * xpPerHit;
                const remainingXP = totalXPReward - xpAlreadyAwarded;
                newXp += remainingXP;
                
                // Update stable mobs for memory and patterns skills on completion
                if (skillConfig.id === 'memory') {
                    newMemoryMob = getRandomFriendlyMob();
                }
                if (skillConfig.id === 'patterns') {
                    newPatternMob = getRandomAxolotl();
                }
                
                // Update miniboss when defeating a miniboss encounter
                if (getEncounterType(current.level) === 'miniboss') {
                    newMiniboss = getRandomMiniboss();
                }
                
                // Check for level restoration first
                if (newLostLevel) {
                    newLevel += 1;
                    newLostLevel = false;
                    newRecoveryDifficulty = null;
                    setShowLevelRestored(true);
                    setTimeout(() => setShowLevelRestored(false), 2000);
                    playNotification();
                }
                
                // Process level ups - use difficulty-scaled XP requirement
                const xpToLevel = calculateXPToLevel(newDifficulty);
                if (newXp >= xpToLevel) {
                    const levelsGained = Math.floor(newXp / xpToLevel);
                    const oldLevel = newLevel;
                    newLevel += levelsGained;
                    newXp = newXp % xpToLevel;
                    leveledUp = true;
                    
                    // Check if we just defeated a boss (leaving a boss level)
                    // Badge/difficulty increment happens when crossing FROM a boss level (e.g., 20->21)
                    // not when arriving AT a boss level (e.g., 19->20)
                    // Cleaning is exempt from difficulty auto-increment
                    if (skillConfig.id !== 'cleaning') {
                        for (let lvl = oldLevel; lvl < newLevel; lvl++) {
                            if (lvl % 20 === 0 && lvl > 0) {
                                // Boss at level lvl was just defeated - increment difficulty (max 7)
                                const newTier = Math.floor(lvl / 20);
                                if (newDifficulty < 7) {
                                    newDifficulty++;
                                }
                                // Award badge for this tier if not already earned
                                if (!newBadges.includes(newTier) && newTier <= 7) {
                                    newBadges.push(newTier);
                                    // Show badge notification for defeating the boss
                                    setLootBox({ level: lvl, skillName: skillConfig.fantasyName, item: "New Rank!", img: BASE_ASSETS.badges.Wood });
                                    playNotification();
                                }
                            }
                        }
                    }
                    
                    // Get new mob if not at boss level
                    if (newLevel % 20 !== 0 && (newLevel - 1) % 20 !== 0) {
                        newMob = getRandomMob(current.currentMob);
                    }
                    
                    if (leveledUp) {
                        playLevelUp();
                    }
                }
                
                // Spawn new mob with fresh health
                newMobMaxHealth = calculateMobHealth(newDifficulty);
                newMobHealth = newMobMaxHealth;
                if (newLevel % 20 !== 0) {
                    newMob = getRandomMob(current.currentMob);
                }
            }
            
            return {
                ...prev,
                [skillId]: {
                    ...current,
                    level: newLevel,
                    xp: newXp,
                    currentMob: newMob,
                    difficulty: newDifficulty,
                    earnedBadges: newBadges,
                    mobHealth: newMobHealth,
                    mobMaxHealth: newMobMaxHealth,
                    lostLevel: newLostLevel,
                    recoveryDifficulty: newRecoveryDifficulty,
                    memoryMob: newMemoryMob,
                    patternMob: newPatternMob,
                    currentMiniboss: newMiniboss
                }
            };
        });
        
        // Generate next challenge for continuous gameplay
        if (skillConfig.hasChallenge && skillConfig.id !== 'memory') {
            // Use the stored battle difficulty for consistent challenge generation throughout the battle
            // This ensures bosses don't change difficulty mid-fight and miniboss difficulty+1 is maintained
            const challengeDiff = battleDifficulty || skillDifficulty;
            setChallengeData(generateChallenge(skillConfig.challengeType, challengeDiff));
        } else if (skillConfig.id === 'memory') {
            setBattlingSkillId(null);
            setBattleDifficulty(null);
        }
    };

    // Helper function to set difficulty for a specific skill
    const setSkillDifficulty = (skillId, newDiff) => {
        setSkills(prev => {
            const current = prev[skillId];
            const newMobMaxHealth = calculateMobHealth(newDiff);
            return {
                ...prev,
                [skillId]: {
                    ...current,
                    difficulty: newDiff,
                    mobHealth: newMobMaxHealth,
                    mobMaxHealth: newMobMaxHealth
                }
            };
        });
    };

    // Award a free level from phantom click
    const handlePhantomLevelAward = (skillId) => {
        if (!skillId) return;
        
        // Play level up sound
        playLevelUp();
        
        setSkills(prev => {
            const current = prev[skillId];
            return {
                ...prev,
                [skillId]: {
                    ...current,
                    level: current.level + 1
                }
            };
        });
        
        // Show celebration notification
        const skillConfig = SKILL_DATA.find(s => s.id === skillId);
        if (skillConfig) {
            setLootBox({ 
                level: skills[skillId].level + 1, 
                skillName: skillConfig.fantasyName, 
                item: "Phantom Bonus!", 
                img: HOSTILE_MOBS['Phantom']
            });
            playNotification();
        }
    };

    const startBattle = (id) => {
        const skill = SKILL_DATA.find(s => s.id === id); 
        setBattlingSkillId(id);
        // Use the skill's current difficulty setting
        const currentDiff = skills[id].difficulty || 1;
        const playerLevel = skills[id].level;
        
        // For miniboss encounters, use difficulty+1 for content (capped at 7)
        const encounterType = getEncounterType(playerLevel);
        const challengeDiff = encounterType === 'miniboss' 
            ? Math.min(7, currentDiff + 1) 
            : currentDiff;
        
        // Store the battle's challenge difficulty so it remains consistent throughout the battle
        setBattleDifficulty(challengeDiff);
        
        setChallengeData(generateChallenge(skill.challengeType, challengeDiff));
        playClick();
        startBGM(); // Start BGM on first battle (user interaction)
        if (skill.challengeType === 'reading' && window.webkitSpeechRecognition) startVoiceListener(id);
    };

    const endBattle = () => {
        setBattlingSkillId(null);
        setBattleDifficulty(null);
        setChallengeData(null);
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        playClick();
    };

    const handleSwitchProfile = (newId) => {
        if (newId === currentProfile) return;
        playClick();
        const newSkills = loadSkills(newId);
        const newTheme = loadTheme(newId);
        setSkills(newSkills);
        setActiveTheme(newTheme);
        setCurrentProfile(newId);
    };
    const handleRenameProfile = (id, newName) => {
        setProfileNames(prev => ({ ...prev, [id]: newName }));
    };
    const handleParentVerified = (profileId, verified) => {
        setParentStatus(prev => ({ ...prev, [profileId]: verified }));
        
        if (verified && profileId === currentProfile) {
            // When parent verification passes, apply parent privileges to all skills
            setSkills(prev => {
                const updated = {};
                Object.keys(prev).forEach(skillId => {
                    const current = prev[skillId];
                    updated[skillId] = {
                        ...current,
                        level: PARENT_PRIVILEGE_LEVEL,
                        difficulty: PARENT_PRIVILEGE_DIFFICULTY,
                        earnedBadges: [...PARENT_PRIVILEGE_BADGES],
                        mobHealth: calculateMobHealth(PARENT_PRIVILEGE_DIFFICULTY, PARENT_PRIVILEGE_LEVEL),
                        mobMaxHealth: calculateMobHealth(PARENT_PRIVILEGE_DIFFICULTY, PARENT_PRIVILEGE_LEVEL)
                    };
                });
                return updated;
            });
        }
    };
    const handleReset = () => {
        localStorage.removeItem(getStorageKey(currentProfile));
        if (currentProfile === 1) localStorage.removeItem('heroSkills_v23');
        // Clear parent status for current profile
        setParentStatus(prev => ({ ...prev, [currentProfile]: false }));
        // Reset profile name to default
        setProfileNames(prev => ({ ...prev, [currentProfile]: `Player ${currentProfile}` }));
        window.location.reload();
    };

    const startVoiceListener = (targetId) => {
        if (!window.webkitSpeechRecognition) return;
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.continuous = true;
        recognitionRef.current.onstart = () => { 
            setIsListening(true); 
            setSpokenText("Listening..."); 
        };
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (e) => { 
            const t = e.results[e.results.length - 1][0].transcript.toUpperCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); 
            setSpokenText(t); 
            // Use the ref to get the CURRENT challenge data
            const currentChallenge = challengeDataRef.current;
            if (currentChallenge && (t === currentChallenge.answer || HOMOPHONES[currentChallenge.answer]?.includes(t))) {
                handleSuccessHit(targetId || battlingSkillId); 
            }
        };
        recognitionRef.current.start();
    };

    useEffect(() => { if(lootBox) setTimeout(() => setLootBox(null), 4000); }, [lootBox]);
    
    const getVisibleItems = () => {
        const items = [];
        for (let i = -2; i <= 2; i++) {
            let idx = selectedIndex + i;
            let dataIndex = idx % SKILL_DATA.length;
            if (dataIndex < 0) dataIndex += SKILL_DATA.length;
            items.push({ ...SKILL_DATA[dataIndex], offset: i, key: idx });
        }
        return items;
    };
    const currentThemeData = THEME_CONFIG[activeTheme] || THEME_CONFIG.minecraft;
    const containerStyle = { ...currentThemeData.style, fontFamily: '"VT323", monospace' };

    // Drag handlers for carousel navigation
    const handleDragStart = (clientX) => {
        if (battlingSkillId) return;
        setIsDragging(true);
        setDragStartX(clientX);
    };
    const handleDragMove = (clientX) => {
        if (!isDragging || battlingSkillId) return;
        const diff = dragStartX - clientX;
        if (Math.abs(diff) >= 100) {
            if (diff > 0) {
                setSelectedIndex(p => p + 1);
                playActionCardRight();
            } else {
                setSelectedIndex(p => p - 1);
                playActionCardLeft();
            }
            setIsDragging(false);
        }
    };
    const handleDragEnd = () => {
        setIsDragging(false);
    };
    const handleCardClick = (offset) => {
        if (battlingSkillId || offset === 0) return;
        setSelectedIndex(p => p + offset);
        if (offset > 0) {
            playActionCardRight();
        } else {
            playActionCardLeft();
        }
    };

    return (
        <div className="min-h-screen overflow-hidden relative flex flex-col bg-cover bg-center bg-no-repeat font-sans text-stone-100" style={containerStyle}>
            <GlobalStyles />
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-0"></div>
            <button onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(true); playClick(); }} className="absolute z-40 bg-stone-800/90 text-white p-3 rounded-lg border-2 border-stone-600 hover:bg-stone-700 transition-all shadow-lg" style={{ top: '16px', left: '16px' }}><Sparkles size={32} className="text-yellow-400" /></button>
            <div className="absolute z-40 flex gap-2" style={{ top: '16px', left: '80px' }}>{Array(10).fill(0).map((_, i) => (<Heart key={i} size={32} className={`${i < playerHealth ? 'fill-red-600 text-red-600' : 'fill-gray-900 text-gray-700'} drop-shadow-md`} />))}</div>
            {/* Settings drawer overlay - click to close */}
            {isSettingsOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => { setIsSettingsOpen(false); playClick(); }}
                />
            )}
            <SettingsDrawer isOpen={isSettingsOpen} activeTheme={activeTheme} setActiveTheme={setActiveTheme} onReset={() => setIsResetOpen(true)} bgmVol={bgmVol} setBgmVol={setBgmVol} sfxVol={sfxVol} setSfxVol={setSfxVolState} currentProfile={currentProfile} onSwitchProfile={handleSwitchProfile} profileNames={profileNames} onRenameProfile={handleRenameProfile} getProfileStats={getProfileStats} parentStatus={parentStatus} onParentVerified={handleParentVerified} currentSkills={skills} />
            <ResetModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} onConfirm={handleReset} />
            <button onClick={() => { setIsSettingsOpen(false); setIsMenuOpen(true); playClick(); }} className="absolute z-40 bg-stone-800/90 text-white p-3 rounded-lg border-2 border-stone-600 hover:bg-stone-700 transition-all shadow-lg" style={{ top: '16px', right: '16px' }}><Menu size={32} /></button>
            {/* Achievement drawer overlay - click to close */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => { setIsMenuOpen(false); playClick(); }}
                />
            )}
            <MenuDrawer isOpen={isMenuOpen} skills={skills} />
            {/* Backdrop overlay when battling - click to exit */}
            {battlingSkillId && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100vw', minHeight: '100vh' }}
                    onClick={endBattle}
                />
            )}
            <main className="flex-1 relative flex flex-col items-center justify-center w-full">
                <div className="z-10 relative mb-[-30px] md:mb-[-50px] pointer-events-none opacity-90"><SafeImage src={currentThemeData.assets.logo} fallbackSrc="https://placehold.co/800x300/333/FFD700?text=LOGO+PLACEHOLDER&font=monsterrat" alt="Game Logo" className="w-[480px] md:w-[720px] lg:w-[960px] object-contain drop-shadow-2xl" /></div>
                <h1 className="text-9xl text-yellow-400 tracking-widest uppercase mb-[80px] z-20 relative drop-shadow-[4px_4px_0_#000]" style={{ textShadow: '6px 6px 0 #000' }}>Level Up!</h1>
                <button onClick={() => {setSelectedIndex(p => p - 1); playActionCardLeft();}} className="flex absolute left-4 md:left-8 z-30 bg-stone-800/80 text-white p-3 md:p-4 border-4 border-stone-600 rounded-sm"><ChevronLeft size={32} className="md:w-10 md:h-10" /></button>
                <button onClick={() => {setSelectedIndex(p => p + 1); playActionCardRight();}} className="flex absolute right-4 md:right-8 z-30 bg-stone-800/80 text-white p-3 md:p-4 border-4 border-stone-600 rounded-sm"><ChevronRight size={32} className="md:w-10 md:h-10" /></button>
                <div 
                    className={`relative w-full flex items-center justify-center perspective-1000 h-[650px] mb-12 ${battlingSkillId ? 'z-50' : ''}`}
                    style={{ cursor: battlingSkillId ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => { e.preventDefault(); handleDragMove(e.touches[0].clientX); }}
                    onTouchEnd={handleDragEnd}
                >
                    {getVisibleItems().map((item) => {
                        const isItemBattling = item.offset === 0 && battlingSkillId === item.id;
                        return (
                        <div key={item.key} className="absolute transition-all duration-500 ease-out" style={{ transform: `translateX(${item.offset * 320}px) scale(${item.offset === 0 ? 1.1 : 0.85})`, opacity: item.offset === 0 ? 1 : 0.6, zIndex: isItemBattling ? 50 : (item.offset === 0 ? 20 : 10 - Math.abs(item.offset)), filter: item.offset === 0 ? 'none' : 'brightness(0.5) blur(1px)', cursor: item.offset !== 0 && !battlingSkillId ? 'pointer' : 'default' }} onClick={() => handleCardClick(item.offset)}>
                            <SkillCard 
                                config={item} data={skills[item.id]} themeData={currentThemeData} isCenter={item.offset === 0} isBattling={item.offset === 0 && battlingSkillId === item.id}
                                mobName={getMobForSkill(item, skills[item.id])} challenge={challengeData} isListening={isListening} spokenText={spokenText} damageNumbers={damageNumbers.filter(d => d.skillId === item.id)}
                                onStartBattle={() => startBattle(item.id)} onEndBattle={endBattle}
                                onMathSubmit={(val) => handleSuccessHit(item.id, val)} onMicClick={() => startVoiceListener(item.id)}
                                difficulty={skills[item.id].difficulty || 1} 
                                setDifficulty={(newDiff) => setSkillDifficulty(item.id, newDiff)} 
                                unlockedDifficulty={Math.min(7, Math.floor(skills[item.id].level / 20) + 1)}
                            />
                        </div>
                        );
                    })}
                </div>
            </main>
            {lootBox && <div className="fixed bottom-8 left-1/2 z-50 animate-toast w-full max-w-2xl pointer-events-none transform -translate-x-1/2"><div className="bg-black/80 border-4 border-yellow-500 rounded-full p-4 px-12 flex items-center justify-between shadow-[0_0_30px_rgba(255,215,0,0.6)] backdrop-blur-md mx-4"><div className="flex items-center gap-4"><div className="bg-yellow-500/20 p-3 rounded-full border-2 border-yellow-400"><Gift size={32} className="text-yellow-300 animate-bounce" /></div><div className="text-left"><h2 className="text-2xl text-yellow-400 font-bold leading-none mb-1">LEVEL {lootBox.level} REACHED!</h2><p className="text-stone-300 text-sm">{lootBox.skillName}</p></div></div><div className="text-right pl-8 border-l-2 border-stone-600 flex items-center gap-4"><SafeImage src={lootBox.img} alt="Badge" className="w-12 h-12 object-contain" /><div><p className="text-stone-400 text-xs uppercase tracking-wider">Unlocked</p><p className="text-2xl text-green-400 font-bold">{lootBox.item}</p></div></div></div></div>}
            
            {/* Death Overlay - Minecraft-style YOU DIED screen */}
            {showDeathOverlay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/60 animate-pulse pointer-events-none">
                    <div className="text-center">
                        <h1 className="text-8xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000' }}>
                            YOU DIED
                        </h1>
                        <p className="text-2xl text-red-300 mt-4">Level -1</p>
                        <p className="text-lg text-stone-400 mt-2">Take a moment to rest...</p>
                    </div>
                </div>
            )}
            
            {/* Level Restored celebration */}
            {showLevelRestored && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="text-center animate-bounce">
                        <h1 className="text-6xl font-bold text-green-400 drop-shadow-[0_0_20px_rgba(0,255,0,0.8)]" style={{ textShadow: '4px 4px 0 #000' }}>
                            LEVEL RESTORED!
                        </h1>
                        <p className="text-2xl text-yellow-400 mt-4">Welcome back, hero!</p>
                    </div>
                </div>
            )}
            
            {/* Phantom Fly-By Bonus Event */}
            <PhantomEvent 
                battlingSkillId={battlingSkillId} 
                onAwardLevel={handlePhantomLevelAward} 
            />
        </div>
    );
};

export default App;