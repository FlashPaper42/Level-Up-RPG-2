import { HOSTILE_MOBS, FRIENDLY_MOBS, CHEST_BLOCKS } from '../constants/gameData';

export const getRandomMob = (exclude) => { 
    const pool = Object.keys(HOSTILE_MOBS).filter(m => m !== exclude); 
    return pool[Math.floor(Math.random() * pool.length)]; 
};

export const getMobForSkill = (skillConfig, userSkill) => {
    if (skillConfig.id === 'cleaning') {
            if (userSkill.level % 20 === 0) return 'Ender Chest';
            if (userSkill.level % 5 === 0) return 'Shulker Box';
            const standardChests = Object.keys(CHEST_BLOCKS).filter(k => !['Ender Chest', 'Shulker Box'].includes(k));
            return standardChests[(userSkill.level - 1) % standardChests.length];
    }
    if (skillConfig.id === 'memory') {
        const friendlyMobKeys = Object.keys(FRIENDLY_MOBS);
        return friendlyMobKeys[Math.floor(Math.random() * friendlyMobKeys.length)];
    }
    if (userSkill.level % 20 === 0) return skillConfig.boss;
    const hostileMobKeys = Object.keys(HOSTILE_MOBS);
    return userSkill.currentMob || hostileMobKeys[Math.floor(Math.random() * hostileMobKeys.length)];
};