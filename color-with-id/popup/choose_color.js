/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.sautest) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log('Clicked');

    /**
     * Given the name of a color, return the color as hex value.
     */
    function nameToColor(colorName) {
      switch (colorName) {
        case "Red":
          return "#F00";
        case "Green":
          return "#0F0";
        case "Blue":
          return "#00F";
      }
    }

    /**
     * Adds color
     * @param {*} tabs list of tabs
     */
    function addColor(tabs) {
      console.log('Try add color');
      browser.tabs.insertCSS({code: ""}).then(() => {
        let color = nameToColor(e.target.textContent);
        console.log('Try add color: ', color);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "colorize",
          clr: color
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: ""}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not colorize: ${error}`);
    }

    // Depending on button, add color block
    if (e.target.classList.contains("color")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(addColor)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute color block content script: ${error.message}`);
}

// Load script in the active tab's page and then bind events for popup windows
browser.tabs.executeScript({file: "/content_scripts/colorize.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
