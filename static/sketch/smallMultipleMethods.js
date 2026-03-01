function DrawSmallMultiple() {

    this.draw = function () {
        noFill();
        stroke(125);
        strokeWeight(1);
        if (movement) drawMovement();
        else if (talk) {
            drawTalk();
            readConversationBridge();
            if (!locked) image(allConversationBoxes, 0, 0, width, height);
        } else if (curation) drawCuration();
    }

    function readConversationBridge() {
        var hover = window._igsConversationHover;
        if (hover && hover.active) {
            var j = hover.index;
            if (mapConversation[j] && mapConversation[j] !== -1) {
                locked = true;
                image(mapConversation[j].conversationBox, 0, 0, width, height);
            }
        }
    }

    function drawMovement() {
        image(baseGrid_2, 0, 0, width, height);
        image(baseGrid_3, 0, 0, width, height);
        for (var i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {
                image(mapMovement[i].movement, 0, 0, width, height);
            }
        }
    }

    function drawTalk() {
        image(baseGrid_2, 0, 0, width, height);
        image(grayScale, 0, 0, width, height);
        for (var i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {
                image(mapTalk[i], 0, 0, width, height);
            }
        }
    }

    function drawCuration() {
        image(baseGrid_2, 0, 0, width, height);
        image(baseGrid_3, 0, 0, width, height);
        for (var i = 0; i < individualLength; i++) {
            if (noCurationIndividuals.indexOf(i) !== -1) continue;
            if (mapMovement[i].show) {
                image(mapCuration[i], 0, 0, width, height);
            }
        }
    }
}
