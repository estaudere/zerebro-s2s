#!/bin/bash

# path to your llm
LLM_MODEL=llama.cpp/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf 
LLM_CONTEXT=8192 # if you use Llama 3.1 and don't specify this it'll OOM

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux is not installed. Please install it and try again."
    exit 1
fi

# Function to create a new window and run a command
create_window() {
    local window_name=$1
    local command=$2
    tmux new-window -n "$window_name"
    tmux send-keys -t "voicechat2:$window_name" "$command" C-m
}

# Create a new tmux session named 'voicechat2' or attach to it if it already exists
tmux new-session -d -s voicechat2

# FastAPI server (with Mamba activation)
create_window "voicechat2" "./bin/micromamba run -n vc uvicorn voicechat2:app --host localhost --port 8000 --reload"

# SRT server (HF transformers w/ distil-whisper)
create_window "srt" "./bin/micromamba run -n vc uvicorn srt-server:app --host 0.0.0.0 --port 8001 --reload"

# # LLM server (llama.cpp)
# create_window "llm" "llama.cpp/llama-server --host 127.0.0.1 --port 8002 -m $LLM_MODEL -ngl 99 -c $LLM_CONTEXT"

# TTS server (with Mamba activation)
create_window "tts" "./bin/micromamba run -n vc uvicorn tts-server:app --host 0.0.0.0 --port 8003"

# Attach to the session
tmux attach-session -t voicechat2

echo "Voice chat system is now running in tmux session 'voicechat2'."
echo "To attach to the session, use: tmux attach -t voicechat2"
echo "To detach from the session, use: Ctrl-b d"
