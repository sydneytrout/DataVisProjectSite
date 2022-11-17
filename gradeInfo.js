/** @format */
var semGradeGraph;
var deptGradeGraph;
var levelGradeGraph;
var profGradeGraph;

function gradeTotal(dataset, grade) {
  let Atotal = 0;
  for (let i = 0; i < dataset.length; i++) {
    Atotal += convertPct(dataset[i][grade]);
  }
  Atotal /= dataset.length;
  // console.log(semester.length);

  return Atotal;
}

function getDeptGrades(dataset, dept) {
  let deptCourses = [];
  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].Course === dept) {
      deptCourses.push(dataset[i]);
    }
  }
  // console.log(deptCourses);
  return deptCourses;
}
function getLevelGrades(dataset, level) {
  levelCourses = [];
  for (let i = 0; i < dataset.length; i++) {
    if (
      dataset[i] !== undefined &&
      Math.floor(dataset[i].Numbe / 1000 - 1).toString() === level
    ) {
      levelCourses.push(dataset[i]);
    }
  }
  return levelCourses;
}
function genGradeChart(dataset, htmlId) {
  if (semGradeGraph !== undefined && htmlId === "#gradebarchart") {
    semGradeGraph.selectAll("*").remove();
    deptGradeGraph?.selectAll("*").remove();
    levelGradeGraph?.selectAll("*").remove();
    profGradeGraph?.selectAll("*").remove();
  }
  if (deptGradeGraph !== undefined && htmlId === "#subGradebarchart") {
    deptGradeGraph.selectAll("*").remove();
    levelGradeGraph?.selectAll("*").remove();
    profGradeGraph?.selectAll("*").remove();
  }
  if (levelGradeGraph !== undefined && htmlId === "#subSubGradebarchart") {
    levelGradeGraph.selectAll("*").remove();
    profGradeGraph?.selectAll("*").remove();
  }
  if (profGradeGraph !== undefined && htmlId === "#subSubSubGradebarchart") {
    profGradeGraph.selectAll("*").remove();
  }
  const gradeList = ["A", "B", "C", "D", "F", "W", "P", "F(P)"];
  var gradeDist = [];
  for (let i = 0; i < gradeList.length; i++) {
    gradeDist.push({
      grade: gradeList[i],
      pct: gradeTotal(dataset, gradeList[i]),
    });
  }
  dataset = gradeDist;

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
  console.log(htmlId);
  var svg = d3
    .select(htmlId)
    .style("width", dimensions.width)
    .style("height", dimensions.height);

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  var xScale = d3
    .scaleBand()
    .domain(
      dataset.map(function (d) {
        console.log(d);
        return d.grade;
      })
    )
    .range([0, dimensions.boundedWidth])
    .padding(0.2);

  var yAccessor = (d) => {
    return d.pct;
  };

  var yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([dimensions.boundedHeight, 0]);

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
    .text("Average Percentage");

  var xLabel = svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height)
    .attr("text-anchor", "middle")
    .text("Grade");

  //generate primary bar chart
  var bars = bounds
    .selectAll("bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.grade);
    })
    .attr("width", xScale.bandwidth)
    .attr("y", function (d) {
      return yScale(d.pct);
    })
    .attr("height", function (d) {
      return dimensions.boundedHeight - yScale(d.pct);
    })
    .attr("fill", "steelblue")
    .on("mouseover", function (d, i) {
      d3.select(this).attr("style", "outline: solid black;");
      var bar = d3.select(this);
      var label = d3.select(this.parentNode).selectAll(".label").data([d]);
      console.log(i.pct);
      label
        .enter()
        .append("text")
        .attr("class", "label")
        .merge(label)
        .text(d3.format(".2%")(i.pct / 100))
        .style("display", null)
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle")
        .attr("x", +bar.attr("x") + +bar.attr("width") / 2)
        .attr("y", +bar.attr("y") - 6);
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("style", "outline: none;");
    });

  var xAxis = d3
    .axisBottom(xScale)
    .tickValues(
      xScale.domain().filter(function (d, i) {
        return i + 1;
      })
    )
    .tickFormat(function (d) {
      return d;
    })
    .tickSizeOuter(0);

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
  //spawn x axis
  if (htmlId === "#gradebarchart") {
    semGradeGraph = svg;
  }
  if (htmlId === "#subGradebarchart") {
    deptGradeGraph = svg;
  }
  if (htmlId === "#subSubGradebarchart") {
    levelGradeGraph = svg;
  }
  if (htmlId === "#subSubSubGradebarchart") {
    profGradeGraph = svg;
  }
}
