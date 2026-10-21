# VERDE OS app — fact sheet

**Canonical repo:** `VERDE-CBSE-APP` · **Surface:** Next.js dashboard · **Status:** complete build, runtime unverified

## Purpose
The control surface for the farm: see the sensors, change the actuators, ask the system questions.

## Intended user
The person running the farm — or, in a portfolio context, a reader who wants proof that the hardware story has a usable interface.

## Problem
Sensor data is only useful if it arrives somewhere a human can act on it. Every serious farm project needs a control room.

## Essential functionality
Telemetry tiles with sparklines and expandable history; pump and light AUTO/MANUAL; threshold editing; rain override; tank calibration; weather forecast and auto-override; Plant Doctor (camera capture, disease identification); two chat surfaces with sensor context.

## Architecture
Next.js App Router. Five server routes proxy Firebase, OpenWeather, Gemini, OpenRouter and Plant.id. Keys never reach the client; Firebase paths and fields are whitelisted.

## Verified contribution
Anuj — the whole application, by repository authorship.

## Collaborators
Hardware by Aarav Choudhary; this repository is software only.

## Evidence of implementation
37 files, five API routes, no `NEXT_PUBLIC_*` usage under `app/`, `.env.example` documenting server-only reads.

## Limitations
Cannot be run without Firebase and three AI keys. No fixture, no replay mode, no test.

## Most defensible differentiator
**Key custody done properly.** Most student IoT dashboards leak the Firebase secret into the bundle. This one does not.

## Portfolio role
The strongest *engineering* exhibit, and the best candidate for a 40-second screen recording — provided it is labelled as a recorded session if the board is not live.
