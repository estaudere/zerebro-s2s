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

# test that the LLM is downloaded
if ! ollama list | grep -q "llama3.2:3b"; then
    echo "Error: llama3.2:3b is not downloaded. Please download it with 'ollama pull llama3.2:3b' and try again."
    exit 1
fi

# check that the music folder is downloaded, if not, download it
if [ ! -d "music" ]; then
    echo "Downloading music..."
    curl -L "https://drive.usercontent.google.com/download?id=1vTske5Pn-PcAXZx6q3mZv9YzRzW4Gr_2&confirm=xxx" -o music.zip
    unzip music.zip
    rm music.zip
    rm -rf __MACOSX
fi
echo "Music downloaded"

# check that the zerebro_voxel.fbx file in the UI folder is downloaded, if not, download it
if [ ! -f "ui/zerebro_voxel.fbx" ]; then
    echo "Downloading avatar..."
    curl -L "https://drive.usercontent.google.com/download?id=1vTske5Pn-PcAXZx6q3mZv9YzRzW4Gr_2&confirm=xxx" -o ui/zerebro_voxel.fbx
fi
echo "Avatar downloaded"

echo "Installation successful!"