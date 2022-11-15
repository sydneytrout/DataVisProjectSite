/** @format */

Promise.all([
  d3.csv("refined_data/2013f.csv"),
  d3.csv("refined_data/2014f.csv"),
  d3.csv("refined_data/2014s.csv"),
  d3.csv("refined_data/2015f.csv"),
  d3.csv("refined_data/2015s.csv"),
  d3.csv("refined_data/2016f.csv"),
  d3.csv("refined_data/2016s.csv"),
  d3.csv("refined_data/2017f.csv"),
  d3.csv("refined_data/2017s.csv"),
  d3.csv("refined_data/2018f.csv"),
  d3.csv("refined_data/2018s.csv"),
  d3.csv("refined_data/2019f.csv"),
  d3.csv("refined_data/2019s.csv"),
  d3.csv("refined_data/2020f.csv"),
  d3.csv("refined_data/2020s.csv"),
  d3.csv("refined_data/2021f.csv"),
  d3.csv("refined_data/2021s.csv"),
  d3.csv("refined_data/2022s.csv"),
]).then(function (files) {
  // for (file in files) {
  //   console.log(files[file]);
  // }
  for (file in files) {
    console.log("final: ", condneseSemester(files[file]));
  }
  //dimensions constant
  const dimensions = {
    width: 11000,
    height: 600,
    margin: {
      top: 10,
      bottom: 100,
      right: 10,
      left: 50,
    },
  };
  var dataset = files[0];

  // delete dataset["columns"];
  // for (item in dataset) {
  //   if (dataset[item].Instructor === "") {
  //     console.log(item);
  //     console.log(dataset[item]);
  //   }
  // }

  //retrieve data being displayed
  var yAccessor = (d) => {
    // console.log(d["A"]);
    // console.log(convertPct(d["A"]));
    return convertPct(d["A"]);
  };

  //generate initial plane to graph the things on
  var svg = d3
    .select("#barchart")
    .attr(
      "width",
      dimensions.width + dimensions.margin.left + dimensions.margin.right
    )
    .attr(
      "height",
      dimensions.height + dimensions.margin.top + dimensions.margin.bottom
    )
    .append("g")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    );

  // create the x and y scales
  var xScale = d3
    .scaleBand() //all bars are same width
    .range([0, dimensions.width]) //horizontal literal width
    .domain(d3.map(dataset, (d) => d.Instructor)) //horizontal points being marked
    .padding(0.1); //how  w i d e  are the *gaps* in the bars?

  console.log(yAccessor);
  var yScale = d3
    .scaleLinear() //the bar height is dynamic / linear
    .domain(d3.extent(dataset, yAccessor)) // max and min are based on data set used
    // .domain([0, 100000]) // max and min are based on data set used
    .range([dimensions.height, 0]);

  //generate bottom axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-65)")
    .style("text-anchor", "end");

  //generate left axis
  svg.append("g").call(d3.axisLeft(yScale));

  //make all the bars
  var myColor = "#a11640";
  svg
    .selectAll("bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.Instructor);
    })
    .attr("y", function (d) {
      // console.log(d.A);
      // console.log(convertPct(d.A));
      return yScale(convertPct(d.A));
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return dimensions.height - yScale(convertPct(d.A));
    })
    .attr("fill", myColor);
});

function convertPct(myValue) {
  return +myValue.replace("%", "");
}

function condneseSemester(semester) {
  let total = 0;
  for (let i = 0; i < semester.length; i++) {
    total += condenseCourse(semester[i]);
  }
  total /= semester.length;
  // console.log(semester.length);
  return total;
}

function condenseCourse(course) {
  let divisor =
    convertPct(course["A"]) +
    convertPct(course["B"]) +
    convertPct(course["C"]) +
    convertPct(course["D"]) +
    convertPct(course["F"]) +
    convertPct(course["W"]);
  if (divisor === 0) {
    divisor = 100;
  }
  let total =
    (convertPct(course["A"]) / divisor) * 4 +
    (convertPct(course["B"]) / divisor) * 3 +
    (convertPct(course["C"]) / divisor) * 2 +
    (convertPct(course["D"]) / divisor) * 1 +
    (convertPct(course["F"]) / divisor) * 0;

  return total;
}
