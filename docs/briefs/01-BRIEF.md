# Adding a toolbar to the bottom of the application

The application needs a toolbar in the bottom with 5 buttons.

- camera: this action will open the gallery or the camera of the phone, allowing the user to set the image which will be used for later processing.
- play: this action will process the image and convert it to ASCII art.
- view: this action will switch between the original image and the newly create ASCII art image.
- share: this action will allow the user to share the image.
- info: this action will open a browser an point it to <https://www.eldiletante.com>

Use the icons from expo/vector-icons. Import the icons from:

```
import Feather from '@expo/vector-icons/Feather';
```

For the camera icon use: `<Feather name="camera" size={24} color="black" />`. For the play icon use: `<Feather name="play" size={24} color="black" />`. For the view icon use: `<Feather name="eye" size={24} color="black" />`. For the share icon use: `<Feather name="share" size={24} color="black" />`. For the info icon use: `<Feather name="info" size={24} color="black" />`

This task does not creates the functionality for the icons. It will only create the toolbar and populate it with the icons.
