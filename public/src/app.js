// TODO: extract into class, no global variables!
let wordCounts = {};
// need to store keys separately to be able to sort them, cannot sort a dictionary directly
let wordKeys = [];

let totalWordCount = 0;
let uniqueWordCount = 0;

function onTextFileChanged() {
    const textFileElement = document.getElementById("text-file");
    const files = textFileElement.files;

    if (files.length === 0) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        processText(reader.result);
    }
    // can assume length is 1, multiple files not allowed
    reader.readAsText(files[0]);
}

function processText(text) {
    const processedText = preprocessText(text);

    // split text into words
    // use regex: \s => split on any whitespace (including tab, newline), + => one or more
    const words = processedText.split(/\s+/);

    countWords(words);

    // sort words by count descending
    wordKeys.sort((a, b) => {
        // trick: positive number means wrong order, elements will be swapped
        return wordCounts[b] - wordCounts[a];
    });

    // print general statistics
    const generalStatisticsDiv = document.getElementById("generalStatistics");
    generalStatisticsDiv.innerHTML = createGeneralStatisticsHTML();

    // print words and their counts in a table
    const tableDiv = document.getElementById("wordTable");
    tableDiv.innerHTML = createWordTableHTML();
}

function preprocessText(text) {
    // convert to lowercase, uppercase and lowercase should be treated as the same word
    let processedText = text.toLowerCase();

    // remove special chars. e.g. "it", "it,", "it." should all count as the same word
    // use regex: ^ => negation, \w => word character (letter, digit and underscore), \s => whitespace
    // g => global match, finds all matches rather than only the first one
    // [] defines a character group, all inside of it matches one character
    processedText = processedText.replace(/[^\w\s]/g, "");

    // remove numbers
    // use regex: \d => digit
    processedText = processedText.replace(/\d/g, "");

    return processedText;
}

function countWords(words) {
    wordCounts = {};
    wordKeys = [];

    totalWordCount = words.length;

    for (const word of words) {
        if (word in wordCounts) {
            // word already exists, so increase count
            wordCounts[word]++;
        } else {
            // new word, so init count to 1
            wordCounts[word] = 1;
            wordKeys.push(word);
        }
    }

    uniqueWordCount = wordKeys.length;
}

// create html table containing the words and their counts
function createWordTableHTML() {
    let html = "<table>";

    // header
    html += "<tr><th>ID</th></th><th>Word</th><th>Count</th></tr>";

    // row for each word
    for (let i = 0; i < wordKeys.length; i++) {
        const key = wordKeys[i];
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + key + "</td>";
        html += "<td>" + wordCounts[key] + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    return html;
}

function createGeneralStatisticsHTML() {
    let html = "<ul>";

    html += "<li>Total word count: " + totalWordCount + "</li>";
    html += "<li>Unique word count: " + uniqueWordCount + "</li>";

    html += "</ul>";

    return html;
}
