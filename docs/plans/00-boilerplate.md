# Plan: ASCII Artist Boilerplate Screen

Requirement: docs/requirements/00-boilerplate.md  
Solution: docs/solutions/00-boilerplate.md  
Branch: feat/00-boilerplate

## Tracer bullet

The thinnest end-to-end path creates the initial screen files, exposes the selected initial-screen presentation contract, and renders a visible `ASCII Artist` title above one empty canvas that fills the available viewport. The result is demonstrable through the screen's public presentation surface before later units harden launch routing, orientation, asset resolution, responsive resizing, and no-interaction behavior.

## Unit 1: Render the initial screen surface

- Status: complete.
- Builds: The first screen files and their public presentation surface, with the exact `ASCII Artist` title and one empty canvas rendered across the available screen surface.
- Contracts: `InitialScreenPresentation`; `createInitialScreenPresentation(): InitialScreenPresentation`; invariants for the exact title, one canvas, empty state, and no image side effects.
- Test first: Given the initial screen presentation, the rendered screen contains the exact title `ASCII Artist` and exactly one empty canvas.
- Acceptance: A focused screen check renders the initial screen and visibly shows `ASCII Artist` with one empty canvas covering the available viewport; no image is selected or processed.
- Blocked by: none.
- Parallel-safe: no. This establishes the screen surface that every later unit extends.

## Unit 2: Make the screen the application entry route

- Status: complete.
- Builds: The initial screen is reachable when the application opens, without sign-in, permissions, selected image, or another prerequisite.
- Contracts: `createInitialScreenPresentation(): InitialScreenPresentation`; initial application entry behavior from the solution's current-path contract.
- Test first: Given a fresh application launch, the first rendered screen is the initial screen and does not require a gate or prior state.
- Acceptance: Launching the application as a new user displays the `ASCII Artist` initial screen without an authentication, permission, or image-selection step.
- Blocked by: Unit 1.
- Parallel-safe: no. It wires the Unit 1 screen into the runtime entry path.

## Unit 3: Enforce portrait presentation

- Status: complete.
- Builds: The initial screen remains presented in portrait orientation as required by the accepted screen contract.
- Contracts: `ScreenOrientation`; `InitialScreenPresentation.orientation` invariant is always `portrait`.
- Test first: When the application opens, the reported and observed screen orientation is portrait.
- Acceptance: The application opens and remains in portrait presentation; no landscape behavior is introduced.
- Blocked by: Unit 2.
- Parallel-safe: no. It changes the launched screen's observable presentation and must be verified through the application entry path.

## Unit 4: Preserve the canvas across viewport changes

- Status: complete.
- Builds: The single canvas remains centered and covers the available screen area when the supported width or height changes.
- Contracts: `CanvasPresentation`; centered and full-available-area invariants for every supported screen width and height.
- Test first: Given two supported viewport sizes, the rendered canvas remains centered and covers each available viewport without an unintended uncovered region.
- Acceptance: Resizing the supported screen changes the canvas bounds to the new available area while retaining one centered, empty canvas.
- Blocked by: Unit 2.
- Parallel-safe: no. It extends the same initial-screen rendering surface and must be validated after launch routing is in place.

## Unit 5: Display temporary default visual assets

- Status: complete.
- Builds: The initial screen resolves and displays the supplied default application visual assets as temporary assets.
- Contracts: `VisualAssetRole`; `InitialScreenPresentation` temporary asset-role invariant.
- Test first: The initial screen presentation identifies every required temporary default visual asset role and resolves each role for the launched screen.
- Acceptance: The launched initial screen displays the supplied default application icons, and the presentation treats them as temporary rather than final artwork.
- Blocked by: Unit 2.
- Parallel-safe: yes, after Unit 2. It does not change the screen title, canvas behavior, orientation, or route contract, and it can be developed separately from Unit 3 or Unit 4 when file ownership is separated.

## Unit 6: Keep the canvas non-interactive and side-effect free

- Status: complete.
- Builds: Taps and gestures on the canvas produce no drawing, image input, processing, sharing, persistence, or other user-visible effect.
- Contracts: `CanvasPresentation`; no interaction input and no image side-effect invariants on `InitialScreenPresentation`.
- Test first: After tapping and gesturing on the rendered canvas, the canvas remains empty and no image or persistence state changes.
- Acceptance: Opening and interacting with the initial screen leaves the canvas empty and performs none of the excluded image, drawing, sharing, or persistence behaviors.
- Blocked by: Unit 2.
- Parallel-safe: yes, after Unit 2. It can be tested against the launched screen without changing routing, orientation, asset roles, or viewport layout.

## Requirement coverage

- Opening the application presents the initial screen to every user without sign-in or another prerequisite. -> Unit 2
- The initial screen visibly displays the exact title `ASCII Artist`. -> Unit 1
- The application is presented in portrait orientation. -> Unit 3
- The initial screen contains one empty canvas visual surface. -> Unit 1
- The canvas is centered within the available screen area. -> Unit 4
- The canvas covers the available screen area for every supported screen width and height without leaving an unintended uncovered region. -> Unit 4
- Changing the supported screen width or height causes the canvas to continue covering the available screen area while remaining centered. -> Unit 4
- The canvas does not respond to taps, drawing gestures, image input, or other user interaction in this increment. -> Unit 6
- The initial screen uses the product's supplied default application icons as temporary visual assets. -> Unit 5
- No image is selected, processed, converted to ASCII art, shared, or persisted as a result of opening the initial screen. -> Unit 1 and Unit 6

## Open questions

None. The units preserve the accepted technical choices and add no new architecture or behavior decisions.
