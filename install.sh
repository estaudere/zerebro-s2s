set -e  # Stop on error

# install micromamba
curl -Ls https://micro.mamba.pm/api/micromamba/osx-arm64/latest | tar -xvj bin/micromamba
eval "$(./bin/micromamba shell hook -s posix)"

# create a new environment
micromamba create -n voicechat -y python=3.9
micromamba activate voicechat
micromamba info

# install the dependencies
micromamba run -r voicechat pip install -r requirements.txt

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