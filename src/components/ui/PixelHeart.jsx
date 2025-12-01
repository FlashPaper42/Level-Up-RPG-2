import React from 'react';

// Pixel types for the heart shape grid
const PIXEL = {
  EMPTY: 0,
  OUTLINE: 1,
  FILL: 2,
  DARK: 3,
  HIGHLIGHT: 4,
};

// Color configuration for filled and empty heart states
const COLORS = {
  FILLED: {
    fill: '#F22830',      // Minecraft red
    dark: '#8B0000',      // Dark red shadow
    highlight: '#FFFFFF', // White shine
  },
  EMPTY: {
    fill: '#1f2937',      // Dark gray
    dark: '#111827',      // Darker gray
    highlight: '#374151', // Light gray
  },
  OUTLINE: '#000000',     // Black outline
};

/**
 * A Minecraft-style pixelated heart component for health display.
 * Uses a 9x9 pixel grid pattern with SVG for crisp rendering.
 * 
 * @param {Object} props
 * @param {number} props.size - The size of the heart in pixels (default: 32)
 * @param {boolean} props.filled - Whether the heart is filled (true) or empty (false)
 */
const PixelHeart = ({ size = 32, filled = true }) => {
  // Select color palette based on filled state
  const palette = filled ? COLORS.FILLED : COLORS.EMPTY;

  // Pixel size based on 9x9 grid
  const pixelSize = size / 9;

  // Heart shape pixel map (9x9 grid)
  const { EMPTY: _, OUTLINE: O, FILL: F, HIGHLIGHT: H } = PIXEL;
  const heartPixels = [
    [_, O, O, _, _, _, O, O, _],
    [O, H, F, O, _, O, F, F, O],
    [O, F, F, F, O, F, F, F, O],
    [O, F, F, F, F, F, F, F, O],
    [_, O, F, F, F, F, F, O, _],
    [_, _, O, F, F, F, O, _, _],
    [_, _, _, O, F, O, _, _, _],
    [_, _, _, _, O, _, _, _, _],
    [_, _, _, _, _, _, _, _, _],
  ];

  const getColor = (value) => {
    switch (value) {
      case PIXEL.OUTLINE: return COLORS.OUTLINE;
      case PIXEL.FILL: return palette.fill;
      case PIXEL.DARK: return palette.dark;
      case PIXEL.HIGHLIGHT: return palette.highlight;
      default: return 'transparent';
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      style={{ imageRendering: 'pixelated' }}
      className="drop-shadow-md"
    >
      {heartPixels.map((row, y) =>
        row.map((pixel, x) => {
          if (pixel === 0) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={getColor(pixel)}
            />
          );
        })
      )}
    </svg>
  );
};

export default PixelHeart;
