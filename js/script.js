

function toggleSidebar() {
document.querySelector('.left').style.left="0";
}
function closesidebar() {
  document.querySelector('.left').style.left="-100%";
}


function convertSecondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"; 
  }
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

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


  



async function main() {

    let songs = await getSongs();
    console.log(songs);
    let element = document.querySelector(".card-container");
    element.innerHTML = "";

    for (const song of songs) {
      element.innerHTML += makeSongHTML(song);
    }

    let currentAudio = null; 

  // Selecting All the buttons with class .playthesong
    
    let playButtons = document.querySelectorAll(".playthesong");
    playButtons.forEach((button, index) => {
      // Adding the event listeners to every button selected 
      button.addEventListener("click", function () {
        // Stop the currently playing audio (if any)
// When i play the 1st song current audio will be null it skips this 
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0; 
        }

        // Create new Audio object and play the corresponding song
        var audio = new Audio(`/songs/${songs[index]}`);
        audio.play();
        // When songs will play seekbar restarts 
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
          document.querySelector(".circle").style.left = 0 + "%";
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
         document.querySelector(".circle").style.left = 0 + "%";
          updatetimeandtitle(index, currentAudio);
        });
        updatetimeandtitle(index, currentAudio);


      });
    });
//  in main ftn

document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentAudio.currentTime = ((currentAudio.duration) * percent) / 100
})
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
document.querySelector(".range-slider").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log(e.target);
  currentAudio.volume = parseInt(e.target.value) / 100
  if (currentAudio.volume >0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
  }
})
document.querySelector(".volume>img").addEventListener("click", e=>{ 
  if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentAudio.volume = 0;
      document.querySelector(".range-slider").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentAudio.volume = .10;
      document.querySelector(".range-slider").getElementsByTagName("input")[0].value = 10;
  }

})
}
// main ftn ends


function updatePlayPauseButton(isPlay) {
  let playPauseButton = document.getElementById("play-pause");
  if (isPlay) {
    playPauseButton.src = "./images/pause.svg";
  } else {
    playPauseButton.src = "./images/play.svg";
  }
}
const artists = [
  "Taylor Swift",
  "Zack Knight",
  "Hadiqa Khan",
  "Phontom Planet",
  "Ammy Virk",
];

let i=1;
function makeSongHTML(song) {
  if(i>4){
    i=1;
  }
  
  let newhtml = `
        <div class="card">
            <div class="play">
                <button class="playthesong">
                    <img  src="./images/playbutton.svg" alt="playbutton">
              </button>
            </div>
            <img src="../images/cover (${i}).jpg" alt="">
            <h2>${song.replaceAll("%20", " ")}</h2>
            <p>${artists[i]}</p>
        </div>
    `;
    i++;
  return newhtml;
}


main();
