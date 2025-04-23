// Function to adjust spacing between contact and core values sections
function adjustSectionSpacing() {
    const contactSection = document.querySelector('.contact-section');
    const coreValuesSection = document.querySelector('.core-values-section');
    
    // Exit if either section doesn't exist
    if (!contactSection || !coreValuesSection) return;
    
    // Get current screen and viewport dimensions
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Special handling for specific high-resolution displays
    if ((screenWidth === 2048 && screenHeight === 1536) || 
        (screenWidth === 2560 && screenHeight === 1440) || 
        (screenWidth === 2560 && screenHeight === 1600) || 
        (screenWidth === 3840 && screenHeight === 2160)) {
        
        // Apply more aggressive margin correction for these resolutions
        coreValuesSection.style.marginTop = '-5%';  
        contactSection.style.height = '100%';      
        return;
    }
    
    // Calculate the current zoom level approximation using multiple methods
    let zoomLevel = 1;
    
    // Method 1: Using window.innerWidth vs original design width
    const designWidth = 1920;
    if (viewportWidth > designWidth) {
        // This is likely due to zooming out
        zoomLevel = Math.max(zoomLevel, viewportWidth / designWidth);
    }
    
    // Method 2: Using devicePixelRatio as a reference
    if (window.devicePixelRatio) {
        zoomLevel = Math.max(zoomLevel, 1 / window.devicePixelRatio);
    }
    
    // Method 3: Using screen width vs viewport width
    const screenToViewportRatio = screenWidth / viewportWidth;
    if (screenToViewportRatio < 1) {
        // Another indicator of zoom out
        zoomLevel = Math.max(zoomLevel, 1 / screenToViewportRatio);
    }
    
    // Calculate aspect ratio for additional adjustments
    const aspectRatio = viewportWidth / viewportHeight;
    
    // Adjust the margin-top of core-values-section based on zoom level and screen size
    if (viewportWidth >= 2048 || zoomLevel > 1) {
        // Calculate a responsive margin that decreases as resolution or zoom increases
        const baseMarginPercent = -15;
        const sizeFactor = Math.max(viewportWidth / 1920, zoomLevel);
        const adjustedMargin = baseMarginPercent / sizeFactor;
        
        // Ensure margin doesn't get too small for very large screens or extreme zoom levels
        const minMargin = viewportWidth >= 3000 ? -3 : -5;
        coreValuesSection.style.marginTop = `${Math.max(adjustedMargin, minMargin)}%`;
        
        // Adjust contact section height based on aspect ratio and zoom
        let heightAdjustment = 120; // Default height percentage
        
        // Reduce height for wider screens (higher aspect ratio)
        if (aspectRatio > 1.8) {
            heightAdjustment = 100;
        } else if (aspectRatio > 1.6) {
            heightAdjustment = 110;
        }
        
        // Further reduce height when zoomed out
        heightAdjustment = heightAdjustment / Math.sqrt(sizeFactor);
        
        // Enforce minimum height
        heightAdjustment = Math.max(heightAdjustment, 80);
        
        contactSection.style.height = `${heightAdjustment}%`;
    } else {
        // Reset to the original values when at normal zoom and standard resolution
        coreValuesSection.style.marginTop = '-15%';
        contactSection.style.height = '120%';
    }
    
    // Debug information - uncomment if needed for troubleshooting
    /*
    console.log({
        screenDimensions: `${screenWidth}x${screenHeight}`,
        viewport: `${viewportWidth}x${viewportHeight}`,
        zoomLevel,
        aspectRatio,
        marginTop: coreValuesSection.style.marginTop,
        height: contactSection.style.height
    });
    */
}

// Set up event listeners to detect zoom and resolution changes
function setupZoomDetection() {
    // Use the resize event to detect zoom and window size changes
    window.addEventListener('resize', function() {
        // Add a small timeout to ensure all browser calculations are complete
        setTimeout(adjustSectionSpacing, 50);
    });
    
    // Detect zoom using mouse wheel + ctrl key
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            // This is likely a zoom action
            setTimeout(adjustSectionSpacing, 100);
        }
    });
    
    // Listen for orientation changes on mobile devices
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustSectionSpacing, 200);
    });
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', adjustSectionSpacing);
    
    // Periodic check for zoom changes
    // This helps catch zoom changes that might not trigger other events
    setInterval(adjustSectionSpacing, 1000);
    
    // Initial adjustment
    adjustSectionSpacing();
    
    // Additional adjustment after all images and resources are loaded
    window.addEventListener('load', adjustSectionSpacing);
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupZoomDetection);

// Immediate execution for cases where the script loads after DOM is ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setupZoomDetection();
}