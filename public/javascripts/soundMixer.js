/**
 * Created by alexey on 03.01.16.
 */
var player = {
    // initialisation:
    pCount:0,
    playlistUrls:['/sounds/track_1.mp3', '/sounds/track_2.mp3', '/sounds/track_3.mp3'], // audio list
    howlerBank:[],
    loop:true,
    // playing i+1 audio (= chaining audio files)
    onEnd:function() {
        with(player){
            if (loop === true ) { pCount = (pCount + 1 !== howlerBank.length)? pCount + 1 : 0; }
            else { pCount = pCount + 1; }
            howlerBank[pCount].play();
        }
    },
    startPlay:function(){
        with(player) {
            // build up howlerBank:
            this.playlistUrls.forEach(function (current, i) {
                howlerBank.push(new Howl({
                urls: [playlistUrls[i]],
                onend: onEnd,
                buffer: true,
                volume: 0.8
                }))
            });
            // initiate the whole :
            howlerBank[0].play();
        }
    },
    stopPlay:function(){
        with(player) {
            howlerBank[pCount].pause();
        }
    },
    continuePlay:function(){
        with(player) {
            howlerBank[pCount].play();
        }
    }
};