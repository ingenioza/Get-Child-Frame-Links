# Get Child Frame Links - Figma Plugin

> **Extract all child frame links in seconds** — Perfect for sharing frame links with AI tools like Cursor

A Figma plugin that extracts links to all top-most sub-frames within a selected frame or frame link. This is particularly useful when working with large frames that contain many sub-frames, making it easier to share individual frame links with tools like Cursor for building Figma designs.

## Features

- **Frame Link Input**: Paste a Figma frame URL to extract its child frame links
- **Selection Support**: Automatically use the currently selected frame in Figma
- **Top-Most Sub-Frames**: Finds only direct child frames (not nested sub-frames)
- **Copy Links**: Copy individual links or all links at once
- **Real-time Selection Monitoring**: Shows current selection status in the plugin UI

## How to Use

1. **Using Selected Frame**:
   - Select a frame in Figma
   - Open the plugin
   - Click "Get Sub-Frame Links" or "Use Selected Frame"
   - All top-most sub-frame links will be displayed

2. **Using Frame Link**:
   - Copy a Figma frame URL
   - Paste it into the "Frame Link" input field
   - Click "Get Sub-Frame Links"
   - All top-most sub-frame links will be displayed

3. **Copying Links**:
   - Click "Copy Link" on any individual frame link
   - Or click "Copy All Links" to copy all links at once (one per line)

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Branch Structure

- **develop**: Default development branch
- **main**: Production branch (merged from develop when ready)

## Installation

1. Build the plugin: `npm run build`
2. In Figma, go to Plugins > Development > Import plugin from manifest...
3. Select the `manifest.json` file from this directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © inGenIO Software Solutions
