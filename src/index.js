// WAVESURFER PROPERTIES
var audioTrack = WaveSurfer.create({
    container: '.player',
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

//AUDIO LOADER
//./audio/all_love.mp3
//./audio/chameleon.mp3
//./audio/how_does_it_feel.mp3
//./audio/let_go.mp3
//./audio/new_soul.mp3

audioTrack.load('./audio/let_go.mp3');

// DEFAULTS
let hotCue01 = 0;
let hotCue02 = 0;
let totalDuration01 = 0;
let totalDuration02 = 0;
let loop = {
    in: 0,
    out: 0,
    looped: false
};
// SPLASH SCREEN
const splashScreen = document.querySelector(".splash")
splashScreen.addEventListener("click", () => {
    splashScreen.classList.add("clicked")
})
// WAVEFORM VIEW
const toggleView = document.querySelector(".toggle")
toggleView.addEventListener("click", () => {
    audioTrack.toggleScroll();
})
// PLAY / STOP BUTTONS
const playButton = document.querySelector(".play-button")
const stopButton = document.querySelector(".stop-button")
playButton.addEventListener("click", () => {
    startPlayback();
})
stopButton.addEventListener("click", () => {
    stopPlayback();
})
// VOL SLIDER
const modVol = (vol) => {
    audioTrack.setVolume(vol);
}
const volSlider = document.querySelector(".vol-slider")
volSlider.addEventListener("input", () => {
    modVol(volSlider.value);
})
//SPEED SLIDER
const rateSlider = document.querySelector(".rate-slider")
rateSlider.addEventListener("input", () => {
    audioTrack.setPlaybackRate(rateSlider.value)
})
// HOTCUES
const hotCueOne = document.querySelector(".hot-cue-1")
const hotCueTwo = document.querySelector(".hot-cue-2")
const resetCueOne = document.querySelector(".reset-cue-1")
const resetCueTwo = document.querySelector(".reset-cue-2")
hotCueOne.addEventListener("click", () => {
    if (!hotCueOne.classList.contains("clicked") && hotCue01 === 0){
        hotCueOne.classList.add("clicked");
        hotCue01 = audioTrack.getCurrentTime();
    } else {
        totalDuration01 = audioTrack.getDuration();
        let currTimeOne = hotCue01 / totalDuration01
        audioTrack.seekTo(currTimeOne);

        loop.looped = false;
        loopIn.classList.remove("clicked");
        loopOut.classList.remove("clicked");
        loop.in = 0;
        loop.out = 0;
    }
})
resetCueOne.addEventListener("click", () => {
    if (hotCueOne.classList.contains("clicked")){
        hotCueOne.classList.remove("clicked");
        hotCue01 = 0;
    }
})
hotCueTwo.addEventListener("click", () => {
    if (!hotCueTwo.classList.contains("clicked") && hotCue02 === 0){
        hotCueTwo.classList.add("clicked");
        hotCue02 = audioTrack.getCurrentTime();
    } else {
        totalDuration02 = audioTrack.getDuration();
        let currTimeTwo = hotCue02 / totalDuration02
        audioTrack.seekTo(currTimeTwo);

        loop.looped = false;
        loopIn.classList.remove("clicked");
        loopOut.classList.remove("clicked");
        loop.in = 0;
        loop.out = 0;
    }
})
resetCueTwo.addEventListener("click", () => {
    if (hotCueTwo.classList.contains("clicked")){
        hotCueTwo.classList.remove("clicked");
        hotCue02 = 0;
    }
})
// LOOP
const loopIn = document.querySelector(".loop-in")
const loopOut = document.querySelector(".loop-out")
const clearLoop = document.querySelector(".clear-loop")
audioTrack.on('audioprocess', function() {
    if (loop.looped && loop.in && 
        audioTrack.getCurrentTime().toFixed(2) === loop.out){
        doTheLoop();
    }
})
const doTheLoop = function(){
    loop.looped = true;
    audioTrack.play(loop.in);
}
loopIn.addEventListener("click", () => {
    if (!loopIn.classList.contains("clicked") && !loop.in){
        loop.in = audioTrack.getCurrentTime();
        loopIn.classList.add("clicked");
    };
})
loopOut.addEventListener("click", () => {
    if (loop.in > 0 && !loop.out) {
        loop.out = audioTrack.getCurrentTime().toFixed(2);
        loopOut.classList.add("clicked");
        playButton.classList.add("playing")
        if (audioTrack.isPlaying()) audioTrack.stop();
        doTheLoop();
    };
})
clearLoop.addEventListener("click", () => {
        loop.looped = false;
        audioTrack.play(audioTrack.getCurrentTime());
        loopIn.classList.remove("clicked");
        loopOut.classList.remove("clicked");
        loop.in = 0;
        loop.out = 0;
})
// PLAYBACK HELPER FUNCTIONS
function startPlayback(){
    audioTrack.playPause();
    if (audioTrack.isPlaying()){
        playButton.classList.add("playing")
    } else {
        playButton.classList.remove("playing")
    }
}
function stopPlayback(){
    audioTrack.stop();
    playButton.classList.remove("playing")

    let totalSec = audioTrack.getDuration();
    if (totalSec > 0.5) {
    let totalTime = timeafy(totalSec)
    document.getElementById('current').innerText = "00:00 / " + totalTime;
    }
}
// TIMECODE RELATED
audioTrack.on('audioprocess', function() {
    if (audioTrack.isPlaying()) {
        const trackDuration = audioTrack.getDuration();
        let currSec = audioTrack.getCurrentTime();
        let currTime = timeafy(currSec)
        let totalSec = audioTrack.getDuration();
        let totalTime = timeafy(totalSec)
        document.getElementById('current').innerText = currTime + " / " + totalTime;
        document.getElementById('bpm').innerText = audioTrack.getPlaybackRate() + "x";
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
    audioTrack.pause();
    audioTrack.play([sec]);
    playButton.classList.add("playing")
}