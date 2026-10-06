# Plan: Camera Image Selection

Requirement: docs/requirements/02-camera.md  
Solution: docs/solutions/02-camera.md  
Branch: feat/02-camera

## Tracer bullet

The thinnest end-to-end path starts from the existing camera toolbar action, presents the user with camera and gallery choices, normalizes a successful source result, and displays that image in the existing canvas with its full proportions preserved. Unit 1 establishes the source-flow contract; Unit 2 connects a successful result to the canvas while preserving the toolbar and all prior canvas content on cancellation or failure.

## Unit 1: Open the gallery or camera

- Status: complete.
- Builds: Pressing the camera toolbar button presents exactly two source choices, camera and gallery, and reports cancellation or access failure without changing the current canvas.
- Contracts: `ImageSource`; `ImageSelectionResult`; `chooseImageSource(): Promise<ImageSource | null>`; `selectImage(source: ImageSource): Promise<ImageSelectionResult>`.
- Test first: Given a camera-button press, the source choice exposes exactly camera and gallery; dismissing it returns cancellation, while denied or unavailable access returns failure with a brief user-facing message.
- Acceptance: A user can reach both the camera capture flow and gallery selection flow from the initial screen; dismissing or canceling either flow leaves the current canvas unchanged, and access failure leaves it unchanged while showing brief feedback.
- Blocked by: none.
- Parallel-safe: no. This establishes the media-selection contract that Unit 2 consumes.

## Unit 2: Set the image in the main canvas

- Status: complete.
- Builds: A successful camera capture or gallery selection becomes the current canvas image, with the entire image visible at preserved proportions; the toolbar remains visible and usable.
- Contracts: `SelectedImage`; `ImageSelectionResult`; `CurrentImage`; `setCurrentImage(image: SelectedImage): void`; `CanvasImagePresentation`.
- Test first: Given a successful wide, tall, or square image result, the canvas displays exactly that image without cropping or stretching; given cancellation or failure, the prior canvas image remains unchanged.
- Acceptance: After successful capture or gallery selection, the chosen image replaces the canvas content in a complete aspect-preserving fit, the toolbar remains usable, and no conversion, sharing, navigation, or persistence occurs.
- Blocked by: Unit 1.
- Parallel-safe: no. It consumes Unit 1's normalized result and completes the image-selection behavior.

## Requirement coverage

- From the initial screen, pressing the camera button presents exactly two image-source choices: taking a new picture and selecting an existing gallery image. -> Unit 1
- The camera-source choice can produce a captured image when the user completes capture successfully. -> Unit 1 and Unit 2
- The gallery-source choice can produce a selected image when the user completes selection successfully. -> Unit 1 and Unit 2
- After a successful capture or gallery selection, the chosen image is displayed in the main canvas. -> Unit 2
- The displayed image preserves its original proportions. -> Unit 2
- The entire chosen image is visible in the canvas; no part of it is cropped to fill the canvas. -> Unit 2
- The toolbar remains visible and usable after a chosen image is displayed. -> Unit 2
- If the user dismisses the source choice without choosing a source, the current canvas remains unchanged. -> Unit 1
- If the user cancels camera capture, the current canvas remains unchanged. -> Unit 1
- If the user cancels gallery selection, the current canvas remains unchanged. -> Unit 1
- If camera or gallery access fails or is unavailable, the current canvas remains unchanged. -> Unit 1 and Unit 2
- When camera or gallery access fails or is unavailable, a brief user-visible error message is shown. -> Unit 1
- This feature does not trigger image conversion, ASCII-art generation, image sharing, browser navigation, or behavior for the other toolbar buttons. -> Unit 2

## Open questions

None. The plan preserves the accepted media-selection and canvas contracts and introduces no new technical or product decisions.
