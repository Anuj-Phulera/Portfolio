# Source-of-truth method

The failure mode this document exists to prevent: a portfolio built from README descriptions instead of from the code. Every statement in this folder was produced by reading files, running commands, or inspecting history — not by trusting prose.

## Evidence grades

| Grade | Meaning | Minimum bar |
|---|---|---|
| **V** verified | Confirmed by source code, build, test run, or live HTTP response | A file path, command, or URL is cited |
| **P** partial | Exists but incomplete, gated, or unexercised | What is missing is named |
| **U** unverified | Cannot be checked here | The blocking reason is recorded |
| **A** aspirational | Intent, plan, or documentation of something not built | No implementation evidence found |
| **X** contradicted | Documentation and implementation disagree | Both sides quoted |

## Procedure per project

1. Clone the repository (see `reproduce.md`) at a pinned commit.
2. Read the README. Extract every factual claim into `../02-claims/ledger.yaml`.
3. For each claim, locate the implementation: route, component, script, config, asset.
4. Run what can be run: `git log`, file counts, grep for flags, package scripts, test suites.
5. Grade the claim. Quote file:line where possible.
6. Record what a visitor would actually experience versus what is promised.
7. Note what is *absent* — features described in prose with no corresponding code.

## What counts as evidence

- A source file that implements the behaviour.
- A test or script that asserts the behaviour, and its output.
- A commit that shows when the behaviour changed.
- A dependency in `package.json` that a feature would require.

## What does not count

- A README sentence.
- A marketing page.
- A comment that says something is done.
- A variable name that suggests a capability.
- A UI label displaying a number.

## Environment limits (apply to every document in this folder)

- Outbound network is restricted to `github.com`, `codeload.github.com`, `api.github.com`, `registry.npmjs.org`, `pypi.org`, `files.pythonhosted.org`. Vercel and github.io deployments **cannot be fetched from this environment**; deployment status is therefore recorded as `U` unless another signal exists.
- No browser is installed, so no live site can be driven or screenshot. Runtime claims about deployed URLs are `U`, not `V`.
- Static analysis of source is available and is the primary instrument.
