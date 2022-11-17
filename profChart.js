/** @format */

function genProfChart(data, courseLevel) {
  if (profGraph !== undefined) {
    profGraph.selectAll("*").remove();
  }
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
    var size = d3.min([window.innerWidth * 1.5, window.innerHeight * 1.5]);
    var divisor = data[courseLevel].length;
    // console.log(divisor);
    if (divisor > 7) {
      myWidth = 50 * divisor;
    } else {
      myWidth = size / 2;
    }
    var dimensions = {
      width: myWidth,
      height: size / 3,
      margin: {
        top: 10,
        right: 10,
        bottom: 100,
        left: 100,
      },
    };

    var dataset = data[courseLevel];
    // console.log(dataset);
    for (course in dataset) {
      dataset[course].gpa = condenseCourse(dataset[course]);
    }

    // console.log(dataset);

    var svg = d3
      .select("#subSubSubBarchart")
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
          return d;
        })
      )
      .range([0, dimensions.boundedWidth])
      .padding(0.1);

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
      .text("Professors");

    //generate primary bar chart
    var bars = bounds
      .selectAll("bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d);
      })
      .attr("width", xScale.bandwidth)
      .attr("y", function (d) {
        return yScale(d.gpa);
      })
      .attr("height", function (d) {
        return dimensions.boundedHeight - yScale(d.gpa);
      })
      .attr("fill", "steelblue")
      .on("mouseover", function (d, i) {
        genGradeChart([i], "#subSubSubGradebarchart");
        d3.select(this).attr("style", "outline: solid black;");
        var bar = d3.select(this);
        var label = d3.select(this.parentNode).selectAll(".label").data([d]);
        label
          .enter()
          .append("text")
          .attr("class", "label")
          .merge(label)
          .text(d3.format(".3")(i.gpa))
          .style("display", null)
          .style("font", "10px sans-serif")
          .attr("text-anchor", "middle")
          .attr("x", +bar.attr("x") + +bar.attr("width") / 2)
          .attr("y", +bar.attr("y") - 6);
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
        return d.Instructor;
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
      .attr("transform", "rotate(-35)");

    //create the yAxis
    var yAxis = d3.axisLeft(yScale);
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
    profGraph = svg;
  });
}
