import { getJestProjectsAsync } from "@nx/jest";
import { pathsToModuleNameMapper } from "ts-jest";

export default async () => ({
  projects: await getJestProjectsAsync(),
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@cynaps/core": ["libs/core/src/index.ts"],
      "@cynaps/datamanager": ["libs/datamanager/src/index.js"],
      "@cynaps/editor": ["libs/editor/src/index.js"],
      "@cynaps/frontend-test/*": ["libs/frontend-test/src/*"],
      "@cynaps/ui": ["libs/ui/src/index.ts"],
      "@cynaps/icons": ["libs/ui/src/assets/icons"],
      "@cynaps/shad/*": ["./libs/ui/src/shad/*"],
    },
    { prefix: "<rootDir>/../../" },
  ),
});

