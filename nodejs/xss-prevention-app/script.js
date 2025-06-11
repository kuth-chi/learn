function processInput() {
    // Get user input
    const input = document.getElementById('userInput').value;

    // Sanitize the input using DOMPurify
    const sanitizedInput = DOMPurify.sanitize(input);

    // Create a temporary element to encode HTML characters
    const tempDiv = document.createElement('div');
    tempDiv.textContent = sanitizedInput;  // Encoding input as plain text

    // Display the sanitized and encoded output
    document.getElementById('output').textContent = tempDiv.textContent;
}