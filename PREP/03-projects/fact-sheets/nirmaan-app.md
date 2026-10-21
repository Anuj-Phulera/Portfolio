# NIRMAAN app — fact sheet

**Canonical repo:** `nirmaan-app` · **Surface:** Next.js three-role platform · **Status:** broad build, zero verified runtime

## Purpose
To make e-waste collection as easy as food delivery: a household books a pickup, a business manages volume, an admin runs the network.

## Intended user
Three distinct users with three distinct interfaces: a householder, a recycling business, and a platform operator.

## Problem
India generates 14.14 lakh tonnes of e-waste a year; most is processed informally. The barrier is access, trust and traceability, not awareness.

## Essential functionality
Booking flow, live map with nearby centres, OTP handover, business dashboards, admin approval and pricing, AI assistant, notifications.

## Architecture
Next.js 14, Firebase Auth + Firestore for identity, Supabase Postgres for bookings/businesses/locations, Leaflet for maps, Gemini for chat, nodemailer for OTP.

## Verified contribution
Sole repository author. Competition context stated in README; team composition not recorded.

## Collaborators
Not recorded. The NIRMAN *site* has a `/team/aarav` route — confirm whether Aarav is also on this project.

## Evidence of implementation
18 page routes, 10 API routes, both database clients, both map libraries. Route tree confirms real role separation.

## Limitations
Requires three cloud projects and a manual seed procedure. No fixture. No tests. No deployment URL. The superlative in the README is unfalsifiable.

## Most defensible differentiator
**The dual-database role model** — and the honesty of admitting it is the hard part, rather than pretending a single schema would do.

## Portfolio role
The product-thinking exhibit. Present as a working prototype with a seeded demo, or as an architecture case study — not as a live national service.
