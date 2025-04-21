let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
  
    const minutes = Math.floor(seconds / 60);
    const   
   remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2,   
   '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    // Parse the response text as HTML
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, 'text/html');

    // Find all <li> elements in the parsed HTML
    let as = doc.getElementsByTagName("a");

    // Log all the <li> elements found
    console.log(as);

    // If you want to log each <li> element's text content, you can loop through them
    // for (let li of tds) {
    //     console.log(li.textContent.trim());
    // }
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs;

}
const playMusic = (track,pause=false) => {
    //let audio = new Audio("/songs/"+track);
    currentsong.src = "/songs/" + track;
    if(!pause){
        currentsong.play();
        play.src ="pause.svg"
    }
    

    //audio.play();
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00"
}

async function main() {




    //get the list of all songs
    songs = await getSongs();
    console.log(songs);

    playMusic(songs[0],true)


    //show all songs in playlist 
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let li = document.createElement("li");

        li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Ram</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        `;

        songUl.appendChild(li);
    }


    //event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })


    })

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src ="pause.svg"
        }
        else{
            currentsong.pause();
            play.src="play.svg"
        }
    })

    //timeupdate
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentsong.currentTime)}:${secondsToMinutesSeconds(currentsong.duration)}`
        
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%";
    })

   //eventlistner to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector(".circle").style.left=percent+"%";
    currentsong.currentTime = (currentsong.duration*percent )/100

    
    
   })
   //hamburger
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
   })

   //hamburger eventlistner

   document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"; 
   })
   //prev and next 
   previous.addEventListener("click",()=>{
    console.log("previous clicked");
    console.log(currentsong);
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0 ])
    if (index > 0) {
        // Play the previous song if not at the first song
        playMusic(songs[index - 1]);
    } else {
        // If at the first song, loop back to the last song
        playMusic(songs[songs.length - 1]);
    } 
    
   })

   next.addEventListener("click",()=>{
    console.log("next clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0 ])
    if (index + 1 >= songs.length) {
        // If we're at the end, loop back to the first song
        playMusic(songs[0]);
    } else {
        // Otherwise, play the next song
        playMusic(songs[index + 1]);
    }
    
   })

}
main();

