async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
async function main() {
    try {
        let songs = await getSongs();
        console.log(songs);

        let element = document.querySelector(".card-container");
        element.innerHTML = "";

        for (const song of songs) {
            element.innerHTML += makeSongHTML(song);
        }

        let currentAudio = null; // Variable to hold the currently playing Audio object

        // Add event listeners to play buttons dynamically
        let playButtons = document.querySelectorAll(".playthesong");
        playButtons.forEach((button, index) => {
            button.addEventListener("click", function () {
                // Stop the currently playing audio (if any)
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0; // Reset playback to start
                }

                // Create new Audio object and play the corresponding song
                var audio = new Audio(`/songs/${songs[index]}`);
                audio.play();

                // Update currentAudio to the new Audio object
                currentAudio = audio;

                // Update play/pause button icon
                updatePlayPauseButton(true); // true for play icon
            });
        });

        // Play/pause button event listener
        let playPauseButton = document.getElementById("play-pause");
        playPauseButton.addEventListener("click", function () {
            if (currentAudio) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    updatePlayPauseButton(true); // true for play icon
                } else {
                    currentAudio.pause();
                    updatePlayPauseButton(false); // false for pause icon
                }
            }
        });

    } catch (error) {
        console.error("Error in main:", error);
    }
}

// Function to update play/pause button icon
function updatePlayPauseButton(isPlay) {
    let playPauseButton = document.getElementById("play-pause");
    if (isPlay) {
        playPauseButton.src = "./images/pause.svg";
    } else {
        playPauseButton.src = "./images/play.svg";
    }
}


function makeSongHTML(song) {
  let newhtml = `
        <div class="card">
            <div class="play">
                <button class="playthesong">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#000000" fill="none">
                        <circle cx="12" cy="12" r="12" fill="#1ed760"/>
                        <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                    </svg>
                </button>
            </div>
            <img src="https://i.scdn.co/image/ab67706f000000021178668a0433d73e34bb4af5" alt="">
            <h2>${song.replaceAll("%20", " ")}</h2>
            <p>Soothen Your Body</p>
        </div>
    `;
  return newhtml;
}

main();
