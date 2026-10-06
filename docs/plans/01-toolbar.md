# Plan: Bottom Toolbar

Requirement: docs/requirements/01-toolbar.md  
Solution: docs/solutions/01-toolbar.md  
Branch: feat/01-toolbar

## Tracer bullet

The thinnest path creates a bottom toolbar surface on the existing initial screen, then extends that surface with exactly five enabled buttons in the accepted order, each showing its semantic icon role and doing nothing when pressed. The existing title, canvas, temporary asset, launch route, and portrait presentation remain unchanged.

The repository currently stores the accepted toolbar solution as `docs/solutions/00-boilerplate.md`, although that document cites the requested `01-toolbar` requirement. This plan uses that existing toolbar solution as the source of truth without reopening its decisions.

## Unit 1: Create the empty toolbar

- Status: complete.
- Builds: A visible toolbar shell positioned at the bottom of the existing initial screen, with no action buttons yet.
- Contracts: `ToolbarPresentation` as the bottom-positioned presentation boundary; the toolbar host accepts an empty item collection as the intermediate state that Unit 2 extends to the fixed five-item presentation.
- Test first: Given the initial screen, the toolbar shell is visible at the bottom and contains zero toolbar buttons while the existing title and canvas remain visible.
- Acceptance: Opening the application shows an empty bottom toolbar shell on the initial screen without changing the existing title, canvas, temporary asset, route, or portrait presentation.
- Blocked by: none.
- Parallel-safe: no. This establishes the toolbar surface that Unit 2 extends.

## Unit 2: Add the five enabled icon buttons

- Status: complete.
- Builds: The empty toolbar becomes the final five-button presentation: camera, play, view, share, and info from left to right, with recognizable matching symbols, enabled state, and no-op presses.
- Contracts: `ToolbarAction`; `ToolbarVisualRole`; `ToolbarItem`; `ToolbarPresentation`; `createToolbarPresentation(): ToolbarPresentation`; `pressToolbarAction(action: ToolbarAction): void`.
- Test first: Given the initial screen, the toolbar contains exactly five enabled buttons in the required order, each has its matching visual role, and pressing each action produces no observable effect.
- Acceptance: Opening the application shows five enabled bottom buttons ordered camera, play, view, share, info; each displays its recognizable symbol, and pressing any button does not open media capture, process or switch images, share content, navigate, open a browser, request permissions, or persist state.
- Blocked by: Unit 1.
- Parallel-safe: no. It fills the Unit 1 toolbar shell and completes the toolbar acceptance moment.

## Requirement coverage

- Opening the application presents the initial screen and its bottom toolbar to every user without sign-in or another prerequisite. -> Unit 1 and Unit 2
- The toolbar is positioned at the bottom of the initial screen. -> Unit 1
- The toolbar contains exactly five buttons. -> Unit 2
- The buttons appear from left to right in this order: camera, play, view, share, info. -> Unit 2
- The camera button displays a recognizable camera symbol. -> Unit 2
- The play button displays a recognizable play symbol. -> Unit 2
- The view button displays a recognizable eye or equivalent view symbol. -> Unit 2
- The share button displays a recognizable share symbol. -> Unit 2
- The info button displays a recognizable information symbol. -> Unit 2
- All five buttons appear enabled and available on the initial screen. -> Unit 2
- Pressing any button does not open the gallery or camera, process an image, switch the displayed image, share an image, open a browser, or navigate to the product information page in this increment. -> Unit 2
- The toolbar remains visible when the initial screen is opened without a selected image. -> Unit 1 and Unit 2

## Open questions

None. The plan preserves the accepted toolbar contract and introduces no new technical or product decisions.
