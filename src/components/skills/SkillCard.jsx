import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Mic, Plus, Minus } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { BASE_ASSETS, FRIENDLY_MOBS, HOSTILE_MOBS, CHEST_BLOCKS, BOSS_MOBS, MINIBOSS_MOBS, DIFFICULTY_IMAGES, DIFFICULTY_CONTENT } from '../../constants/gameData';
import { playClick, getSfxVolume } from '../../utils/soundManager';

const PRESTIGE_LEVEL_THRESHOLD = 20;

const SkillCard = ({ config, data, themeData, isCenter, isBattling, mobName, challenge, isListening, spokenText, damageNumbers, onStartBattle, onEndBattle, onMathSubmit, onMicClick, difficulty, setDifficulty, unlockedDifficulty }) => {
    const [mathInput, setMathInput] = useState('');
    const [isHit, setIsHit] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const prevDamageCount = useRef(0);
    const inputRef = useRef(null);
    
    const [memoryCards, setMemoryCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [isProcessingMatch, setIsProcessingMatch] = useState(false);
    const [mismatchShake, setMismatchShake] = useState(false);
    
    // Ref to track if memory game session was initialized for the current battle
    const memorySessionStartedRef = useRef(false);

    // Simon Says state for Pattern Recognition
    const [simonSequence, setSimonSequence] = useState([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [completedRounds, setCompletedRounds] = useState(0);
    const [litAxolotl, setLitAxolotl] = useState(null);
    const [simonGameActive, setSimonGameActive] = useState(false);
    
    // Ref to track if patterns game session was initialized for the current battle
    const simonSessionStartedRef = useRef(false);

    // Calculate HP percentage based on mobHealth/mobMaxHealth for HP bar display
    const mobHealth = data.mobHealth || 100;
    const mobMaxHealth = data.mobMaxHealth || 100;
    const hpPercent = Math.round((mobHealth / mobMaxHealth) * 100);
    
    let borderClass = 'border-stone-500';
    let levelTextColor = 'text-white';
    if (data.level >= 20) { levelTextColor = 'text-amber-700'; borderClass = 'border-wood'; }
    if (data.level >= 40) { levelTextColor = 'text-stone-400'; borderClass = 'border-stone'; }
    if (data.level >= 60) { levelTextColor = 'text-yellow-400'; borderClass = 'border-gold'; }
    if (data.level >= 80) { levelTextColor = 'text-gray-200'; borderClass = 'border-iron'; }
    if (data.level >= 100) { levelTextColor = 'text-emerald-400'; borderClass = 'border-emerald'; }
    if (data.level >= 120) { levelTextColor = 'text-cyan-300'; borderClass = 'border-diamond'; }
    if (data.level >= 140) { levelTextColor = 'text-gray-500'; borderClass = 'border-netherite'; }
    if (data.level >= 160) { levelTextColor = 'text-rainbow'; borderClass = 'border-netherite'; }

    const skillThemeConfig = themeData.skills[config.id] || {};
    const skillName = skillThemeConfig.name || config.name;
    
    // Determine valid mob source and display name based on skill type
    let mobSrc;
    let displayMobName = mobName;
    
    if (config.id === 'memory') {
        mobSrc = FRIENDLY_MOBS[mobName] || themeData.assets.mobs[mobName] || BASE_ASSETS.axolotls.Pink;
    } else if (config.id === 'cleaning') {
        mobSrc = CHEST_BLOCKS[mobName] || themeData.assets.mobs[mobName] || BASE_ASSETS.axolotls.Pink;
    } else if (config.id === 'patterns') {
        // Patterns skill uses axolotls from BASE_ASSETS.axolotls
        mobSrc = BASE_ASSETS.axolotls[mobName] || BASE_ASSETS.axolotls.Pink;
    } else {
        // Combat skills (reading, writing, math) - validate mob exists
        // Check hostile mobs, boss mobs, and miniboss mobs
        mobSrc = HOSTILE_MOBS[mobName] || BOSS_MOBS[mobName] || MINIBOSS_MOBS[mobName] || themeData.assets.mobs[mobName];
        if (!mobSrc) {
            // Fallback to a random hostile mob if the provided name is invalid
            const hostileMobKeys = Object.keys(HOSTILE_MOBS);
            displayMobName = hostileMobKeys.length > 0 ? hostileMobKeys[Math.floor(Math.random() * hostileMobKeys.length)] : 'Zombie';
            mobSrc = HOSTILE_MOBS[displayMobName] || BASE_ASSETS.axolotls.Pink;
        }
    }

    const gemStyle = {}; 

    // Extract button colors from config.colorStyle to match card background
    const getButtonStyle = () => {
        const gradientMatch = config.colorStyle?.background?.match(/#([a-fA-F0-9]{6})/g);
        if (gradientMatch && gradientMatch.length >= 2) {
            const fromColor = gradientMatch[0];
            const toColor = gradientMatch[1];
            // Create a darker shadow color from the 'to' color
            const darkenColor = (hex) => {
                const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
                const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
                const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            };
            const shadowColor = darkenColor(toColor);
            return {
                background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
                boxShadow: `0 6px 0 ${shadowColor}`,
                borderColor: fromColor
            };
        }
        return {
            background: 'linear-gradient(to bottom, #7e22ce, #581c87)',
            boxShadow: '0 6px 0 #581c87',
            borderColor: '#a855f7'
        };
    };

    const buttonStyle = getButtonStyle();
    
    // Helper function to play mismatch sound with proper volume
    const playMismatch = () => {
        const audio = new Audio(BASE_ASSETS.audio.mismatch);
        audio.volume = getSfxVolume();
        audio.play().catch(() => {});
    };

    useEffect(() => { setMathInput(''); }, [challenge]);
    
    // Memory game config based on difficulty
    const memoryConfig = DIFFICULTY_CONTENT.memory[difficulty] || DIFFICULTY_CONTENT.memory[1];
    const memoryPairs = memoryConfig.pairs || 3;
    const memoryGridCols = memoryConfig.gridCols || 4;
    
    useEffect(() => {
        if (isBattling && config.id === 'memory' && !memorySessionStartedRef.current) {
            // Only regenerate cards when entering battle if no session started yet
            memorySessionStartedRef.current = true;
            const allMobKeys = Object.keys(FRIENDLY_MOBS);
            const shuffledMobs = [...allMobKeys].sort(() => Math.random() - 0.5);
            const selectedMobs = shuffledMobs.slice(0, memoryPairs);
            // Create pairs from the selected mobs
            let deck = [...selectedMobs, ...selectedMobs].sort(() => Math.random() - 0.5);
            setMemoryCards(deck.map((mobKey, i) => ({ id: i, color: mobKey, img: FRIENDLY_MOBS[mobKey] })));
            setFlippedIndices([]); setMatchedPairs([]); setIsProcessingMatch(false); setMismatchShake(false);
        } else if (!isBattling && config.id === 'memory') {
            // Reset memory game state and session ref when exiting battle
            memorySessionStartedRef.current = false;
            setMemoryCards([]);
            setFlippedIndices([]); setMatchedPairs([]); setIsProcessingMatch(false); setMismatchShake(false);
        }
    }, [isBattling, config.id, memoryPairs]);

    useEffect(() => {
        if (damageNumbers.length > prevDamageCount.current) { setIsHit(true); setTimeout(() => setIsHit(false), 400); }
        prevDamageCount.current = damageNumbers.length;
    }, [damageNumbers]);

    // Pattern config based on difficulty
    const patternConfig = DIFFICULTY_CONTENT.patterns[difficulty] || DIFFICULTY_CONTENT.patterns[1];
    const axolotlCount = patternConfig.axolotlCount || 2;
    const shouldResetSequence = patternConfig.resetSequence || false;

    // Simon Says initialization and sequence playback
    // Only use the number of axolotls specified by difficulty
    const allAxolotlColors = Object.keys(BASE_ASSETS.axolotls);
    const axolotlColors = allAxolotlColors.slice(0, Math.min(axolotlCount, allAxolotlColors.length));
    
    const playSequence = (sequence) => {
        setIsShowingSequence(true);
        setPlayerIndex(0);
        let i = 0;
        const playNext = () => {
            if (i < sequence.length) {
                setLitAxolotl(sequence[i]);
                playClick();
                setTimeout(() => {
                    setLitAxolotl(null);
                    i++;
                    setTimeout(playNext, 200);
                }, 600);
            } else {
                setIsShowingSequence(false);
            }
        };
        setTimeout(playNext, 500);
    };

    const startSimonGame = () => {
        const firstColor = axolotlColors[Math.floor(Math.random() * axolotlColors.length)];
        const newSequence = [firstColor];
        setSimonSequence(newSequence);
        setPlayerIndex(0);
        setCompletedRounds(0);
        setSimonGameActive(true);
        playSequence(newSequence);
    };

    const handleAxolotlClick = (color) => {
        if (isShowingSequence || !simonGameActive) return;
        
        playClick();
        
        if (color === simonSequence[playerIndex]) {
            // Correct click
            if (playerIndex === simonSequence.length - 1) {
                // Completed the sequence
                const matchAudio = new Audio(BASE_ASSETS.audio.match);
                matchAudio.volume = getSfxVolume();
                matchAudio.play().catch(() => {});
                const newRounds = completedRounds + 1;
                setCompletedRounds(newRounds);
                
                // For difficulty 7, reset sequence each round instead of building
                let newSequence;
                if (shouldResetSequence) {
                    // Generate completely new sequence of same length + 1
                    newSequence = [];
                    for (let i = 0; i < simonSequence.length + 1; i++) {
                        newSequence.push(axolotlColors[Math.floor(Math.random() * axolotlColors.length)]);
                    }
                } else {
                    // Normal mode: Add new random axolotl to sequence
                    const nextColor = axolotlColors[Math.floor(Math.random() * axolotlColors.length)];
                    newSequence = [...simonSequence, nextColor];
                }
                
                setSimonSequence(newSequence);
                setPlayerIndex(0);
                setTimeout(() => playSequence(newSequence), 800);
            } else {
                // Move to next in sequence
                setPlayerIndex(playerIndex + 1);
            }
        } else {
            // Wrong click - game over
            const mismatchAudio = new Audio(BASE_ASSETS.audio.mismatch);
            mismatchAudio.volume = getSfxVolume();
            mismatchAudio.play().catch(() => {});
            setSimonGameActive(false);
            // Deal damage based on completed rounds (submit WIN with rounds as damage multiplier)
            setTimeout(() => {
                onMathSubmit("WIN", completedRounds);
            }, 500);
        }
    };

    useEffect(() => {
        if (isBattling && config.id === 'patterns' && !simonSessionStartedRef.current) {
            // Only start a new game when entering battle if no session started yet
            simonSessionStartedRef.current = true;
            startSimonGame();
        } else if (!isBattling && config.id === 'patterns') {
            // Reset Simon Says state and session ref when not battling
            simonSessionStartedRef.current = false;
            setSimonSequence([]);
            setPlayerIndex(0);
            setIsShowingSequence(false);
            setCompletedRounds(0);
            setLitAxolotl(null);
            setSimonGameActive(false);
        }
    }, [isBattling, config.id]);

    const handleCardClick = (index) => {
        if (isProcessingMatch || flippedIndices.includes(index) || matchedPairs.includes(memoryCards[index].color)) return;
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);
        playClick();

        if (newFlipped.length === 2) {
            setIsProcessingMatch(true);
            setTimeout(() => {
                if (memoryCards[newFlipped[0]].color === memoryCards[newFlipped[1]].color) {
                    const matchAudio = new Audio(BASE_ASSETS.audio.match);
                    matchAudio.volume = getSfxVolume();
                    matchAudio.play().catch(() => {});
                    const newMatched = [...matchedPairs, memoryCards[newFlipped[0]].color];
                    setMatchedPairs(newMatched); setFlippedIndices([]); setIsProcessingMatch(false);
                    // Win when all pairs are matched (use memoryPairs from difficulty config)
                    if (newMatched.length === memoryPairs) setTimeout(() => onMathSubmit("WIN"), 500);
                } else {
                    const mismatchAudio = new Audio(BASE_ASSETS.audio.mismatch);
                    mismatchAudio.volume = getSfxVolume();
                    mismatchAudio.play().catch(() => {});
                    setMismatchShake(true);
                    setTimeout(() => { setMismatchShake(false); setFlippedIndices([]); setIsProcessingMatch(false); }, 500);
                }
            }, 300);
        }
    };

    const showMob = !isBattling || config.id !== 'memory';
    const topSectionBaseClass = config.id === 'memory' && isBattling ? 'hidden' : 'h-[55%] relative flex items-center justify-center overflow-hidden rounded-t-sm';
    const bottomSectionClass = config.id === 'memory' && isBattling ? 'h-full bg-[#3a3a3a] p-4 flex flex-col relative rounded-lg' : 'flex-1 bg-[#3a3a3a] p-4 flex flex-col relative rounded-b-sm';

    const isBattlingCenter = isBattling && isCenter;

    const cardContent = (
        <div
            className={`bg-[#2b2b2b] border-4 rounded-lg overflow-visible flex flex-col transition-all duration-500 ${isCenter ? `selected-card-glow ${borderClass}` : 'border-stone-700'} w-[300px] h-[600px] ${!isBattlingCenter ? 'relative' : ''}`}
        >
                {isCenter && data.level >= PRESTIGE_LEVEL_THRESHOLD && <div className="gem-socket"><div className="gem-stone" style={gemStyle}></div></div>}
                <div className={topSectionBaseClass} style={config.colorStyle}>
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white border border-white/20 z-20"><div className="text-xs text-gray-400 uppercase">{skillName}</div><div className="text-lg leading-none">{config.fantasyName}</div></div>
                    <div className="absolute top-2 right-2 z-20"><div className={`bg-black/60 px-3 py-1 rounded border border-white/20 text-3xl font-bold ${levelTextColor}`}>Lvl {data.level}</div></div>
                    {showMob && <div className="relative z-10 flex items-center justify-center h-full max-h-[200px]"><SafeImage key={displayMobName} src={mobSrc} alt={displayMobName} className={`max-w-[160px] max-h-[160px] w-auto h-auto object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-transform duration-100 ${isHit ? 'animate-knockback' : 'animate-bob'}`} />{damageNumbers.map(dmg => (<div key={dmg.id} className="absolute text-5xl font-bold text-red-500 animate-bounce pointer-events-none whitespace-nowrap" style={{ left: `calc(50% + ${dmg.x}px)`, top: `calc(50% + ${dmg.y}px)`, textShadow: '2px 2px 0 #000' }}>-{dmg.val}</div>))}</div>}
                    {config.id !== 'memory' && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-2 rounded-full text-white border-2 border-white/30 text-xl font-bold tracking-wide z-10 shadow-lg whitespace-nowrap min-w-max">{displayMobName}</div>}
                </div>
                {(!isBattling || config.id !== 'memory') && <div className="bg-[#1a1a1a] p-2 border-t-4 border-b-4 border-black relative"><div className="flex justify-between text-gray-400 text-xs mb-1 uppercase"><span>HP</span><span>{hpPercent}%</span></div><div className="w-full h-6 bg-[#333] rounded-full overflow-hidden border-2 border-[#555] relative"><div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-200" style={{ width: `${hpPercent}%` }}></div></div></div>}
            <div className={bottomSectionClass}>
                {isBattling ? (
                    <div className="flex flex-col h-full animate-in slide-in-from-bottom-10 duration-300">
                        <div className="text-center mb-2"><span className="text-yellow-400 text-lg uppercase animate-pulse tracking-wide">{config.taskDescription}</span></div>
                        {config.id === 'memory' ? (
                            <div className={`flex-1 grid gap-2 bg-black/20 p-2 rounded items-center`} style={{ gridTemplateColumns: `repeat(${memoryGridCols}, 1fr)` }}>
                                {memoryCards.map((card, index) => {
                                    const isFlipped = flippedIndices.includes(index);
                                    const isMatched = matchedPairs.includes(card.color);
                                    if (isMatched) return <div key={card.id} className="w-full aspect-[2/3]"></div>;
                                    return (
                                        <div key={card.id} onClick={() => handleCardClick(index)} className={`w-full aspect-[2/3] cursor-pointer transition-all duration-300 perspective-1000 relative transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} ${mismatchShake && isFlipped ? 'animate-shake-flipped border-red-500' : ''}`}>
                                            <div className="absolute inset-0 backface-hidden w-full h-full" style={{ backfaceVisibility: 'hidden' }}><SafeImage src={themeData.assets.cardBack} className="w-full h-full object-cover rounded border border-stone-600" /></div>
                                            <div className="absolute inset-0 backface-hidden w-full h-full rotate-y-180 bg-slate-800 rounded border border-white/20 flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}><SafeImage src={card.img} className="w-full h-full object-contain p-1" /></div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                {config.id === 'patterns' ? (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        {/* Round counter */}
                                        <div className="text-white text-lg font-bold">
                                            Round: {completedRounds} {isShowingSequence && <span className="text-yellow-400 animate-pulse">Watch!</span>}
                                            {!isShowingSequence && simonGameActive && <span className="text-green-400">Your turn!</span>}
                                            {shouldResetSequence && <span className="text-purple-400 text-sm ml-2">(New sequence each round!)</span>}
                                        </div>
                                        {/* Dynamic axolotl formation based on difficulty */}
                                        <div className="relative w-[240px] h-[240px]">
                                            {axolotlColors.map((color, index) => {
                                                // Calculate angle based on number of axolotls (evenly distributed around circle)
                                                const anglePerAxolotl = 360 / axolotlColors.length;
                                                const angle = (index * anglePerAxolotl - 90) * (Math.PI / 180);
                                                const radius = 85;
                                                const x = 120 + radius * Math.cos(angle) - 40;
                                                const y = 120 + radius * Math.sin(angle) - 40;
                                                const isLit = litAxolotl === color;
                                                return (
                                                    <div
                                                        key={color}
                                                        onClick={() => handleAxolotlClick(color)}
                                                        className={`absolute w-[80px] h-[80px] cursor-pointer transition-all duration-200 rounded-full p-1 ${isLit ? 'scale-125 ring-4 ring-yellow-400 brightness-150 z-10' : 'hover:scale-110'} ${isShowingSequence ? 'pointer-events-none' : ''}`}
                                                        style={{ left: x, top: y }}
                                                    >
                                                        <SafeImage
                                                            src={BASE_ASSETS.axolotls[color]}
                                                            alt={color}
                                                            className="w-full h-full object-contain drop-shadow-lg"
                                                        />
                                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white bg-black/60 px-1 rounded">{color}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {!simonGameActive && completedRounds > 0 && (
                                            <div className="text-red-400 text-lg font-bold animate-pulse">Game Over! Rounds: {completedRounds}</div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 bg-black/40 rounded border-2 border-[#555] flex items-center justify-center mb-3 p-2 relative overflow-hidden w-full">
                                            {config.challengeType === 'writing' ? (
                                                // Display single or multiple item images for writing challenge
                                                <div className="flex items-center justify-center gap-2">
                                                    {challenge?.images?.map((img, idx) => (
                                                        <React.Fragment key={idx}>
                                                            {idx > 0 && <span className="text-3xl text-yellow-400 font-bold">+</span>}
                                                            <SafeImage src={img} className="w-16 h-16 object-contain animate-bob" />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            ) : <span className="text-4xl text-white font-bold tracking-wider">{challenge?.question.replace('Write: ', '')}</span>}
                                            {config.challengeType === 'reading' && <div className="absolute bottom-1 text-xs text-gray-400">{spokenText || (isListening ? "Listening..." : "Mic Off")}</div>}
                                        </div>
                                        {config.challengeType === 'math' && <div className="relative w-full flex justify-center"><input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" value={mathInput} onChange={(e) => { const val = e.target.value.replace(/[^0-9-]/g, ''); setMathInput(val); if (val === String(challenge?.answer)) { onMathSubmit(val); setMathInput(''); } else if (val.length === String(challenge?.answer).length) { setIsWrong(true); playMismatch(); onMathSubmit('WRONG'); setTimeout(() => { setIsWrong(false); setMathInput(''); inputRef.current?.focus(); }, 500); } }} className="absolute inset-0 opacity-0 cursor-pointer" autoFocus maxLength={String(challenge?.answer).length} disabled={isWrong} /><div className={`flex gap-2 ${isWrong ? 'animate-shake' : ''}`}>{String(challenge?.answer).split('').map((char, i) => (<div key={i} className={`w-10 h-12 border-b-4 flex items-center justify-center text-2xl font-mono font-bold text-white bg-black/20 rounded-t ${isWrong ? 'border-red-500 bg-red-900/30' : (i < mathInput.length ? 'border-green-500' : 'border-gray-600')}`}>{mathInput[i] || ''}</div>))}</div></div>}
                                        {config.challengeType === 'writing' && <div className="relative w-full flex justify-center"><input ref={inputRef} type="text" value={mathInput} onChange={(e) => { const val = e.target.value.toUpperCase(); setMathInput(val); if (val === challenge?.answer) { onMathSubmit(val); setMathInput(''); } else if (val.length === challenge?.answer.length) { setIsWrong(true); playMismatch(); setTimeout(() => { setIsWrong(false); setMathInput(''); inputRef.current?.focus(); }, 500); } }} className="absolute inset-0 opacity-0 cursor-pointer" autoFocus maxLength={challenge?.answer.length} disabled={isWrong} /><div className={`flex gap-1 flex-wrap justify-center ${isWrong ? 'animate-shake' : ''}`}>{challenge?.answer.split('').map((char, i) => (<div key={i} className={`${challenge?.answer.length > 6 ? 'w-7 h-9 text-lg' : 'w-10 h-12 text-2xl'} border-b-4 flex items-center justify-center font-mono font-bold text-white bg-black/20 rounded-t ${isWrong ? 'border-red-500 bg-red-900/30' : (i < mathInput.length ? 'border-green-500' : 'border-gray-600')}`}>{mathInput[i] || ''}</div>))}</div></div>}
                                        {config.challengeType === 'reading' && <button onClick={onMicClick} className={`w-full text-center p-2 rounded border-2 transition-colors flex items-center justify-center gap-2 ${isListening ? 'border-red-500 bg-red-900/20' : 'border-gray-600 hover:bg-white/10'}`}>{isListening ? <Mic className="inline animate-pulse text-red-500" /> : <><Mic className="inline text-gray-500" /><span className="text-xs uppercase font-bold text-stone-400">Tap to Speak</span></>}</button>}
                                        {config.challengeType === 'cleaning' && <button onClick={() => onMathSubmit(challenge?.answer)} className="w-full bg-green-600 hover:bg-green-500 text-white text-3xl font-bold py-4 rounded shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-[4px] transition-all">Complete!</button>}
                                        {config.challengeType !== 'cleaning' && config.challengeType !== 'writing' && config.challengeType !== 'math' && <button onClick={() => onMathSubmit(challenge?.answer)} className="mt-auto text-xs text-gray-500 underline hover:text-white self-center">Skip / Manual Success</button>}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <p className="text-gray-400 text-center mb-4 px-2">{config.taskDescription}</p>
                        <button onClick={onStartBattle} style={buttonStyle} className={`w-full text-white text-3xl font-bold py-6 rounded-lg active:shadow-none active:translate-y-[6px] transition-all border-2 uppercase tracking-wider`}>
                            {config.actionName}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (isBattlingCenter) {
        return ReactDOM.createPortal(
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={onEndBattle}
            >
                <div 
                    style={{
                        transform: 'scale(1.5)',
                        transformOrigin: 'center center',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {cardContent}
                </div>
            </div>,
            document.body
        );
    }

    return (
        <div className="relative">
            {/* Difficulty adjuster positioned above the card - hidden for cleaning skill */}
            {(!isBattling || config.id !== 'memory') && config.id !== 'cleaning' && (
                <div className="absolute -top-10 left-0 flex items-center gap-2 z-20">
                    <button onClick={() => setDifficulty(Math.max(1, difficulty - 1))} className="bg-stone-700 text-white rounded p-1 border border-stone-500 hover:bg-stone-600"><Minus size={16} /></button>
                    <div className="relative">
                        <SafeImage 
                            src={DIFFICULTY_IMAGES[difficulty] || DIFFICULTY_IMAGES[1]} 
                            alt={`Difficulty ${difficulty}`} 
                            className="w-8 h-8 object-contain"
                        />
                        {/* Difficulty level number indicator in bottom-right corner */}
                        <span className="absolute -bottom-1 -right-1 bg-black/90 text-yellow-400 text-xs font-bold px-1 rounded border border-yellow-500/50 min-w-[16px] text-center">
                            {difficulty}
                        </span>
                    </div>
                    <button onClick={() => setDifficulty(Math.min(unlockedDifficulty, difficulty + 1))} className="bg-stone-700 text-white rounded p-1 border border-stone-500 hover:bg-stone-600"><Plus size={16} /></button>
                </div>
            )}
            {cardContent}
        </div>
    );
};

export default SkillCard;
