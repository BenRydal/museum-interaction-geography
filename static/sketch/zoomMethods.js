function DrawZoom() {

    var grids = [
        [grid_Walkway, plan_Walkway],
        [grid_Bluegrass, plan_Bluegrass],
        [grid_Rotunda, plan_Rotunda]
    ];

    var grayScales = [
        [grayScale_00, grayScale_01, grayScale_02, grayScale_03],
        [grayScale_10, grayScale_11, grayScale_12, grayScale_13],
        [grayScale_20, grayScale_21, grayScale_22]
    ];

    var conversationBoxes = [
        [conversationBoxes_00, conversationBoxes_01, conversationBoxes_02, conversationBoxes_03],
        [conversationBoxes_10, conversationBoxes_11, conversationBoxes_12, conversationBoxes_13],
        [conversationBoxes_20, conversationBoxes_21, conversationBoxes_22]
    ];

    // Per-individual: which spaces have curation data (used in drawCurationZoom)
    // walkway: not 0, 1, 5, 8, 14;  bluegrass: not 1, 7;  rotunda: not 6, 8, 11, 13, 14
    var noWalkwayCuration = [0, 1, 5, 8, 14];
    var noBluegrassCuration = [1, 7];
    var noRotundaCuration = [6, 8, 11, 13, 14];

    this.draw = function () {
        noFill();
        stroke(125);
        strokeWeight(1);

        // Draw base image for selected space
        var pair = grids[displaySpace];
        if (pair) image(talk ? pair[1] : pair[0], 0, 0, width, height);

        if (movement) drawMovementZoom();
        else if (talk) {
            drawTalkZoom();
            readConversationBridge();
            if (!locked) drawConversationZoom();
        } else if (curation) drawCurationZoom();
    }

    function readConversationBridge() {
        var hover = window._igsConversationHover;
        if (hover && hover.active) {
            var i = hover.index;
            if (mapConversation[i] && mapConversation[i] !== -1) {
                locked = true;
                image(mapConversation[i].conversationBoxZoom, 0, 0, width, height);
            }
        }
    }

    function hasRotunda(i) {
        return noRotundaIndividuals.indexOf(i) === -1;
    }

    function getSelectedSpaceImage(zoomData, i) {
        if (mapZoomMovement[i].selectWalkway) return zoomData.movementWalkway;
        if (mapZoomMovement[i].selectBluegrass) return zoomData.movementBluegrass;
        if (mapZoomMovement[i].selectRotunda && hasRotunda(i)) return zoomData.movementRotunda;
        return null;
    }

    function drawMovementZoom() {
        for (var i = 0; i < individualLength; i++) {
            if (!mapMovement[i].show || mapZoomMovement[i] === -1) continue;
            var img = getSelectedSpaceImage(mapZoomMovement[i], i);
            if (img) image(img, 0, 0, width, height);
        }
    }

    function drawTalkZoom() {
        var row = grayScales[displaySpace];
        if (row && row[displayFamily]) image(row[displayFamily], 0, 0, width, height);

        for (var i = 0; i < individualLength; i++) {
            if (!mapMovement[i].show || mapZoomMovement[i] === -1 || mapZoomTalk[i] === -1) continue;
            var img = getSelectedSpaceImage(mapZoomTalk[i], i);
            if (img) image(img, 0, 0, width, height);
        }
    }

    function drawConversationZoom() {
        var row = conversationBoxes[displaySpace];
        if (row && row[displayFamily]) image(row[displayFamily], 0, 0, width, height);
    }

    function drawCurationZoom() {
        for (var i = 0; i < individualLength; i++) {
            if (noCurationIndividuals.indexOf(i) !== -1) continue;
            if (!mapMovement[i].show || mapZoomMovement[i] === -1 || mapZoomCuration[i] === -1 || mapZoomCuration[i] === 1) continue;

            if (mapZoomMovement[i].selectWalkway && noWalkwayCuration.indexOf(i) === -1) {
                image(mapZoomCuration[i].movementWalkway, 0, 0, width, height);
            } else if (mapZoomMovement[i].selectBluegrass && noBluegrassCuration.indexOf(i) === -1) {
                image(mapZoomCuration[i].movementBluegrass, 0, 0, width, height);
            } else if (mapZoomMovement[i].selectRotunda && noRotundaCuration.indexOf(i) === -1) {
                image(mapZoomCuration[i].movementRotunda, 0, 0, width, height);
            }
        }
    }
}
