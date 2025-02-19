# Zerebro Local Voice Chat

## Setup (Mac instructions)

1. Install [ollama](https://ollama.com/) and run `ollama pull llama3.2:3b` to download the LLM.
2. Clone this repository and install the rest of the dependencies with 
```
conda create -n zerebro python=3.10
conda activate zerebro
pip install -r requirements.txt
```
3. Run `./run-voicechat2.sh` to start the required servers. This will run each of the three servers in different tmux sessions.
4. Access the voice chat at `http://localhost:8000`
5. Set `DEBUG=False` in [`voicechat2.py`](ui/index2.html#L215) to disable the debug UI (this will remove the latency metrics).

## Interaction

1. Press and hold the space bar or the right circle in the top right of the UI to talk (let go to stop).
2. The AI will respond in the chat box.
3. TO enable auto voice detection, click on the left circle in the top right of the UI. (Warning: this is experimental and may not work as expected.)
4. To refresh chat history, refresh the page. (TODO: fix this, add chat timeout and reset button)