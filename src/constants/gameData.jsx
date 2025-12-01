export const BASE_ASSETS = {
    skillIcons: { 'Reading': '/assets/skills/reading_icon.gif', 'Math': '/assets/skills/math_icon.png', 'Writing': '/assets/skills/writing_icon.png', 'Cleaning': '/assets/skills/cleaning_icon.gif', 'Memory': '/assets/skills/farm_icon.png', 'Patterns': '/assets/skills/pattern_icon.png' },
    badges: { 'Wood': '/assets/badges/wood_badge.png', 'Stone': '/assets/badges/stone_badge.png', 'Gold': '/assets/badges/gold_badge.png', 'Iron': '/assets/badges/iron_badge.png', 'Emerald': '/assets/badges/emerald_badge.png', 'Diamond': '/assets/badges/diamond_badge.png', 'Netherite': '/assets/badges/netherite_badge.png', 'Obsidian': '/assets/badges/obsidian_badge.png', 'Legendary': '/assets/badges/star_badge.png' },
    audio: { 'bgm': ['/assets/sounds/bgm_1.wav'], 'click': '/assets/sounds/click.wav', 'hit': ['/assets/sounds/hit_1.wav'], 'levelup': '/assets/sounds/levelup.wav', 'success': '/assets/sounds/success.wav', 'fail': '/assets/sounds/fail.wav', 'match': '/assets/sounds/match_success.wav', 'mismatch': '/assets/sounds/mismatch.wav', 'damage': '/assets/sounds/damage.wav', 'faint': '/assets/sounds/faint.wav' },
    axolotls: { 'Pink': '/assets/mobs/axolotl/axolotl_pink.gif', 'Cyan': '/assets/mobs/axolotl/axolotl_cyan.gif', 'Gold': '/assets/mobs/axolotl/axolotl_gold.gif', 'Brown': '/assets/mobs/axolotl/axolotl_brown.gif', 'Blue': '/assets/mobs/axolotl/axolotl_blue.gif' },
    items: { 'TNT': '/assets/items/tnt.png', 'BED': '/assets/items/bed.png', 'BOW': '/assets/items/bow.png', 'MAP': '/assets/items/map.png', 'EGG': '/assets/items/egg.png', 'ICE': '/assets/blocks/ice.png', 'AXE': '/assets/items/axe.gif', 'HOE': '/assets/items/hoe.gif', 'BOOK': '/assets/items/book.gif', 'CAKE': '/assets/items/cake.png', 'BOAT': '/assets/items/boat.png', 'DOOR': '/assets/blocks/door.png', 'WOOL': '/assets/blocks/wool.png', 'SAND': '/assets/blocks/sand.png', 'DIRT': '/assets/blocks/dirt.png', 'MILK': '/assets/items/milk.png' }
};

export const FRIENDLY_MOBS = {
    'Allay': '/assets/mobs/friendly/allay.gif',
    'Armadillo': '/assets/mobs/friendly/armadillo.png',
    'Bunny': '/assets/mobs/friendly/bunny.png',
    'Camel': '/assets/mobs/friendly/camel.gif',
    'Cat': '/assets/mobs/friendly/cat.png',
    'Chicken': '/assets/mobs/friendly/chicken.png',
    'Copper Golem': '/assets/mobs/friendly/coppergolem.png',
    'Cow': '/assets/mobs/friendly/cow.png',
    'Glow Squid': '/assets/mobs/friendly/glowsquid.gif',
    'Goat': '/assets/mobs/friendly/goat.png',
    'Horse': '/assets/mobs/friendly/horse.png',
    'Mooshroom': '/assets/mobs/friendly/mooshroom.png',
    'Nautilus': '/assets/mobs/friendly/nautilus.gif',
    'Panda': '/assets/mobs/friendly/panda.png',
    'Pig': '/assets/mobs/friendly/pig.png',
    'Polar Bear': '/assets/mobs/friendly/polarbear.png',
    'Sheep': '/assets/mobs/friendly/sheep.png',
    'Squid': '/assets/mobs/friendly/squid.gif',
    'Turtle': '/assets/mobs/friendly/turtle.png',
    'Wolf': '/assets/mobs/friendly/wolf.png'
};

export const HOSTILE_MOBS = {
    'Zombie': '/assets/mobs/hostile/zombie.png',
    'Creeper': '/assets/mobs/hostile/creeper.png',
    'Skeleton': '/assets/mobs/hostile/skeleton.png',
    'Spider': '/assets/mobs/hostile/spider.png',
    'Enderman': '/assets/mobs/hostile/enderman.png',
    'Blaze': '/assets/mobs/hostile/blaze.gif',
    'Ghast': '/assets/mobs/hostile/ghast.gif',
    'Slime': '/assets/mobs/hostile/slime.png',
    'Witch': '/assets/mobs/hostile/witch.png',
    'Phantom': '/assets/mobs/hostile/phantom.gif',
    'Piglin': '/assets/mobs/hostile/piglin.png',
    'Hoglin': '/assets/mobs/hostile/hoglin.png',
    'Drowned': '/assets/mobs/hostile/drowned.png',
    'Pillager': '/assets/mobs/hostile/pillager.png',
    'Evoker': '/assets/mobs/hostile/evoker.png',
    'Guardian': '/assets/mobs/hostile/guardian.gif',
    'Magma Cube': '/assets/mobs/hostile/magmacube.png'
};

export const CHEST_BLOCKS = {
    'Chest': '/assets/blocks/chests/chest.gif',
    'Trapped Chest': '/assets/blocks/chests/trapped_chest.gif',
    'Barrel': '/assets/blocks/chests/barrel.png',
    'Bundle': '/assets/blocks/chests/bundle.png',
    'Shulker Box': '/assets/blocks/chests/shulker_box.png',
    'Ender Chest': '/assets/blocks/chests/ender_chest.gif'
};

// Special chests that appear at milestone levels (used for cleaning skill)
export const SPECIAL_CHESTS = ['Ender Chest', 'Shulker Box'];

export const BOSS_MOBS = {
    'Ender Dragon': '/assets/mobs/boss/enderdragon.gif',
    'Wither': '/assets/mobs/boss/wither.png',
    'Warden': '/assets/mobs/boss/warden.gif'
};

export const MINIBOSS_MOBS = {
    'Creaking': '/assets/mobs/miniboss/creaking.png',
    'Elder Guardian': '/assets/mobs/miniboss/elderguardian.gif',
    'Ravager': '/assets/mobs/miniboss/ravager.png',
    'Wither Skeleton': '/assets/mobs/miniboss/witherskeleton.png'
};

// Difficulty content framework - 7 tiers of content per skill
// This structure holds different configurations for each difficulty level
export const DIFFICULTY_CONTENT = {
    reading: {
        1: { charLength: 3 },
        2: { charLength: 4 },
        3: { charLength: 5 },
        4: { charLength: 6 },
        5: { charLength: 7 },
        6: { charLength: 8 },
        7: { useFunnyWords: true }
    },
    math: {
        1: { operations: ['+'], range: [1, 9], description: 'Single-digit addition' },
        2: { operations: ['+'], range: [10, 99], description: 'Double-digit addition' },
        3: { operations: ['+', '-'], range: [1, 99], description: 'Addition and subtraction' },
        4: { operations: ['+', '-', '*'], range: [1, 20], multiplyRange: [1, 12], description: 'Add, subtract, multiply' },
        5: { operations: ['+', '-', '*', '/'], range: [1, 50], divisionRange: [1, 12], description: 'All operations' },
        6: { pemdas: true, description: 'Order of operations' },
        7: { algebra: true, description: 'Algebra with variables' }
    },
    writing: {
        1: { targetLength: 3 },
        2: { targetLength: 4 },
        3: { targetLength: 5 },
        4: { targetLength: 6 },
        5: { targetLength: 7 },
        6: { targetLength: 8 },
        7: { targetLength: 9 }
    },
    patterns: {
        1: { axolotlCount: 2 },
        2: { axolotlCount: 3 },
        3: { axolotlCount: 4 },
        4: { axolotlCount: 5 },
        5: { axolotlCount: 6 },
        6: { axolotlCount: 7 },
        7: { axolotlCount: 8, resetSequence: true }
    },
    memory: {
        1: { pairs: 3, gridCols: 3 },  // 6 cards: 3x2
        2: { pairs: 4, gridCols: 4 },  // 8 cards: 4x2
        3: { pairs: 5, gridCols: 5 },  // 10 cards: 5x2
        4: { pairs: 6, gridCols: 4 },  // 12 cards: 4x3
        5: { pairs: 7, gridCols: 4 },  // 14 cards: 4x4 (2 empty)
        6: { pairs: 8, gridCols: 4 },  // 16 cards: 4x4
        7: { pairs: 10, gridCols: 5 } // 20 cards: 5x4
    },
    cleaning: {
        // Cleaning is exempt from difficulty changes
        1: { exempt: true },
        2: { exempt: true },
        3: { exempt: true },
        4: { exempt: true },
        5: { exempt: true },
        6: { exempt: true },
        7: { exempt: true }
    }
};

// Difficulty image assets
export const DIFFICULTY_IMAGES = {
    1: '/assets/difficulty/Difficulty_1.png',
    2: '/assets/difficulty/Difficulty_2.png',
    3: '/assets/difficulty/Difficulty_3.png',
    4: '/assets/difficulty/Difficulty_4.png',
    5: '/assets/difficulty/Difficulty_5.png',
    6: '/assets/difficulty/Difficulty_6.png',
    7: '/assets/difficulty/Difficulty_7.png'
};

export const THEME_CONFIG = {
    'minecraft': {
        name: 'Minecraft',
        style: { backgroundImage: `url('/assets/themes/minecraft.png')`, backgroundSize: 'cover', backgroundPosition: 'center' },
        assets: {
            logo: '/assets/themes/minecraft_logo.png', cardBack: '/assets/themes/memorycard.jpg',
            mobs: { 'Zombie': '/assets/mobs/hostile/zombie.png', 'Creeper': '/assets/mobs/hostile/creeper.png', 'Skeleton': '/assets/mobs/hostile/skeleton.png', 'Ender Dragon': '/assets/mobs/boss/enderdragon.gif', 'Axolotl': '/assets/mobs/axolotl/axolotl_pink.gif', 'Spider': '/assets/mobs/hostile/spider.png', 'Phantom': '/assets/mobs/hostile/phantom.gif', 'Enderman': '/assets/mobs/hostile/enderman.png', 'Blaze': '/assets/mobs/hostile/blaze.gif', 'Ghast': '/assets/mobs/hostile/ghast.gif', 'Slime': '/assets/mobs/hostile/slime.png', 'Witch': '/assets/mobs/hostile/witch.png', 'Pillager': '/assets/mobs/hostile/pillager.png', 'Wither': '/assets/mobs/boss/wither.png', 'Warden': '/assets/mobs/boss/warden.gif' }
        },
        skills: { reading: { name: 'Reading', boss: 'Ender Dragon', mobType: 'Standard' }, math: { name: 'Math', boss: 'Wither', mobType: 'Creeper' }, writing: { name: 'Writing', boss: 'Warden', mobType: 'Skeleton' }, cleaning: { name: 'Cleaning', boss: 'Ender Chest', mobType: 'Chest' }, memory: { name: 'Memory', boss: 'Axolotl', mobType: 'Mascot' }, patterns: { name: 'Pattern Recognition', boss: 'Iron Golem', mobType: 'Standard' } }
    },
    'kpop': {
        name: 'K-Pop Demon Hunters',
		style: { backgroundImage: `url('/assets/themes/kpop.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' },
        assets: { 
			logo: '/assets/themes/kpop_logo.png', cardBack: '/assets/themes/kpop_memorycard.jpg', 
			mobs: {} 
		},
        skills: { reading: { name: 'Decryption', boss: 'Cyborg King' }, math: { name: 'Engineering', boss: 'Mecha-Brain' }, writing: { name: 'Hacking', boss: 'Mainframe' }, cleaning: { name: 'Waste Mgmt', boss: 'Trash Bot' }, memory: { name: 'Droid Repair', boss: 'Droid' }, patterns: { name: 'Navigation', boss: 'Star Map' } }
    },
    'pokemon': {
        name: 'Pokemon', 
		style: { backgroundImage: `url('/assets/themes/pokemon.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' },
        assets: { 
			logo: '/assets/themes/pokemon_logo.png', cardBack: '/assets/themes/pokemon_memorycard.jpg', 
			mobs: {} 
		},
        skills: { reading: { name: 'Spellcasting', boss: 'Lich King' }, math: { name: 'Alchemy', boss: 'Golem' }, writing: { name: 'Scribing', boss: 'Dragon' }, cleaning: { name: 'Looting', boss: 'Mimic' }, memory: { name: 'Runes', boss: 'Wisp' }, patterns: { name: 'Rituals', boss: 'Cultist' } }
    },
    'spy': {
        name: 'Spy', 
		style: { backgroundImage: `url('/assets/themes/minecraft.png')`, backgroundSize: 'cover', backgroundPosition: 'center' },
        assets: { 
			logo: '/assets/themes/spy_logo.png', cardBack: '/assets/themes/spy_memorycard.jpg', 
			mobs: {} 
		},
        skills: { reading: { name: 'Intel Analysis', boss: 'Double Agent' }, math: { name: 'Gadgetry', boss: 'Mad Scientist' }, writing: { name: 'Forgery', boss: 'Bureaucrat' }, cleaning: { name: 'Evidence', boss: 'Safe' }, memory: { name: 'Identities', boss: 'Mole' }, patterns: { name: 'Code Breaking', boss: 'Hacker' } }
    }
};

export const THEMES_LIST = [ { id: 'minecraft', name: 'Minecraft', img: '/assets/themes/minecraft.png' }, { id: 'kpop', name: 'K-Pop Demon Hunters', img: '/assets/themes/kpop.jpg' }, { id: 'pokemon', name: 'Pokemon', img: '/assets/themes/pokemon.jpg' }, { id: 'spy', name: 'Spy', img: '/assets/themes/spy.png' } ];
export const BADGE_TIERS = [ { level: 20, title: "Wood" }, { level: 40, title: "Stone" }, { level: 60, title: "Gold" }, { level: 80, title: "Iron" }, { level: 100, title: "Emerald" }, { level: 120, title: "Diamond" }, { level: 140, title: "Netherite" }, { level: 160, title: "Obsidian" } ];

// Reading words organized by character length for difficulty scaling
export const READING_WORDS = {
    3: ["CAT", "DOG", "SUN", "BAT", "HAT", "RUN", "BIG", "RED", "FOX", "MOM", "DAD", "CUP", "BUS", "PEN", "ANT", "BEE"],
    4: ["BOOK", "TREE", "FISH", "BALL", "CAKE", "BIRD", "FROG", "PLAY", "JUMP", "MILK", "DOOR", "DUCK", "STAR", "MOON", "RAIN"],
    5: ["APPLE", "HOUSE", "WATER", "HAPPY", "MUSIC", "TIGER", "BEACH", "PLANT", "CLOUD", "SMILE", "PIZZA", "GRAPE", "HORSE", "SHEEP"],
    6: ["BANANA", "ORANGE", "PURPLE", "GARDEN", "FRIEND", "SCHOOL", "FLOWER", "RABBIT", "MONKEY", "BUTTON", "CASTLE", "DRAGON", "FOREST"],
    7: ["DIAMOND", "EMERALD", "CHICKEN", "RAINBOW", "DOLPHIN", "PENGUIN", "GIRAFFE", "PUMPKIN", "VOLCANO", "TORNADO", "MONSTER", "TEACHER"],
    8: ["SKELETON", "ELEPHANT", "TREASURE", "CROCODILE", "FIREWORK", "BIRTHDAY", "SANDWICH", "DINOSAUR", "COMPUTER", "MUSHROOM", "I LOVE MOM"]
};

// Humorously long words for difficulty 7 (adult assistance)
export const FUNNY_LONG_WORDS = [
    "ANTIDISESTABLISHMENTARIANISM",
    "PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS",
    "HIPPOPOTOMONSTROSESQUIPPEDALIOPHOBIA",
    "SUPERCALIFRAGILISTICEXPIALIDOCIOUS",
    "FLOCCINAUCINIHILIPILIFICATION",
    "PSEUDOPSEUDOHYPOPARATHYROIDISM",
    "INCOMPREHENSIBILITIES",
    "HONORIFICABILITUDINITY"
];

// Spelling items with length property for writing skill
export const SPELLING_ITEMS = [
    { word: "TNT", length: 3 },
    { word: "BED", length: 3 },
    { word: "BOW", length: 3 },
    { word: "MAP", length: 3 },
    { word: "EGG", length: 3 },
    { word: "ICE", length: 3 },
    { word: "AXE", length: 3 },
    { word: "HOE", length: 3 },
    { word: "BOOK", length: 4 },
    { word: "CAKE", length: 4 },
    { word: "BOAT", length: 4 },
    { word: "DOOR", length: 4 },
    { word: "WOOL", length: 4 },
    { word: "SAND", length: 4 },
    { word: "DIRT", length: 4 },
    { word: "MILK", length: 4 },
    { word: "APPLE", length: 5 },
    { word: "SWORD", length: 5 },
    { word: "TORCH", length: 5 },
    { word: "ARROW", length: 5 },
    { word: "CHEST", length: 5 },
    { word: "STONE", length: 5 },
    { word: "BUCKET", length: 6 },
    { word: "POTION", length: 6 },
    { word: "CARROT", length: 6 },
    { word: "COOKIE", length: 6 },
    { word: "HELMET", length: 6 },
    { word: "SADDLE", length: 6 },
    { word: "DIAMOND", length: 7 },
    { word: "EMERALD", length: 7 },
    { word: "REDSTONE", length: 8 },
    { word: "OBSIDIAN", length: 8 },
    { word: "SKELETON", length: 8 },
    { word: "NETHERITE", length: 9 }
];

// Writing items organized by length for quick lookup
export const WRITING_ITEMS_BY_LENGTH = {
    3: SPELLING_ITEMS.filter(i => i.length === 3),
    4: SPELLING_ITEMS.filter(i => i.length === 4),
    5: SPELLING_ITEMS.filter(i => i.length === 5),
    6: SPELLING_ITEMS.filter(i => i.length === 6),
    7: SPELLING_ITEMS.filter(i => i.length === 7),
    8: SPELLING_ITEMS.filter(i => i.length === 8),
    9: SPELLING_ITEMS.filter(i => i.length >= 9)
};

export const HOMOPHONES = { "SEE": ["SEA", "C"], "TO": ["TWO", "TOO", "2"], "FOR": ["FOUR", "4"], "SUN": ["SON"], "RED": ["READ"], "NO": ["KNOW"], "ARE": ["R", "OUR"], "YOU": ["U", "EWE"], "EYE": ["I"], "BEE": ["BE"], "ONE": ["WON", "1"] };
export const MOB_KEYS = Object.keys(HOSTILE_MOBS);

export const SKILL_DATA = [
    { id: 'reading', name: 'Reading', class: 'Reading', fantasyName: 'Enchanting Table', actionName: 'Enchant!', taskDescription: "Read words into the microphone!", img: BASE_ASSETS.skillIcons['Reading'], colorStyle: { background: 'linear-gradient(to bottom, #7e22ce, #3730a3)' }, accent: 'text-purple-400', boss: 'Ender Dragon', hasChallenge: true, challengeType: 'reading', mobOffset: 0 },
    { id: 'math', name: 'Math', class: 'Math', fantasyName: 'Redstone', actionName: 'Calculate!', taskDescription: "Solve the math problem!", img: BASE_ASSETS.skillIcons['Math'], colorStyle: { background: 'linear-gradient(to bottom, #b91c1c, #9a3412)' }, accent: 'text-red-400', boss: 'The Wither', hasChallenge: true, challengeType: 'math', mobOffset: 4 },
    { id: 'writing', name: 'Writing', class: 'Spelling', fantasyName: 'Crafting Table', actionName: 'Craft!', taskDescription: "Type the letters to craft items!", img: BASE_ASSETS.skillIcons['Writing'], colorStyle: { background: 'linear-gradient(to bottom, #0369a1, #1e40af)' }, accent: 'text-cyan-400', boss: 'The Warden', hasChallenge: true, challengeType: 'writing', mobOffset: 8 },
    { id: 'cleaning', name: 'Cleaning', class: 'Cleaning', fantasyName: 'Chest Management', actionName: 'Organize!', taskDescription: "Clean one real-life room!", img: BASE_ASSETS.skillIcons['Cleaning'], colorStyle: { background: 'linear-gradient(to bottom, #059669, #15803d)' }, accent: 'text-emerald-400', boss: 'Ender Chest', hasChallenge: true, challengeType: 'cleaning', mobOffset: 12 },
    { id: 'memory', name: 'Memory', class: 'Memory', fantasyName: 'Match n\' Hatch', actionName: 'Match!', taskDescription: "Match the animals to hatch eggs!", img: BASE_ASSETS.skillIcons['Memory'], colorStyle: { background: 'linear-gradient(to bottom, #db2777, #be123c)' }, accent: 'text-pink-400', boss: 'Axolotl Mascot', hasChallenge: true, challengeType: 'memory', mobOffset: 16 },
    { id: 'patterns', name: 'Patterns', class: 'Patterns', fantasyName: 'Logic Building', actionName: 'Solve!', taskDescription: "Complete the pattern!", img: BASE_ASSETS.skillIcons['Patterns'], colorStyle: { background: 'linear-gradient(to bottom, #ea580c, #c2410c)' }, accent: 'text-orange-400', boss: 'Iron Golem', hasChallenge: true, challengeType: 'patterns', mobOffset: 20 },
];