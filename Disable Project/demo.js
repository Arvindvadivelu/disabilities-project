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

    // Function to type text with a typing effect and speak concurrently
    async function typeText(element, text, speed) {
        const totalDuration = speed * text.length; // Calculate total duration for typing
        const speechRate = 1; // Set to match the typing speed
        const speechDuration = totalDuration / speed; // Duration of speech

        // Speak the text concurrently with typing
        const speechPromise = speak(text, speechRate);

        return new Promise((resolve) => {
            let index = 0;
    
            function type() {
                if (index < text.length) {
                    const char = text[index];
                    element.textContent += char;

                    // Wait for the character to be typed
                    setTimeout(() => {
                        index++;
                        type(); // Continue typing
                    }, speed);
                } else {
                    resolve(); // Resolve when typing is complete
                }
            }
    
            type();

            // Wait for speech to finish
            speechPromise.then(() => resolve());
        });
    }

    // Function to handle the loader and transition to main content
    async function handleLoader() {
        const loader = document.getElementById('loader');
        const loaderMessage = "Seamless Disabled Access Platform!";
        const typingSpeed = 50; // Typing speed in milliseconds
        const fadeDuration = 1000;

        loader.textContent = '';

        // Type the text in the loader and speak concurrently
        await typeText(loader, loaderMessage, typingSpeed);

        // Hide loader after speech ends
        setTimeout(() => {
            loader.classList.add('fade-out'); // Apply fade-out animation
            setTimeout(() => {
                loader.style.display = 'none'; // Remove loader from view
                initializeVoiceAssistant(); // Initialize voice assistant
            }, fadeDuration);
        }, 1000); // Adjust delay before fading out loader
    }

    // Function to initialize voice assistant
    function initializeVoiceAssistant() {
        // Initialize Speech Recognition
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

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
                    // Hide the output div after the last segment
                    setTimeout(() => {
                        outputDiv.textContent = ""; // Clear text   
                        outputDiv.style.opacity = 0; // Ensure it is fully hidden
                        startSpeechRecognition(); // Start speech recognition after the last segment
                    }, 1000); // Additional delay before hiding
                }
            }

            showNextSegment();
        }

        // Display a welcome message when the page loads
        const welcomeMessage = "Welcome to SpeakEase! Empowering digital accessibility for impaired individuals. Our voice-based system enhances data entry for individuals with typing limitations or visual impairments. Explore a seamless, inclusive digital experience with us. You can also navigate through the pages by using voice commands. The available options are Overview, Services, Tutorial, and About Us. For Services, you can say Blind People, Low Typing Abilities, or Deaf People.";
        displayText(welcomeMessage); // Display with typing effect
    }

    // Function to start speech recognition
    function startSpeechRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event) {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Command received:', command);

            if (command.includes('home')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'index.html'; // Update with your home page URL
            } else if (command.includes('overview')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'overview.html';
            } else if (command.includes('services')) {
                stopAll(); // Stop TTS and recognition
                document.querySelector('.dropdown-toggle').click(); // Open the dropdown
            } else if (command.includes('tutorial')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'tutorial.html';
            } else if (command.includes('about us')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'about.html';
            } else if (command.includes('blind people')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'Blind.html';
            } else if (command.includes('low typing abilities')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'lowtype.html'; // Update URL if different
            } else if (command.includes('deaf people')) {
                stopAll(); // Stop TTS and recognition
                window.location.href = 'Deaf.html'; // Update URL if different
            } else {
                speak("Sorry, I didn't understand that command.Please try again. ")
                    .then(() => {
                        // Restart speech recognition after the error message is spoken
                        startSpeechRecognition();
                    });
            }
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
            speak("There was an error with the speech recognition. Please try again.")
                .then(() => {
                    // Restart speech recognition after the error message is spoken
                    startSpeechRecognition();
                });
        };

        // Start speech recognition
        recognition.start();

        // Function to stop all ongoing TTS and recognition
        function stopAll() {
            if (synth.speaking) {
                synth.cancel(); // Stop ongoing speech
            }
            recognition.stop(); // Stop ongoing recognition
        }

        // Stop all ongoing speech synthesis and recognition when navigating away from the page
        window.onbeforeunload = function () {
            stopAll(); // Ensure TTS and recognition are stopped
        };
    }

    handleLoader(); // Start loader handling
};
