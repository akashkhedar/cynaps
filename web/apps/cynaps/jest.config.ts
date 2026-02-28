/* eslint-disable */
export default {
  displayName: "Cynaps",
  preset: "../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^apps/Cynaps/(.*)$": "<rootDir>/$1",
  },
  coverageDirectory: "../../coverage/apps/Cynaps",
};

