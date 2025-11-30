import { HOSTILE_MOBS, FRIENDLY_MOBS, CHEST_BLOCKS, SPECIAL_CHESTS, MINIBOSS_MOBS, READING_WORDS, FUNNY_LONG_WORDS, SPELLING_ITEMS, WRITING_ITEMS_BY_LENGTH, DIFFICULTY_CONTENT, BASE_ASSETS } from '../constants/gameData';

export const getRandomMob = (exclude) => { 
    const pool = Object.keys(HOSTILE_MOBS).filter(m => m !== exclude); 
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : 'Zombie';
};

export const getRandomMiniboss = () => {
    const minibossKeys = Object.keys(MINIBOSS_MOBS);
    return minibossKeys.length > 0 ? minibossKeys[Math.floor(Math.random() * minibossKeys.length)] : 'Wither Skeleton';
};

// Determines encounter type based on level cycle pattern
// Level cycle: 1-9 = hostile, 10 = miniboss, 11-19 = hostile, 20 = boss (repeats)
export const getEncounterType = (level) => {
    const levelInCycle = ((level - 1) % 20) + 1; // 1-20
    if (levelInCycle === 20) return 'boss';
    if (levelInCycle === 10) return 'miniboss';
    return 'hostile';
};

export const getMobForSkill = (skillConfig, userSkill) => {
    // Cleaning skill is exempt from miniboss cycles - uses original logic
    if (skillConfig.id === 'cleaning') {
            if (userSkill.level % 20 === 0) return 'Ender Chest';
            if (userSkill.level % 5 === 0) return 'Shulker Box';
            const standardChests = Object.keys(CHEST_BLOCKS).filter(k => !SPECIAL_CHESTS.includes(k));
            return standardChests[(userSkill.level - 1) % standardChests.length];
    }
    if (skillConfig.id === 'memory') {
        const friendlyMobKeys = Object.keys(FRIENDLY_MOBS);
        return friendlyMobKeys.length > 0 ? friendlyMobKeys[Math.floor(Math.random() * friendlyMobKeys.length)] : 'Allay';
    }
    
    // Determine encounter type based on level cycle
    const encounterType = getEncounterType(userSkill.level);
    
    if (encounterType === 'boss') {
        return skillConfig.boss;
    }
    
    if (encounterType === 'miniboss') {
        // Return a random miniboss
        return getRandomMiniboss();
    }
    
    // Normal hostile mob
    const hostileMobKeys = Object.keys(HOSTILE_MOBS);
    const currentMobIsValid = userSkill.currentMob && hostileMobKeys.includes(userSkill.currentMob);
    return currentMobIsValid ? userSkill.currentMob : (hostileMobKeys.length > 0 ? hostileMobKeys[Math.floor(Math.random() * hostileMobKeys.length)] : 'Zombie');
};

// ===== RPG Progression Utility Functions =====

// Calculate damage per correct answer based on player level and difficulty
export const calculateDamage = (playerLevel, difficulty) => {
    const baseDamage = 10 + (playerLevel * 2);
    const difficultyMultiplier = 1 + (difficulty - 1) * 0.5;
    return Math.round(baseDamage * difficultyMultiplier);
};

// Calculate mob max HP to require ~5 hits at appropriate player level
export const calculateMobHealth = (difficulty) => {
    // Each difficulty tier roughly corresponds to levels: 1=1-20, 2=21-40, etc.
    const levelForCalc = Math.max(1, (difficulty - 1) * 20 + 1);
    const expectedDamage = calculateDamage(levelForCalc, difficulty);
    return 5 * expectedDamage;
};

// Calculate XP reward for defeating a mob
export const calculateXPReward = (difficulty, playerLevel) => {
    return Math.round(20 * difficulty * (1 + (playerLevel / 100)));
};

// ===== Reading Word Selection =====

// Get a reading word based on difficulty level
export const getReadingWord = (difficulty) => {
    if (difficulty === 7) {
        return FUNNY_LONG_WORDS[Math.floor(Math.random() * FUNNY_LONG_WORDS.length)];
    }
    const config = DIFFICULTY_CONTENT.reading[difficulty] || DIFFICULTY_CONTENT.reading[1];
    const charLength = config.charLength || 3;
    const words = READING_WORDS[charLength] || READING_WORDS[3];
    return words[Math.floor(Math.random() * words.length)];
};

// ===== Math Problem Generation =====

// Generate a math problem based on difficulty tier
export const generateMathProblem = (difficulty) => {
    const config = DIFFICULTY_CONTENT.math[difficulty] || DIFFICULTY_CONTENT.math[1];
    
    // Difficulty 7: Algebra with variables
    if (config.algebra) {
        const algebraProblems = [
            { question: 'x + 5 = 12', answer: '7', hint: 'x = ?' },
            { question: '2x = 8', answer: '4', hint: 'x = ?' },
            { question: 'x - 3 = 7', answer: '10', hint: 'x = ?' },
            { question: '3x = 15', answer: '5', hint: 'x = ?' },
            { question: 'x + 8 = 15', answer: '7', hint: 'x = ?' },
            { question: '4x = 20', answer: '5', hint: 'x = ?' },
            { question: 'x - 6 = 4', answer: '10', hint: 'x = ?' },
            { question: '2x + 1 = 7', answer: '3', hint: 'x = ?' },
            { question: 'x / 2 = 5', answer: '10', hint: 'x = ?' },
            { question: '5x = 25', answer: '5', hint: 'x = ?' }
        ];
        const problem = algebraProblems[Math.floor(Math.random() * algebraProblems.length)];
        return { type: 'math', question: problem.question, answer: problem.answer, isAlgebra: true };
    }
    
    // Difficulty 6: PEMDAS/Order of Operations
    if (config.pemdas) {
        const pemdasProblems = [
            { question: '3 + 4 × 2', answer: '11' },
            { question: '(2 + 3) × 4', answer: '20' },
            { question: '10 - 2 × 3', answer: '4' },
            { question: '(5 + 5) ÷ 2', answer: '5' },
            { question: '8 ÷ 2 + 3', answer: '7' },
            { question: '2 × 3 + 4', answer: '10' },
            { question: '15 - 3 × 3', answer: '6' },
            { question: '(4 + 2) × 3', answer: '18' },
            { question: '12 ÷ 3 + 5', answer: '9' },
            { question: '2 + 6 ÷ 2', answer: '5' },
            { question: '(8 - 3) × 2', answer: '10' },
            { question: '4 × 2 - 1', answer: '7' }
        ];
        const problem = pemdasProblems[Math.floor(Math.random() * pemdasProblems.length)];
        return { type: 'math', question: `${problem.question} = ?`, answer: problem.answer, isPemdas: true };
    }
    
    // Difficulties 1-5: Standard operations
    const operations = config.operations || ['+'];
    const [minVal, maxVal] = config.range || [1, 9];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let a, b, question, answer;
    
    switch (operation) {
        case '+':
            a = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            b = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            question = `${a} + ${b} = ?`;
            answer = (a + b).toString();
            break;
        case '-':
            // Ensure positive result
            a = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            b = Math.floor(Math.random() * a) + 1; // b is always less than or equal to a
            question = `${a} - ${b} = ?`;
            answer = (a - b).toString();
            break;
        case '*': {
            const [multMin, multMax] = config.multiplyRange || [1, 12];
            a = Math.floor(Math.random() * (multMax - multMin + 1)) + multMin;
            b = Math.floor(Math.random() * (multMax - multMin + 1)) + multMin;
            question = `${a} × ${b} = ?`;
            answer = (a * b).toString();
            break;
        }
        case '/': {
            // Ensure clean division
            const [divMin, divMax] = config.divisionRange || [1, 12];
            b = Math.floor(Math.random() * (divMax - divMin + 1)) + divMin;
            const quotient = Math.floor(Math.random() * 10) + 1;
            a = b * quotient;
            question = `${a} ÷ ${b} = ?`;
            answer = quotient.toString();
            break;
        }
        default:
            a = Math.floor(Math.random() * 9) + 1;
            b = Math.floor(Math.random() * 9) + 1;
            question = `${a} + ${b} = ?`;
            answer = (a + b).toString();
    }
    
    return { type: 'math', question, answer };
};

// ===== Writing/Spelling Item Selection =====

// Get items for a target character length
// Returns single item or combination of items
export const getItemsForLength = (targetLength) => {
    // First, try to find a single item matching the length
    const singleItems = SPELLING_ITEMS.filter(item => item.length === targetLength);
    if (singleItems.length > 0) {
        const item = singleItems[Math.floor(Math.random() * singleItems.length)];
        return {
            items: [item],
            combinedAnswer: item.word,
            images: [BASE_ASSETS.items[item.word] || BASE_ASSETS.items['TNT']]
        };
    }
    
    // If no single item, try combinations
    // For simplicity, try combining two items
    for (let i = 0; i < SPELLING_ITEMS.length; i++) {
        for (let j = 0; j < SPELLING_ITEMS.length; j++) {
            if (i !== j) {
                const item1 = SPELLING_ITEMS[i];
                const item2 = SPELLING_ITEMS[j];
                if (item1.length + item2.length === targetLength) {
                    return {
                        items: [item1, item2],
                        combinedAnswer: item1.word + item2.word,
                        images: [
                            BASE_ASSETS.items[item1.word] || BASE_ASSETS.items['TNT'],
                            BASE_ASSETS.items[item2.word] || BASE_ASSETS.items['TNT']
                        ]
                    };
                }
            }
        }
    }
    
    // Fallback: return the closest single item
    const sortedByLength = [...SPELLING_ITEMS].sort((a, b) => 
        Math.abs(a.length - targetLength) - Math.abs(b.length - targetLength)
    );
    const fallbackItem = sortedByLength[0];
    return {
        items: [fallbackItem],
        combinedAnswer: fallbackItem.word,
        images: [BASE_ASSETS.items[fallbackItem.word] || BASE_ASSETS.items['TNT']]
    };
};