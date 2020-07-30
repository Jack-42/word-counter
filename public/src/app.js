function start() {
    fetch("assets/all_star_lyrics.txt")
        .then(response => response.text())
        .then(text => run(text));
}

function run(text) {
    console.log(text);
}
