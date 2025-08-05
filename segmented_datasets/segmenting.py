"""
Prerequisites
-------------
pip install soundfile pandas

Folder layout expected
----------------------
C:\Monash\FYP\SarawakDataset2\
│
├─ sarawak_data.csv
├─ sarawakmalay-main\
│   ├─ wav\                    ← all original WAVs here
│   │     SM_FF_ADATSYIRIK_001.wav
│   │     SM_FF_ARNABKURA_001.wav
│   └─ ...
└─ segments\                   ← will be created/filled by this script
"""

from pathlib import Path
import pandas as pd
import soundfile as sf
import csv

# ─── CONFIG ────────────────────────────────────────────────────────────────
csv_path       = Path(r"C:\Monash\FYP\SarawakDataset2\segments\sarawak_data.csv")
wav_dir        = Path(r"C:\Monash\FYP\SarawakDataset2\sarawakmalay-main\wav")
segments_root  = Path(r"C:\Monash\FYP\SarawakDataset2\segments")
min_word_len   = 1            # ignore rows whose 'words' column is empty
# ───────────────────────────────────────────────────────────────────────────

segments_root.mkdir(exist_ok=True)

# 1. load & normalise
df = (
    pd.read_csv(csv_path)
      .assign( wav_file = lambda d: d["file_name"].str.replace(".TextGrid", ".wav",
                                                               regex=False) )
)
if min_word_len > 0:
    df = df[df["words"].str.len().fillna(0) >= min_word_len]

# 2. iterate recording by recording
for wav_name, sub in df.groupby("wav_file"):
    wav_path = wav_dir / wav_name
    if not wav_path.exists():
        print(f"[skip] missing WAV {wav_path}")
        continue

    out_dir = segments_root / wav_name.replace(".wav", "")
    out_dir.mkdir(parents=True, exist_ok=True)

    audio, sr = sf.read(wav_path)
    manifest_rows = []

    for idx, row in sub.reset_index(drop=True).iterrows():
        seg_fname = f"seg_{idx+1:03}.wav"
        start, end = float(row["xmin"]), float(row["xmax"])

        s = int(start * sr)
        e = int(end   * sr)
        sf.write(out_dir / seg_fname, audio[s:e], sr)

        manifest_rows.append([seg_fname, f"{start:.3f}", f"{end:.3f}", row["words"]])

    # 3. write manifest for this recording
    with open(out_dir / "manifest.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["file", "start", "end", "words"])
        w.writerows(manifest_rows)

    print(f"[✓] {wav_name}: {len(manifest_rows)} segments → {out_dir}")
