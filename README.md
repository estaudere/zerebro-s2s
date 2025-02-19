# Zerebro Local Voice Chat

## Setup (Mac instructions)

1. Install [ollama](https://ollama.com/) (it is an app) and run `ollama pull llama3.2:3b` in the terminal to download the LLM. Ensure that ollama is running (you can check this by seeing if the app icon is visible in the Mac menu bar).
2. Clone this repository: In your terminal, run `git clone https://github.com/estaudere/zerebro-s2s.git`. Then *navigate* into the respository that was just copied onto your computer by running `cd zerebro-s2s`.
3. Install the rest of the dependencies with `./install.sh`.
4. Run `./run-voicechat2.sh` to start the required servers. This will run each of the three servers in different tmux sessions.
5. Access the voice chat at `http://localhost:8000`

NOTE: If you want to reinstall the code after changes have been made, you will need to delete the folder `zerebro-s2s` (which you can probably find at ~/) and follow the instructions above again.

## Interaction

1. Press and hold the space bar or the right circle in the top right of the UI to talk (let go to stop).
2. The AI will respond in the chat box.
3. TO enable auto voice detection, click on the left circle in the top right of the UI. (Warning: this is experimental and may not work as expected.)
4. To refresh chat history, refresh the page. (TODO: fix this, add chat timeout and reset button)