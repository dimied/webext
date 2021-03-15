(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * 
   * @param {string} colorValue 
   */
  function insertColorBlock(colorValue) {
    removeExistingColorBlock();
    let colorBlock = document.createElement("div");
    // display is important, 
    // because the page might have other "understanding" of this block element
    colorBlock.style.display = "block";
    colorBlock.style.width = "100vw";
    colorBlock.style.position = "fixed";
    colorBlock.style.bottom = "0";
    colorBlock.style.left = "0";
    colorBlock.style.height = "10vh";
    colorBlock.style.width = "100vw";
    colorBlock.className = "clr-block";
    colorBlock.style.backgroundColor = colorValue;
    document.body.appendChild(colorBlock);
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingColorBlock() {
    let existingColorBlock = document.querySelectorAll(".clr-block");
    for (let beast of existingColorBlock) {
      beast.remove();
    }
  }

  // For messages (form other scripts)
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "colorize") {
      insertColorBlock(message.clr);
    } else if (message.command === "reset") {
      removeExistingColorBlock();
    }
  });

})();
