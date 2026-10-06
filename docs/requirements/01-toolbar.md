# Bottom Toolbar

## Problem

The ASCII Artist initial screen does not yet provide a visible control surface for the app's main image workflow. Users need to see where image selection, ASCII-art conversion, viewing, sharing, and product information will be accessed.

## Solution

The initial screen presents a toolbar at the bottom with exactly five enabled buttons in this left-to-right order:

1. Camera: represents choosing or capturing an image for later processing.
2. Play: represents converting the selected image to ASCII art.
3. View: represents switching between the original image and the created ASCII-art image.
4. Share: represents sharing the image.
5. Info: represents opening the product information page at `https://www.eldiletante.com`.

The buttons display recognizable symbols for their represented actions. In this increment, pressing any button has no observable effect; the represented actions are future functionality.

## Entry and access

The toolbar appears on the application's initial screen for every user. No sign-in, permission, selected image, or other prerequisite is required to see it. Users reach it by opening the application.

## User stories

1. As an ASCII Artist user, I want to see the five workflow controls together at the bottom of the initial screen, so that I can understand how the app's main actions are organized.
2. As an ASCII Artist user, I want each control to have a recognizable symbol, so that I can distinguish image selection, conversion, viewing, sharing, and information at a glance.
3. As an ASCII Artist user, I want the controls to be visible before I have selected an image, so that I can discover the available workflow from the initial screen.

## Acceptance criteria

- [ ] Opening the application presents the initial screen and its bottom toolbar to every user without sign-in or another prerequisite.
- [ ] The toolbar is positioned at the bottom of the initial screen.
- [ ] The toolbar contains exactly five buttons.
- [ ] The buttons appear from left to right in this order: camera, play, view, share, info.
- [ ] The camera button displays a recognizable camera symbol.
- [ ] The play button displays a recognizable play symbol.
- [ ] The view button displays a recognizable eye or equivalent view symbol.
- [ ] The share button displays a recognizable share symbol.
- [ ] The info button displays a recognizable information symbol.
- [ ] All five buttons appear enabled and available on the initial screen.
- [ ] Pressing any button does not open the gallery or camera, process an image, switch the displayed image, share an image, open a browser, or navigate to the product information page in this increment.
- [ ] The toolbar remains visible when the initial screen is opened without a selected image.

## Out of scope

- Opening the device gallery or camera.
- Selecting or storing an image.
- Converting an image to ASCII art.
- Switching between original and ASCII-art images.
- Sharing an image.
- Opening a browser or navigating to `https://www.eldiletante.com`.
- Adding image, permission, navigation, sharing, or processing failure behavior.
- Choosing modules, storage, file paths, frameworks, or libraries.

## Open questions

None. Initial-screen access, bottom placement, button count and order, enabled presentation, recognizable symbols, and no-op button behavior are confirmed.
