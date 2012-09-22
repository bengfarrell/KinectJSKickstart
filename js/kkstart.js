// OVERRIDE THESE METHODS ///////////////
function onJump(player) {}
function onLean(direction, leg, player) {}
function onTurn(direction, player) {}
function onReachIn(player) {}
function onReachOut(player) {}
function onWaveHand(status, player) {}
function onPlayerCountChange(count) {}
function onSwipeLeft(hand, player) {}
function onSwipeRight(hand, player) {}
function onSwipeUp(hand, player) {}
function onSwipeDown(hand, player) {}
function onConnected() {}
function onDisconnected() {}
function onHandMove(hand, x, y) {} // todo: add z coordinate and track diff players
///////////////////////////////////////

var kks_leftHandLoc = {x:0, y:0};
var kks_rightHandLoc = {x:0, y:0};

document.addEventListener( 'DOMContentLoaded', function() {

    kinect.setUp({
        players  	: 1,
        relative 	: true,
        meters	 	: false,
        sensitivity	: 1.0,
        joints	 	: [ 'HAND_RIGHT', 'HAND_LEFT' ],
        gestures 	: [ 'HANDS_DIST', 'SWIPE', 'JUMP', 'ESCAPE', 'FOOT_LEAN', 'BODY_ANGLE' ]
    }).onMessage( function( e ) {
            var coords = this.coords;
            var left = coords[0][1];
            var right = coords[0][0];
            if (left.x != kks_leftHandLoc.x || left.y != kks_leftHandLoc.y) {
                onHandMove("left", left.x, left.y);
            }
            if (right.x != kks_rightHandLoc.x || right.y != kks_rightHandLoc.y) {
                onHandMove("right", right.x, right.y);
            }
        });

    kinect.addEventListener('openedSocket', onConnected);
    kinect.addEventListener('closedSocket', onDisconnected);
    kinect.addEventListener('playerFound', _onKDSKPlayerChangeHandler);
    kinect.addEventListener('playerLost', _onKDSKPlayerChangeHandler);
    kinect.addEventListener('gestureSwipe', _onKJSKStartSwipeHandler);
    kinect.addEventListener('gestureJump', _onKDSKStartJumpHandler);
    kinect.addEventListener('gestureFootLean', _onKDSKStartLeanHandler);
    kinect.addEventListener('gestureBodyTurning', _onKDSKStartTurnHandler)
    kinect.addEventListener('gestureEscape', _onKDSKStartWaveHandler);
    kinect.addEventListener('gestureCrank_ON', _onKDSKReachInHandler );
    kinect.addEventListener('gestureCrank_OFF', _onKDSKReachOutHandler );
    kinect.sessionPersist().modal.make('js/knctModal.css').notif.make();

}, false);


function _onKDSKPlayerChangeHandler(args) {
    onPlayerCountChange(args[0]);
}

function _onKDSKReachInHandler(args) {
    onReachIn(args[0]);
}

function _onKDSKReachOutHandler(args) {
    onReachOut(args[0]);
}

function _onKDSKStartTurnHandler(args) {
    onTurn(args[1], args[0]);
}

function _onKDSKStartLeanHandler(args) {
    onLean(args[2], args[1], args[0]);
}

function _onKDSKStartJumpHandler(args) {
    onJump(args[0]);
}

function _onKDSKStartWaveHandler(args) {
    var status;
    if (args[1] == true)  {
        status = "starting";
    } else {
        status = "finished;"
    }
    onWaveHand(status, args[0]);
}

function _onKJSKStartSwipeHandler(args) {
    var direction = args[2];

    var hand = "unknown";
    if (args[1] == 7) {
        hand = "left";
    } else if (args[1] == 11) {
        hand = "right";
    }

    if (direction == "left") {
        onSwipeLeft(hand, args[0]+1);
    } else if (direction == "right")  {
        onSwipeRight(hand, args[0]+1);
    } else if (direction == "top")  {
        onSwipeUp(hand, args[0]+1);
    } else if (direction == "bottom")  {
        onSwipeDown(hand, args[0]+1);
    }
}