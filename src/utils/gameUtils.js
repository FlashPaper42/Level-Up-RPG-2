import { HOSTILE_MOBS, FRIENDLY_MOBS, CHEST_BLOCKS, SPECIAL_CHESTS, MINIBOSS_MOBS } from '../constants/gameData';

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