Based on your previous request where we added the `value` field to the `Quadrant` interface, I’ll update the `README.md` you provided to reflect that change. I’ll also enhance the documentation with the spinning wheel image, ensure it aligns with the `oho-spin` module, and incorporate details from the HTML demo. Since you mentioned an HTML demo file and a spinning wheel image, I’ll assume the image is something you’ve provided (or will host), and I’ll placeholder its path for now.

Here’s the updated `README.md`:

---

```markdown
# Spin The Wheel

A customizable, interactive spinning wheel module for the browser, built with TypeScript and the Canvas API. Create engaging spinning wheel experiences with configurable quadrants, positions, and interactivity.

## Installation

Install the module via npm:

```bash
npm install oho-spin
```

Ensure you’re using this in a browser environment, as it relies on the Canvas API and DOM.

## Features

- Customizable quadrants with text, colors, images, background images, and values.
- Configurable result position (top, bottom, left, right) for displaying the winning outcome.
- Optional interactive mode with a pointer (red triangle) that appears at the result position.
- Initial wheel alignment based on `resultPosition`.
- Smooth spinning animations with easing options (e.g., linear, easeOut, cubicOut).
- Support for sound effects, overlay images, and custom font styles.
- Added `value` field in quadrants for associating prizes or scores.

## Demo

Here’s a visual representation of the spinning wheel:

![Spinning Wheel Demo](path/to/your/spinning-wheel-image.png)

*Note: Replace `path/to/your/spinning-wheel-image.png` with the actual path or URL where the spinning wheel image is hosted (e.g., in your GitHub repository under `/images/spinning-wheel.png` or a public URL).*

## Usage

### Basic Example

Create a simple spinning wheel in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spin The Wheel Demo</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #wheel-container {
      margin: 20px;
    }
    button {
      margin: 5px;
    }
  </style>
</head>
<body>
  <div id="wheel-container"></div>
  <button onclick="wheel.spin()">Spin</button>
  <script type="module">
    import SpinTheWheel from 'oho-spin';

    const wheel = new SpinTheWheel({
      container: '#wheel-container',
      quadrants: [
        { text: 'Prize 1', color: '#ff9999', value: 100 },
        { text: 'Prize 2', color: '#99ccff', value: 50 },
        { text: 'Prize 3', color: '#99ff99' } // No value
      ],
      resultPosition: 'top'
    });

    window.wheel = wheel; // Expose to global scope for button access
  </script>
</body>
</html>
```

### Advanced Example

With more options, interactivity, values, and buttons for various actions:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spin The Wheel Advanced Demo</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #wheel-container {
      margin: 20px;
    }
    button {
      margin: 5px;
    }
  </style>
</head>
<body>
  <div id="wheel-container"></div>
  <button id="spin-random">Random Spin</button>
  <button id="spin-index-2">Spin to Index 2 (Slow)</button>
  <button id="spin-index-5">Spin to Index 5 (Fast)</button>
  <button id="set-winner">Set Winner to "Prize 3"</button>
  <button id="reset-btn">Reset</button>
  <button id="stop-btn">Stop</button>
  <button id="toggle-interact">Toggle Interactivity</button>

  <script type="module">
    import SpinTheWheel from 'oho-spin';

    const wheel = new SpinTheWheel({
      container: '#wheel-container',
      quadrants: [
        { 
          image: 'https://picsum.photos/40/40?random=1',
          text: 'Prize 1',
          textColor: '#ffffff',
          fontStyle: 'bold 20px Comic Sans MS',
          color: '#ff9999',
          weight: 1,
          value: 100
        },
        { 
          image: 'https://picsum.photos/40/40?random=2',
          text: 'Prize 2 with Long Text',
          textColor: '#ffffff',
          fontSize: 18,
          color: '#99ccff',
          weight: 2,
          value: 50
        },
        { 
          image: 'https://picsum.photos/40/40?random=3',
          text: 'Prize 3',
          textColor: '#ffffff',
          fontStyle: 'italic 16px Georgia',
          color: '#99ff99',
          weight: 1,
          value: 25
        },
        { 
          image: 'https://picsum.photos/40/40?random=4',
          text: 'Prize 4 Super Long Text',
          textColor: '#ffffff',
          fontSize: 14,
          color: '#ffcc99',
          weight: 3,
          value: 75
        },
        { 
          image: 'https://picsum.photos/40/40?random=5',
          text: 'Prize 5',
          textColor: '#ffffff',
          fontStyle: '600 20px Roboto',
          color: '#cc99ff',
          weight: 3,
          value: 200
        },
        { 
          image: 'https://picsum.photos/40/40?random=6',
          text: 'Prize 6 with Extra Words',
          textColor: '#ffffff',
          fontSize: 16,
          color: '#ffff99',
          weight: 3,
          value: 10
        }
      ],
      spinDuration: 10000,
      soundEnabled: true,
      soundFile: '/assets/spin-sound.mp3',
      pointerAngle: 0,
      isInteractive: false,
      easing: 'cubicOut',
      overlayImage: '/assets/spin-wheel-overlay.svg',
      resultPosition: 'top',
      onSpinComplete: (result) => {
        const valueText = result.value !== undefined ? ` (Value: ${result.value})` : '';
        alert(`You won: ${result.text}${valueText}!`);
      }
    });

    document.getElementById('spin-random').addEventListener('click', () => wheel.spin());
    document.getElementById('spin-index-2').addEventListener('click', () => wheel.spinToIndex(2, 0.5)); // Index 2, slow speed
    document.getElementById('spin-index-5').addEventListener('click', () => wheel.spinToIndex(5, 2)); // Index 5, fast speed
    document.getElementById('set-winner').addEventListener('click', () => wheel.setWinningQuadrant('Prize 3'));
    document.getElementById('reset-btn').addEventListener('click', () => wheel.reset());
    document.getElementById('stop-btn').addEventListener('click', () => wheel.stopSpin());
    document.getElementById('toggle-interact').addEventListener('click', () => 
      wheel.toggleInteractivity(!wheel['config'].isInteractive)
    );
  </script>
</body>
</html>
```

## Configuration Options

The `SpinTheWheel` constructor accepts a configuration object with the following properties:

| Property          | Type                          | Default         | Description                                                                 |
|-------------------|-------------------------------|-----------------|-----------------------------------------------------------------------------|
| `container`       | `string`                     | -               | CSS selector for the container element (required).                          |
| `quadrants`       | `Quadrant[]`                | -               | Array of quadrant objects (required). See Quadrant interface below.         |
| `spinDuration`    | `number`                     | `4000`          | Duration of the spin animation in milliseconds.                             |
| `soundEnabled`    | `boolean`                    | `true`          | Enable/disable spinning sound.                                              |
| `soundFile`       | `string`                     | -               | Path to the sound file (required if `soundEnabled` is `true`).              |
| `pointerAngle`    | `number`                     | `0`             | Initial angle offset for the pointer (in degrees).                          |
| `isInteractive`   | `boolean`                    | `true`          | Enable/disable interactivity (shows pointer when `true`).                   |
| `easing`          | `'linear' | 'easeOut' | 'cubicOut'` | `'easeOut'` | Animation easing function.                                                  |
| `overlayImage`    | `string`                     | -               | Path to an overlay image (e.g., SVG/PNG) to display over the wheel.         |
| `resultPosition`  | `'left' | 'right' | 'top' | 'bottom'` | `'top'` | Where the result text and pointer appear (also sets initial alignment).     |
| `onSpinComplete`  | `(result: Quadrant) => void` | -               | Callback function invoked with the winning quadrant after spinning.         |

### Quadrant Interface

Each quadrant in the `quadrants` array can have:

| Property          | Type            | Default   | Description                                           |
|-------------------|-----------------|-----------|-------------------------------------------------------|
| `image`           | `string`        | -         | URL to a small image displayed in the quadrant.       |
| `text`            | `string`        | -         | Text label for the quadrant (required).               |
| `color`           | `string`        | `#ffffff` | Background color (used if no `backgroundImage`).      |
| `backgroundImage` | `string`        | -         | URL to a background image for the quadrant.           |
| `textColor`       | `string`        | `#000`    | Color of the text.                                    |
| `fontSize`        | `number`        | `16`      | Font size in pixels (used if `fontStyle` not set).    |
| `fontStyle`       | `string`        | -         | Full font style (e.g., `'bold 20px Arial'`).          |
| `weight`          | `number`        | -         | Weight for spin probability (not currently used).     |
| `value`           | `string | number` | -         | Optional value (e.g., prize amount or score).         |

## Methods

| Method                  | Parameters                     | Description                                                  |
|-------------------------|--------------------------------|--------------------------------------------------------------|
| `spin()`                | -                              | Starts a random spin animation.                              |
| `spinToIndex(index, speed)` | `number, number`            | Spins to a specific quadrant by index with a speed multiplier. |
| `setWinningQuadrant(text)` | `string`                   | Spins to a quadrant with the specified text.                 |
| `setRotationSpeed(speed)` | `number`                     | Sets the spin speed multiplier (e.g., `0.5` for slow, `2` for fast). |
| `reset()`               | -                              | Resets the wheel to its initial state (aligned to `resultPosition`). |
| `getCurrentQuadrant()`   | -                              | Returns the current winning quadrant without spinning.       |
| `stopSpin()`            | -                              | Stops the spin immediately and shows the result.             |
| `toggleInteractivity(enable)` | `boolean`                | Toggles interactivity (shows/hides pointer).                 |

## Notes

- **Browser Only:** This module uses the Canvas API and DOM, so it’s intended for browser environments. It won’t work directly in Node.js without a canvas implementation (e.g., `node-canvas`).
- **Assets:** Ensure sound files (`soundFile`) and overlay images (`overlayImage`) are accessible in your project.
- **Initial Alignment:** The wheel starts with the middle of the first quadrant aligned to `resultPosition` (e.g., `'top'` places "Prize 1" at the top).
- **Value Display:** If a quadrant has a `value`, it’s shown in the result (e.g., "You won: Prize 1 (100)") and can be displayed on the wheel itself (optional, based on your implementation).
- **Weight:** The `weight` property in quadrants is currently not used for probability but can be extended for weighted randomization in future versions.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Feel free to submit issues or pull requests on the [GitHub repository](https://github.com/koushikmobo/oho-spin).

## Author

[Koushik Mandal](mailto:math.koushik1997@gmail.com)
# oho-spin
