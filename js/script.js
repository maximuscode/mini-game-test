document.addEventListener("DOMContentLoaded", function () {
    // Show the game popup on page load
    var gamePopup = document.createElement('div');
    gamePopup.id = 'game-popup';
    gamePopup.style.display = 'flex';
    gamePopup.style.justifyContent = 'center';
    gamePopup.style.alignItems = 'center';
    gamePopup.style.position = 'fixed';
    gamePopup.style.top = '0';
    gamePopup.style.left = '0';
    gamePopup.style.width = '100%';
    gamePopup.style.height = '100%';
    gamePopup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    gamePopup.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h2>Ready to start the game?</h2>
        <button id="start-game-button">Start Game</button>
      </div>
    `;
    document.body.appendChild(gamePopup);

    var startGameButton = document.getElementById('start-game-button');
    startGameButton.addEventListener('click', function () {
        gamePopup.style.display = 'none';
        startGame(); // Start the game automatically
    });

    function showResultPopup(result, details) {
      var resultPopup = document.createElement("div");
      resultPopup.id = "result-popup";
      resultPopup.style.display = "flex";
      resultPopup.style.justifyContent = "center";
      resultPopup.style.alignItems = "center";
      resultPopup.style.position = "fixed";
      resultPopup.style.top = "0";
      resultPopup.style.left = "0";
      resultPopup.style.width = "100%";
      resultPopup.style.height = "100%";
      resultPopup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      resultPopup.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h2>Game Results:</h2>
          <p>Obstacle Position: ${details.rockPosition}px</p>
          <p>Run Time: ${details.runTime}ms</p>
          <p>Jump Distance: ${details.jumpDistance}px</p>
          <p>Obstacle Size: ${details.rockSize}px</p>
          <p>Final Result: ${result}</p>
          <button id="restart-game-button">Try Again</button>
        </div>
      `;
      document.body.appendChild(resultPopup);

      // Send game result to server
      var data = {
        action: "save_game_results",
        nonce: gameData.nonce,
        result: result,
        rock_position: details.rockPosition,
        run_time: details.runTime,
        jump_distance: details.jumpDistance,
        rock_size: details.rockSize,
      };

      jQuery.post(gameData.ajax_url, data, function (response) {
        if (response.success) {
          console.log("Game result saved successfully");
        } else {
          console.log("Failed to save game result");
        }
      });

      var restartGameButton = document.getElementById("restart-game-button");
      restartGameButton.addEventListener("click", function () {
        resultPopup.remove(); // Remove the results popup
        startGame(); // Restart the game
      });
    }

      function startGame() {
        var startTime = Date.now();
        var jumpDistance = 0;
        var rockPosition = window.terrain.rockPosition;
        var rockSize = window.terrain.rockSize;
        var gameResult = "Failure"; // Default to failure

        // Ensure the character starts running
        window.character.run();

        // Automatically jump when approaching the rock
        var gameInterval = setInterval(function () {
          var characterPosition = window.character.characterPosition;

          if (
            characterPosition >= rockPosition - 110 &&
            characterPosition <= rockPosition + 110
          ) {
            window.character.jump();
            jumpDistance = characterPosition; // Record the distance at which the character jumps
          }

          if (characterPosition >= 1020) {
            // Check if character reaches the flag
            clearInterval(gameInterval);
            window.character.stop(); // Ensure the character stops
          }

          if (
            characterPosition >= rockPosition - 50 &&
            characterPosition <= rockPosition + rockSize
          ) {
            // Check if character hits the rock
            clearInterval(gameInterval);
            gameResult = "Success"; // Set game result to success
            window.character.jump(); // Jump over the rock
            setTimeout(function () {
              window.character.run(); // Continue running after jumping over the rock
            }, 500); // Wait for a short time before resuming running
          }
        }, 10);

        // Function to stop the game and show result
        window.character.stop = function () {
          var runTime = Date.now() - startTime;
          var resultDetails = {
            rockPosition: rockPosition,
            runTime: runTime,
            jumpDistance: jumpDistance,
            rockSize: rockSize,
          };

          showResultPopup(gameResult, resultDetails);

          clearInterval(gameInterval);
          if (window.character.isRunning) {
            clearInterval(window.character.isRunning);
          }
          window.character.isRunning = false;
          window.character.donut.classList.remove("running");
        };

        // Update the annotate function to set gameResult
        window.character.annotate = function (text) {
          this.characterAnnotation.style.opacity = "1";
          this.characterAnnotation.querySelector(
            ".annotation-wrapper"
          ).innerText = text;
          setTimeout(
            function () {
              this.characterAnnotation.style.opacity = "0";
            }.bind(this),
            5000
          );

          // Set the game result based on the annotation text
          if (text === "Yay!") {
            gameResult = "Success";
          } else if (text === "Ouch!") {
            gameResult = "Failure";
          }
        };
      }
});
