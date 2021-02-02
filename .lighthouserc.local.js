module.exports = {
  ci: {
    upload: {
      target: "filesystem",
      outputDir: ".lighthousereports",
    },
    assert: {
      preset: "lighthouse:no-pwa",
    },
    collect: {
      staticDistDir: "out",
    },
  },
};
