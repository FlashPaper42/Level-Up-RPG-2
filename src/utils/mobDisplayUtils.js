// Mob display utilities for aura generation

// Available aura types
const AURA_TYPES = ['rainbow', 'frost', 'shadow', 'lava', 'gradient', 'sparkle', 'plasma', 'nature'];

// Aura adjectives mapping
export const AURA_ADJECTIVES = {
    'frost': 'Frozen',
    'lava': 'Flaming',
    'shadow': 'Shadowy',
    'rainbow': 'Prismatic',
    'gradient': 'Shifting',
    'sparkle': 'Glittering',
    'plasma': 'Volatile',
    'nature': 'Overgrown'
};

/**
 * Get a random aura effect
 * @returns {string} Random aura type from AURA_TYPES
 */
export const getRandomAura = () => {
    return AURA_TYPES[Math.floor(Math.random() * AURA_TYPES.length)];
};

/**
 * Generate mob with aura for display
 * @param {string} mobName - Name of the mob
 * @param {string} mobSrc - Source path for mob image
 * @returns {object} Object with mobName, mobSrc, aura, and displayName
 */
export const generateMobWithAura = (mobName, mobSrc) => {
    const aura = getRandomAura();
    const displayName = AURA_ADJECTIVES[aura] 
        ? `${AURA_ADJECTIVES[aura]} ${mobName}` 
        : mobName;
    
    return {
        mobName,
        mobSrc,
        aura,
        displayName
    };
};
