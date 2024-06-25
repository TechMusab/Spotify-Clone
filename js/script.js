function convertSecondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"; // Handle invalid or negative input
  }

  // Ignore milliseconds by flooring the input seconds
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return formatted time
  return `${paddedMinutes}:${paddedSeconds}`;
}

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

 async function updatetimeandtitle(index, currentAudio) {
    let songs = await getSongs();
  let info = document.getElementById("info");
  info.innerText = songs[index].replaceAll("%20", " ");
  currentAudio.addEventListener("timeupdate", () => {
    console.log(currentAudio.currentTime, currentAudio.duration);
    document.querySelector("#duration").innerText = `${convertSecondsToMinutes(
      currentAudio.currentTime
    )} : ${convertSecondsToMinutes(currentAudio.duration)}`;
    document.querySelector(".circle").style.left=  currentAudio.currentTime/currentAudio.duration * 100 +" %" 
  });
}
async function updateseekbar(currentAudio){
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentAudio.currentTime = ((currentAudio.duration) * percent) / 100
    })
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

    let currentAudio = null; 

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
        document.querySelector(".circle").style.left=0+"%";

        // Update currentAudio to the new Audio object
        currentAudio = audio;
        updatePlayPauseButton(true);

        let previous = document.getElementById("previous");
        previous.addEventListener("click", function () {
          currentAudio.pause();
          // current index is playing song when previous is clicked previuos song plays when i again click previous itplay previuos because
          // i am doing index-1 if i dont do this again & again  current index will be play upon clicking.
          var audio = new Audio(`/songs/${songs[index - 1]}`);
          audio.play();
          currentAudio = audio;
          updatePlayPauseButton(true);
          index = index - 1; // updating the index
          updatetimeandtitle(index, currentAudio);
        });
        let next = document.getElementById("next");
        next.addEventListener("click", function () {
          currentAudio.pause();
          // current index is playing song when previous is clicked previuos song plays when i again click previous itplay previuos because
          // i am doing index+1 if i dont do this again & again  current index will be play upon clicking.
          var audio = new Audio(`/songs/${songs[index + 1]}`);
          audio.play();
          currentAudio = audio;
          updatePlayPauseButton(true);
          index = index + 1; // updating the index
          updatetimeandtitle(index, currentAudio);
        });
        updatetimeandtitle(index, currentAudio);
        updateseekbar(currentAudio);

      });
    });

    let playPauseButton = document.getElementById("play-pause");
    playPauseButton.addEventListener("click", function () {
      if (currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play();
          updatePlayPauseButton(true);
        } else {
          currentAudio.pause();
          updatePlayPauseButton(false);
        }
      }
    });
  } catch (error) {
    console.error("Error in main:", error);
  }
}

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
