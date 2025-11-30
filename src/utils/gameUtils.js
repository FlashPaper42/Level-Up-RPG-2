import { HOSTILE_MOBS, FRIENDLY_MOBS, CHEST_BLOCKS, SPECIAL_CHESTS } from '../constants/gameData';

export const getRandomMob = (exclude) => { 
    const pool = Object.keys(HOSTILE_MOBS).filter(m => m !== exclude); 
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : 'Zombie';
};

export const getMobForSkill = (skillConfig, userSkill) => {
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
    if (userSkill.level % 20 === 0) return skillConfig.boss;
    // For combat skills - validate currentMob exists in HOSTILE_MOBS
    const hostileMobKeys = Object.keys(HOSTILE_MOBS);
    const currentMobIsValid = userSkill.currentMob && hostileMobKeys.includes(userSkill.currentMob);
    return currentMobIsValid ? userSkill.currentMob : (hostileMobKeys.length > 0 ? hostileMobKeys[Math.floor(Math.random() * hostileMobKeys.length)] : 'Zombie');
};