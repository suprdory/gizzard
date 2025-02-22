// List of common words to exclude
const stopWords = [
    "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he",
    "was", "for", "on", "are", "as", "with", "his", "they", "at", "be",
    "this", "have", "from", "or", "one", "had", "by", "word", "but", "not",
    "what", "all", "were", "we", "when", "your", "can", "said", "there", "use",
    "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "about"
];

// Function to filter and clean text
function cleanText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, "") // Remove punctuation
        .split(/\s+/) // Split into words
        .filter(word => word.length > 2 && !stopWords.includes(word)); // Exclude short and stop words
}

// Function to seed random based on the date
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Function to get three unique "Words of the Day" based on the current date
function getWordsOfTheDay(words) {
    const dateSeed = new Date().toISOString().split("T")[0]; // Get the current date (YYYY-MM-DD)
    const seed = dateSeed.split("-").join(""); // Combine the date digits into a seed
    const uniqueWords = new Set();

    let n = 0;
    while (uniqueWords.size < 3) {
        const randomIndex = Math.floor(seededRandom(parseInt(seed) + n*111111) * words.length);
        uniqueWords.add(capitalizeFirstLetter(words[randomIndex]));
        n = n + 1;
    }
    document.title = [...uniqueWords][0]
    return Array.from(uniqueWords).join(", ");

}

// Function to generate a random phrase with punctuation and capitalization
function generateRandomPhraseWithFormatting(originalText) {
    const sentences = originalText.match(/[^.!?]+[.!?]/g) || []; // Split text into sentences
    const words = originalText.match(/\S+/g) || []; // Match all words (with punctuation)

    if (words.length === 0) return "No phrase available.";

    const phraseLength = Math.floor(Math.random() * 26) + 5; // Random length between 5 and 20
    const startIndex = Math.floor(Math.random() * (words.length - phraseLength));
    const phraseWords = words.slice(startIndex, startIndex + phraseLength);

    // Ensure the phrase starts with a capital and ends with a full stop
    const phrase = phraseWords.join(" ")
        .replace(/^\s*([A-Za-z])/, (match, p1) => p1.toUpperCase()) // Capitalize the first letter
        .replace(/[^a-zA-Z0-9\s]+$/, "") // Remove any trailing punctuation
        + "."; // Add a final full stop

    return phrase;
}

// Function to reveal full text
function revealText() {
    if (document.getElementById("full-text").style.display == "block") {
        document.getElementById("full-text").style.display = "none";
        document.getElementById("reveal-button").innerText = "View the source"
    }
    else {
        document.getElementById("full-text").style.display = "block";
        document.getElementById("reveal-button").innerText = "Hide the source"
    }
    // document.getElementById("full-text").style.display = "block";
    // document.getElementById("reveal-button").style.display = "none";
}

// Function to generate a phrase on button click
function generatePhrase() {
    const phrase = generateRandomPhraseWithFormatting(originalText);
    document.getElementById("random-phrase").textContent = phrase;
}

let cleanedWords = []; // Store cleaned words globally
let originalText = ""; // Store the original text globally

// // Load the contents of text.txt
fetch("text.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then(data => {
        originalText = data; // Store original text for phrase generation
        cleanedWords = cleanText(data);

        // Full Text
        document.getElementById("text-content").textContent = data;
        generatePhrase();

        //         // Words of the Day
        document.getElementById("daily-words").textContent = getWordsOfTheDay(cleanedWords);
        //     })

    })


    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });