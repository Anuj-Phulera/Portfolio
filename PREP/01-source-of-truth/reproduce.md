# Reproducing the evidence

Every inspection in this package was performed against the commits below. `git clone --filter=blob:none` keeps the clone small; pin the commit before reading.

| Project | Repository | Inspected commit | Date |
|---|---|---|---|
| VERDE compendium | `UCHIHA-MADARA-ANUJ/Verde-CBSE` | `9d5576d94b61f2ffd478e5c9141ee23e45e47d09` | 2026-10-09 |
| VERDE OS app | `UCHIHA-MADARA-ANUJ/VERDE-CBSE-APP` | `387a14c51b1035eff8307dcfd918a74e4daf2d96` | 2026-10-09 |
| NIRMAAN app | `UCHIHA-MADARA-ANUJ/nirmaan-app` | `a7ea6832bf432e1de1a05ad082e6497640541f06` | 2026-06-21 |
| NIRMAAN site | `UCHIHA-MADARA-ANUJ/Nirmaan-Portfolio-` | `efdef9b996bd75fa7a3fcc34b0f1eb415821b2ac` | 2026-06-21 |
| SKILLVERSE | `UCHIHA-MADARA-ANUJ/S2S` | `05f238377e3d6dc6a34ffca9db4340e965653bed` | 2026-07-06 |
| RESONATE | `UCHIHA-MADARA-ANUJ/Resonate-Portfolio` | `14fe27732222a28335c2cb7d45ea5fdf3bf95f8e` | 2026-06-20 |
| STRATA | `UCHIHA-MADARA-ANUJ/WEBE` | `e8795c8308ea76cc0c42d0b2fe0b3827470d30b2` | 2026-10-18 |

Not cloned, still to inspect: `Rakshbandhan` (121 MB), `verde-main-portfolio`, `SkillVerse`, `Brahm-Dutt-MUN`, `IIT-DELHI-MUN`, `CCA-Mun`, `MUN-SKILLS`, `Commit`, `Asset-Manager-Vikas`, `WEBX`, `WEBX-WINNER`.

## Commands used

```bash
git clone --filter=blob:none --no-checkout https://github.com/UCHIHA-MADARA-ANUJ/<repo>.git
git -C <repo> checkout <sha>
git -C <repo> log --pretty=format:'%ad | %s' --date=short
git -C <repo> ls-tree -r --name-only HEAD
git -C <repo> grep -n "<term>" HEAD
git -C <repo> show HEAD:<path>
```

## Re-check a specific finding

```bash
# NIRMAN loader was never 18s
git -C Nirmaan-Portfolio- log -p --all -- src/components/sections/GenesisLoader.tsx | grep -n "duration ="

# VERDE telemetry is simulated
git -C Verde-CBSE show HEAD:app/api/telemetry/route.ts | head -20

# SkillVerse really has 262 respondents
git -C S2S show HEAD:SUBMISSION_PACK/SkillVerse_Raw_Data_250_Records.csv | wc -l

# STRATA ships verification scripts
git -C WEBE ls-tree -r --name-only HEAD | grep scripts/
```
