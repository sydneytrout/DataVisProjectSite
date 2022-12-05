/** @format */
var mainGraph;
var currentChart = 0;
const smallScale = d3
  .scaleLinear([0, 60], ["lightgrey", "purple"])
  .interpolate(d3.interpolateRgb.gamma(1.9));
var prevData = [];
// const bigScale = d3
//   .scaleLinear([60, 150], ["purple", "orange"])
//   .interpolate(d3.interpolateRgb.gamma(1.9));
function genSemesterChart() {
  var object = document.getElementById("search");
  var object2 = document.getElementById("searchTitle");

  object.style.display = "none";
  object2.style.display = "none";
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
    //dimensions constant
    if (mainGraph != undefined) {
      mainGraph.selectAll("*").remove();
    }
    var size = d3.min([window.innerWidth * 1.5, window.innerHeight * 1.5]);

    var dimensions = {
      width: size / 2,
      height: size / 3,
      margin: {
        top: 10,
        right: 10,
        bottom: 100,
        left: 100,
      },
    };
    var dataset = [];
    for (file in files) {
      dataset.push(files[file]);
      dataset[file].semester = file;
      dataset[file].gpa = condneseSemester(files[file]);
    }
    dataset[0].name = "Fall 2013";
    dataset[1].name = "Fall 2014";
    dataset[2].name = "Spring 2014";
    dataset[3].name = "Fall 2015";
    dataset[4].name = "Spring 2015";
    dataset[5].name = "Fall 2016";
    dataset[6].name = "Spring 2016";
    dataset[7].name = "Fall 2017";
    dataset[8].name = "Spring 2017";
    dataset[9].name = "Fall 2018";
    dataset[10].name = "Spring 2018";
    dataset[11].name = "Fall 2019";
    dataset[12].name = "Spring 2019";
    dataset[13].name = "Fall 2020";
    dataset[14].name = "Spring 2020";
    dataset[15].name = "Fall 2021";
    dataset[16].name = "Spring 2021";
    dataset[17].name = "Spring 2022";

    // console.log(dataset[0]);

    // generate initial planes
    var svg = d3
      .select("#barchart")
      .style("width", dimensions.width)
      .style("height", dimensions.height);

    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.right - dimensions.margin.left;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    // set up scales
    var xScale = d3
      .scaleBand()
      .domain(
        dataset.map(function (d) {
          return d.semester;
        })
      )
      .range([0, dimensions.boundedWidth])
      .padding(0.2);

    var yAccessor = (d) => {
      return d.gpa;
    };

    var yScale = d3
      .scaleLinear()
      .domain([0, 4])
      .range([dimensions.boundedHeight, 0]);

    // generate bounds for the bar chart
    var bounds = svg
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    // create x and y labels
    var yLabel = svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("y", 30)
      .attr("x", -150)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Average GPA");

    var xLabel = svg
      .append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.height - 15)
      .attr("text-anchor", "middle")
      .text("Semester");

    //generate primary bar chart
    var bars = bounds
      .selectAll("bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d.semester);
      })
      .attr("width", xScale.bandwidth)
      .attr("y", function (d) {
        return yScale(d.gpa);
      })
      .attr("height", function (d) {
        return dimensions.boundedHeight - yScale(d.gpa);
      })
      .attr("fill", "steelblue")
      .on("click", function (d, i) {
        prevData[2] = i.semester;
        prevData[3] = i.name;
        genDepartmentChart(i.semester, i.name);
      })
      .on("mouseover", function (d, i) {
        genGradeChart(dataset[i.semester], "#gradebarchart");
        d3.select(this).attr("style", "outline: solid black;");
        var bar = d3.select(this);
        var label = d3.select(this.parentNode).selectAll(".label").data([d]);
        label
          .enter()
          .append("text")
          .attr("class", "label")
          .merge(label)
          .text("GPA: " + d3.format(".3")(i.gpa))
          .style("display", null)
          .style("font", "12px times")
          .attr("text-anchor", "middle")
          .attr("x", +bar.attr("x") + +bar.attr("width") / 2)
          .attr("y", +bar.attr("y") - 6);
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("style", "outline: none;");
        d3.select(this.parentNode).selectAll(".label").remove();
      });

    //generate secondary bar chart

    //create the x axis
    var xAxis = d3
      .axisBottom(xScale)
      .tickValues(
        xScale.domain().filter(function (d, i) {
          return i + 1;
        })
      )
      .tickFormat(function (d) {
        return dataset[d].name;
      })
      .tickSizeOuter(0);

    //spawn x axis
    svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          dimensions.margin.left +
          "," +
          (dimensions.boundedHeight + dimensions.margin.top) +
          ")"
      )
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    //create the yAxis
    var yAxis = d3.axisLeft(yScale).tickValues([0, 1, 2, 3, 4]);
    //spawn y axis
    var changing_axis = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          dimensions.margin.left +
          "," +
          dimensions.margin.top +
          ")"
      )
      .call(yAxis);

    //functions for swapping the chart style
    d3.select("#goBack").on("click", function () {
      console.log("lolnerd");
    });

    mainGraph = svg;
    currentChart = 0;
  });
}
genSemesterChart();

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
