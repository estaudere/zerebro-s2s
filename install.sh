set -e  # Stop on error

# install micromamba
if [ ! -f "bin/micromamba" ]; then
    echo "Installing micromamba..."
    curl -Ls https://micro.mamba.pm/api/micromamba/osx-arm64/latest | tar -xvj bin/micromamba || { echo "Failed to install micromamba"; exit 1; }
fi

# create a new environment
# eval "$(./bin/micromamba shell hook -s bash)" || { echo "Failed to initialize micromamba"; exit 1; }
./bin/micromamba create -n vc -y python=3.9 || { echo "Failed to create micromamba environment"; exit 1; }
# ./bin/micromamba activate voicechat || { echo "Failed to activate micromamba environment"; exit 1; }
# ./bin/micromamba info || { echo "Failed to retrieve micromamba info"; exit 1; }

# install the dependencies
./bin/micromamba run -n vc pip install -r requirements.txt
./bin/micromamba -n vc install ffmpeg

# test that ollama is running
if ! ollama list; then
    echo "Error: ollama is not running. Please ensure that ollama is started and try again."
    exit 1
fi

# test that the LLM is downloaded
if ! ollama list | grep -q "llama3.2:3b"; then
    echo "Error: llama3.2:3b is not downloaded. Please download it with 'ollama pull llama3.2:3b' and try again."
    exit 1
fi

echo "Installation successful!"