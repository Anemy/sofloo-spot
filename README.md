[Concentric](https://anemy.github.io/concentric) is a generative art project.
Built by [Anemy](https://github.com/Anemy)

## Installation

Install node js from https://nodejs.org/en/download/

```bash
$ # Clone this repo and navigate to the cloned folder.
$ npm install
```

## Development

```bash
$ npm start
$ browser https://localhost:3000
```

## Donate

If you like this project - show your love! ❤️
It will push me to make improvements and more projects like this!

Eth Wallet:
```0x4Daa587303C6929CC5b8f3FdB6F82B177c642eEc```

BTC Wallet:
```1CfnSzzMonCUSfKGeDN2C87vX13hZEcFHJ```


If you'd like to see something added, create an issue or make a PR! 🚀

## TODO:
#### Features
- Depth for each step which impacts shadow.
- Have the step center variation rely on depth and a center point for the core which also has a depth.
- Interior elements inside of steps - like bridges, or columns inside of the shape.
- Combinations of multiple shapes which build a bigger shape.
- Custom imported shape or text to use as the initial shape.
- Multiple scattered shapes.
- Controls
  - A control for everything that is in random shape configs `src/utils/shapes`.
  - Ability to lock certain controls when randomizing.
- Animations
- Colors
  - More sources and curated.
  - Gradients with changing step darkness kind of thing.
#### Code
- Clean up `src/utils/steps/polygon.js` - It could use a lot of love lol. (See `curves.js`).
- Make it mobile friendly.
- Use 'greiner-hormann' or another lib - not clipper - for polygon boolean operation.
- Clean up the SVG code - `src/components/svg/shape/index.js` and `src/components/path/index.js`
- 
