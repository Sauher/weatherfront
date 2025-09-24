async function InitChart(theme) {
  // Theme configurations
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

  // Fetch weather data
  let data = await getWeatherData();
  data.sort((a,b) => new Date(a.date) - new Date(b.date))

  // Format dataPoints
  let dataPoints = data.map((wdata, i) => ({
    label: wdata.date,
    y: [Number(wdata.minmax[0]), Number(wdata.minmax[1])],
    name: wdata.name,
    x: i
  }));

  // Store chart reference for global access (e.g. in resize handler)
  let chart;

  // Render chart
  function renderChart(currentThemeConfig) {
    chart = new CanvasJS.Chart("chartContainer", {
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
            y: dp.y[0],
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
            y: dp.y[1],
            indexLabel: `${dp.y[1]}°`,
            indexLabelFontColor: currentThemeConfig.markerColorMax,
            indexLabelFontSize: 14,
            indexLabelPlacement: "outside"
          }))
        }
      ]
    });

    chart.render();
    addImages(chart); // Add weather icons after rendering
  }

  // Initial render
  const currentThemeConfig = theme === "dark" ? darkTheme : lightTheme;
  renderChart(currentThemeConfig);

  // Add weather icons above each data point
  function addImages(chart) {
    // Remove old icons if re-rendered
    $(".weather-icon").remove();

    for (let i = 0; i < dataPoints.length; i++) {
      const name = dataPoints[i].name;
      let src = "";

      switch (name) {
        case "cloudy":
          src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png";
          break;
        case "rainy":
          src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png";
          break;
        case "sunny":
          src = "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png";
          break;
        case "storm":
          src = "./images/storm.png";
          break;
        case "snowy":
          src = "./images/snow.png";
          break;
        case "foggy":
          src = "./images/foggy.png";
          break;
      }

      const img = $("<img>")
        .attr("src", src)
        .attr("class", `weather-icon ${name}`)
        .attr("data-index", i)
        .css("position", "absolute")
        .width("40px");

      img.appendTo($("#chartContainer>.canvasjs-chart-container"));
      positionImage(img, i, chart);
    }
  }

  // Position an image above a data point
  function positionImage(image, index, chart) {
    const imageCenter = chart.axisX[0].convertValueToPixel(dataPoints[index].x);
    const imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

    image.css({
      left: imageCenter - 20 + "px", // center horizontally
      top: imageTop + "px" // top edge
    });
  }

  // On resize, reposition images
  $(window).off("resize.weatherIcons").on("resize.weatherIcons", function () {
    $(".weather-icon").each(function () {
      const index = parseInt($(this).attr("data-index"));
      if (!isNaN(index)) {
        positionImage($(this), index, chart);
      }
    });
  });
}
