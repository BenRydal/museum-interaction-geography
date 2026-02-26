function DrawSmallMultiple() {

    this.draw = function () {
        noFill(); // reset fill & strokes
        stroke(125);
        strokeWeight(1);
if (movement) drawMovement();
        else if (talk) {
            drawTalk();
            readConversationBridge();
            if (!locked) image(allConversationBoxes, 0, 0, width, height);
        } else if (curation) drawCuration();
    }

    // Read Svelte conversation hover bridge and draw conversationBox image if active
    function readConversationBridge() {
        var hover = window._igsConversationHover;
        if (hover && hover.active) {
            var j = hover.index;
            if (mapConversation[j] !== -1 && mapConversation[j] !== undefined && mapConversation[j] !== null) {
                locked = true;
                image(mapConversation[j].conversationBox, 0, 0, width, height);
            }
        }
    }

    // draws movement paths with underlaying base images and filled ellipse for movement button
    function drawMovement() {
        var i;
        image(baseGrid_2, 0, 0, width, height);
        image(baseGrid_3, 0, 0, width, height);
        for (i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {
                image(mapMovement[i].movement, 0, 0, width, height);
            }
        }
    }

    function drawTalk() {
        var i;
        image(baseGrid_2, 0, 0, width, height);
        image(grayScale, 0, 0, width, height);
        for (i = 0; i < individualLength; i++) {
            if (mapMovement[i].show) {                image(mapTalk[i], 0, 0, width, height);
            }
        }
    }

    function drawCuration() {
        var i;
        image(baseGrid_2, 0, 0, width, height);
        image(baseGrid_3, 0, 0, width, height);
        for (i = 0; i < individualLength; i++) {
            if (i == 2 || i == 3 || i == 4 || i == 12) {
                continue;
            } else if (mapMovement[i].show) {                image(mapCuration[i], 0, 0, width, height);
            }
        }
    }
}
