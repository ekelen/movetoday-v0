module.exports = {
  ci: {
    upload: {
      target: "filesystem",
      outputDir: ".lighthousereports",
    },
    assert: {
      // preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
      },
    },
    collect: {
      staticDistDir: "out",
    },
  },
};
