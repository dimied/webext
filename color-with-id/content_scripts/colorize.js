(function () {
  // Just a flag that the script got injected into page
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  var currentColor;
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
    currentColor = colorValue;
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingColorBlock() {
    let existingColorBlock = document.querySelectorAll(".clr-block");
    for (let colorBlock of existingColorBlock) {
      colorBlock.remove();
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
  var calls = 0;
  var lastId;
  var lastColor;

  document.body.addEventListener("mousemove", function (evt) {
    if (calls == 20) {
      calls = 0;

      let existingColorBlock = document.querySelectorAll(".clr-block");

      if (existingColorBlock.length > 0) {
        for (let block of existingColorBlock) {
          block.innerHTML = "X = " + evt.pageX + " | Y = " + evt.pageY;
        }
        console.log(evt);

        if (currentColor && evt.target.id && evt.target.id != lastId) {
          var lastTarget;
          console.log('Check:', lastId, lastColor);

          if (lastId && lastColor != undefined) {
            console.log('Search for:', lastId);
            lastTarget = document.getElementById(lastId);
            if (lastTarget) {
              console.log('Found last element:for:', lastId);
              lastTarget.style.backgroundColor = lastColor;
            }

          }


          lastId = evt.target.id;
          lastColor = evt.target.style.backgroundColor;
          evt.target.style.backgroundColor = currentColor;
        }
      }
    }
    calls++;
  });
})();
