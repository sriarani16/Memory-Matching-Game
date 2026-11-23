// Matching Game JavaScript
// Shuffle algorithm: Fisher–Yates (source: https://bost.ocks.org/mike/shuffle/)
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

$(document).ready(function () {
    const backImage = "back.png"; 
    const images = [
        "butterfly.png", "chicken.png", "crab.png", "dog.png",
        "dolphin.png", "dove.png", "elephant.png", "horse.png"
    ];

    var cardImages = images.concat(images); // duplicate for pairs
    shuffle(cardImages);

    const board = $("#game-board");
    cardImages.forEach((img, index) => {
        const card = $(`
            <div class="card" data-index="${index}" data-image="${img}">
                <img src="${backImage}" alt="back">
            </div>
        `);
        board.append(card);
    });

    var flippedCards = [];
    var lockBoard = false;

    $(".card").click(function () {
        if (lockBoard) return;
        if ($(this).hasClass("flipped")) return;
        if (flippedCards.length === 2) return; // stop if 2 are already face-up

        // flip card
        const imgSrc = "images/" + $(this).data("image");
        $(this).find("img").attr("src", imgSrc);
        $(this).addClass("flipped");
        flippedCards.push($(this));

        if (flippedCards.length === 2) {
            $("#continue-btn").prop("disabled", false); // enable button
        }
    });

    $("#continue-btn").click(function () {
        if (flippedCards.length !== 2) return; // only works when 2 are face-up

        const img1 = flippedCards[0].data("image");
        const img2 = flippedCards[1].data("image");

        if (img1 === img2) {
            // match → remove from board
            flippedCards.forEach(card => card.addClass("removed").off("click"));
            checkWin();
        } else {
            // not match → flip back after click
            flippedCards.forEach(card => {
                card.find("img").attr("src", backImage);
                card.removeClass("flipped");
            });
        }

        flippedCards = [];
        $("#continue-btn").prop("disabled", true);
    });
    function checkWin() {
    // count how many cards have the 'removed' class
    const removedCount = $(".card.removed").length;
    if (removedCount === cardImages.length) { // all cards removed
        $("#win-message").show();
        $("#continue-btn").prop("disabled", true);
    }
}
});
