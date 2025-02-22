#!/bin/bash

# path to your llm
LLM_MODEL=llama.cpp/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf 
LLM_CONTEXT=8192 # if you use Llama 3.1 and don't specify this it'll OOM

# check if ollama is running by accessing http://127.0.0.1:11434
if ! curl -s http://127.0.0.1:11434 > /dev/null; then
    echo "Error: ollama is not running. Please start ollama and try again."
    exit 1
fi

# Create a new screen session named 'voicechat2'
# screen -dmS voicechat2

# FastAPI server (with Mamba activation)
screen -dmS voicechat2 ./bin/micromamba run -n vc uvicorn voicechat2:app --host localhost --port 8000 --reload

# SRT server (HF transformers w/ distil-whisper)
screen -dmS sst ./bin/micromamba run -n vc uvicorn srt-server:app --host 0.0.0.0 --port 8001 --reload

# TTS server (with Mamba activation)
screen -dmS tts ./bin/micromamba run -n vc uvicorn tts-server:app --host 0.0.0.0 --port 8003

# Attach to the session
echo "Voice chat system is now running in screen session 'voicechat2'."
echo "To attach to the session, use: screen -r voicechat2"

# echo "Voice chat system is now running in tmux session 'voicechat2'."
# echo "To attach to the session, use: tmux attach -t voicechat2"
# echo "To detach from the session, use: Ctrl-b d"
