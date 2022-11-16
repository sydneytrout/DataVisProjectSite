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
  }
  //dimensions constant
  const dimensions = {
    width: 1500,
    height: 600,
    margin: {
      top: 10,
      bottom: 100,
      right: 10,
      left: 100,
    },
  };
  var dataset = [];
  var condensedSemesters;
  for (file in files) {
    dataset.push(files[file]);
    dataset[file].semester = file;
    dataset[file].condensed = condneseSemester(files[file]);
    console.log("final: ", dataset[file].condensed);
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
  for (file in dataset) {
    console.log(dataset[file].semester);
    console.log(dataset[file]);
  }

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
    return d.condensed;
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
    .domain(d3.map(dataset, (d) => d.semester)) //horizontal points being marked
    .padding(0.1); //how  w i d e  are the *gaps* in the bars?

  console.log(yAccessor);
  let myCoolExtent = d3.extent(dataset, yAccessor);
  myCoolExtent[0] -= 0.01;
  var yScale = d3
    .scaleLinear() //the bar height is dynamic / linear
    .domain(myCoolExtent) // max and min are based on data set used
    // have a button that does this
    //.domain([0, 4]) // max and min are based on data set used
    .range([dimensions.height, 0]);

  //generate bottom axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(
      d3.axisBottom(xScale).tickFormat(function (d, i) {
        return dataset[i].name;
      })
    )
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-65)")
    .style("text-anchor", "end");

  //generate left axis
  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", -(dimensions.height / 2))
    .attr("y", -dimensions.margin.left / 2)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Average GPA");

  svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height + dimensions.margin.bottom)
    .attr("text-anchor", "middle")
    .text("Semester");

  //make all the bars
  var myColor = "#a11640";
  svg
    .selectAll("bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.semester);
    })
    .attr("y", function (d) {
      // console.log(d.A);
      // console.log(convertPct(d.A));
      return yScale(d.condensed);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return dimensions.height - yScale(d.condensed);
    })
    .attr("fill", myColor);

  //4.0 button
  d3.select("#scale").on("click", function () {
    svg.selectAll("*").remove();
    var yScale = d3.scaleLinear().domain([0, 4]).range([dimensions.height, 0]);
    svg
      .append("g")
      .attr("transform", "translate(0," + dimensions.height + ")")
      .call(
        d3.axisBottom(xScale).tickFormat(function (d, i) {
          return dataset[i].name;
        })
      )
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-65)")
      .style("text-anchor", "end");

    //generate left axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", -(dimensions.height / 2))
      .attr("y", -dimensions.margin.left / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Average GPA");

    svg
      .append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.height + dimensions.margin.bottom)
      .attr("text-anchor", "middle")
      .text("Semester");

    var myColor = "#a11640";
    svg
      .selectAll("bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d.semester);
      })
      .attr("y", function (d) {
        // console.log(d.A);
        // console.log(convertPct(d.A));
        return yScale(d.condensed);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return dimensions.height - yScale(d.condensed);
      })
      .attr("fill", myColor);
  });

  //zoom button
  d3.select("#zoom").on("click", function () {
    svg.selectAll("*").remove();
    let myCoolExtent = d3.extent(dataset, yAccessor);
    myCoolExtent[0] -= 0.01;
    var yScale = d3
      .scaleLinear()
      .domain(myCoolExtent)
      .range([dimensions.height, 0]);
    svg
      .append("g")
      .attr("transform", "translate(0," + dimensions.height + ")")
      .call(
        d3.axisBottom(xScale).tickFormat(function (d, i) {
          return dataset[i].name;
        })
      )
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-65)")
      .style("text-anchor", "end");

    //generate left axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", -(dimensions.height / 2))
      .attr("y", -dimensions.margin.left / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Average GPA");

    svg
      .append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.height + dimensions.margin.bottom)
      .attr("text-anchor", "middle")
      .text("Semester");

    var myColor = "#a11640";
    svg
      .selectAll("bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d.semester);
      })
      .attr("y", function (d) {
        // console.log(d.A);
        // console.log(convertPct(d.A));
        return yScale(d.condensed);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return dimensions.height - yScale(d.condensed);
      })
      .attr("fill", myColor);
  });