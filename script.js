/** @format */

d3.csv("name-data.csv").then(function (data) {
  var nameSelected = "Betty";

  var size = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  var dimensions = {
    width: size,
    height: size / 3,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  var svg = d3
    .select("#barchart")
    .style("width", dimensions.width)
    .style("height", dimensions.height);

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  var xScale = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.year;
      })
    )
    .range([0, dimensions.boundedWidth])
    .padding(0.2);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(
        data.map(function (d) {
          return d[nameSelected];
        }),
        (s) => +s
      ),
    ])
    .range([dimensions.boundedHeight, 0]);

  var bounds = svg
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  var text = svg
    .append("text")
    .attr("id", "topbartext")
    .attr("x", 700)
    .attr("y", 20)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-family", "sans-serif")
    .text("Count per year: 0");

  var bars = bounds
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("width", xScale.bandwidth)
    .attr("y", function (d) {
      return yScale(d["Betty"]);
    })
    .attr("height", function (d) {
      return dimensions.boundedHeight - yScale(d["Betty"]);
    })
    .attr("fill", "steelblue")
    .on("mouseover", function (d, i) {
      console.log(d);
      console.log(i);
      text.text("Count per year: " + i[nameSelected]);
      d3.select(this).attr("style", "outline: solid black;");
    })
    .on("mouseout", function (d, i) {
      text.text("Count per year: 0");
      d3.select(this).attr("style", "outline: none;");
    });

  var xAxis = d3
    .axisBottom(xScale)
    .tickValues(
      xScale.domain().filter(function (d, i) {
        return !(i % 4);
      })
    )
    .tickSizeOuter(0);

  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        dimensions.margin.left +
        "," +
        (dimensions.boundedHeight + dimensions.margin.bottom / 4) +
        ")"
    )
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  var yAxis = d3.axisLeft(yScale);

  var changing_axis = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    )
    .call(yAxis);

  d3.select("#betty").on("click", function () {
    nameSelected = "Betty";
    yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.map(function (d) {
            return d[nameSelected];
          }),
          (s) => +s
        ),
      ])
      .range([dimensions.boundedHeight, 0]);
    yAxis = d3.axisLeft(yScale);
    changing_axis.transition().call(yAxis);

    bars
      .transition()
      .attr("x", function (d) {
        return xScale(d.year);
      })
      .attr("width", xScale.bandwidth)
      .attr("y", function (d) {
        return yScale(d[nameSelected]);
      })
      .attr("height", function (d) {
        return dimensions.boundedHeight - yScale(d[nameSelected]);
      })
      .style("fill", "steelblue");
  });

  d3.select("#linda").on("click", function () {
    nameSelected = "Linda";
    yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.map(function (d) {
            return d[nameSelected];
          }),
          (s) => +s
        ),
      ])
      .range([dimensions.boundedHeight, 0]);
    yAxis = d3.axisLeft(yScale);
    changing_axis.transition().call(yAxis);

    bars
      .transition()
      .attr("x", function (d) {
        return xScale(d.year);
      })
      .attr("width", xScale.bandwidth)
      .attr("y", function (d) {
        return yScale(d[nameSelected]);
      })
      .attr("height", function (d) {
        return dimensions.boundedHeight - yScale(d[nameSelected]);
      })
      .style("fill", "steelblue");
  });
});
