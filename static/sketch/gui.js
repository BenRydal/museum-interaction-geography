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
        if ((i < start || i > end) && mapMovement[i].show) individualDisplay(i);
    }
}

// Shows individuals in range, hides those outside
function familyHighlight(start, end) {
    resetTransition();
    for (var i = 0; i < individualLength; i++) {
        var inRange = i >= start && i <= end;
        if (inRange && !mapMovement[i].show) individualDisplay(i);
        else if (!inRange && mapMovement[i].show) individualDisplay(i);
    }
}

// Sets the active space and updates all individuals' space selection
function spaceSelect(space) {
    displaySpace = space;
    resetTransition();
    for (var i = 0; i < individualLength; i++) {
        if (mapZoomMovement[i] === -1) continue;
        mapZoomMovement[i].selectWalkway = (space == 0);
        mapZoomMovement[i].selectBluegrass = (space == 1);
        mapZoomMovement[i].selectRotunda = (space == 2);
    }
}

// Toggles an individual's visibility, loading data on first display
function individualDisplay(number) {
    if (mapMovement[number].movement !== -1) {
        mapMovement[number].show = !mapMovement[number].show;
    } else {
        loadDataSmallMultiple(number);
        if (zoomView) {
            loadDataZoom(number);
        }
        spaceSelect(displaySpace);
    }
}

function setUpAnimation() {
    if (animate && zoomView && reveal < width) transitionReveal();
    if (fillColor > 0) transition();
}

// Draws fade transition with the correct floor plan image
function transition() {
    noStroke();
    fill(255, fillColor);
    rect(50, 110, width, height);
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
