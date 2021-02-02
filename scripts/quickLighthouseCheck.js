const fs = require("fs");

fs.readFile("./.lighthousereports/manifest.json", (err, content) => {
  if (err) {
    console.log("read err: ", err);
    return;
  } else {
    const json = JSON.parse(content);
    for (i = 0; i < json.length; i++) {
      if (json[i].isRepresentativeRun === true)
        if (
          json[i].summary.performance <= 0.9 ||
          json[i].summary.accessibility <= 0.9
        ) {
          console.log(`Warning for ${json[i].url}`);
          console.log(json[i].summary);
        }
    }
  }
});
