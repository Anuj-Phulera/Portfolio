# Privacy — the SkillVerse dataset

**Sensitivity:** high. Real teenagers' answers about their habits, including free text.

## What the file contains

`SUBMISSION_PACK/SkillVerse_Raw_Data_250_Records.csv` — 262 lines including header. Columns include: submission ID, respondent ID, timestamp, age, grade, gender, city, daily screen hours, device, platform use flags, learning/entertainment/social percentages, skills learned, free-text descriptions of personal projects, AI-tool usage, country.

## Identifiers

- **Direct:** submission ID, respondent ID.
- **Quasi-identifiers** that combine to re-identify quickly: age + grade + gender + city + device + hours.
- **Free text** that can contain names of projects, schools or personal details.

## Rules for the portfolio

1. **Never commit the raw CSV** to the portfolio repository.
2. **Never publish rows.** Publish distributions only.
3. **No free-text quotations** unless the respondent gave separate, documented consent and the quote is not identifying.
4. **No city-level breakdowns** below a minimum cell size (suggested n ≥ 20), or aggregate to region.
5. **No timestamps** in public data.
6. **State the method**: when, where, how recruited, sample size, self-reported, limitations.
7. **State the numbers accurately**: 261 responses + header = 262 lines. "250+" is acceptable only with the exact figure available.

## Before publishing any chart

- Run the aggregation from the CSV with a documented script (to be written), not by hand.
- Check each output cell for n and suppress small cells.
- Record the script, its input hash, and its output in `../02-claims/verification-runs.md`.

## The principle

The dataset is the strongest evidence in the body of work and the easiest way to harm someone. Aggregates honour both facts.
