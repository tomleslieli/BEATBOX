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
// NAVBAR ///////////////////////////////////////////////////////////
const aboutsection = document.querySelector(".about");
const infoboxes = document.querySelector(".info-boxes")
let aboutclicked = false;
aboutsection.addEventListener("click", () => {
    if (!aboutclicked){
        infoboxes.classList.add("clicked");
        aboutclicked = true;
    } else {
        infoboxes.classList.remove("clicked");
        aboutclicked = false;
    }
})

let nightModeOn = false;
const waveform0 = document.querySelector(".waveform-0");
const waveform1 = document.querySelector(".waveform-1");
const waveform2 = document.querySelector(".waveform-2");
const waveform3 = document.querySelector(".waveform-3");
const body= document.querySelector("body");

const trackinfo0 = document.querySelector(".track-info-0");
const trackinfo1 = document.querySelector(".track-info-1");
const trackinfo2 = document.querySelector(".track-info-2");
const trackinfo3 = document.querySelector(".track-info-3");

const upload0 = document.querySelector(".upload-0")
const upload1 = document.querySelector(".upload-1")
const upload2 = document.querySelector(".upload-2")
const upload3 = document.querySelector(".upload-3")

const clear0 = document.querySelector(".clear-track-0")
const clear1 = document.querySelector(".clear-track-1")
const clear2 = document.querySelector(".clear-track-2")
const clear3 = document.querySelector(".clear-track-3")

const regular = document.querySelector(".regular")
const dark = document.querySelector(".dark")

const bpm0 = document.querySelector(".bpm-container-0")
const bpm1 = document.querySelector(".bpm-container-1")
const bpm2 = document.querySelector(".bpm-container-2")
const bpm3 = document.querySelector(".bpm-container-3")

const wavetext0 = document.querySelector(".wave-text-background-0");
const wavetext1 = document.querySelector(".wave-text-background-1");
const wavetext2 = document.querySelector(".wave-text-background-2");
const wavetext3 = document.querySelector(".wave-text-background-3");

const playheads0 = document.querySelector("playheads-0.fa-solid.fa-sort-up");
const playheads1 = document.querySelector("playheads-0.fa-solid.fa-sort-down");

const abouttext = document.querySelector(".about-text")

const navbar = document.querySelector(".bar")

const nightMode = document.querySelector(".night-mode");
nightMode.addEventListener("click", () => {
    if (!nightModeOn) {
        body.classList.add("clicked");

        waveform0.classList.add("clicked");
        waveform1.classList.add("clicked");
        waveform2.classList.add("clicked");
        waveform3.classList.add("clicked");

        trackinfo0.classList.add("clicked");
        trackinfo1.classList.add("clicked");
        trackinfo2.classList.add("clicked");
        trackinfo3.classList.add("clicked");

        upload0.classList.add("clicked");
        upload1.classList.add("clicked");
        upload2.classList.add("clicked");
        upload3.classList.add("clicked");

        clear0.classList.add("clicked");
        clear1.classList.add("clicked");
        clear2.classList.add("clicked");
        clear3.classList.add("clicked");

        regular.classList.add("clicked");
        dark.classList.add("clicked"); 

        bpm0.classList.add("clicked");
        bpm1.classList.add("clicked");
        bpm2.classList.add("clicked");
        bpm3.classList.add("clicked");

        wavetext0.classList.add("clicked");
        wavetext1.classList.add("clicked");
        wavetext2.classList.add("clicked");
        wavetext3.classList.add("clicked");

        abouttext.classList.add("night");

        navbar.classList.add("clicked");

        mixer[0].setWaveColor('rgb(108, 184, 159)');
        mixer[0].setProgressColor('rgb(227, 158, 164)');
        mixer[1].setWaveColor('rgb(108, 184, 159)');
        mixer[1].setProgressColor('rgb(227, 158, 164)');
        mixer[2].setWaveColor('rgb(108, 184, 159)');
        mixer[2].setProgressColor('rgb(227, 158, 164)');
        mixer[3].setWaveColor('rgb(108, 184, 159)');
        mixer[3].setProgressColor('rgb(227, 158, 164)');

        nightModeOn = true;
    } else {
        body.classList.remove("clicked");

        trackinfo0.classList.remove("clicked");
        trackinfo1.classList.remove("clicked");
        trackinfo2.classList.remove("clicked");
        trackinfo3.classList.remove("clicked");

        waveform0.classList.remove("clicked");
        waveform1.classList.remove("clicked");
        waveform2.classList.remove("clicked");
        waveform3.classList.remove("clicked");  
        
        upload0.classList.remove("clicked");
        upload1.classList.remove("clicked");
        upload2.classList.remove("clicked");
        upload3.classList.remove("clicked");
        
        clear0.classList.remove("clicked");
        clear1.classList.remove("clicked");
        clear2.classList.remove("clicked");
        clear3.classList.remove("clicked");
        
        bpm0.classList.remove("clicked");
        bpm1.classList.remove("clicked");
        bpm2.classList.remove("clicked");
        bpm3.classList.remove("clicked");

        wavetext0.classList.remove("clicked");
        wavetext1.classList.remove("clicked");
        wavetext2.classList.remove("clicked");
        wavetext3.classList.remove("clicked");

        mixer[0].setWaveColor('rgb(151, 210, 235)');
        mixer[0].setProgressColor('rgb(300, 150, 90)');
        mixer[1].setWaveColor('rgb(151, 210, 235)');
        mixer[1].setProgressColor('rgb(300, 150, 90)');
        mixer[2].setWaveColor('rgb(151, 210, 235)');
        mixer[2].setProgressColor('rgb(300, 150, 90)');
        mixer[3].setWaveColor('rgb(151, 210, 235)');
        mixer[3].setProgressColor('rgb(300, 150, 90)');

        regular.classList.remove("clicked");
        dark.classList.remove("clicked");   
        
        abouttext.classList.remove("night");
        
        navbar.classList.remove("clicked");

        nightModeOn = false;
    }
})