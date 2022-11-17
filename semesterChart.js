/** @format */
var departmentGraph;
var courseGraph;
var profGraph;
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
  dataset[0].name = "2013 Fall";
  dataset[1].name = "2014 Fall";
  dataset[2].name = "2014 Spring";
  dataset[3].name = "2015 Fall";
  dataset[4].name = "2015 Spring";
  dataset[5].name = "2016 Fall";
  dataset[6].name = "2016 Spring";
  dataset[7].name = "2017 Fall";
  dataset[8].name = "2017 Spring";
  dataset[9].name = "2018 Fall";
  dataset[10].name = "2018 Spring";
  dataset[11].name = "2019 Fall";
  dataset[12].name = "2019 Spring";
  dataset[13].name = "2020 Fall";
  dataset[14].name = "2020 Spring";
  dataset[15].name = "2021 Fall";
  dataset[16].name = "2021 Spring";
  dataset[17].name = "2022 Spring";

  console.log(dataset[0]);

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
    .attr("y", 6)
    .attr("x", -150)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average GPA");

  var xLabel = svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height)
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
      genSemesterChart(i.semester);
    })
    .on("mouseover", function (d, i) {
      genGradeChart(dataset[i.semester], "#gradebarchart");
      d3.select(this).attr("style", "outline: solid black;");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("style", "outline: none;");
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
  var yAxis = d3.axisLeft(yScale);
  //spawn y axis
  var changing_axis = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    )
    .call(yAxis);

  //functions for swapping the chart style
  d3.select("#zoom").on("click", function () {
    let myCoolExtent = d3.extent(dataset, yAccessor);
    myCoolExtent[0] -= 0.01;
    yScale = d3
      .scaleLinear()
      .domain(myCoolExtent)
      .range([dimensions.boundedHeight, 0]);
    yAxis = d3.axisLeft(yScale);
    changing_axis.transition().call(yAxis);
    bars
      .transition()
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
      .style("fill", "steelblue");
  });
  d3.select("#scale").on("click", function () {
    yScale = d3
      .scaleLinear()
      .domain([0, 4])
      .range([dimensions.boundedHeight, 0]);
    yAxis = d3.axisLeft(yScale);
    changing_axis.transition().call(yAxis);
    bars
      .transition()
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
      .style("fill", "steelblue");
  });
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
