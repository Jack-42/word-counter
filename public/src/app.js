let wordStatistics = {};
// need to store keys separately to be able to sort them, cannot sort a dictionary directly
let wordKeys = [];

let totalWordCount = 0;
let uniqueWordCount = 0;
let averageWordLength = 0.0;

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
    const words = tokenize(processedText);

    totalWordCount = words.length;
    countWords(words);
    uniqueWordCount = wordKeys.length;
    calculateAverageWordLength();
    sortByFrequency();

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

function tokenize(text) {
    // use regex: \s => split on any whitespace (including tab, newline), + => one or more
    return text.split(/\s+/);
}

function countWords(words) {
    wordStatistics = {};
    wordKeys = [];

    for (const word of words) {
        if (word in wordStatistics) {
            // word already exists
            const currWordStatistics = wordStatistics[word];
            currWordStatistics.frequency++;
            currWordStatistics.updateProbability(totalWordCount);
        } else {
            // new word
            const currWordStatistics = new WordStatistics(1, word.length);
            currWordStatistics.updateProbability(totalWordCount);
            wordStatistics[word] = currWordStatistics;
            wordKeys.push(word);
        }
    }
}

function calculateAverageWordLength() {
    let sum = 0;

    for (const key of wordKeys) {
        sum += wordStatistics[key].length;
    }

    averageWordLength = sum / wordKeys.length;
}

function sortByFrequency() {
    wordKeys.sort((a, b) => {
        // descending order
        // trick: if order is ascending, subtraction results into positive number, so elements will be swapped
        return wordStatistics[b].frequency - wordStatistics[a].frequency;
    });
}

function createGeneralStatisticsHTML() {
    let html = "<ul>";

    html += "<li>Total word count: " + totalWordCount + "</li>";
    html += "<li>Unique word count: " + uniqueWordCount + "</li>";
    html += "<li>Average word length: " + averageWordLength.toFixed(2) + "</li>";

    html += "</ul>";

    return html;
}

// create html table containing the words and their counts
function createWordTableHTML() {
    let html = "<table>";

    // header
    html += "<tr><th>ID</th><th>Word</th><th>Frequency</th><th>Probability</th><th>Length</th></tr>";

    // row for each word
    for (let i = 0; i < wordKeys.length; i++) {
        const key = wordKeys[i];
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + key + "</td>";
        html += "<td>" + wordStatistics[key].frequency + "</td>";
        const probabilityInPercent = wordStatistics[key].probability * 100.0;
        html += "<td>" + probabilityInPercent.toFixed(4) + " %</td>";
        html += "<td>" + wordStatistics[key].length + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    return html;
}
