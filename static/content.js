// content.js
//
// Create a new div element

const newDiv = document.createElement('div');

let garmentImg = localStorage.getItem('garmentLink');
newDiv.innerHTML = `
  <h1>VESTI TRYON</h1>
  <button id="closeButton" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: red; color: white; border: none; cursor: pointer;">
    Close
  </button>
  <div  style="height:22rem; padding-top: 2rem; background-position: center; width: 100%; background-color: red; background-size: cover; background: url('https://pub-82f74f0ef5a241518dfdaec5fa1292fa.r2.dev/Screenshot%202024-12-16%20at%2012.23.36%E2%80%AFAM.png');" >
  </div>
`;


// Apply initial styles
newDiv.style.position = 'fixed';
newDiv.style.bottom = '10px';
newDiv.style.right = '10px';
newDiv.style.backgroundColor = 'lightblue';
newDiv.style.padding = '20px';
newDiv.style.zIndex = '9999';
newDiv.style.overflow = 'clip';
newDiv.style.width = '20rem';  // Default width (w-40)
newDiv.style.height = '30rem'; // Default height (h-[30rem])
newDiv.style.transition = 'width 0.3s ease, height 0.3s ease'; // Smooth transition for resizing

newDiv.style.borderRadius = '20px'; // Rounded corners
// Append the new div to the document body
document.body.appendChild(newDiv);

// Add event listener to the close button
const closeButton = newDiv.querySelector('#closeButton');
closeButton.addEventListener('click', () => {
  // Toggle the size of the div
  if (newDiv.style.width === '20rem' && newDiv.style.height === '30rem') {
    newDiv.style.width = '5rem';  // Collapsed width (w-20)
    newDiv.style.height = '5rem'; // Collapsed height (h-20)
    newDiv.style.borderRadius = '9999px'; // Rounded corners
  } else {
    newDiv.style.borderRadius = '20px'; // Rounded corners
    newDiv.style.width = '20rem'; // Expanded width (w-40)
    newDiv.style.height = '30rem'; // Expanded height (h-[30rem])
  }
});


function processImages() {
  // Select all images with the target class that haven't been processed yet
  const images = document.querySelectorAll('.product-card__hero-image:not(.processed)');

  images.forEach((img) => {
    // Skip already processed images
    if (img.classList.contains('processed')) return;

    // Create an overlay button
    const button = document.createElement('button');
    button.innerText = 'VESTI TRYON'; // Button text
    button.style.position = 'absolute';
    button.style.background = 'rgba(79, 70, 229, 0.8)'; // Semi-transparent purple
    button.style.color = 'white';
    button.style.padding = '8px 12px'; // Larger padding for better UX
    button.style.top = '-20px';
    button.style.left = '50%'; // Center horizontally
    button.style.transform = 'translateX(-50%)'; // Adjust for centering
    button.style.borderRadius = '10px'; // Rounded corners
    button.style.fontSize = '0.5rem';
    button.style.zIndex = '100'; // Higher z-index for visibility
    button.style.cursor = 'pointer';
    button.style.border = 'none';
    button.style.pointerEvents = 'all'; // Ensure the button captures clicks
    button.style.userSelect = 'none'; // Prevent text selection
    button.style.transition = 'background-color 0.3s'; // Smooth transition for hover effect

    // Add hover effect
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(79, 70, 229, 1)'; // Change background on hover
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(79, 70, 229, 0.8)'; // Reset background when hover ends
    });

    // Add click event to log the image src to console and send the image src to the background script
    button.addEventListener('click', (event) => {
      const imageSrc = img.src;
      garmentImg = imageSrc

      localStorage.setItem('garmentLink', imageSrc);
      // Log the image source to the console
      console.log('Image Source:', imageSrc);

      // Prevent the click from propagating to underlying elements
      event.stopPropagation();

      // Send the image src to the background script
      chrome.runtime.sendMessage(
        { action: 'sendImageSrc', src: imageSrc },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
          } else {
            console.log('Response from background:', response);
          }
        }
      );

      // Now, send a message to the background script to open the popup
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });

    // Ensure the parent element has position relative
    const parent = img.parentElement;
    if (parent) {
      // Ensure parent positioning for proper button alignment
      const computedStyle = window.getComputedStyle(parent);
      if (computedStyle.position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(button);
    }

    // Mark this image as processed to avoid duplicate buttons
    img.classList.add('processed');
  });
}



// Use MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutationsList) => {
  // Call `processImages` whenever DOM changes are detected
  for (const mutation of mutationsList) {
    if (mutation.addedNodes.length > 0) {
      processImages();
      break;
    }
  }
});

// Start observing the document for DOM changes
observer.observe(document.body, { childList: true, subtree: true });

// Run the function once on initial page load
document.addEventListener('DOMContentLoaded', () => {
  processImages();
});

