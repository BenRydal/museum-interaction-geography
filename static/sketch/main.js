/*
 * Copyright (C) 2018 Ben Rydal Shapiro. All rights reserved.
 * Originally developed at Vanderbilt University.
 * https://etd.library.vanderbilt.edu/available/etd-03212018-140140/unrestricted/Shapiro_Dissertation.pdf
 */

// For high res or low res screens
var imageFileName;

// Array Lengths
var individualLength = 15,
    conversationLength = 106;

// Hash for data
var mapConversation = []; // conversationLength
var mapMovement = [], // individualLength for all
    mapTalk = [],
    mapCuration = [],
    mapZoomMovement = [],
    mapZoomTalk = [],
    mapZoomCuration = [];

// Base image files
var baseGrid_2, baseGrid_3, grayScale, allConversationBoxes, grid_Walkway, grid_Bluegrass, grid_Rotunda, plan_Walkway, plan_Bluegrass, plan_Rotunda, conversationBoxes_00, conversationBoxes_01, conversationBoxes_02, conversationBoxes_03, conversationBoxes_10, conversationBoxes_11, conversationBoxes_12, conversationBoxes_13, conversationBoxes_20, conversationBoxes_21, conversationBoxes_22, grayScale_00, grayScale_01, grayScale_02, grayScale_03, grayScale_10, grayScale_11, grayScale_12, grayScale_13, grayScale_20, grayScale_21, grayScale_22;

// 3 modes
var movement = true,
    talk = false,
    curation = false;

// ********* GUI *********
var font_PlayfairReg; // font
var conversationAudioNumber = -1; // Constant for preventing audio repeating

// Interface variables
var locked = false,
    zoomView = true,
    grayScaleToggle = true,
    welcome = true, // Controls welcome message/information on hover
    intro = true; // Controls opening selection of Blake/Adhir

// Animation variables
var reveal = 0,
    fillColor = 255,
    animate = true,
    fullScreenTransition = false;

// Conversation button variables
var conversationButtonSize = 7,
    conversationButtonSizeZoom = 14,
    conversationButtonGap = 7,
    conversationButtonGapZoom = 14;

// Conversation button positions
var conversationButtonY, conversationButtonX, yPosWalkway, yPosBluegrass, yPosRotunda, xPosButtonBluegrass, xPosButtonGayle, xPosButtonBusiness, xPosButtonMom;

// Current space and family selection
var displaySpace = 1,
    displayFamily = 0;

// Timeline animation variables
var timelineStartWalkway, timelineStartBluegrass, timelineStartRotunda;

// Classes
function Conversation(convo, box, boxZoom, audio) {
    this.conversationText = convo;
    this.conversationBox = box;
    this.conversationBoxZoom = boxZoom;
    this.conversationAudio = audio;
}

function movementPath(movement, view) {
    this.movement = movement;
    this.show = view;
}

// Primary class to control GUI using movement
function movementZoom(walkway, bluegrass, rotunda, selectWalkway, selectBluegrass, selectRotunda) {
    this.movementWalkway = walkway;
    this.movementBluegrass = bluegrass;
    this.movementRotunda = rotunda;
    this.selectWalkway = selectWalkway;
    this.selectBluegrass = selectBluegrass;
    this.selectRotunda = selectRotunda;
}

function talkCurationZoom(walkway, bluegrass, rotunda) {
    this.movementWalkway = walkway;
    this.movementBluegrass = bluegrass;
    this.movementRotunda = rotunda;
}

function preload() {
    loadBlankDataArrays();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    if (windowWidth > 900) imageFileName = "images/"; // high density displays
    else imageFileName = "lowImages/"; // low density displays
    loadBaseImages();
    frameRate(30);
    positionButtons();
    font_PlayfairReg = loadFont("data/PlayfairDisplay-Regular.ttf");
    textFont(font_PlayfairReg, 18);
}

// sets drawing canvas, organizes drawing in 2 views (zoom or not zoom), sets animation
function draw() {
    // Read from Svelte store bridge
    var s = window._igsState;
    if (s) {
        zoomView = s.view === 'zoom';
        movement = s.mode === 'movement';
        talk = s.mode === 'talk';
        curation = s.mode === 'curation';
        displaySpace = s.space;
        displayFamily = s.family;
        animate = s.animate;
        welcome = s.welcome;
    }

    background(255);
    var drawingSurface;
    locked = false; // resets locked
    noStroke();
    if (zoomView) {
        drawingSurface = new DrawZoom();
        drawingSurface.draw();
    } else if (!zoomView) {
        drawingSurface = new DrawSmallMultiple();
        drawingSurface.draw();
    }
    setUpAnimation();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    positionButtons();
}


function loadBlankDataArrays() {
    var noData = -1;
    var path = new movementPath(noData, false);
    // load individual length arrays
    for (var i = 0; i < 15; i++) {
        mapMovement.push(path);
        mapTalk.push(noData);
        mapCuration.push(noData);
        mapZoomMovement.push(noData);
        mapZoomTalk.push(noData);
        mapZoomCuration.push(noData);
    }
    // load conversation length array
    for (var i = 0; i < 106; i++) {
        mapConversation.push(noData);
    }
}

function loadDataSmallMultiple(i) {
    var path;
    var block;
    var curPath;
    var curPathZoom;
    path = new movementPath(loadImage(imageFileName + i + "_movement.png"), true);
    // mapMovement[i].movement = loadImage(imageFileName + i + "_movement.png"); // replace noData with image

    mapMovement[i] = path;

    block = loadImage(imageFileName + i + "_talk.png");
    mapTalk[i] = block;

    if (i == 2 || i == 3 || i == 4 || i == 12) { // for people who did not curate push integer
        mapCuration[i] = 1;
        mapZoomCuration[i] = 1;
    } else {
        if (i == 0 || i == 5) { // no walkway curation
            curPathZoom = new movementZoom(1, loadImage(imageFileName + i + "_bluegrassCuration.png"), loadImage(imageFileName + i + "_rotundaCuration.png"));
        } else if (i == 1) { // only rotunda curation
            curPathZoom = new movementZoom(1, 1, loadImage(imageFileName + i + "_rotundaCuration.png"));
        } else if (i == 7) { // no bluegrass curation
            curPathZoom = new movementZoom(loadImage(imageFileName + i + "_walkwayCuration.png"), 1, loadImage(imageFileName + i + "_rotundaCuration.png"));
        } else if (i == 8 || i == 14) { // only bluegrass curation
            curPathZoom = new movementZoom(1, loadImage(imageFileName + i + "_bluegrassCuration.png"), 1);
        } else if (i == 6 || i == 11 || i == 13) { // no rotunda curation
            curPathZoom = new movementZoom(loadImage(imageFileName + i + "_walkwayCuration.png"), loadImage(imageFileName + i + "_bluegrassCuration.png"), 1);
        } else if (i == 9 || i == 10) { // show all
            curPathZoom = new movementZoom(loadImage(imageFileName + i + "_walkwayCuration.png"), loadImage(imageFileName + i + "_bluegrassCuration.png"), loadImage(imageFileName + i + "_rotundaCuration.png"));
        }

        curPath = loadImage(imageFileName + i + "_curation.png");
        mapCuration[i] = curPath;
        mapZoomCuration[i] = curPathZoom;
    }
}

function loadDataZoom(i) {
    var pathZoom;
    var blockZoom;
    // for BG mom and Swift family there is no rotunda image 
    if (i == 3 || i > 10) {
        pathZoom = new movementZoom(loadImage(imageFileName + i + "_walkway.png"), loadImage(imageFileName + i + "_bluegrass.png"), 1, false, false, false);
        blockZoom = new movementZoom(loadImage(imageFileName + i + "_walkwayTalk.png"), loadImage(imageFileName + i + "_bluegrassTalk.png"), 1);
    } else {
        pathZoom = new movementZoom(loadImage(imageFileName + i + "_walkway.png"), loadImage(imageFileName + i + "_bluegrass.png"), loadImage(imageFileName + i + "_rotunda.png"), false, false, false);
        blockZoom = new movementZoom(loadImage(imageFileName + i + "_walkwayTalk.png"), loadImage(imageFileName + i + "_bluegrassTalk.png"), loadImage(imageFileName + i + "_rotundaTalk.png"));
    }
    mapZoomMovement[i] = pathZoom;
    mapZoomTalk[i] = blockZoom;
}

function loadDataConversation(i) {
    var conversation = new Conversation(loadStrings(imageFileName + i + "_conversation.txt"), loadImage(imageFileName + i + "_conversationBox.png"), loadImage(imageFileName + i + "_conversationBoxZoom.png"), loadSound("audio/" + i + "_conversationAudio.mp3"));
    mapConversation[i] = conversation;
}


function loadBaseImages() {
    baseGrid_2 = loadImage(imageFileName + "baseGrid_2.png");
    baseGrid_3 = loadImage(imageFileName + "baseGrid_3.png");
    grid_Bluegrass = loadImage(imageFileName + "grid_Bluegrass.png");
    // load above first
    grid_Walkway = loadImage(imageFileName + "grid_Walkway.png");
    grid_Rotunda = loadImage(imageFileName + "grid_Rotunda.png");

    plan_Walkway = loadImage(imageFileName + "plan_Walkway.png");
    plan_Bluegrass = loadImage(imageFileName + "plan_Bluegrass.png");
    plan_Rotunda = loadImage(imageFileName + "plan_Rotunda.png");
    grayScale = loadImage(imageFileName + "grayScale.png");
    allConversationBoxes = loadImage(imageFileName + "allConversationBoxes.png");
    conversationBoxes_00 = loadImage(imageFileName + "conversationBoxes_00.png");
    conversationBoxes_01 = loadImage(imageFileName + "conversationBoxes_01.png");
    conversationBoxes_02 = loadImage(imageFileName + "conversationBoxes_02.png");
    conversationBoxes_03 = loadImage(imageFileName + "conversationBoxes_03.png");
    conversationBoxes_10 = loadImage(imageFileName + "conversationBoxes_10.png");
    conversationBoxes_11 = loadImage(imageFileName + "conversationBoxes_11.png");
    conversationBoxes_12 = loadImage(imageFileName + "conversationBoxes_12.png");
    conversationBoxes_13 = loadImage(imageFileName + "conversationBoxes_13.png");
    conversationBoxes_20 = loadImage(imageFileName + "conversationBoxes_20.png");
    conversationBoxes_21 = loadImage(imageFileName + "conversationBoxes_21.png");
    conversationBoxes_22 = loadImage(imageFileName + "conversationBoxes_22.png");
    grayScale_00 = loadImage(imageFileName + "grayScale_00.png");
    grayScale_01 = loadImage(imageFileName + "grayScale_01.png");
    grayScale_02 = loadImage(imageFileName + "grayScale_02.png");
    grayScale_03 = loadImage(imageFileName + "grayScale_03.png");
    grayScale_10 = loadImage(imageFileName + "grayScale_10.png");
    grayScale_11 = loadImage(imageFileName + "grayScale_11.png");
    grayScale_12 = loadImage(imageFileName + "grayScale_12.png");
    grayScale_13 = loadImage(imageFileName + "grayScale_13.png");
    grayScale_20 = loadImage(imageFileName + "grayScale_20.png");
    grayScale_21 = loadImage(imageFileName + "grayScale_21.png");
    grayScale_22 = loadImage(imageFileName + "grayScale_22.png");
}

function positionButtons() {
    // Conversation button positions
    yPosWalkway = height / 2.5;
    yPosBluegrass = height / 1.56;
    yPosRotunda = height / 1.075;
    xPosButtonBluegrass = width / 6.2;
    xPosButtonGayle = width / 2.475;
    xPosButtonBusiness = width / 1.58;
    xPosButtonMom = width / 1.19;

    // Timeline scaling
    timelineStartWalkway = width / 2.45;
    timelineStartBluegrass = width / 2.83;
    timelineStartRotunda = width / 1.81;
}

// Bridge: called by Svelte when welcome overlay is dismissed
window._igsWelcomeDismiss = function() {
    welcome = false;
    if (intro) {
        individualDisplay(0);
        individualDisplay(4);
        intro = false;
    }
};

// Bridge: expose p5 functions for Svelte store to call
window._igsIndividualDisplay = function(i) {
    individualDisplay(i);
};
window._igsSpaceSelect = function(space) {
    spaceSelect(space);
};
window._igsFamilyHighlight = function(start, end) {
    familyHighlight(start, end);
};
window._igsZoomSelect = function(index) {
    zoomSelect(index);
};
window._igsResetTransition = function() {
    resetTransition();
};
window._igsResetReveal = function() {
    reveal = 0;
};
