window.onload = function () {
    console.log("Page loaded");

    // Initialize SpeechSynthesis
    const synth = window.speechSynthesis;

    // Function to speak text
    function speak(text, rate = 1) {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = rate; // Set speech rate
            utterance.onend = resolve; // Resolve promise when speech ends
            synth.speak(utterance);
        });
    }

    // Function to spell out text letter by letter with increased speed and less delay
    async function spellOut(text) {
        const letters = text.split('');
        for (const letter of letters) {
            if (letter.trim().length > 0) {
                await speak(letter, 2); // Increased rate for faster spelling
            }
            await new Promise(resolve => setTimeout(resolve, 5)); // Shorter delay between letters
        }
    }

    async function startEmailContentRecognition() {
        const outputDiv = document.getElementById("voice-output");

        // Prompt user to provide email content
        await speak("Please say the content of the email to send.");

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = async function (event) {
            const content = event.results[0][0].transcript;
            console.log('Email content received:', content);

            // Spell out the email content
            await speak("You said the content of the email is: ");
            await spellOut(content); // Spell out the content
            await speak(". Is that correct? Say yes or no.");

            recognition.onresult = async function (event) {
                const confirmation = event.results[0][0].transcript.toLowerCase();
                if (confirmation.includes('yes')) {
                    await speak("Thank you. The email content has been noted.");
                    // Process the email content or perform further actions
                } else if (confirmation.includes('no')) {
                    await speak("Please say the content of the email again.");
                    startEmailContentRecognition(); // Restart email content recognition
                } else {
                    await speak("Sorry, I didn't understand that. Please say yes or no.");
                    startEmailContentRecognition(); // Restart email content recognition
                }
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error', event.error);
                speak("There was an error with the speech recognition. Please try again.")
                    .then(() => {
                        // Restart speech recognition after the error message is spoken
                        startEmailContentRecognition();
                    });
            };

            // Start speech recognition to capture the email content
            recognition.start();
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
            speak("There was an error with the speech recognition. Please try again.")
                .then(() => {
                    // Restart speech recognition after the error message is spoken
                    startEmailContentRecognition();
                });
        };

        // Start speech recognition to capture the email content
        recognition.start();
    }

    async function startSenderEmailRecognition() {
        const outputDiv = document.getElementById("voice-output");

        // Prompt user to provide sender's email
        await speak("Please say the sender's email address.");

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = async function (event) {
            const email = event.results[0][0].transcript.toLowerCase();
            console.log('Sender email received:', email);

            // Spell out the sender's email address
            await speak("You said the sender's email address is: ");
            await spellOut(email); // Spell out the email address
            await speak(". Is that correct? Say yes or no.");

            recognition.onresult = async function (event) {
                const confirmation = event.results[0][0].transcript.toLowerCase();
                if (confirmation.includes('yes')) {
                    await speak("Thank you. The sender's email address has been noted.");
                    startReceiverEmailRecognition(); // Proceed to receiver's email
                } else if (confirmation.includes('no')) {
                    await speak("Please say the sender's email address again.");
                    startSenderEmailRecognition(); // Restart sender email recognition
                } else {
                    await speak("Sorry, I didn't understand that. Please say yes or no.");
                    startSenderEmailRecognition(); // Restart sender email recognition
                }
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error', event.error);
                speak("There was an error with the speech recognition. Please try again.")
                    .then(() => {
                        // Restart speech recognition after the error message is spoken
                        startSenderEmailRecognition();
                    });
            };

            // Start speech recognition for confirmation
            recognition.start();
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
            speak("There was an error with the speech recognition. Please try again.")
                .then(() => {
                    // Restart speech recognition after the error message is spoken
                    startSenderEmailRecognition();
                });
        };

        // Start speech recognition to capture the sender's email address
        recognition.start();
    }

    async function startReceiverEmailRecognition() {
        const outputDiv = document.getElementById("voice-output");

        // Prompt user to provide receiver's email
        await speak("Please say the receiver's email address.");

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = async function (event) {
            const email = event.results[0][0].transcript.toLowerCase();
            console.log('Receiver email received:', email);

            // Spell out the receiver's email address
            await speak("You said the receiver's email address is: ");
            await spellOut(email); // Spell out the email address
            await speak(". Is that correct? Say yes or no.");

            recognition.onresult = async function (event) {
                const confirmation = event.results[0][0].transcript.toLowerCase();
                if (confirmation.includes('yes')) {
                    await speak("Thank you. The receiver's email address has been noted.");
                    startEmailContentRecognition(); // Proceed to requesting email content
                } else if (confirmation.includes('no')) {
                    await speak("Please say the receiver's email address again.");
                    startReceiverEmailRecognition(); // Restart receiver email recognition
                } else {
                    await speak("Sorry, I didn't understand that. Please say yes or no.");
                    startReceiverEmailRecognition(); // Restart receiver email recognition
                }
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error', event.error);
                speak("There was an error with the speech recognition. Please try again.")
                    .then(() => {
                        // Restart speech recognition after the error message is spoken
                        startReceiverEmailRecognition();
                    });
            };

            // Start speech recognition for confirmation
            recognition.start();
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
            speak("There was an error with the speech recognition. Please try again.")
                .then(() => {
                    // Restart speech recognition after the error message is spoken
                    startReceiverEmailRecognition();
                });
        };

        // Start speech recognition to capture the receiver's email address
        recognition.start();
    }

    // Function to initialize voice assistant
    function initializeVoiceAssistant() {
        // Function to display text with typing effect, segment by segment
        async function displayText(text) {
            const outputDiv = document.getElementById("voice-output");
            const segments = text.split('.').map(segment => segment.trim()).filter(segment => segment.length > 0);

            let currentSegment = 0;

            async function showNextSegment() {
                if (currentSegment < segments.length) {
                    const segment = segments[currentSegment] + '.';
                    outputDiv.textContent = ""; // Clear previous text
                    let index = 0;

                    // Start speaking the segment
                    const speechPromise = speak(segment);

                    function typeCharacter() {
                        if (index < segment.length) {
                            outputDiv.textContent += segment[index];
                            index++;
                            setTimeout(typeCharacter, 40); // Speed of typing
                        } else {
                            setTimeout(async () => {
                                outputDiv.style.transition = "opacity 0.3s"; // Shorter fade-out time
                                outputDiv.style.opacity = 0; // Fade out
                                await speechPromise; // Wait for speech to finish
                                setTimeout(() => {
                                    outputDiv.style.opacity = 1; // Reset opacity for next segment
                                    outputDiv.style.transition = ""; // Reset transition
                                    currentSegment++;
                                    showNextSegment(); // Show next segment
                                }, 300); // Fade out duration
                            }, 1000); // Delay before fading out
                        }
                    }

                    typeCharacter();
                } else {
                    setTimeout(() => {
                        outputDiv.textContent = ""; // Clear text   
                        outputDiv.style.opacity = 0; // Ensure it is fully hidden
                        startSenderEmailRecognition();
                    }, 1000);
                }
            }

            showNextSegment();
        }

        // Initialize the voice assistant with instructions or a welcome message
        displayText("Welcome to Blind People Page!. I will guide you through the process of sending an email ! You can make entries using voice recognition. Your camera is automatically enabled to make sure you are present!. First, we need the sender's email address.");
    }

    initializeVoiceAssistant();
    function enableWebcam() {
        const videoElement = document.createElement("video");
        videoElement.id = "webcam";
        videoElement.style.position = "absolute";
        videoElement.style.top = "0";
        videoElement.style.left = "0";
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.zIndex = "9999"; // Ensure it's in front of other elements
        videoElement.autoplay = true;
        videoElement.playsInline = true;

        const uploadCard = document.getElementById("uploadCard");
        if (uploadCard) {
            uploadCard.style.position = "relative"; // Ensure the card is a containing block for absolute positioning
            uploadCard.appendChild(videoElement);
        } else {
            console.error("Unable to find #uploadCard element.");
            speak("Unable to display webcam video. Please try refreshing the page.");
        }

        // Access the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoElement.srcObject = stream;
            })
            .catch((error) => {
                console.error("Error accessing webcam: ", error);
                speak("There was an error accessing the webcam. Please check your camera settings.");
            });
    }

    // Enable webcam when the page loads
    enableWebcam();
};