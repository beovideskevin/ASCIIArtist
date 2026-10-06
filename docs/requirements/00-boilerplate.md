# ASCII Artist Boilerplate

## Problem

The ASCII Artist application does not yet provide a basic user-facing starting screen. Users need an identifiable application surface that establishes the product name and provides a responsive canvas area for future image and ASCII-art work.

## Solution

When the user opens ASCII Artist, the application presents an initial screen in portrait mode with:

- The visible title “ASCII Artist”.
- A canvas that is centered and covers the available screen area at every supported screen width and height.
- The default application icons supplied with the product, which serve as temporary visual assets until they are replaced later.

The canvas is an empty, non-interactive visual surface in this increment. It does not draw, process images, respond to gestures, or perform other user actions.

## Entry and access

The initial screen is shown when any user opens the application. No sign-in, permission prompt, selected image, or other prerequisite is required. The application presents the screen in portrait mode; users do not enter through an alternate authenticated or gated flow.

## User stories

1. As an ASCII Artist user, I want to see the application name when I open the app, so that I know which application I am using.
2. As an ASCII Artist user, I want a canvas that fills the available screen while remaining centered, so that the application has a consistent surface for future artwork.
3. As an ASCII Artist user, I want the app to remain in portrait mode, so that the initial experience has a stable orientation.

## Acceptance criteria

- [ ] Opening the application presents the initial screen to every user without sign-in or another prerequisite.
- [ ] The initial screen visibly displays the exact title “ASCII Artist”.
- [ ] The application is presented in portrait orientation.
- [ ] The initial screen contains one empty canvas visual surface.
- [ ] The canvas is centered within the available screen area.
- [ ] The canvas covers the available screen area for every supported screen width and height without leaving an unintended uncovered region.
- [ ] Changing the supported screen width or height causes the canvas to continue covering the available screen area while remaining centered.
- [ ] The canvas does not respond to taps, drawing gestures, image input, or other user interaction in this increment.
- [ ] The initial screen uses the product’s supplied default application icons as temporary visual assets.
- [ ] No image is selected, processed, converted to ASCII art, shared, or persisted as a result of opening the initial screen.

## Out of scope

- Image selection from a gallery or camera.
- Drawing or editing on the canvas.
- Converting images or other content to ASCII art.
- Displaying generated ASCII art.
- Toolbar controls or other workflow actions.
- Replacing the supplied default icons with final artwork.
- Sign-in, permissions, user accounts, persistence, or cloud behavior.
- Landscape orientation behavior.
- Choosing modules, storage, file paths, frameworks, libraries, or other implementation details.

## Open questions

None. The initial access path, portrait orientation, visible title, empty canvas behavior, responsive coverage, and temporary icon treatment have been confirmed.
None. The initial access path, portrait orientation, visible title, empty canvas behavior, responsive coverage, and temporary icon treatment have been confirmed.
