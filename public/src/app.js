function start() {
    fetch("assets/all_star_lyrics.txt")
        .then(response => response.text())
        .then(text => run(text));
}

function run(text) {
    // split text into words
    // use regex: \s => split on any whitespace (including tab, newline), + => one or more
    const words = text.split(/\s+/);

    let wordCounts = {};
    // need to store keys separately to be able to sort them, cannot sort a dictionary directly
    let wordKeys = [];

    // count the words
    for (let word of words) {
        // convert to lowercase, uppercase and lowercase should be treated as the same word
        word = word.toLowerCase();
        if (word in wordCounts) {
            // word already exists, so increase count
            wordCounts[word]++;
        } else {
            // new word, so init count to 1
            wordCounts[word] = 1;
            wordKeys.push(word);
        }
    }

    // sort words by count descending
    wordKeys.sort((a, b) => {
        // trick: positive number means wrong order, elements will be swapped
        return wordCounts[b] - wordCounts[a];
    });

    for (const wordKey of wordKeys) {
        console.log(wordKey + " : " + wordCounts[wordKey]);
    }
}
