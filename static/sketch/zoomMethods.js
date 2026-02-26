function DrawZoom() {

    // draws base images (grid or plan) for zoom then sends to drawMovementZoom, drawTalkZoom or drawCurationZoom()
    this.draw = function () {
        noFill();
        stroke(125);
        strokeWeight(1);

        // Draw base image for selected space
        if (displaySpace == 0) {
            if (talk) image(plan_Walkway, 0, 0, width, height);
            else image(grid_Walkway, 0, 0, width, height);
        } else if (displaySpace == 1) {
            if (talk) image(plan_Bluegrass, 0, 0, width, height);
            else image(grid_Bluegrass, 0, 0, width, height);
        } else if (displaySpace == 2) {
            if (talk) image(plan_Rotunda, 0, 0, width, height);
            else image(grid_Rotunda, 0, 0, width, height);
        }

        if (movement) drawMovementZoom();
        else if (talk) {
            drawTalkZoom();
            readConversationBridge(); // Svelte controls hover; p5 draws box images
            if (!locked) drawConversationZoom();
        } else if (curation) drawCurationZoom();
    }

    // Read Svelte conversation hover bridge and draw conversationBoxZoom image if active
    function readConversationBridge() {
        var hover = window._igsConversationHover;
        if (hover && hover.active) {
            var i = hover.index;
            if (mapConversation[i] !== -1 && mapConversation[i] !== undefined && mapConversation[i] !== null) {
                locked = true;
                image(mapConversation[i].conversationBoxZoom, 0, 0, width, height);
            }
        }
    }

    // draw zoom Movement paths
    function drawMovementZoom() {
        var i;
        for (i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {                if (mapZoomMovement[i].selectWalkway) {
                    image(mapZoomMovement[i].movementWalkway, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectBluegrass) {
                    image(mapZoomMovement[i].movementBluegrass, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectRotunda == true && i !== 3 && i < 11) {
                    image(mapZoomMovement[i].movementRotunda, 0, 0, width, height);
                }
            }
        }
    }

    // draws talkBlocks
    function drawTalkZoom() {
        var i;
        if (displaySpace == 0) {
            if (displayFamily == 0) image(grayScale_00, 0, 0, width, height);
            else if (displayFamily == 1) image(grayScale_01, 0, 0, width, height);
            else if (displayFamily == 2) image(grayScale_02, 0, 0, width, height);
            else if (displayFamily == 3) image(grayScale_03, 0, 0, width, height);
        } else if (displaySpace == 1) {
            if (displayFamily == 0) image(grayScale_10, 0, 0, width, height);
            else if (displayFamily == 1) image(grayScale_11, 0, 0, width, height);
            else if (displayFamily == 2) image(grayScale_12, 0, 0, width, height);
            else if (displayFamily == 3) image(grayScale_13, 0, 0, width, height);
        } else if (displaySpace == 2) {
            if (displayFamily == 0) image(grayScale_20, 0, 0, width, height);
            else if (displayFamily == 1) image(grayScale_21, 0, 0, width, height);
            else if (displayFamily == 2) image(grayScale_22, 0, 0, width, height);
        }
        for (i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {                if (mapZoomMovement[i].selectWalkway) {
                    image(mapZoomTalk[i].movementWalkway, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectBluegrass) {
                    image(mapZoomTalk[i].movementBluegrass, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectRotunda == true && i !== 3 && i < 11) {
                    image(mapZoomTalk[i].movementRotunda, 0, 0, width, height);
                }
            }
        }
    }

    // draws conversation boxes for selected space and family in zoom mode. Uses displaySpace and displayFamily variables
    function drawConversationZoom() {
        if (displaySpace == 0) {
            if (displayFamily == 0) image(conversationBoxes_00, 0, 0, width, height);
            else if (displayFamily == 1) image(conversationBoxes_01, 0, 0, width, height);
            else if (displayFamily == 2) image(conversationBoxes_02, 0, 0, width, height);
            else if (displayFamily == 3) image(conversationBoxes_03, 0, 0, width, height);
        } else if (displaySpace == 1) {
            if (displayFamily == 0) image(conversationBoxes_10, 0, 0, width, height);
            else if (displayFamily == 1) image(conversationBoxes_11, 0, 0, width, height);
            else if (displayFamily == 2) image(conversationBoxes_12, 0, 0, width, height);
            else if (displayFamily == 3) image(conversationBoxes_13, 0, 0, width, height);
        } else if (displaySpace == 2) {
            if (displayFamily == 0) image(conversationBoxes_20, 0, 0, width, height);
            else if (displayFamily == 1) image(conversationBoxes_21, 0, 0, width, height);
            else if (displayFamily == 2) image(conversationBoxes_22, 0, 0, width, height);
        }
    }

    // draws curation paths
    function drawCurationZoom() {
        var i;
        for (i = 0; i < individualLength; i++) {
            if (i == 2 || i == 3 || i == 4 || i == 12) {
                continue;
            } else if (mapMovement[i].show) {                // !i indicates spaces where there is no curation
                if (mapZoomMovement[i].selectWalkway == true) {
                    if (i !== 0 && i !== 1 && i !== 8 && i !== 14 && i !== 5) image(mapZoomCuration[i].movementWalkway, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectBluegrass == true) {
                    if (i !== 1 && i !== 7) image(mapZoomCuration[i].movementBluegrass, 0, 0, width, height);
                } else if (mapZoomMovement[i].selectRotunda == true) {
                    if (i !== 8 && i !== 14 && i !== 6 && i !== 11 && i !== 13) image(mapZoomCuration[i].movementRotunda, 0, 0, width, height);
                }
            }
        }
    }
}
