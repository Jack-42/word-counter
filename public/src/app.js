function start() {
    fetch("assets/all_star_lyrics.txt")
        .then(response => response.text())
        .then(text => run(text));
}

function run(text) {
    console.log(text);

    // split text into words
    // use regex: \s => split on any whitespace (including tab, newline), + => one or more
    const words = text.split(/\s+/);

    let wordCounts = {};
    for (let word of words) {
        word = word.toLowerCase();
        if (word in wordCounts) {
            // word already exists, so increase count
            wordCounts[word]++;
        } else {
            // new word, so init count to 1
            wordCounts[word] = 1;
        }
    }

    console.log(wordCounts);
}
