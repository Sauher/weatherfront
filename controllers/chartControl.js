async function InitChart(theme) {
  // Define your dark and light theme configurations
  const darkTheme = {
    backgroundColor: "#212529",
    fontColor: "#FFFFFF",
    axisXFontColor: "#FFFFFF",
    axisYFontColor: "#FFFFFF",
    toolTipBackgroundColor: "#333333",
    minMaxColor: "#FFFFFF",
    markerColorMin: "#00BFFF",
    markerColorMax: "#FF6347"
  };

  const lightTheme = {
    backgroundColor: "#F5F5F5",
    fontColor: "#000000",
    axisXFontColor: "#000000",
    axisYFontColor: "#000000",
    toolTipBackgroundColor: "#FFFFFF",
    minMaxColor: "#000000",
    markerColorMin: "#00BFFF",
    markerColorMax: "#FF6347"
  };

  // Define your data points
  let dataPoints = [
    { label: "Monday", y: [15, 26], name: "rainy" },
    { label: "Tuesday", y: [15, 27], name: "rainy" },
    { label: "Wednesday", y: [13, 27], name: "sunny" },
    { label: "Thursday", y: [14, 27], name: "sunny" },
    { label: "Friday", y: [15, 26], name: "cloudy" },
    { label: "Saturday", y: [17, 26], name: "sunny" },
    { label: "Sunday", y: [16, 27], name: "rainy" }
  ];

  // Add x value (CanvasJS needs it for position)
  dataPoints = dataPoints.map((dp, i) => ({ ...dp, x: i }));

  // Function to render the chart
  function renderChart(currentThemeConfig) {
    const chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Weekly Weather Forecast",
        fontColor: currentThemeConfig.fontColor
      },
      axisX: {
        labelFontColor: currentThemeConfig.axisXFontColor,
        interval: 1
      },
      axisY: {
        labelFontColor: currentThemeConfig.axisYFontColor,
        suffix: " °C",
        maximum: 40,
        gridThickness: 0
      },
      backgroundColor: currentThemeConfig.backgroundColor,
      toolTip: {
        shared: true,
        backgroundColor: currentThemeConfig.toolTipBackgroundColor,
        contentFormatter: function (e) {
          const rangeEntry = e.entries.find(entry => entry.dataSeries.type === "rangeSplineArea");
          if (!rangeEntry) return "";

          const dp = rangeEntry.dataPoint;
          const min = dp.y[0];
          const max = dp.y[1];
          const label = dp.label;

          const minColor = `<span style='color:${currentThemeConfig.minMaxColor};'>Min: ${min}°</span>`;
          const maxColor = `<span style='color:${currentThemeConfig.minMaxColor};'>Max: ${max}°</span>`;

          return label + "<br>" + minColor + "<br>" + maxColor;
        }
      },
      data: [
        {
          type: "rangeSplineArea",
          fillOpacity: 0.2,
          color: currentThemeConfig.minMaxColor,
          dataPoints: dataPoints
        },
        {
          type: "scatter",
          showInLegend: false,
          markerType: "circle",
          markerSize: 6,
          markerColor: currentThemeConfig.markerColorMin,
          dataPoints: dataPoints.map(dp => ({
            x: dp.x,
            y: dp.y[0], // Min temp
            indexLabel: `${dp.y[0]}°`,
            indexLabelFontColor: currentThemeConfig.markerColorMin,
            indexLabelFontSize: 14,
            indexLabelPlacement: "outside"
          }))
        },
        {
          type: "scatter",
          showInLegend: false,
          markerType: "circle",
          markerSize: 6,
          markerColor: currentThemeConfig.markerColorMax,
          dataPoints: dataPoints.map(dp => ({
            x: dp.x,
            y: dp.y[1], // Max temp
            indexLabel: `${dp.y[1]}°`,
            indexLabelFontColor: currentThemeConfig.markerColorMax,
            indexLabelFontSize: 14,
            indexLabelPlacement: "outside"
          }))
        }
      ]
    });

    chart.render();
    addImages(chart); // Call the function to add images after the chart is rendered
  }

  // Call initial render with current theme
  const currentThemeConfig = theme === "dark" ? darkTheme : lightTheme;
  renderChart(currentThemeConfig);

  // Add weather icons and position them correctly
  function addImages(chart) {
    const images = [];

    for (let i = 0; i < dataPoints.length; i++) {
      const name = dataPoints[i].name;
      let src = "";

      // Set the correct image URL based on weather condition
      if (name === "cloudy") {
        src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png";
      } else if (name === "rainy") {
        src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png";
      } else if (name === "sunny") {
        src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png";
      }

      const img = $("<img>")
        .attr("src", src)
        .attr("class", name)
        .css("position", "absolute")
        .width("40px");

      images.push(img);
      img.appendTo($("#chartContainer>.canvasjs-chart-container"));
      positionImage(img, i, chart); // Position the image correctly after appending it
    }
  }

  // Correctly position the images on the chart based on X and Y axis values
  function positionImage(image, index, chart) {
    const imageCenter = chart.axisX[0].convertValueToPixel(dataPoints[index].x);
    const imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

    image.css({
      left: imageCenter - 20 + "px", // Centering image horizontally
      top: imageTop + "px"            // Positioning image vertically based on max Y value
    });
  }

  // Reposition images on window resize
  $(window).resize(function () {
    const counters = { cloudy: 0, rainy: 0, sunny: 0 };
    
    // Recalculate image positions after window resize
    for (let i = 0; i < dataPoints.length; i++) {
      const xPixel = chart.axisX[0].convertValueToPixel(dataPoints[i].x) - 20; // Adjust for image width
      const name = dataPoints[i].name;

      // Adjust image position based on class name (weather condition)
      $("." + name).eq(counters[name]++).css({ left: xPixel + "px" });
    }
  });

}
