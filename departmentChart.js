/** @format */
var meWhenISeeD3 = "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyE/giphy.gif";

function genDepartmentChart(semNum, name) {
  mainGraph.selectAll("*").remove();
  var object = document.getElementById("search");
  var object2 = document.getElementById("searchTitle");

  object.style.display = "block";
  object2.style.display = "block";
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
        top: 20,
        right: 10,
        bottom: 100,
        left: 100,
      },
    };
    var dataset = files[semNum];
    var courses = {};

    var oldDataset = dataset;
    for (course in dataset) {
      if (
        dataset[course].Course !== undefined &&
        dataset[course].Course !== "" &&
        convertPct(dataset[course]["P"]) === 0
      ) {
        courses[dataset[course].Course] = 1;
      }
    }
    // console.log(getMyLevels(dataset, "CPSC"));

    var temp = [];
    for (course in courses) {
      var condensed = condenseDepartment(dataset, course);

      temp.push({ course: course, gpa: condensed });
    }
    dataset = temp;

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
      .scaleLinear()
      .domain([0, 120])
      .range([0, dimensions.boundedWidth]);
    // .padding(0.1);

    var yScale = d3
      .scaleLinear()
      .domain([0, 4])
      .range([dimensions.boundedHeight, 0]);

    // generate bounds for the bar chart

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
      .attr("y", dimensions.height - 40)
      .attr("text-anchor", "middle")
      .text("Number of Courses Per Department in " + name);

    var bounds = svg
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    //generate primary bar chart
    var bars = bounds
      .selectAll("dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(getMyLevels(oldDataset, d.course));
      })
      // .attr("width", xScale.bandwidth)
      .attr("cy", function (d) {
        return yScale(d.gpa);
      })
      // .attr("height", function (d) {
      //   return dimensions.boundedHeight - yScale(d.gpa);
      // })
      .attr("r", 4)

      .attr("fill", function (d) {
        return smallScale(getMyLevels(oldDataset, d.course));
      })
      .on("click", function (d, i) {
        // console.log(scale(getMyLevels(oldDataset, i.course)));
        console.log(getMyLevels(oldDataset, i.course));

        genLevelChart(semNum, i.course);
        prevData[0] = semNum;
        prevData[1] = i.course;
      })
      .on("mouseover", function (d, i) {
        console.log(d3.select(this).style("opacity"));
        if (d3.select(this).style("opacity") !== "0") {
          genGradeChart(
            getDeptGrades(files[semNum], i.course),
            "#gradebarchart"
          );
          d3.select(this).attr("style", "fill: darkorange;");
          var bar = d3.select(this);
          var label = d3.select(this.parentNode).selectAll(".label").data([d]);
          label
            .enter()
            .append("text")
            .attr("class", "label")
            .merge(label)
            .text("Department: " + i.course + " GPA: " + d3.format(".3")(i.gpa))
            .style("display", null)
            .style("font", "15px times")
            .attr("text-anchor", "middle")
            .attr("x", bar.attr("cx"))
            .attr("y", bar.attr("cy") - 8);
        }
      })
      .on("mouseout", function (d, i) {
        if (d3.select(this).style("opacity") !== "0") {
          d3.select(this).attr("style", "outline: none;");
          d3.select(this.parentNode).selectAll(".label").remove();
        }
      });

    //generate secondary bar chart

    //create the x axis
    console.log(xScale.ticks());
    console.log(xScale.domain());
    var xAxis = d3
      .axisBottom(xScale)
      .tickValues([
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
        90, 95, 100, 105, 110, 115, 120,
      ]);

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
    d3.select("#goBack").on("click", function () {
      genSemesterChart();
    });
    var inputField = d3.select("#search");

    inputField.on("input", function () {
      // Get the keyword entered by the user
      var keyword = this.value;

      // Filter the data using the keyword
      var filteredData = filterData(dataset, keyword);
      bars
        .transition()
        .duration(500)
        .style("opacity", function (d) {
          if (filteredData.includes(d)) {
            return 1;
          } else {
            return 0;
          }
        });
    });

    mainGraph = svg;
    currentChart = 1;
  });

  function condenseDepartment(semester, department) {
    let total = 0;
    let courseCount = 0;
    for (let i = 0; i < semester.length; i++) {
      if (
        semester[i].Course === department &&
        convertPct(semester[i]["P"]) === 0
      ) {
        total += condenseCourse(semester[i]);
        courseCount++;
      }
    }
    total /= courseCount;

    return total;
  }
}

function convertPct(myValue) {
  return +myValue.replace("%", "");
}

function filterData(data, keyword) {
  return data.filter(function (d) {
    return d.course.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  });
}
