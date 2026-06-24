const Walkthrough = (() => {
    let landingTour = null;
    let genderTour = null;
    let occasionTour = null;
    let styleTour = null;
    let outfitTour = null;
    let colorTour = null;
    let resultsTour = null;
    let archiveTour = null;

    function initArchiveTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        archiveTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '#archive-sort-container',
                    popover: {
                        title: 'Sort Your Archive',
                        description: 'Use these tabs to easily organize your saved looks by how recently you saved them, or by their Match Score.',
                        side: 'bottom', align: 'end'
                    }
                },
                {
                    element: '.archive-card',
                    popover: {
                        title: 'Interactive Cards',
                        description: 'Hover over any card to reveal its details. Click the View Look overlay to explore the complete garment breakdown, or hit the Share icon to instantly copy a pristine, read-only link to send to a friend.',
                        side: 'right', align: 'start'
                    }
                }
            ]
        });
    }

    function initLandingTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        landingTour = driver({
            showProgress: true,
            animate: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: '#tour-main-title',
                    popover: {
                        title: 'Welcome to FashionWardrobe',
                        description: 'Your premium digital styling engine. We curate personalized outfits tailored to your unique aesthetic.<br><br><span style="font-size: 8px; opacity: 0.6;">(Pro tip: Use ← / → arrows to navigate, and ESC to close)</span>',
                        side: 'bottom', align: 'start'
                    }
                },
                {
                    element: '#start-journey-btn',
                    popover: {
                        title: 'Begin Curation',
                        description: 'Click here to start building your personalized style profile.',
                        side: 'top', align: 'start'
                    }
                }
            ]
        });
    }

    function initGenderTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        genderTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '.selection-card',
                    popover: {
                        title: 'Select Gender',
                        description: 'First, tell us who we are dressing today. Choose your preference to proceed.',
                        side: 'bottom', align: 'center'
                    }
                },
                {
                    element: '#selection-counter-box',
                    popover: {
                        title: 'Selection Tracker',
                        description: 'As you build your profile, this counter ensures you have made the required selections.',
                        side: 'right', align: 'center'
                    }
                },
                {
                    element: '#continue-btn',
                    popover: {
                        title: 'Proceed to Next Step',
                        description: 'Once you select your gender, click here to move to the occasion mapping.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    function initOccasionTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        occasionTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '.selection-card',
                    popover: {
                        title: "What's the occasion?",
                        description: 'Where are you heading? Choose the primary setting so we can tailor the formality of your look.',
                        side: 'bottom', align: 'center'
                    }
                },
                {
                    element: '#next-btn-main',
                    popover: {
                        title: 'Continue to Curation',
                        description: 'Lock in your event. Next, we will refine the specific stylistic undertones of your outfit.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    function initStyleTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        styleTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '.selection-card',
                    popover: {
                        title: "What's your vibe?",
                        description: 'Select the stylistic undertones that speak to you (e.g., minimalist, avant-garde). You can pick multiple.',
                        side: 'bottom', align: 'center'
                    }
                },
                {
                    element: '#next-btn-main',
                    popover: {
                        title: 'Move to Wardrobe Selection',
                        description: 'With your style profile complete, we will now select the actual garments for your look.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    function initOutfitTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        outfitTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '#category-counters',
                    popover: {
                        title: 'Garment Categories',
                        description: 'Your look is broken down into categories (Tops, Bottoms, Outerwear).',
                        side: 'right', align: 'start'
                    }
                },
                {
                    element: '.selection-card',
                    popover: {
                        title: 'Select Base Layers',
                        description: 'Click on garments to add them to your ensemble. You can use the carousel arrows to browse more options.',
                        side: 'bottom', align: 'center'
                    }
                },
                {
                    element: '#next-btn-main',
                    popover: {
                        title: 'Proceed to Color Theory',
                        description: 'Once you have selected your garments, continue here to customize the color palette of your items.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    function initColorTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        colorTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '.configuration-block',
                    popover: {
                        title: 'Define Canvas',
                        description: 'Select your primary color. Adding a secondary color or pattern is optional, but helps refine your look.',
                        side: 'bottom', align: 'center'
                    }
                },
                {
                    element: '.item-color-swatch',
                    popover: {
                        title: 'Custom Hues',
                        description: 'Click a color swatch to apply it. The last swatch is a custom color picker for exact shades.',
                        side: 'bottom', align: 'start'
                    }
                },
                {
                    element: '#continue-btn',
                    popover: {
                        title: 'Finalize Curation',
                        description: 'All set! Click here and our engine will extract your style DNA and generate your final curated look.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    function initResultsTour() {
        if (!window.driver) return;
        const driver = window.driver.js.driver;
        resultsTour = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '.collection-view.lg\\:w-\\[35\\%\\]',
                    popover: {
                        title: 'Your Base Collection',
                        description: 'This represents the foundational look built directly from the garments and colors you selected.',
                        side: 'right', align: 'center'
                    }
                },
                {
                    element: '.collection-view.lg\\:w-\\[65\\%\\]',
                    popover: {
                        title: 'Curated Recommendations',
                        description: 'Our styling engine suggests these additional accessories, layers, and color matches to elevate your base look.',
                        side: 'left', align: 'center'
                    }
                },
                {
                    element: '#save-look-btn',
                    popover: {
                        title: 'Save to Archive',
                        description: 'Love this look? Save it to your personal archive for future reference, or click "Create New Look" to start over.',
                        side: 'top', align: 'center'
                    }
                }
            ]
        });
    }

    // Public API
    return {
        startLandingTour: () => {
            if (!landingTour) initLandingTour();
            if (landingTour) landingTour.drive();
        },
        startGenderTour: () => {
            if (!genderTour) initGenderTour();
            if (genderTour) genderTour.drive();
        },
        startOccasionTour: () => {
            if (!occasionTour) initOccasionTour();
            if (occasionTour) occasionTour.drive();
        },
        startStyleTour: () => {
            if (!styleTour) initStyleTour();
            if (styleTour) styleTour.drive();
        },
        startOutfitTour: () => {
            if (!outfitTour) initOutfitTour();
            if (outfitTour) outfitTour.drive();
        },
        startColorTour: () => {
            if (!colorTour) initColorTour();
            if (colorTour) colorTour.drive();
        },
        startResultsTour: () => {
            if (!resultsTour) initResultsTour();
            if (resultsTour) resultsTour.drive();
        },
        startArchiveTour: () => {
            if (!archiveTour) initArchiveTour();
            if (archiveTour) archiveTour.drive();
        }
    };
})();

window.Walkthrough = Walkthrough;
