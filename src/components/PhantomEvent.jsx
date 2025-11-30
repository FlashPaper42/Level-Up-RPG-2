import { useState, useEffect, useRef, useCallback } from 'react';
import { HOSTILE_MOBS, BASE_ASSETS } from '../constants/gameData';

const PHANTOM_COOLDOWN_KEY = 'phantomEvent_lastSpawn_v1';
const MIN_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MAX_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const FLIGHT_DURATION_MS = 4000; // 4 seconds to cross the screen

const PhantomEvent = ({ battlingSkillId, onAwardLevel }) => {
    const [isActive, setIsActive] = useState(false);
    const [fromLeft, setFromLeft] = useState(true);
    const [clicked, setClicked] = useState(false);
    const timeoutRef = useRef(null);
    const flightTimeoutRef = useRef(null);
    const spawnPhantomRef = useRef(null);

    // Schedule the next phantom spawn
    const scheduleNextSpawn = useCallback(() => {
        const lastSpawn = parseInt(localStorage.getItem(PHANTOM_COOLDOWN_KEY) || '0', 10);
        const now = Date.now();
        const timeSinceLastSpawn = now - lastSpawn;
        
        // Calculate how long until we can spawn again
        let delay;
        if (timeSinceLastSpawn >= MIN_COOLDOWN_MS) {
            // Cooldown has passed, spawn after a random delay (0 to 5 minutes)
            delay = Math.random() * (MAX_COOLDOWN_MS - MIN_COOLDOWN_MS);
        } else {
            // Wait for minimum cooldown plus some random extra time
            delay = (MIN_COOLDOWN_MS - timeSinceLastSpawn) + Math.random() * (MAX_COOLDOWN_MS - MIN_COOLDOWN_MS);
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (spawnPhantomRef.current) {
                spawnPhantomRef.current();
            }
        }, delay);
    }, []);

    // Spawn the phantom
    const spawnPhantom = useCallback(() => {
        // Randomly choose direction
        const startFromLeft = Math.random() > 0.5;
        setFromLeft(startFromLeft);
        setClicked(false);
        setIsActive(true);
        
        // Record spawn time
        localStorage.setItem(PHANTOM_COOLDOWN_KEY, Date.now().toString());

        // Set timeout for when phantom reaches the other side
        if (flightTimeoutRef.current) {
            clearTimeout(flightTimeoutRef.current);
        }
        flightTimeoutRef.current = setTimeout(() => {
            setIsActive(false);
            scheduleNextSpawn();
        }, FLIGHT_DURATION_MS);
    }, [scheduleNextSpawn]);

    // Keep ref updated
    useEffect(() => {
        spawnPhantomRef.current = spawnPhantom;
    }, [spawnPhantom]);

    // Handle click on phantom
    const handleClick = useCallback(() => {
        if (clicked) return; // Prevent multiple clicks
        
        setClicked(true);
        
        // Play hit sound (errors logged for debugging)
        new Audio(BASE_ASSETS.audio.hit[0]).play().catch(err => console.warn('Hit sound failed:', err));
        
        // Award level if skill is active
        if (battlingSkillId) {
            onAwardLevel(battlingSkillId);
        }
        
        // Remove phantom after brief delay for visual feedback
        setTimeout(() => {
            setIsActive(false);
            if (flightTimeoutRef.current) {
                clearTimeout(flightTimeoutRef.current);
            }
            scheduleNextSpawn();
        }, 200);
    }, [clicked, battlingSkillId, onAwardLevel, scheduleNextSpawn]);

    // Initialize on mount
    useEffect(() => {
        scheduleNextSpawn();
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (flightTimeoutRef.current) {
                clearTimeout(flightTimeoutRef.current);
            }
        };
    }, [scheduleNextSpawn]);

    if (!isActive) return null;

    const phantomSrc = HOSTILE_MOBS['Phantom'];

    return (
        <div
            className="fixed top-4 z-[9999] cursor-pointer select-none"
            style={{
                animation: `${fromLeft ? 'phantomFlyLeft' : 'phantomFlyRight'} ${FLIGHT_DURATION_MS}ms linear forwards`,
                opacity: clicked ? 0 : 1,
                transition: 'opacity 0.2s ease-out',
            }}
            onClick={handleClick}
        >
            <img
                src={phantomSrc}
                alt="Phantom"
                className="w-24 h-24 object-contain drop-shadow-[0_0_10px_rgba(100,200,255,0.8)]"
                style={{
                    transform: fromLeft ? 'scaleX(1)' : 'scaleX(-1)',
                }}
                draggable={false}
            />
            {clicked && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-400 text-2xl font-bold animate-bounce drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]">
                        +1 Level!
                    </span>
                </div>
            )}
        </div>
    );
};

export default PhantomEvent;
