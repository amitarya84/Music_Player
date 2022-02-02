
let songNumber = 1;
let shuffle = false;
let loop = 'noLoop';

//initializing audio object
let song = new Audio();
song.src = $('.songLi' + songNumber).attr('data-src');

let playing = false;
let totelSongs = $('.songLi').length;

resize();
setVolume(5)

$('.songName').html($('.songLi' + songNumber).find('h4').html());

$(window).on('resize', resize);
$('#progressBar').on('input', function () {
    updateProgressRevealer(getPercent(this.max, this.value))

})
$('#volumeInput').on('input', function () {
    updateVolumeRevealer(this.value)

})
$('#vloumeBtn').on('click', function () {

    toggleVolumeBar();
    if ($('.volumeBar').css('opacity') == 0) {
        volTimeout = setTimeout(toggleVolumeBar, 2000);
    }

});

$('#volumeInput').on('wheel', function (e) {
    e.stopPropagation();
    if (e.originalEvent.deltaY > 0) {
        e.target.value = parseInt(e.target.value) - 1;
        updateVolumeRevealer(e.target.value)
    } else {
        e.target.value = parseInt(e.target.value) + 1;
        updateVolumeRevealer(e.target.value)
    }
    setVolume(e.target.value)
})

$('#playlistBtn').on('click', togglePlaylistView)

$('.music-img-container').on('wheel', function (e) {
    if (e.originalEvent.deltaY > 0) {
        $('.playlistMainContainer').css('top', '100vh')
    } else {
        $('.playlistMainContainer').css('top', '0%')
    }
})

$('.down').on('click', function () {
    $('.playlistMainContainer').css('top', '100vh')
})

$('.shuffle').on('click', function () {
    if (!shuffle) {
        $('.shuffleSpan').css('font-weight', 'bold');
        $('.shuffleSpan').css('color', '#5a81ff');
        shuffle = true;
    } else {
        $('.shuffleSpan').css('font-weight', 'normal');
        $('.shuffleSpan').css('color', '#888');
        shuffle = false;
    }
})

$('.loop').on('click', function () {
    if (loop == 'noLoop') {
        $('.loopSpan').css('color', '#5a81ff');
        $('.loopSpan').css('font-weight', '600');
        loop = 'loopAll';
    } else if (loop == 'loopAll') {
        $('.loopSpan').css('font-weight', 'bold');
        $('.loopSpan').html('repeat_one')
        loop = 'loop1';
    } else if (loop == 'loop1') {
        $('.loopSpan').css('color', '#888');
        $('.loopSpan').css('font-weight', 'normal');
        $('.loopSpan').html('repeat')
        loop = 'noLoop';
    }
})

$('.pressable').on('mousedown', function () {
    $(this).addClass('pressed')
})
$('.pressable').on('mouseup', function () {
    $(this).removeClass('pressed')
})

$('#play-pause').on('click', mainPlayPauseToggle);
$('.bigPlayPauseBtn').on('click', mainPlayPauseToggle);

function mainPlayPauseToggle() {
    if (!playing) {
        $('#play-pause').html('<span class="material-icons">pause</span>');
        $('#play-pause').css('background', 'radial-gradient(#9cb7fa, #5a81ff)');
        $('#play-pause').css('color', '#fff');
        $('.bigPlayPauseBtn').html('<span class="material-icons">pause</span>');
        playing = true;
        song.play();
    } else {
        $('#play-pause').html('<span class="material-icons">play_arrow</span>');
        $('#play-pause').css('background', 'radial-gradient(white , #e7f0fd)')
        $('#play-pause').css('color', '#a1aec7')
        $('.bigPlayPauseBtn').html('<span class="material-icons">play_arrow</span>')

        playing = false;
        song.pause();
    }
    toggleBars();
    $('.songName').html($('.songLi' + songNumber).find('h4').html())
}

$('.forward').on('click', nextSong);
$('.prv').on('click', prevSong);
$('.songLi').on('click', function () {

    song.src = $('.songLi' + ($(this).index() + 1)).attr('data-src');
    songNumber = ($(this).index() + 1);
    if (!playing) { mainPlayPauseToggle(); }
    else {
        playing = !playing;
        mainPlayPauseToggle()
    }
})

$('#volumeInput').on('input', setVolume)

$(song).on('timeupdate', timeUpdateHandler)

$('#progressBar').on('mousedown', function () {
    $(song).off('timeupdate');
})
$('#progressBar').on('mouseup', function () {
    $(song).on('timeupdate', timeUpdateHandler);
    console.dir($('#progressBar')[0])
})
$('#progressBar').on('change', function () {
    song.currentTime = $('#progressBar').val();
})




function timeUpdateHandler() {
    $('#progressBar').attr('max', song.duration);
    updateProgressRevealer(Math.floor(getPercent(song.duration, song.currentTime)));
    $('.curTime').text(formatedTime(song.currentTime));
    $('.totelTime').html(formatedTime(song.duration));
    $('#progressBar').val(song.currentTime);

    if (song.ended) {
        if (loop == 'loop1') {
            song.currentTime == 0;
            playing = !playing;
            mainPlayPauseToggle()
        } else if (loop == 'noLoop' && songNumber == totelSongs) {
            mainPlayPauseToggle()
        } else {
            nextSong()
        }
    }

}

function setVolume(volume) {
    let songVol = this.value / 10 || volume / 10;
    if (isNaN(songVol) || songVol < 0) {
        songVol = 0;
    }
    song.volume = songVol;
}
function toggleBars() {
    $('.songLi').each(function () {
        $(this).find('figure').css('display', 'none');
    })

    if (playing) {
        $('.songLi' + songNumber).children(1).css('display', 'block');
    }


    $('.songLi').each(function () {
        $(this).removeClass('selected')
    })
    $('.songLi' + songNumber).addClass('selected')
    songNumber = ($('.songLi' + songNumber).index() + 1);
}

function nextSong() {
    if (!shuffle) {
        updateProgressRevealer(0);
        songNumber++;
        if (songNumber > totelSongs) {
            songNumber = 1;
        }
        song.src = $('.songLi' + songNumber).attr('data-src');
        playing = !playing;
        mainPlayPauseToggle()
    } else {
        updateProgressRevealer(0);
        let newRandomNo = random(1, totelSongs);

        while (newRandomNo == songNumber) {
            newRandomNo = random(1, totelSongs)
            console.log(newRandomNo)
        }

        songNumber = newRandomNo;
        if (songNumber > totelSongs) {
            songNumber = 1;
        }
        song.src = $('.songLi' + songNumber).attr('data-src');
        playing = !playing;
        mainPlayPauseToggle()
    }
}

function prevSong() {
    songNumber--;
    if (songNumber < 1) {
        songNumber = totelSongs;
    }
    song.src = $('.songLi' + songNumber).attr('data-src');
    playing = !playing;
    mainPlayPauseToggle()
}

function updateProgressRevealer(val) {
    $('.sliderFill').css('width', Math.floor(val) + '%')
}

function updateVolumeRevealer(val) {
    $('.volumeRevealer').css('width', (Math.floor(parseInt(val)) * 900) / 100 + '%')
    clearTimeout(volTimeout)
    volTimeout = setTimeout(toggleVolumeBar, 2000);
}

function togglePlaylistView() {
    $('.playlistMainContainer').css('top', '0');
}

function resize() {
    $('.music-img').css('width', $('.music-img').css('height'));
}
function getPercent(totel, gained) {
    return (gained * 100) / totel;
}
function random(no, toNo) {
    return Math.round((Math.random() * toNo) + no)
}
function formatedTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    if (hours > 0) {
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return hours + ':' + minutes + ':' + sec;
    } else {
        // if(minutes < 10){
        //     minutes = '0' + minutes;
        // }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return minutes + ':' + sec;
    }
}

let volTimeout;
function toggleVolumeBar() {
    if ($('.volumeBar').css('opacity') == 0) {
        $('.volumeBar').css('opacity', '1')
        $('.volumeBar').css('pointer-events', 'all');
    } else {
        $('.volumeBar').css('opacity', '0');
        $('.volumeBar').css('pointer-events', 'none');
        clearTimeout(volTimeout)

    }
}