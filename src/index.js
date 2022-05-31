// DEFAULTS ////////////////////////////////////////////////////////////////
let track1 = {
    hotCue01: 0,
    hotCue02: 0,
    originalVolume: 0,
    totalDuration01: 0,
    totalDuration02: 0,
    trackName: "",
    in: 0,
    out: 0,
    looped: false
};
let track2 = {
    hotCue01: 0,
    hotCue02: 0,
    originalVolume: 0,
    totalDuration01: 0,
    totalDuration02: 0,
    trackName: "",
    in: 0,
    out: 0,
    looped: false
};
let track3 = {
    hotCue01: 0,
    hotCue02: 0,
    originalVolume: 0,
    totalDuration01: 0,
    totalDuration02: 0,
    trackName: "",
    in: 0,
    out: 0,
    looped: false
};
let track4 = {
    hotCue01: 0,
    hotCue02: 0,
    originalVolume: 0,
    totalDuration01: 0,
    totalDuration02: 0,
    trackName: "",
    in: 0,
    out: 0,
    looped: false
};
const tracks = [track1, track2, track3, track4];
const mixer = [];
// SPLASH SCREEN ///////////////////////////////////////////////////////////
const splashScreen = document.querySelector(".splash")
splashScreen.addEventListener("click", () => {
    splashScreen.classList.add("clicked");
    setTimeout(function(){
        splashScreen.classList.add("splashed");
    }, 1500);
})
// PLAYER CREATOR ///////////////////////////////////////////////////////////
const createTrack = function (id) {

    var playerContainer = document.createElement('div');
    playerContainer.setAttribute("id", "track-" + id);

    document.querySelector("#track-container-"+id).appendChild(playerContainer);
    // LOADING & CLEARING TRACKS ///////////////////////////////////////////////
    mixer[id] = WaveSurfer.create({
        container: playerContainer,
        waveColor: 'rgb(151, 210, 235)',
        progressColor: 'rgb(300, 150, 90)',
        cursorColor: 'rgb(999, 999, 999)',
        barWidth: '3',
        barGap: '1.5',
        height: '75',
        autoCenter: true,
        scrollParent: true,
        hideScrollbar: true
    });
    document.getElementById("upload-file-"+id).addEventListener("change", function(e){
        let newFile = this.files[0];
        if (newFile) {
            let file = new FileReader();

            file.onload = function(el){
                let track = new window.Blob([new Uint8Array(el.target.result)]);
                mixer[id].loadBlob(track);
            };
            tracks[id].trackName = newFile.name
            document.getElementById('track-name-'+id).innerText = "Track: " + tracks[id].trackName;
            file.readAsArrayBuffer(newFile);
            mixer[id].load(file);
            let currSec = mixer[id].getCurrentTime();
            let currTime = timeafy(currSec)
            let totalSec = mixer[id].getDuration();
            let totalTime = timeafy(totalSec)
            document.getElementById('current+'+id).innerText = currTime + " / " + totalTime;
            if (playButton.classList.contains("playing")){
                playButton.classList.remove("playing")
            }
        }
    }, false);
    const clearTrack = document.querySelector(".clear-"+id)
    clearTrack.addEventListener("click", () => {
        mixer[id].stop();
        mixer[id].empty();
        mixer[id].unAll();
        playButton.classList.remove("playing");
        tracks[id].trackName = ""
        volSlider.value = .5;
        rateSlider.value = 1;
        document.getElementById('track-name-'+id).innerText = "Track: ";
        document.getElementById('current-'+id).innerText = "00:00 / 00:00";
        document.getElementById('bpm-'+id).innertext ="1x";
    });

    // WAVEFORM VIEW ///////////////////////////////////////////////////////////
    const toggleView = document.querySelector(".toggle-"+id)
    const playheads = document.querySelector(".playheads-"+id)
    toggleView.addEventListener("click", () => {
        mixer[id].toggleScroll();
        if (!playheads.classList.contains("clicked")){
        playheads.classList.add("clicked")
        } else {
            playheads.classList.remove("clicked");
        }
    })

    // PLAY / STOP BUTTONS /////////////////////////////////////////////////////
    const playButton = document.querySelector(".play-button-"+id)
    const stopButton = document.querySelector(".stop-button-"+id)
    playButton.addEventListener("click", () => {
        startPlayback();
    })
    stopButton.addEventListener("click", () => {
        stopPlayback();
    })
    // VOL SLIDER //////////////////////////////////////////////////////////////
    const modVol = (vol) => {
        mixer[id].setVolume(vol);
    }
    const volSlider = document.querySelector(".vol-slider-"+id)
    volSlider.addEventListener("input", () => {
        modVol(volSlider.value);
    })
    const muteVol = document.querySelector(".mute-"+id)
    const muted = document.querySelector(".muted-"+id)
    muteVol.addEventListener("click", () => {
        if (!mixer[id].getMute()) {
            tracks[id].originalVolume = mixer[id].getVolume();
            mixer[id].setMute(true);
            muteVol.classList.add("clicked");
            muted.classList.add("clicked");
            volSlider.value = 0;
        } 
    });
    muted.addEventListener("click", () => {
        if (mixer[id].getMute()){
        mixer[id].setMute(false);
        muteVol.classList.remove("clicked");
        muted.classList.remove("clicked");
        volSlider.value = tracks[id].originalVolume;
        }
    })
    //SPEED SLIDER /////////////////////////////////////////////////////////////
    const rateSlider = document.querySelector(".rate-slider-"+id)
    rateSlider.addEventListener("input", () => {
        mixer[id].setPlaybackRate(rateSlider.value)
    })
    const speed = document.querySelector(".speed-"+id)
    speed.addEventListener("click", () => {
        mixer[id].setPlaybackRate(1)
        rateSlider.value = 1;
    })
    // HOTCUES /////////////////////////////////////////////////////////////////
    const hotCueOne = document.querySelector(".hot-cue-1-"+id)
    const hotCueTwo = document.querySelector(".hot-cue-2-"+id)
    const resetCueOne = document.querySelector(".reset-cue-1-"+id)
    const resetCueTwo = document.querySelector(".reset-cue-2-"+id)
    hotCueOne.addEventListener("click", () => {
        if (!hotCueOne.classList.contains("clicked") && tracks[id].hotCue01 === 0){
            hotCueOne.classList.add("clicked");
            tracks[id].hotCue01 = mixer[id].getCurrentTime();
        } else {
            tracks[id].totalDuration01 = mixer[id].getDuration();
            let currTimeOne = tracks[id].hotCue01 / tracks[id].totalDuration01
            mixer[id].seekTo(currTimeOne);

            tracks[id].looped = false;
            loopIn.classList.remove("clicked");
            loopOut.classList.remove("clicked");
            tracks[id].in = 0;
            tracks[id].out = 0;
        }
    })
    resetCueOne.addEventListener("click", () => {
        if (hotCueOne.classList.contains("clicked")){
            hotCueOne.classList.remove("clicked");
            tracks[id].hotCue01 = 0;
        }
    })
    hotCueTwo.addEventListener("click", () => {
        if (!hotCueTwo.classList.contains("clicked") && tracks[id].hotCue02 === 0){
            hotCueTwo.classList.add("clicked");
            tracks[id].hotCue02 = mixer[id].getCurrentTime();
        } else {
            totalDuration02 = mixer[id].getDuration();
            let currTimeTwo = tracks[id].hotCue02 / totalDuration02
            mixer[id].seekTo(currTimeTwo);

            tracks[id].looped = false;
            loopIn.classList.remove("clicked");
            loopOut.classList.remove("clicked");
            tracks[id].in = 0;
            tracks[id].out = 0;
        }
    })
    resetCueTwo.addEventListener("click", () => {
        if (hotCueTwo.classList.contains("clicked")){
            hotCueTwo.classList.remove("clicked");
            tracks[id].hotCue02 = 0;
        }
    })
    // LOOP ////////////////////////////////////////////////////////////////////
    const loopIn = document.querySelector(".loop-in-"+id)
    const loopOut = document.querySelector(".loop-out-"+id)
    const clearLoop = document.querySelector(".clear-loop-"+id)
    mixer[id].on('audioprocess', function() {
        if (tracks[id].looped && tracks[id].in && 
            mixer[id].getCurrentTime().toFixed(2) === tracks[id].out){
            doTheLoop();
        }
    })
    const doTheLoop = function(){
        tracks[id].looped = true;
        mixer[id].play(tracks[id].in);
    }
    loopIn.addEventListener("click", () => {
        if (!loopIn.classList.contains("clicked") && !tracks[id].in){
            tracks[id].in = mixer[id].getCurrentTime();
            loopIn.classList.add("clicked");
        };
    })
    loopOut.addEventListener("click", () => {
        if (tracks[id].in > 0 && !tracks[id].out) {
            tracks[id].out = mixer[id].getCurrentTime().toFixed(2);
            loopOut.classList.add("clicked");
            playButton.classList.add("playing")
            if (mixer[id].isPlaying()) mixer[id].stop();
            doTheLoop();
        };
    })
    clearLoop.addEventListener("click", () => {
            tracks[id].looped = false;
            mixer[id].play(mixer[id].getCurrentTime());
            loopIn.classList.remove("clicked");
            loopOut.classList.remove("clicked");
            tracks[id].in = 0;
            tracks[id].out = 0;
    })
    // PLAYBACK HELPER FUNCTIONS /////////////////////////////////////////////
    function startPlayback(){
        mixer[id].playPause();
        if (mixer[id].isPlaying()){
            playButton.classList.add("playing")
        } else {
            playButton.classList.remove("playing")
        }
    }
    function stopPlayback(){
        mixer[id].stop();
        playButton.classList.remove("playing")

        let totalSec = mixer[id].getDuration();
        if (totalSec > 0.5) {
        let totalTime = timeafy(totalSec)
        document.getElementById('current-'+id).innerText = "00:00 / " + totalTime;
        }
    }
    // TIMECODE RELATED //////////////////////////////////////////////////////
    mixer[id].on('audioprocess', function() {
        if (mixer[id].isPlaying()) {
            const trackDuration = mixer[id].getDuration();
            let currSec = mixer[id].getCurrentTime();
            let currTime = timeafy(currSec)
            let totalSec = mixer[id].getDuration();
            let totalTime = timeafy(totalSec)
            document.getElementById('current-'+id).innerText = currTime + " / " + totalTime;
            document.getElementById('bpm-'+id).innerText = mixer[id].getPlaybackRate() + "x";
        } 
    })
    function timeafy(input){
        let sec = Math.round(input);
        let min = 0;

        if ((sec >= 60)) {
            min += (Math.floor(sec / 60));
            sec = (sec % 60);
        }
        let min_out = "";
        let sec_out = "";

        if (sec / 10 >= 1){
            sec_out = sec.toString();
        } else {
            sec_out = "0" + sec.toString();
        }
        if (min / 10 >= 1){
            min_out = min;
        } else {
            min_out = "0" + min.toString();
        }
        return min_out + ":" + sec_out;
    }
    function startOnCue(sec){
        stopPlayback();
        mixer[id].pause();
        mixer[id].play([sec]);
        playButton.classList.add("playing")
    }
}
// INSTANCE CREATION ///////////////////////////////////////////////////////////
createTrack(0);
createTrack(1);
createTrack(2);
createTrack(3);
// CROSSFADERS ///////////////////////////////////////////////////////////