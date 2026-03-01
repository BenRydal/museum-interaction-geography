/*
 * Copyright (C) 2018 Ben Rydal Shapiro. All rights reserved.
 * Originally developed at Vanderbilt University.
 * https://etd.library.vanderbilt.edu/available/etd-03212018-140140/unrestricted/Shapiro_Dissertation.pdf
 */

var imageFileName;
var individualLength = 15;

// Per-individual data arrays
var mapConversation = [];
var mapMovement = [],
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

var font_PlayfairReg;

// Interface variables
var locked = false,
    zoomView = true,
    welcome = true,
    intro = true;

// Animation variables
var reveal = 0,
    fillColor = 255,
    animate = true;

// Current space and family selection
var displaySpace = 1,
    displayFamily = 0;

// Timeline animation variables
var timelineStartWalkway, timelineStartBluegrass, timelineStartRotunda;

// Individuals with no curation data
var noCurationIndividuals = [2, 3, 4, 12];
// Individuals with no rotunda data
var noRotundaIndividuals = [3, 11, 12, 13, 14];

function Conversation(convo, box, boxZoom, audio) {
    this.conversationText = convo;
    this.conversationBox = box;
    this.conversationBoxZoom = boxZoom;
    this.conversationAudio = audio;
}

function movementPath(movement, show) {
    this.movement = movement;
    this.show = show;
}

function movementZoom(walkway, bluegrass, rotunda, selectWalkway, selectBluegrass, selectRotunda) {
    this.movementWalkway = walkway;
    this.movementBluegrass = bluegrass;
    this.movementRotunda = rotunda;
    this.selectWalkway = selectWalkway;
    this.selectBluegrass = selectBluegrass;
    this.selectRotunda = selectRotunda;
}

function preload() {
    loadBlankDataArrays();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    imageFileName = windowWidth > 900 ? "images/" : "small-images/";
    loadBaseImages();
    frameRate(30);
    positionButtons();
    font_PlayfairReg = loadFont("data/PlayfairDisplay-Regular.ttf");
    textFont(font_PlayfairReg, 18);
}

function draw() {
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
    locked = false;
    noStroke();
    if (zoomView) {
        new DrawZoom().draw();
    } else {
        new DrawSmallMultiple().draw();
    }
    setUpAnimation();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    positionButtons();
}

function loadBlankDataArrays() {
    var blankPath = new movementPath(-1, false);
    for (var i = 0; i < 15; i++) {
        mapMovement.push(blankPath);
        mapTalk.push(-1);
        mapCuration.push(-1);
        mapZoomMovement.push(-1);
        mapZoomTalk.push(-1);
        mapZoomCuration.push(-1);
    }
    for (var i = 0; i < 106; i++) {
        mapConversation.push(-1);
    }
}

function img(name) {
    return loadImage(imageFileName + name);
}

function loadDataSmallMultiple(i) {
    mapMovement[i] = new movementPath(img(i + "_movement.png"), true);
    mapTalk[i] = img(i + "_talk.png");

    if (noCurationIndividuals.indexOf(i) !== -1) {
        mapCuration[i] = 1;
    } else {
        mapCuration[i] = img(i + "_curation.png");
    }
}

function loadZoomCuration(i) {
    // Per-individual curation availability by space:
    //   walkway: not 0, 1, 5, 8, 14
    //   bluegrass: not 1, 7
    //   rotunda: not 6, 8, 11, 13, 14
    var curationMap = {
        0:  [1,    'bg', 'rot'],
        1:  [1,    1,    'rot'],
        5:  [1,    'bg', 'rot'],
        6:  ['wk', 'bg', 1],
        7:  ['wk', 1,    'rot'],
        8:  [1,    'bg', 1],
        9:  ['wk', 'bg', 'rot'],
        10: ['wk', 'bg', 'rot'],
        11: ['wk', 'bg', 1],
        13: ['wk', 'bg', 1],
        14: [1,    'bg', 1]
    };

    var spaceNames = { wk: 'walkway', bg: 'bluegrass', rot: 'rotunda' };
    var entry = curationMap[i];
    if (!entry) return;

    var spaces = entry.map(function(s) {
        return s === 1 ? 1 : img(i + "_" + spaceNames[s] + "Curation.png");
    });
    mapZoomCuration[i] = new movementZoom(spaces[0], spaces[1], spaces[2]);
}

function loadDataZoom(i) {
    var hasRotunda = noRotundaIndividuals.indexOf(i) === -1;
    var rotundaMovement = hasRotunda ? img(i + "_rotunda.png") : 1;
    var rotundaTalk = hasRotunda ? img(i + "_rotundaTalk.png") : 1;

    mapZoomMovement[i] = new movementZoom(
        img(i + "_walkway.png"), img(i + "_bluegrass.png"), rotundaMovement,
        false, false, false
    );
    mapZoomTalk[i] = new movementZoom(
        img(i + "_walkwayTalk.png"), img(i + "_bluegrassTalk.png"), rotundaTalk
    );

    if (noCurationIndividuals.indexOf(i) !== -1) {
        mapZoomCuration[i] = 1;
    } else {
        loadZoomCuration(i);
    }
}

function loadDataConversation(i) {
    mapConversation[i] = new Conversation(
        loadStrings(imageFileName + i + "_conversation.txt"),
        img(i + "_conversationBox.png"),
        img(i + "_conversationBoxZoom.png"),
        loadSound("audio/" + i + "_conversationAudio.mp3")
    );
}

function loadBaseImages() {
    baseGrid_2 = img("baseGrid_2.png");
    baseGrid_3 = img("baseGrid_3.png");
    grid_Bluegrass = img("grid_Bluegrass.png");
    grid_Walkway = img("grid_Walkway.png");
    grid_Rotunda = img("grid_Rotunda.png");

    plan_Walkway = img("plan_Walkway.png");
    plan_Bluegrass = img("plan_Bluegrass.png");
    plan_Rotunda = img("plan_Rotunda.png");
    grayScale = img("grayScale.png");
    allConversationBoxes = img("allConversationBoxes.png");

    conversationBoxes_00 = img("conversationBoxes_00.png");
    conversationBoxes_01 = img("conversationBoxes_01.png");
    conversationBoxes_02 = img("conversationBoxes_02.png");
    conversationBoxes_03 = img("conversationBoxes_03.png");
    conversationBoxes_10 = img("conversationBoxes_10.png");
    conversationBoxes_11 = img("conversationBoxes_11.png");
    conversationBoxes_12 = img("conversationBoxes_12.png");
    conversationBoxes_13 = img("conversationBoxes_13.png");
    conversationBoxes_20 = img("conversationBoxes_20.png");
    conversationBoxes_21 = img("conversationBoxes_21.png");
    conversationBoxes_22 = img("conversationBoxes_22.png");

    grayScale_00 = img("grayScale_00.png");
    grayScale_01 = img("grayScale_01.png");
    grayScale_02 = img("grayScale_02.png");
    grayScale_03 = img("grayScale_03.png");
    grayScale_10 = img("grayScale_10.png");
    grayScale_11 = img("grayScale_11.png");
    grayScale_12 = img("grayScale_12.png");
    grayScale_13 = img("grayScale_13.png");
    grayScale_20 = img("grayScale_20.png");
    grayScale_21 = img("grayScale_21.png");
    grayScale_22 = img("grayScale_22.png");
}

function positionButtons() {
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
window._igsIndividualDisplay = function(i) { individualDisplay(i); };
window._igsSpaceSelect = function(space) { spaceSelect(space); };
window._igsFamilyHighlight = function(start, end) { familyHighlight(start, end); };
window._igsZoomSelect = function(index) { zoomSelect(index); };
window._igsResetTransition = function() { resetTransition(); };
window._igsResetReveal = function() { reveal = 0; };
window._igsEnsureZoomData = function() {
    for (var i = 0; i < individualLength; i++) {
        if (mapMovement[i].show && mapZoomMovement[i] === -1) {
            loadDataZoom(i);
        }
    }
    spaceSelect(displaySpace);
};
