function mouseMoved() {}
function mousePressed() {}

function resetTransition() {
    fillColor = 255;
    reveal = 0;
}

// Selects family and space when zooming into a visualization
function zoomSelect(select) {
    var space = select < 4 ? 0 : select < 8 ? 1 : 2;
    var familyIndex = select % 4;
    var familyRanges = [[0, 4], [5, 8], [9, 10], [11, 14]];

    spaceSelect(space);
    displayFamily = familyIndex;
    familySelect(familyRanges[familyIndex][0], familyRanges[familyIndex][1]);
}

// Hides individuals outside the selected family range
function familySelect(start, end) {
    for (var i = 0; i < individualLength; i++) {
        if ((i < start || i > end) && mapMovement[i].show == true) individualDisplay(i);
    }
}

// Shows individuals in range, hides those outside
function familyHighlight(start, end) {
    resetTransition();
    for (var i = 0; i < individualLength; i++) {
        if ((i >= start && i <= end) && mapMovement[i].show == false) individualDisplay(i);
        else if ((i < start || i > end) && mapMovement[i].show == true) individualDisplay(i);
    }
}

// Sets the active space and updates all individuals' space selection
function spaceSelect(space) {
    displaySpace = space;
    resetTransition();
    for (var i = 0; i < individualLength; i++) {
        mapZoomMovement[i].selectWalkway = (space == 0);
        mapZoomMovement[i].selectBluegrass = (space == 1);
        mapZoomMovement[i].selectRotunda = (space == 2);
    }
}

// Toggles an individual's visibility, loading data on first display
function individualDisplay(number) {
    if (mapMovement[number].movement !== -1 && mapMovement[number] !== undefined && mapMovement[number] !== null) {
        mapMovement[number].show = !mapMovement[number].show;
    } else {
        loadDataZoom(number);
        loadDataSmallMultiple(number);
        spaceSelect(displaySpace);
    }
}

// Sets conversation button X/Y positions based on space index
function findSpace(space) {
    var spaceMap = {
        0: [xPosButtonBluegrass, yPosWalkway],
        10: [xPosButtonBluegrass, yPosBluegrass],
        30: [xPosButtonBluegrass, yPosRotunda],
        39: [xPosButtonGayle, yPosWalkway],
        58: [xPosButtonGayle, yPosBluegrass],
        67: [xPosButtonGayle, yPosRotunda],
        72: [xPosButtonBusiness, yPosWalkway],
        83: [xPosButtonBusiness, yPosBluegrass],
        85: [xPosButtonBusiness, yPosRotunda],
        86: [xPosButtonMom, yPosWalkway],
        90: [xPosButtonMom, yPosBluegrass]
    };
    var pos = spaceMap[space];
    if (pos) {
        conversationButtonX = pos[0];
        conversationButtonY = pos[1];
    }
}

function setUpAnimation() {
    if (animate && zoomView && reveal < width) transitionReveal();
    if (fillColor > 0) transition();
}

// Draws fade transition with the correct floor plan image
function transition() {
    var xPos = fullScreenTransition ? 0 : 50;
    var yPos = fullScreenTransition ? 0 : 110;
    if (fullScreenTransition) fullScreenTransition = false;

    noStroke();
    fill(255, fillColor);
    rect(xPos, yPos, width, height);
    fillColor -= 25;

    if (zoomView) {
        var grids = [
            [grid_Walkway, plan_Walkway],
            [grid_Bluegrass, plan_Bluegrass],
            [grid_Rotunda, plan_Rotunda]
        ];
        var pair = grids[displaySpace];
        if (pair) image(talk ? pair[1] : pair[0], 0, 0, width, height);
    } else {
        image(baseGrid_2, 0, 0, width, height);
        if (!talk) image(baseGrid_3, 0, 0, width, height);
    }
}

// Draws reveal animation for zoom view timeline
function transitionReveal() {
    var timelineStarts = [timelineStartWalkway, timelineStartBluegrass, timelineStartRotunda];
    var timelineStart = timelineStarts[displaySpace];

    noStroke();
    fill(255);
    rect(timelineStart + reveal, 135, width, height);
    reveal += 4;

    var grids = [
        [grid_Walkway, plan_Walkway],
        [grid_Bluegrass, plan_Bluegrass],
        [grid_Rotunda, plan_Rotunda]
    ];
    var pair = grids[displaySpace];
    if (pair) image(talk ? pair[1] : pair[0], 0, 0, width, height);
}
