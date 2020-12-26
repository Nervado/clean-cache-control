module.exports = {
  roots: ["<rootDir/scr"],
  testEnviroment: "/node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
