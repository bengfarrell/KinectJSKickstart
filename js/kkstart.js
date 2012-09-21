// OVERRIDE THESE METHODS ///////////////
function onJump() { $(".kinectStatus").innerHTML("Jump").fadeOut(1000); }
function onReachIn() { $(".kinectStatus").innerHTML("Reach In").fadeOut(1000); }
function onReachOut() { $(".kinectStatus").innerHTML("Reach Out").fadeOut(1000); }
function onWaveHand() { $(".kinectStatus").innerHTML("Wave Hand").fadeOut(1000); }
function onPlayerFound(num) { $(".kinectStatus").innerHTML( num + " player found").fadeOut(1000); }
function onPlayerLost(num) { $(".kinectStatus").innerHTML("Player lost").fadeOut(1000); }
function onSwipeLeft(hand) { $(".kinectStatus").innerHTML("Swipe Left (" + hand + ")").fadeOut(1000); }
function onSwipeRight(hand) { $(".kinectStatus").innerHTML("Swipe Right (" + hand + ")").fadeOut(1000); }
function onSwipeUp(hand) { $(".kinectStatus").innerHTML("Swipe Up (" + hand + ")").fadeOut(1000); }
function onSwipeDown(hand) { $(".kinectStatus").innerHTML("Swipe Down (" + hand + ")").fadeOut(1000); }
///////////////////////////////////////

document.addEventListener( 'DOMContentLoaded', function() {
    $(".kinectStatus").fadeOut(1000);

    kinect.setUp({
        players  	: 1,
        relative 	: true,
        meters	 	: false,
        sensitivity	: 1.0,
        joints	 	: [ 'HAND_RIGHT', 'HAND_LEFT' ],
        gestures 	: [ 'HANDS_DIST', 'SWIPE', 'JUMP', 'ESCAPE' ]
    }).onMessage( function( e ) {
            var coords = this.coords;
            var left = coords[0][1];
            var right = coords[0][0];
            draw(left.x, left.y, "left");
            draw(right.x, right.y, "right");
        });

//adding notifications on connection status
    kinect.addEventListener('openedSocket', function() { this.notif.push( "CONNECTED" ); });
    kinect.addEventListener('closedSocket', function() { this.notif.push( "DISCONNECTED" ) });
    kinect.addEventListener('gestureSwipe', onSwipe);
    kinect.addEventListener('gestureJump', onJump);
    kinect.addEventListener('gestureEscape', onWaveHand);
    kinect.addEventListener('gestureCrank_ON', onReachIn );
    kinect.addEventListener('gestureCrank_OFF', onReachOut );

//adding notifications on player detection/loss
    kinect.addEventListener('playerFound', function( count ) {
        this.notif.push( "PLAYER FOUND. Total : " + count[ 0 ] );
        onPlayerFound(count);
    });
    kinect.addEventListener('playerLost', function( count ) {
        this.notif.push( "PLAYER LOST. Total : " + count[ 0 ] );
        onPlayerLost(count);
    });

    kinect
        .sessionPersist()
        .modal.make( 'js/knctModal.css' )
        .notif.make();
}, false);

function onSwipe(args) {
    var direction = args[2];
    if (direction == "left") {
        onSwipeLeft();
    } else if (direction == "right")  {
        onSwipeRight();
    } else if (direction == "top")  {
        onSwipeUp();
    } else if (direction == "bottom")  {
        onSwipeDown();
    }
}