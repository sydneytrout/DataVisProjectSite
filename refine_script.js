/** @format */

d3.csv("./data/Fall2020GradeReportRev.csv").then(function (dataset) {
  console.log(dataset);
  for (item in dataset) {
    if (
      !dataset[item]?.Instructor ||
      dataset[item].Course?.length > 4 ||
      dataset[item].Course === "" ||
      dataset[item].Instructor?.includes("%") ||
      dataset[item].Instructor === ""
    ) {
      delete dataset[item];
    }
  }
  for (item in dataset) {
    if (dataset[item].Instructor === "") {
      console.log(item);
      console.log(dataset[item]);
    }
  }
  console.log(dataset);

  headings = [
    "Course",
    "Number",
    "Section",
    "Course Title",
    "A",
    "B",
    "C",
    "D",
    "F",
    "P",
    "F(P)",
    "W",
    "Instructor",
    "Honor",
  ];

  var items = dataset;
  const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");
  const withoutLineBreaks = csv.replace(/\n\s*\n/g, "\n");
  console.log(withoutLineBreaks);
  // console.log(csv);
});
