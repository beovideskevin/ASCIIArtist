# Solution: Camera Image Selection

Source: docs/requirements/02-camera.md

## Current path

The application launches through Expo Router to the initial screen. That screen currently displays the full-screen canvas, temporary application icon, title, and five-button toolbar. The toolbar's camera button is currently a no-op, and the canvas has no selected-image state.

The runtime path for this change is:

1. The user opens the app on the existing initial screen.
2. The user presses the camera toolbar action.
3. The app presents the two accepted source choices: take a picture or select a gallery image.
4. A successful source result becomes the current image shown in the canvas.
5. The toolbar remains available while the image is displayed.
6. Cancellation or access failure leaves the current canvas image unchanged; access failure also produces brief user-visible feedback.

The requested output is `docs/solutions/00-boilerplate.md`, while the source requirement is `docs/requirements/02-camera.md`. The output filename currently belongs to an earlier toolbar solution; this solution records the mismatch without changing the camera requirement.

## Evidence

- Observed: `app/_layout.tsx` sets the initial route to `index`, and `app/index.tsx` renders the initial canvas and toolbar. Result: camera selection is entered from the existing initial screen, not a new access path.
- Observed: `components/toolbar/Toolbar.tsx` defines the camera action as one of five enabled buttons and currently assigns a no-op press handler. Result: the camera action is the smallest existing integration seam for this feature.
- Observed: `app/index.tsx` renders the canvas with pointer input disabled and the toolbar after the title and temporary asset. Result: image display must replace only the canvas content and must not make the toolbar or canvas surface interactive outside the camera action.
- Observed: `package.json` includes `expo-camera` and `expo-image`, but `npm ls expo-image-picker --depth=0` reports no installed `expo-image-picker`. Result: camera capture is available in the repository, while gallery selection requires an added external capability before implementation.
- Observed: the installed `expo-camera` types expose camera permission methods and `takePictureAsync()` returning a URI plus image width and height. Result: the camera result can satisfy the image display contract without inventing a data shape.
- Observed: Expo's primary Camera documentation states that `takePictureAsync` requires camera readiness, returns a `CameraCapturedPicture` with URI, width, and height, and camera permission can be checked/requested. Result: capture must have explicit readiness, permission, cancellation, and failure handling.
- Observed: Expo's primary ImagePicker documentation states that `launchCameraAsync` and `launchImageLibraryAsync` return results with `canceled` and `assets`, and that an asset includes URI, width, and height. Result: one semantic source-result contract can normalize both source paths.
- Observed: Expo's primary ImagePicker documentation states that camera/gallery launch on web must occur directly from user activation, and that canceled results have `assets: null`. Result: the camera action must start the source flow directly from the user press and treat cancellation as a non-error no-op.
- Observed: `npm run typecheck` and `npm run lint` exit successfully before this change. Result: the current baseline is clean.

Primary sources:

- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

## Decisions

- Chosen: Present a source choice with camera capture and gallery selection. Rejected: always opening camera or always opening gallery. Because: the accepted behavior explicitly gives the user both source options and does not define a preferred default.
- Chosen: Use one semantic media-selection Interface that normalizes successful camera and gallery results into one current-image value. Rejected: exposing camera and gallery result shapes directly to the screen. Because: callers should depend on one image-selection contract rather than learn two external result formats.
- Chosen: Use the platform media-picker flow for both source choices. Rejected: building a custom camera screen plus a separate gallery flow. Because: the documented platform flow already supplies both source operations, cancellation, permission outcomes, and asset dimensions, reducing duplicated failure handling.
- Chosen: Replace the canvas image only after a successful result containing a usable image URI and dimensions. Rejected: clearing the current canvas when a flow starts or when a result is canceled. Because: the accepted requirement says cancellation and failure leave the current canvas unchanged.
- Chosen: Display the complete image with preserved proportions inside the canvas. Rejected: cropping or stretching to fill the canvas. Because: the requirement explicitly requires the whole image to remain visible and proportions to be preserved.
- Chosen: Keep the toolbar visible after image replacement. Rejected: hiding or replacing the toolbar while an image is displayed. Because: the requirement explicitly keeps the toolbar usable for subsequent selection.
- Chosen: Report access failure briefly while preserving the current image. Rejected: silently ignoring failure or replacing the canvas with an error state. Because: the confirmed behavior requires user-visible feedback without destructive replacement.
- Chosen: Keep image ownership session-scoped to the current screen presentation with no persistence. Rejected: storing the image across restarts or synchronizing it remotely. Because: persistence and upload are outside the accepted requirement.
- Chosen: Add an external gallery-selection capability during implementation. Rejected: treating `expo-camera` alone as sufficient for both camera and gallery. Because: repository inspection shows no installed gallery picker, while the requirement requires both source paths.

## Module contracts

The changed contracts use the module-design rule: the screen depends on a small semantic media-selection Interface, while external camera/gallery behavior and result normalization remain behind the Implementation. No storage Adapter or remote-service Seam is introduced.

### Media selection module

#### Media selection interface

- `ImageSource`: `camera` or `gallery`.
- `SelectedImage`: a URI, positive width, and positive height for one successfully selected or captured image.
- `ImageSelectionResult`: `selected` with a `SelectedImage`, `cancelled`, or `failed` with a user-facing failure message.
- `chooseImageSource(): Promise<ImageSource | null>`.
- `selectImage(source: ImageSource): Promise<ImageSelectionResult>`.

#### Media selection invariants

- The source choice presents exactly `camera` and `gallery`.
- Dismissing the source choice returns no source and does not change the current image.
- A successful result contains exactly one image with a usable URI and positive dimensions.
- Camera and gallery result formats are normalized before reaching the screen.
- Cancellation is distinct from failure and does not produce an error message.
- Permission denial, unavailable hardware, picker errors, and unusable results produce `failed` with a brief user-facing message.
- The module does not persist, upload, convert, crop, rotate, stretch, or share an image.
- The module does not expose external library result objects, permission API types, or storage handles.

### Canvas image presentation module

#### Canvas image presentation interface

- `CurrentImage`: either no image or one `SelectedImage`.
- `setCurrentImage(image: SelectedImage): void`.
- `clearCurrentImage(): void` is not part of this contract for this feature.
- `CanvasImagePresentation`: the current image rendered with preserved proportions and complete visibility.

#### Canvas image presentation invariants

- A successful selection replaces the current canvas image atomically.
- Cancellation or failure leaves the previous current image unchanged.
- The rendered image uses a fit behavior that preserves the source aspect ratio and does not crop any source pixels.
- The toolbar remains visible and actionable after the current image changes.
- No conversion, ASCII-art generation, sharing, browser navigation, or other toolbar action is triggered by image selection.
- No current image is persisted across application restarts or uploaded remotely.

### Interface sketches considered

- Smallest surface: the screen owns source choice, permission handling, result parsing, and image layout directly. Rejected because it spreads external result and failure knowledge across the screen and makes cancellation preservation difficult to test through one boundary.
- Most permissive surface: the screen receives raw camera/gallery results, permission objects, arbitrary image transforms, and callbacks. Rejected because callers can replace the canvas on cancellation, crop the image, or leak external API details into the product surface.
- Selected surface: the media-selection module returns a normalized selected/cancelled/failed result, and the canvas presentation accepts only a valid selected image. Chosen because it hides external differences behind a small Interface and gives tests a seam for success, cancellation, failure, and aspect-preserving display behavior.

## Risks

| Risk                                                                                             | Likelihood | Impact | Detection                                                                                    | Mitigation                                                                                                                       |
| ------------------------------------------------------------------------------------------------ | ---------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Gallery selection is unavailable because the required capability is not installed or configured. | High       | High   | Build/configuration check and a gallery-selection launch check fail.                         | Treat gallery support as a prerequisite of the media-selection contract and verify both source choices on supported targets.     |
| Camera permission, hardware, or readiness failure replaces or clears the current image.          | Medium     | High   | Denial, unavailable camera, and camera error tests observe current-image state and feedback. | Commit a new image only after a successful normalized result; map all failure paths to unchanged image plus message.             |
| Gallery or camera cancellation is mistaken for failure or success.                               | Medium     | High   | Cancel each source flow and observe no error message and no canvas change.                   | Keep cancellation as a distinct result state in the Interface.                                                                   |
| The displayed image is cropped, stretched, or otherwise incomplete.                              | Medium     | High   | Use wide, tall, and square fixtures and inspect complete-image visibility and aspect ratio.  | Keep source dimensions in `SelectedImage` and make aspect-preserving, non-cropping display an invariant.                         |
| Camera capture returns an orientation or URI that cannot be displayed.                           | Medium     | Medium | Capture on device and verify displayed orientation and image load.                           | Use the documented capture result after readiness and avoid options that skip orientation processing unless separately accepted. |
| The toolbar disappears or becomes unusable after image replacement.                              | Low        | Medium | Select an image, then verify all toolbar controls remain visible and available.              | Keep image state scoped to canvas presentation, not toolbar visibility.                                                          |
| Failure feedback is absent, persistent, or shown for cancellation.                               | Medium     | Medium | Denial/error/cancel scenarios compare message visibility and duration behavior.              | Keep failure feedback in the failed result contract and exclude cancellation from that path.                                     |
| Platform behavior differs on web because media launch requires direct user activation.           | Medium     | Medium | Run source actions from a real button press on web and verify the system chooser opens.      | Start selection directly from the camera button press and document platform-specific launch checks.                              |
| The requested solution filename does not match the camera requirement filename.                  | Medium     | Low    | Documentation review compares `02-camera` source with `00-boilerplate` output.               | Preserve the requested output path and record the mismatch without altering product scope.                                       |

## Requirement impact

None. The selected contracts preserve the accepted camera behavior: both source choices, successful image display, complete proportional visibility, toolbar persistence, cancellation and failure preservation, brief failure feedback, and no unrelated toolbar actions. No requirement criterion is weakened.

## Open questions

None. Source choice, success behavior, fit behavior, cancellation, failure feedback, toolbar persistence, and out-of-scope actions are resolved. The source/output filename mismatch is documented evidence, not an unresolved product or contract decision.
