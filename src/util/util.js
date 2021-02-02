const areas = {
  core: "core",
  handstand: "handstand",
  mobility: "mobility",
  flow: "flow",
  warmup: "warmup",
  misc: "misc",
};

const areaNames = Object.values(areas);

const getArea = (str = "misc") => areas[str.toLowerCase()] || areas.misc;

export { areas, getArea, areaNames };
