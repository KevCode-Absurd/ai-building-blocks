# Inspect speech before editing it

For a request to preserve spoken meaning, do not replace all speech with a silent montage. Silence can be a deliberate requested treatment; it does not fulfil a speech-preservation requirement. First inspect the complete source speech, then choose complete passages whose surrounding context supports the intended meaning.

## Local transcript when no trusted timed transcript exists

Use an already installed, authorized offline ASR runtime. `local-speech-review.mjs` accepts local whisper.cpp, model and FFmpeg files; it never downloads a dependency or uploads media. The operator provisions and pins those dependencies separately. A machine transcript is evidence to inspect, not ground truth. `small.en` is English-only; use a verified matching-language model for other languages. Do not translate unless the brief asks for translation. Model confidence is not a correctness guarantee; names, negations, quantities and material/product claims need special scrutiny.

```sh
node tools/local-speech-review.mjs --source source.mp4 --cli /local/whisper-cli --model /local/ggml-small.en.bin --ffmpeg /local/ffmpeg --out context/source-speech --language en --threads 2
```

The output directory must not exist. `--audio-track 0` selects the first audio stream; inspect all relevant tracks and choose explicitly when a source has several. Optional `--model-sha256` and `--cli-sha256` reject changed dependencies. The receipt binds original media, runtime, model, extracted WAV, raw timed JSON, SRT, text and uncertainty rows to hashes. Keep failed logs. No ASR output is marked semantically approved.

## Make and review the cut

1. Read the complete timed transcript with source frames. Review uncertain tokens and context; compare audible speech where that capability is available. Distinguish **machine-transcript semantic review**, **sampled visual inspection**, **full watched playback** and **human listening** in the handoff. Never claim one because another ran.
2. Build a passage ledger: source hash, original in/out, complete source sentence and its surrounding context, retained words, product/claim support, uncertainty, and why the cut preserves meaning. Preserve negations and qualifiers. Prefer a longer continuous utterance over joining unverified fragments. If a statement cannot be verified, omit the whole unsupported claim without presenting a changed meaning; explain that editorial choice.
3. Retain the corresponding original audio with the selected source video segment. For source audio and video use the same in/out boundaries; an overlay is not permission to replace spoken content. Inspect boundary frames and waveform/silence transitions. Preserve source originals in the editable bundle.
4. Extract and transcribe the final export as well. Compare the final spoken order with the selected source passages and every caption, retaining both transcripts and source/export hashes. A matching ASR string is a diagnostic, not proof of exact audio or meaning. Record any mismatch, uncertain word, unreviewed claim or clipped sentence and revise or hold it.
5. Decode the entire export and check actual audio presence, timing, dimensions and captions. Watch and listen where available; if not, report exact coverage and retain that release dependency. Hash the final files after any edit. Do not claim full playback from a contact sheet, automatic decode or transcript.

An ASR draft makes semantic inspection possible; it does not independently certify the edit, product facts, caption accuracy, licensing or readiness to publish. If speech is unintelligible or the matching runtime/language is unavailable, deliver the feasible work with that concrete gap rather than silently redefining the task.

Primary implementation references: [whisper.cpp v1.8.3](https://github.com/ggml-org/whisper.cpp/tree/v1.8.3), [official converted models](https://huggingface.co/ggerganov/whisper.cpp). Checked 19 November 2026.
