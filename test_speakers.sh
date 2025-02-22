mkdir -p speaker_tests
for speaker_idx in {225..376}; do
    if tts --model_name "tts_models/en/vctk/vits" --out_path "speaker_tests/${speaker_idx}.wav" --text "hi this is a voice test, i am zerebro" --speaker_idx "p${speaker_idx}" > /dev/null 2>&1; then
        echo "Successfully generated speaker index p${speaker_idx}"
    else
        echo "Speaker index p${speaker_idx} does not exist, skipping..."
    fi
done
