# Camera Image Selection

## Problem

The ASCII Artist initial screen does not yet let users provide an image for the later ASCII-art workflow. Users need to choose an existing image or take a new picture and see the result in the main canvas.

## Solution

When the user presses the camera button, the app presents a choice between:

- Taking a new picture with the device camera.
- Selecting an existing image from the device gallery.

After a successful capture or selection, the chosen image appears in the main canvas. The entire image remains visible with its proportions preserved, even when empty space is needed around it to fit the canvas. The toolbar remains visible and usable after the image is displayed.

If the user cancels the source choice, cancels capture or selection, or camera/gallery access fails, the current canvas remains unchanged. When access fails, the app also shows a brief user-visible error message.

This deliverable covers only camera-button image selection and display. The other toolbar buttons retain their existing behavior.

## Entry and access

The user opens the application and arrives at the initial screen with the camera button available in the bottom toolbar. No sign-in or previously selected image is required to press it. The source choice is reached by pressing the camera button; the user may then choose camera capture or gallery selection.

## User stories

1. As an ASCII Artist user, I want to choose between taking a picture and selecting a gallery image, so that I can provide the image source that suits me.
2. As an ASCII Artist user, I want a successfully chosen image to appear in the main canvas, so that I can see what will be used for later processing.
3. As an ASCII Artist user, I want the entire chosen image to remain visible with its proportions preserved, so that no part of my image is unexpectedly cropped.
4. As an ASCII Artist user, I want to cancel image selection without losing the current canvas content, so that an interrupted choice does not destroy my work.
5. As an ASCII Artist user, I want to know when camera or gallery access fails, so that I understand why no replacement image appeared.

## Acceptance criteria

- [ ] From the initial screen, pressing the camera button presents exactly two image-source choices: taking a new picture and selecting an existing gallery image.
- [ ] The camera-source choice can produce a captured image when the user completes capture successfully.
- [ ] The gallery-source choice can produce a selected image when the user completes selection successfully.
- [ ] After a successful capture or gallery selection, the chosen image is displayed in the main canvas.
- [ ] The displayed image preserves its original proportions.
- [ ] The entire chosen image is visible in the canvas; no part of it is cropped to fill the canvas.
- [ ] The toolbar remains visible and usable after a chosen image is displayed.
- [ ] If the user dismisses the source choice without choosing a source, the current canvas remains unchanged.
- [ ] If the user cancels camera capture, the current canvas remains unchanged.
- [ ] If the user cancels gallery selection, the current canvas remains unchanged.
- [ ] If camera or gallery access fails or is unavailable, the current canvas remains unchanged.
- [ ] When camera or gallery access fails or is unavailable, a brief user-visible error message is shown.
- [ ] This feature does not trigger image conversion, ASCII-art generation, image sharing, browser navigation, or behavior for the other toolbar buttons.

## Out of scope

- Converting the chosen image to ASCII art.
- Switching between the original image and an ASCII-art result.
- Sharing the image.
- Opening the product information page.
- Editing, cropping, rotating, filtering, or otherwise modifying the chosen image.
- Retaining an image across application restarts.
- Uploading or synchronizing the image with a remote service.
- Defining implementation modules, storage, file paths, frameworks, libraries, or permission APIs.

## Open questions

None. The source choices, successful display, whole-image proportional fit, cancellation behavior, failure behavior, error feedback, and toolbar persistence are confirmed.
