class WordStatistics {
    frequency = 0;
    probability = 0.0;
    length = 0;

    constructor(frequency, length) {
        this.frequency = frequency;
        this.length = length;
    }

    updateProbability(totalWordCount) {
        this.probability = this.frequency / totalWordCount;
    }
}
