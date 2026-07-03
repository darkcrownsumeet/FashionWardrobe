/**
 * Canonical color vocabulary for the FashionWardrobe application.
 *
 * This is the PRIMARY source of truth for accepted color names across all
 * Stage 4 output fields. The UI rendering map in results_new.js should be
 * kept in sync with this vocabulary — not the reverse.
 *
 * When adding a new color to the application:
 *   1. Add it here first.
 *   2. Add a hex mapping to _getColorStyle() in results_new.js so it renders.
 *
 * Used by: Stage 4.5 sanitizer.
 */
const CANONICAL_COLORS = new Set([
    'black', 'white', 'grey', 'gray', 'charcoal', 'silver',
    'navy', 'navyblue', 'blue', 'lightblue', 'cyan', 'teal',
    'green', 'olive', 'olivegreen', 'lime', 'yellow', 'gold',
    'orange', 'brown', 'tan', 'khaki', 'beige', 'cream', 'ivory',
    'camel', 'sand', 'red', 'maroon', 'burgundy', 'wine', 'oxblood',
    'pink', 'blush', 'rose', 'coral', 'salmon', 'peach',
    'purple', 'magenta', 'violet', 'plum', 'lavender', 'lilac', 'aubergine',
    'rust', 'mustard', 'terracotta', 'cognac', 'copper', 'bronze',
    'indigo', 'sapphire', 'cobalt', 'cerulean', 'turquoise',
    'aquamarine', 'seafoam', 'sage', 'mint', 'mintgreen',
    'emerald', 'forestgreen', 'huntergreen',
    'taupe', 'slate', 'slategrey', 'slategray', 'steelblue', 'steel',
    'denim', 'chambray', 'offwhite', 'darkgrey', 'lightgrey', 'darkbrown',
    'lightbrown', 'darkblue', 'darkgreen', 'crimson', 'fuchsia',
    'mahogany', 'burntorange', 'brickred', 'brick',
    'monochrome', 'ecru', 'stone'
]);

module.exports = { CANONICAL_COLORS };
