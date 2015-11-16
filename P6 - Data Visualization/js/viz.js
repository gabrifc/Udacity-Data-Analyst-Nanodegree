function viz(step) {
  /* Three accessory functions:
      1. Clean the bars.
      2. Transition the axis
      3. Draw the new bars
  */

  /* I should make use of update and exit() functions 
     I'll leave that for the next iteration when I know more d3.js */

  /* Declare the variables used through the script */
  var svgMargin = {top: 20, right: 20, bottom: 75, left: 80};
  var svgWidth = 1200 - svgMargin.left - svgMargin.right;
  var svgHeight = 450 - svgMargin.top - svgMargin.bottom;
  var transitionTime = 400;

  // Create the svg inside the #viz div and assign the variable and class chart
  var chart = d3.select("#viz svg")
    .attr("width", svgWidth + svgMargin.left + svgMargin.right)
    .attr("height", svgHeight + svgMargin.top + svgMargin.bottom)
    .attr('class', 'chart');

  function textAndButtons(step) {
    var stepText = ["From starting an irrational anti-vaccine or anti-GMO movement to causing the suicide of its authors, unfounded biomedical studies that end having to be retracted have important effects in our society. But how often and why a published article gets retracted? <strong>Let's analyze retractions in more depth.</strong>",
      'Every year, hundreds of thousands of scientific articles are published and indexed in <a href="http://www.ncbi.nlm.nih.gov/pubmed" target="_blank">PubMed</a>, an online database of biomedical literature. Currently, <strong>PubMed contains information about more than 25 million articles</strong>, of which more than a million were published only in 2014.',
      'Although all articles indexed in PubMed are <dfn title="Peer review is the evaluation of work by one or more people of similar competence to the producers of the work. (Wikipedia)">peer-reviewed</dfn> prior to publication, <strong>sometimes flawed articles end up being published. When the flaw is later discovered, the article gets retracted</strong>. <br>Since 1959, the year that the first retracted publication indexed in PubMed was published, a little more than 4000 publications have been retracted, but the rate of retractions is increasing.',
      "That is, <strong>of 25 million of biomedical publications, only 4000 – a 0.00016% – have been proven to be flawed, and retracted</strong>. In fact, the dimensions are so divergent that to fit both numbers in a graph we have to use a logarithmic scale… which sadly distorts the comparison scales in our heads.<br>But enough of dimensions, what are the reasons for retracting an article?",
      'According to the <a href="http://www.ala.org/acrl/sites/ala.org.acrl/files/content/conferences/confsandpreconfs/national/2011/papers/retracted_publicatio.pdf" target="_blank">Budd <i>et al.</i> (2009)</a> study, where 1,112 retracted articles were analyzed, <strong>the top reasons for article retraction are proven and presumed misconduct, unreproducibility and study errors with data or methods</strong>.<br>Unfortunately, while some of these flaws are discovered and resolved fast, others can take several months to discover.',
      'Recently, <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0068397" target="_blank">Steen <i>et al.</i> (2013)</a> analyzed <strong>the time it takes flawed articles to retract: an average of 32.91 months</strong>, although the time-to-retraction is decreasing. As expected, the time it takes an article to be retracted depends on the nature of the retraction, among other causes.<br>You can explore the diversity in the time-to-retraction of specific articles below.',
      'Sadly, according to Budd <i>et al.</i> (2009), <strong>retracted articles continue to be cited in a positive manner, causing irreparable damage to science and society</strong>. For example, the third retracted article with most citations is the (in)famous article by Wakefield et al linking vaccines to autism.<br/>Now is your time to learn more about the most influential biomedical retractions.'];
    // Change the text depending on the step
    d3.select('.text').html(stepText[step]);

    var chartTitle = ["", 
      "Number of publications indexed in PubMed per year",
      "Number of biomedical article retractions per year",
      "Comparison of biomedical articles published and retracted per year",
      "Reasons for article retraction (Budd <i>et al.</i> 2009)",
      "Relation of article publication and retraction times",
      "Top retracted articles with most citations"]
    d3.select('.chartTitle').html(chartTitle[step]);

    /* Buttons for every step */
    if (step === 0) {
      d3.select('.next--active')
        .classed('next--active', false)
        .attr('class', 'next')
        .text("Let's go!");
      d3.select('.back--active')
        .classed('back--active', false)
        .attr('class', 'back')
        .text('');
    } else if (step === 1) {
      d3.select('.next')
        .classed('next', false)
        .attr('class', 'next--active')
        .text('Next');
      d3.select('.back')
        .attr('class', 'back--active')
        .text('Back');
    } else if (step === 5) {
      d3.select('.finished')
        .classed('finished', false)
        .attr('class', 'next--active')
        .text('Next');
    } else if (step === 6) {
      d3.select('.next--active')
        .classed('next--active', false)
        .attr('class', 'finished')
        .text('');
    }
  }

  function cleanCanvas() {
    // Remove the tooltips
    d3.selectAll('.d3-tip').remove();
    d3.selectAll('.horizontalBarValue').remove();
    d3.selectAll('.horizontalBarText').remove();
    // Transition all vertical bars to 0
    chart.selectAll('.verticalBar rect')
      .transition()
      .duration(transitionTime)
      .ease('sin-in-out')
      .attr('height', 0)
      .attr('y', svgHeight);
    // Transition all horizontal bars to 0
    chart.selectAll('.horizontalBar rect')
      .transition()
      .duration(transitionTime)
      .ease('sin-in-out')
      .attr('width', 0)
    // Wait for the transition and remove the bars
    d3.selectAll('.bars')
      .transition()
      .delay(transitionTime + 1)
      .remove();
    // Delete the arcs
    d3.selectAll('.arcs').remove();
    d3.selectAll('.chartInfo').remove();
  }

  function transitionAxis(xAxis, yAxis, yLegend) {
    // if Axis are not passed, delete.
    if (xAxis != null) {
    // xAxis
      chart.select('.x')
        .transition()
        .duration(transitionTime)
        .ease('sin-in-out')
        .call(xAxis);

    } else {
      chart.selectAll('.x').remove()
    }
    if (yAxis != null) {
      // yAxis
      chart.selectAll('.y')
        .transition()
        .duration(transitionTime)
        .ease('sin-in-out')
        .call(yAxis);
    } else {
      chart.selectAll('.y').remove()
    }
    // The legend
    chart.select('.yAxisText').remove();

    if (yLegend != null) {
      chart.select('.y')
        .append("text")
          .attr('class', 'yAxisText')
          .attr("transform", "rotate(-90)")
          .attr("y", 11)
          .attr("dy", ".71em")
          .attr("dx", "-6em")
          .style("text-anchor", "end")
          .text(yLegend);
    }
  }

  function drawVerticalBarChart(data, xScale, yScale, barWidth, tip, htmlClass) {
    // data from d.x and d.y
    // If we pass d.z, grouped bar chart.
    // htmlClass is an array!

    chart.call(tip);
    var bars = chart.append('g')
      .attr('class', 'bars')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      // Show and hide tip on mouse events
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr('class', 'verticalBar');
      
    // With x positioning or not? Decided here!
    if (xScale != null) {
      bars.attr('transform', function (d, i) { return 'translate(' + (xScale(d.x)- barWidth/2 ) + ', 0)'; });
      
      bars.append('rect')
        .attr('width', barWidth - 2)
        .attr('class', 'verticalBarRect ' + htmlClass[0] + '')
        .attr('height', 0)
        .attr('y', svgHeight)
        // The transition
        .transition()
        .duration(200)
        .delay(function (d, i) {return i * 20; })
        .attr('y', function(d) {return yScale(d.y);})
        .attr('height', function(d) { return svgHeight - yScale(d.y); });

    } else {
      // Hard coding...
      bars.attr('transform', function (d, i) { return 'translate(' + (svgMargin.left + i * ((svgWidth - svgMargin.left - svgMargin.right) / data.length)) + ', 0)'; });

      bars.append('a')
        .attr('xlink:href', function(d) {return 'http://www.ncbi.nlm.nih.gov/pubmed/' + d.pmid + ''; })
        .attr('target', '_blank')
        .append('rect')
        .attr('width', barWidth - 2)
        .attr('class', 'verticalBarRect ' + htmlClass[0] + '')
        .attr('height', 0)
        .attr('y', svgHeight)
        // The transition
        .transition()
        .duration(200)
        .delay(function (d, i) {return i * 20; })
        .attr('y', function(d) {return yScale(d.y);})
        .attr('height', function(d) { return svgHeight - yScale(d.y); });
    }

    if (data[0].z) {
      // Grouped bar chart
      bars.attr('class', 'verticalBar combinedBar')

      bars.selectAll('rect')
        .attr('width', barWidth/2 )
      
      bars.append('rect')
        .attr('width', barWidth/2 )
        .attr('class', 'verticalBarRect ' + htmlClass[1] + '')
        .attr('transform', function (d, i) { return 'translate(' + barWidth/2 + ', 0)'; })
        .attr('height', 0)
        .attr('y', svgHeight)
        // The transition
        .transition()
        .duration(200)
        .delay(function (d, i) {return i * 20; })
        .attr('y', function(d) {return yScale(d.z);})
        .attr('height', function(d) { return svgHeight - yScale(d.z); });
    }
    if (xScale === null) {
      bars.append("text")
        .attr('class', 'verticalBarValue')
        .style("text-anchor", "middle")
        .attr("x", (barWidth / 2 - 2))
        .attr('y', function(d) {return yScale(d.y);})
        .attr("dy", "1em")
        .text(function(d) { return d.y; });
    }
  }

  function drawHorizontalBarChart(data, xScale, paddingLeft, barHeight, htmlClass) {
    var bars = chart.append('g')
      .attr('class', 'bars')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', function (d, i) { return 'translate(' + (svgMargin.left + paddingLeft) +',' + (svgMargin.top + i * barHeight) +')'; }) // Move to the X postion
      // Show and hide tip on mouse events
      .attr('class', 'horizontalBar');

    bars.append('rect')
      .attr('class', 'horizontalBarRect ' + htmlClass[0] + '')
      .attr('width', 0)
      .attr("height", barHeight - 1)
      .transition()
      .duration(transitionTime)
      .delay(function (d, i) {return i * 20; })
      .attr('width', function(d) { return xScale(d.x); });

    // The text on the left
    bars.append("text")
      .attr('class', 'horizontalBarText')
      .style("text-anchor", "end")
      .attr("x", -10)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.text; });

    // The text on the left
    bars.append("text")
      .attr('class', 'horizontalBarValue')
      .style("text-anchor", "end")
      .attr("x", function(d) { return xScale(d.x) - 5; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.x; });
  }

  function drawArcChart(data, xScale) {
    // The info. I like it INSIDE the svg.
    var chartInfo = chart.append('g')
      .attr('class', 'chartInfo')
      .attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");

      // The title
      chartInfo.append('text')
        .attr('class', 'arcInfoTitle');
      // The authors
      chartInfo.append('text')
        .attr('class', 'arcInfoAuthors')
        .attr("transform", "translate(0, 20)");
      // The journal
      chartInfo.append('text')
        .attr('class', 'arcInfoJournal')
        .attr("transform", "translate(0, 40)");
      // The publication date
      chartInfo.append('text')
        .attr('class', 'arcInfoPub')
        .attr("transform", "translate(0, 60)");
      // The retraction date
      chartInfo.append('text')
        .attr('class', 'arcInfoRet')
        .attr("transform", "translate(0, 80)");

    function showInfo(d) {
      d3.select('.arcInfoTitle')
        .html('<tspan style="font-weight: bold;">Title</tspan>: ' + d.title);
      d3.select('.arcInfoAuthors')
        .html('<tspan style="font-weight: bold;">Authors</tspan>: ' + d.authorString);
      d3.select('.arcInfoJournal')
        .html('<tspan style="font-weight: bold;">Journal</tspan>: ' + d.journalTitle);
      d3.select('.arcInfoPub')
        .html('<tspan style="font-weight: bold;">Published in</tspan>: ' + d.minPubDate);
      d3.select('.arcInfoRet')
        .html('<tspan style="font-weight: bold;">Retracted in</tspan>: ' + d.minRetDate);
    }

    // The paths.
    // I stole the r and ry values from bibviz :/.
    var arcs = chart.append('g')
      .attr('class', 'arcs')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', function(d) { return 'M ' + xScale(d.yStart) + ',' + svgHeight + ' A '+ ((xScale(d.yEnd) - xScale(d.yStart)) * 0.51) + ',' + Math.min(((xScale(d.yEnd) - xScale(d.yStart)) * 0.51), 490) + ' 0 0,1 ' + xScale(d.yEnd) + ',' + svgHeight + ''})
      .on('mouseover', function(d) {
        // Redrawing the arc is cheating but works and performs better to highlight instead of sorting.
        chart.append('path')
          .attr('class', 'arcSelected')
          .attr('d', d3.select(this).attr("d"));
        // And show the tooltips
        showInfo(d);
      })
      .on('mouseout', function(d) {
        chart.select('.arcSelected').remove();
      });
  }

  // Start the steps
  // Change the text and buttons
  textAndButtons(step);

  // And do the viz
  if (step === 0) {
    // Just clean
    cleanCanvas(step);
    // Delete axis if exist.
    var xAxis = null;
    var yAxis = null;
    transitionAxis(xAxis, yAxis);
  } else if (step >= 1 && step <= 3) {
    // Steps 1 to 3 have data & Axis in common.

    timeFormat = d3.time.format("%Y");

    d3.tsv("data/timeline.tsv", function(error, timeline) {
      timeline.forEach(function(d) {
        d.x = timeFormat.parse(d.year);
        d.y = +d.pubmed;
        d.ret = +d.ret;
      })

      // Year Axis
      var xExtent = d3.extent(timeline, function(d) {return d.x;});

      var xScale = d3.time.scale()
        .range([svgMargin.left, svgWidth - svgMargin.right])
        .domain(xExtent)

      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(20);

      var barWidth = (svgWidth - svgMargin.left - svgMargin.right) / timeline.length;

      var yLegend = 'Publications';

      if (step === 1) {
        // PubMed Publication Axis
        var yMax = d3.extent(timeline, function(d) {return d.y;})[1];

        var yScale = d3.scale.linear()
            .range([svgHeight, svgMargin.bottom])
            .domain([0, yMax]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        // The tooltips
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { return "Year: " + (d.x.getUTCFullYear()+1) + "<br/> Publications: " + d.pubmed; });

        var htmlClass = ['pubmedTimelineBar'];
        // Everything on place: clean, draw the axis and the bars.
        cleanCanvas();

        /* First step, create the axis */
        chart.append("g")
          .attr('class', 'axis x')
          .attr("transform", "translate(0," + svgHeight + ")")
          .call(xAxis);

        chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (svgMargin.left - barWidth/2 - 3) + ",0)")
          .call(yAxis);

        transitionAxis(xAxis, yAxis, yLegend);
        drawVerticalBarChart(timeline, xScale, yScale, barWidth, tip, htmlClass);

      } else if (step === 2) {
        // Remap the data
        timeline.forEach(function(d) {
          d.pubmed = +d.x;
          d.y = +d.ret;
        })

        var yExtent = d3.extent(timeline, function(d) {return d.y;});

        var yScale = d3.scale.linear()
            .range([svgHeight, svgMargin.bottom])
            .domain([0, yExtent[1]]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        // The tooltips
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { return "Year: " + (d.x.getUTCFullYear()+1) + "<br/> Retracted articles: " + d.y; });

        var htmlClass = ['retTimelineBar'];
        // Everything on place: clean, draw the axis and the bars.
        cleanCanvas();
        transitionAxis(xAxis, yAxis, yLegend);
        drawVerticalBarChart(timeline, xScale, yScale, barWidth, tip, htmlClass);

      } else if (step === 3) {
        // Remap the data
        timeline.forEach(function(d) {
          d.z = +d.ret;
        })

        var yExtent = d3.extent(timeline, function(d) {return d.y;});

        var yScale = d3.scale.log()
            .range([svgHeight, svgMargin.bottom])
            .domain([1, yExtent[1]]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        /* So the thing is: I'm using a log scale here, but some values are 0.
           I should convert the values to 1 in order to yScale without errors.
           But I don't know how to do it, and the graph renders correctly anyway.
           */

        var htmlClass = ['pubmedTimelineBar', 'retTimelineBar']

        // The tooltips
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { return "Year: " + (d.x.getUTCFullYear()+1) + "<br/> Publications: " + d.y + "<br/> Retracted articles: " + d.z; });
        
        // Everything on place: clean, draw the axis and the bars.
        cleanCanvas();

        chart.append("g")
          .attr('class', 'axis x')
          .attr("transform", "translate(0," + svgHeight + ")")
          .call(xAxis);

        chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (svgMargin.left - barWidth/2 - 3) + ",0)")
          .call(yAxis);
        
        transitionAxis(xAxis, yAxis, yLegend);

        drawVerticalBarChart(timeline, xScale, yScale, barWidth, tip, htmlClass);
      }

    });
  } else if (step === 4) {
    // New data: reasons for retractions. 
    // It is a horizontal bar chart so caution with x and y.
    d3.tsv("data/retractionReasons.tsv", function(error, reasons) {
      reasons.forEach(function(d) {
        d.text = d.reason;
        d.x = +d.number;
      })
      /* There's no y axis */
      var yAxis = null;

      var xExtent = d3.extent(reasons, function(d) {return d.x;});


      // There's a nice padding here for the text.
      var paddingLeft = 250;

      // So... I'm gonna up the range here. I know it's not proportional,
      // But more aestethically pleasant. 
      var xScale = d3.scale.linear()
        .range([10, svgWidth - svgMargin.right - svgMargin.left - paddingLeft])
        .domain([0, xExtent[1]]);

      var xAxis = null;

      var barHeight = (svgHeight - svgMargin.bottom) / reasons.length;
      var htmlClass = ['retTimelineBar'];

      // Everything on place: clean, draw the axis and the bars.
      cleanCanvas();
      transitionAxis(xAxis, yAxis);
      drawHorizontalBarChart(reasons, xScale, paddingLeft, barHeight, htmlClass);

    });
  } else if (step === 5 || step === 6) {
    // Final Data: article info and time to retraction.
    d3.tsv("data/tidyDataset.tsv", function(error, retractions) {
      yearFormat = d3.time.format("%Y");
      dayFormat = d3.time.format("%d-%m-%Y");
      retractions.forEach(function(d) {
        d.x = yearFormat.parse(d.pubYear);
        d.yStart = dayFormat.parse(d.minPubDate);
        d.yEnd = dayFormat.parse(d.minRetDate);      
      })

      if (step === 5) {
        /* There's no y axis */
        var yAxis = null;

        // x Axis
        var xExtent = d3.extent(retractions, function(d) {return d.x;});

        var xScale = d3.time.scale()
          .range([svgMargin.left, svgWidth - svgMargin.right])
          .domain(xExtent)

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(20);

        // Everything on place: clean, draw the axis and the arcs.
        cleanCanvas();

        /* Again, create the axis because we deleted them the last time */
        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + svgHeight + ")")
          .transition()
          .delay(transitionTime+1)
          .call(xAxis);

        transitionAxis(xAxis, yAxis);
        drawArcChart(retractions, xScale);

      } else if (step === 6) {
        // Remap the data
        retractions.forEach(function(d) {
          d.y = +d.citedByCount;
        });

        var retractions = retractions.sort(function(a,b) {
          if (a.y > b.y) {
            return -1;
          } else if (a.y < b.y) {
            return 1;
          }
          return 0;
        })

        retractions = retractions.slice(0,35)

        var yExtent = d3.extent(retractions, function(d) {return d.y;});

        var yScale = d3.scale.linear()
            .range([svgHeight, svgMargin.bottom])
            .domain([1, yExtent[1]]);

        var yLegend = 'Citations';

        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(10);

        var xAxis = null;
        var xScale = null;
        var barWidth = (svgWidth - svgMargin.left - svgMargin.right) / retractions.length;
        var htmlClass = ['retTimelineBar topRetractions'];
        // The tooltips
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { return "<strong>Title:</strong> " + d.title + "<br/><strong>First Author:</strong> " + d.firstAuthor + "<br/><strong>Months until retraction</strong>: " + d.monthsToRet; });

        // Everything on place: clean, draw the axis and the arcs.
        cleanCanvas();

        chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (svgMargin.left - barWidth/2 - 12) + ",0)")
          .call(yAxis);

        transitionAxis(xAxis, yAxis, yLegend);
        drawVerticalBarChart(retractions, xScale, yScale, barWidth, tip, htmlClass);
      }
    });
  }
}