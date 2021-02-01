module.exports = {
  ci: {
    upload: {
      target: "filesystem",
      outputDir: ".lighthousereports",
    },
    collect: {
      staticDistDir: "out",
    },
  },
};
