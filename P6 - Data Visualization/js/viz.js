function viz(step) {
  /** 
  * @author gabrifc@gmail.com (Gabriel Forn-Cuní)
  * The function to generate all the charts and interactiveness of the 
  *     visualization.
  * There are 6 main accessory functions, each explained on its declaration: 
  * <ul>
  * <li>textAndButtons: implements all the accompanying text and buttons.
  * <li>cleanCanvas: to clean the canvas after each step.
  * <li>transitionAxis: takes care of drawing and transitioning the axis.
  * <li>drawVerticalBarChart: draws vertical bar charts.
  * <li>drawHorizontalBarChart: draws horizontal bar charts.
  * <li>drawArcChart: draws an arc chart.
  * </ul>
  * TODO: make use of update and exit() functions of d3.js.
  * TODO: fix log errors on step 3.
  */

  // Declare the variables used through the script: dimensions and transitions.
  var svgMargin = {top: 20, right: 20, bottom: 75, left: 80};
  var svgWidth = 1200 - svgMargin.left - svgMargin.right;
  var svgHeight = 450 - svgMargin.top - svgMargin.bottom;
  var transitionTime = 400;

  // Create the svg inside the #viz div and assign the variable and class chart.
  var chart = d3.select("#viz svg")
    .attr("width", svgWidth + svgMargin.left + svgMargin.right)
    .attr("height", svgHeight + svgMargin.top + svgMargin.bottom)
    .attr('class', 'chart');

  var textAndButtons = function(step) {
    /**
    * Takes care of the text and buttons at every step.
    * Variables: step.
    */

    // Change the main text
    var stepText = ['<p>Biomedical research is a key factor in our fight against human diseases and aging. Hundreds of thousands of articles regarding this topic are published each year. Unfortunately, the publication pressure for funding sometimes ends with scientists publishing unfounded studies or, directly, falsifying data.</p><p>Economically, <a href="http://www.nature.com/news/irreproducible-biology-research-costs-put-at-28-billion-per-year-1.17711" target="_blank">the cost of these studies is calculated to be more than $28 billion per year on the US alone</a>. At the social level, false conclusions form scientific studies can start an irrational <a href="https://en.wikipedia.org/wiki/Andrew_Wakefield" tagert="_blank">anti-vaccine</a> or <a href="https://en.wikipedia.org/wiki/S%C3%A9ralini_affair" target="_blank">anti-GMO</a> movement.</p><p>Needless to say, when the studies are found to be flawed, they get retracted, nulling its validity. The discoveries sometimes have major consequences, such as the suicide of the authors of the study. <strong>But how often, why, and which impact have retracted articles in science?</strong></p>',
      '<p>Every year, hundreds of thousands of scientific articles are published and indexed in <a href="http://www.ncbi.nlm.nih.gov/pubmed" target="_blank">PubMed</a>, an online database of biomedical literature. Currently, <strong>PubMed contains information about more than 25 million articles</strong>, of which more than a million were published only in 2014.</p>',
      '<p>Although all articles indexed in PubMed are <dfn title="Peer review is the evaluation of work by one or more people of similar competence to the producers of the work. (Wikipedia)">peer-reviewed</dfn> prior to publication, sometimes flawed articles end up being published. <strong>When the flaw is later discovered, the article gets retracted</strong>. Since 1959 (first retracted publication on PubMed), just a few more than 4000 publications have been retracted but, taking into account the time it takes to retract an article, the rate of retractions is increasing in the last years.</p>',
      "<p>That is, <strong>of 25 million of biomedical publications, only 4000 – a 0.00016% – have been proven to be flawed, and retracted</strong>. In fact, the dimensions are so divergent that to fit both numbers in a graph we have to use a logarithmic scale… which sadly distorts the comparison scales in our heads.<br>Nevertheless, articles get retracted. What are the reasons for doing so?</p>",
      '<p>According to the <a href="http://www.ala.org/acrl/sites/ala.org.acrl/files/content/conferences/confsandpreconfs/national/2011/papers/retracted_publicatio.pdf" target="_blank">Budd <i>et al.</i> (2009)</a> study, where 1,112 retracted articles were analyzed, <strong>the top reasons for article retraction are proven and presumed misconduct, unreproducibility and study errors with data or methods</strong>.<br>While some of these flaws are discovered and resolved fast, others can take several months to discover.</p>',
      '<p>Recently, <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0068397" target="_blank">Steen <i>et al.</i> (2013)</a> analyzed <strong>the time it takes flawed articles to retract: an average of 32.91 months</strong>, although the time-to-retraction is decreasing. Unfortunately, that is still enough time to impact science and society. As expected, the time it takes an article to be retracted depends on the nature of the retraction, among other causes. You can explore the diversity in the time-to-retraction of specific articles below.</p>',
      '<p>Strikingly, according to Budd <i>et al.</i> (2009), <strong>retracted articles continue to be cited in a positive manner, causing irreparable damage to science and society</strong>. To finish this visualization, you can find below the retracted articles with most impact as per citation number. Some of these articles convey wrong ideas proven to be false, such as the third retracted article with most citations: the (in)famous article by Wakefield et al linking vaccines to autism.</p>'];
    d3.select('.text').html(stepText[step]);

    // Change the chart title
    var chartTitle = [" ", 
      "Number of publications indexed in PubMed per year",
      "Number of biomedical article retractions per year",
      "Comparison of biomedical articles published and retracted per year",
      "Reasons for article retraction (Budd <i>et al.</i> 2009)",
      "Relation of article publication and retraction times",
      "Top retracted articles with most citations"]
    d3.select('.chartTitle').html(chartTitle[step]);

    // Change the chart instructions
    var chartDetails = [" ", 
      "Hover each bar for detailed information",
      "Hover each bar for detailed information",
      "Hover each bar for detailed information. Careful with the scale!",
      "",
      "Hover on the lines to see how much time elapsed on the retraction of the articles",
      "Hover each bar for detailed information and click to go to the PubMed entry of the article"]
    d3.select('.chartDetails').html(chartDetails[step]);

    // Change the buttons at every step.
    if (step === 0) {
      // At 0: there is no back button, and the next says "Let's go"
      d3.select('.next--active')
        .classed('next--active', false)
        .attr('class', 'next')
        .text("Let's go!");
      d3.select('.back--active')
        .classed('back--active', false)
        .attr('class', 'back')
        .text('');
    } else if (step === 1) {
      // At step 1, change the buttons to next and back.
      d3.select('.next')
        .classed('next', false)
        .attr('class', 'next--active')
        .text('Next');
      d3.select('.back')
        .attr('class', 'back--active')
        .text('Back');
    } else if (step === 5) {
      // Penultimate step: assure that the next button is shown.
      d3.select('.finished')
        .classed('finished', false)
        .attr('class', 'next--active')
        .text('Next');
    } else if (step === 6) {
      // Last step: hide the next button.
      d3.select('.next--active')
        .classed('next--active', false)
        .attr('class', 'finished')
        .text('');
    }
  }

  var cleanCanvas = function() {
    /**
    * Takes care of cleaning the canvas before drawing new charts.
    */
    // Remove the tooltips, if they exist.
    d3.selectAll('.d3-tip').remove();
    // Remove the bars values and text, if they exist.
    d3.selectAll('.horizontalBarValue').remove();
    d3.selectAll('.horizontalBarText').remove();
    d3.selectAll('.verticalBarValue').remove();
    // Transition all vertical bars to 0 height.
    chart.selectAll('.verticalBar rect')
      .transition()
      .duration(transitionTime)
      .ease('sin-in-out')
      .attr('height', 0)
      .attr('y', svgHeight);
    // Transition all horizontal bars to 0 width.
    chart.selectAll('.horizontalBar rect')
      .transition()
      .duration(transitionTime)
      .ease('sin-in-out')
      .attr('width', 0)
    // Wait for the transition to finish and remove the bars from the svg.
    d3.selectAll('.bars')
      .transition()
      .delay(transitionTime + 1)
      .remove();
    // Delete the arcs and info.
    d3.selectAll('.arcs').remove();
    d3.selectAll('.chartInfo').remove();
  }

  var transitionAxis = function(xAxis, yAxis, yLegend) {
    /**
    * Takes care of creating the axis.
    * Variables: the x and y axis variables, and the y legend.
    */

    // Transition the x axis
    if (xAxis != null) {
      chart.select('.x')
        .transition()
        .duration(transitionTime)
        .ease('sin-in-out')
        .call(xAxis);
    } else {
      // In case there is no xAxis in the step, delete the previous axis.
      chart.selectAll('.x').remove()
    }
    // The same for the y axis.
    if (yAxis != null) {
      chart.selectAll('.y')
        .transition()
        .duration(transitionTime)
        .ease('sin-in-out')
        .call(yAxis);
    } else {
      chart.selectAll('.y').remove()
    }
    // The legend. Delete the current legend.
    chart.select('.yAxisText').remove();
    // Append the legend if passed on the function.
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

  var drawVerticalBarChart = function(data, xScale, yScale, barWidth, tip, htmlClass) {
    /**
    * Draws vertical bar chart.
    * Variables:
    * data: The data to append to the bars. Height values on d.x, y position 
    *     on d.y. If d.z exists, it creates a grouped bar chart.
    * xScale and yScale: The scales for x and y values.
    * barWidth: The width for the bars.
    * tip: the d3.tip tooltips function.
    * htmlClass: an array with the classes for bars of the specific chart.
    */

    // Call the tooltips function
    chart.call(tip);

    // Create the bar groups
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
      
    // If there is xPositioning, move the bar wrappers to the place.
    if (xScale != null) {
      bars.attr('transform', function (d, i) { return 'translate(' + (xScale(d.x)- barWidth/2 ) + ', 0)'; });
      
      // Draw the bars
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
      // If there is no x positioning, leave a padding on the left and move each
      //    bar after the prior.
      bars.attr('transform', function (d, i) { return 'translate(' + (svgMargin.left + i * ((svgWidth - svgMargin.left - svgMargin.right) / data.length)) + ', 0)'; });

      // Hard coded links because there is only 1 graph like this (the last).
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

      // The width of the d.x bars is the half
      bars.selectAll('rect')
        .attr('width', barWidth/2 )
      
      // And append the ones corresponding to d.z moved barWidth/2 to the right.
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
    // Finally, if there is not scale of the x values, print them on each bar.
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

  var drawHorizontalBarChart = function(data, xScale, paddingLeft, barHeight, htmlClass) {
    /**
    * Draws horizontal bar chart. Similar to the vertical bar chart.
    * Variables:
    * data: The data to append to the bars. Width values on d.x. Titles of each
    *     bar in d.text.
    * xScale: The scales for x values.
    * paddingLeft: The space at the left of the bars for the text.
    * barHeight: The height for the bars on the chart.
    * htmlClass: an array with the classes for bars of the specific chart.
    */

    // Create the horizontal bar wrapper.
    var bars = chart.append('g')
      .attr('class', 'bars')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      // Move to the X position
      .attr('transform', function (d, i) { return 'translate(' + (svgMargin.left + paddingLeft) +',' + (svgMargin.top + i * barHeight) +')'; }) 
      .attr('class', 'horizontalBar');

    // Append the rectangles with the values.
    bars.append('rect')
      .attr('class', 'horizontalBarRect ' + htmlClass[0] + '')
      .attr('width', 0)
      .attr("height", barHeight - 1)
      // Transition
      .transition()
      .duration(transitionTime)
      .delay(function (d, i) {return i * 20; })
      .attr('width', function(d) { return xScale(d.x); });

    // The text on the left (title of each bar)
    bars.append("text")
      .attr('class', 'horizontalBarText')
      .style("text-anchor", "end")
      .attr("x", -10)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.text; });

    // Print the values above each bar.
    bars.append("text")
      .attr('class', 'horizontalBarValue')
      .style("text-anchor", "end")
      .attr("x", function(d) { return xScale(d.x) - 5; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.x; });
  }

  var drawArcChart = function(data, xScale, colorScale) {
    /**
    * Draws an Arc chart
    * Variables:
    * data: The data to append to the arcs. Time start values on d.yStart. Time
    *     end values on d.yEnd.
    * xScale: The scales for time values.
    * colorScale: an scale from 0 to 99 of different shades of gray.
    */

    // The info for each article mouseover. Hard coded values.
    // Create a wrapper for the info and position on the top left.
    var chartInfo = chart.append('g')
      .attr('class', 'chartInfo')
      .attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");

      // Create each specific text instance.
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
      // The months to retraction.
      chartInfo.append('text')
        .attr('class', 'arcInfoMonths')
        .attr("transform", "translate(0, 100)");

    // A nested function to update the values of the info on mouseover.
    var showInfo = function(d) {
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
      d3.select('.arcInfoMonths')
        .html('<tspan style="font-weight: bold;">Months until retraction</tspan>: ' + d.monthsToRet);
    }

    // The paths.
    var arcs = chart.append('g')
      .attr('class', 'arcs')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'arc')
      // Create random gray colors inside the colorscale palette.
      .style('stroke', function(d) { return colorScale(Math.random()*100);})
      // Actually draw the arc paths. Similar code to bibviz.
      .attr('d', function(d) { return 'M ' + xScale(d.yStart) + ',' + svgHeight + ' A '+ ((xScale(d.yEnd) - xScale(d.yStart)) * 0.51) + ',' + Math.min(((xScale(d.yEnd) - xScale(d.yStart)) * 0.51), 490) + ' 0 0,1 ' + xScale(d.yEnd) + ',' + svgHeight + ''})
      .on('mouseover', function(d) {
        // Redrawing the selected arc on top of the rest to highlight.
        chart.append('path')
          .attr('class', 'arcSelected')
          .attr('d', d3.select(this).attr("d"));
        // And show the tooltips
        showInfo(d);
      })
      .on('mouseout', function(d) {
        // Delete the newly created arc on top.
        chart.select('.arcSelected').remove();
      });
  }

  // Functions declared, start with the specifics of each step.
  // First, update the text and buttons
  textAndButtons(step);

  // And now, update the chart.

  if (step === 0) {
    // Just clean
    cleanCanvas(step);
    // Delete axis if exist.
    var xAxis = null;
    var yAxis = null;
    transitionAxis(xAxis, yAxis);
  } else if (step >= 1 && step <= 3) {
    // Steps 1 to 3 have data & Axis in common.
    // Parse the year column.
    timeFormat = d3.time.format("%Y");

    // Read the data
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

      // barWidth
      var barWidth = (svgWidth - svgMargin.left - svgMargin.right) / timeline.length;

      // The title of the y Axis on steps 1 - 3.
      var yLegend = 'Publications';

      if (step === 1) {
        // The y Scale and Axis
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

        // The class of the bars
        var htmlClass = ['pubmedTimelineBar'];

        // Everything on place: clean, draw the axis and the chart.
        cleanCanvas();

        // Axis
        chart.append("g")
          .attr('class', 'axis x')
          .attr("transform", "translate(0," + svgHeight + ")")
          .call(xAxis);

        chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (svgMargin.left - barWidth/2 - 3) + ",0)")
          .call(yAxis);

        transitionAxis(xAxis, yAxis, yLegend);

        // The chart
        drawVerticalBarChart(timeline, xScale, yScale, barWidth, tip, htmlClass);

      } else if (step === 2) {
        // Remap the data
        timeline.forEach(function(d) {
          d.pubmed = +d.x;
          d.y = +d.ret;
        })

        // The y Scale and axis
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

        // The class of the bars
        var htmlClass = ['retTimelineBar'];

        // Everything on place: clean, draw the axis and the chart.
        cleanCanvas();
        transitionAxis(xAxis, yAxis, yLegend);
        drawVerticalBarChart(timeline, xScale, yScale, barWidth, tip, htmlClass);

      } else if (step === 3) {
        // Remap the data
        timeline.forEach(function(d) {
          d.z = +d.ret;
        })

        // The y Scale and axis

        /**
        * So the thing is: I'm using a log scale here, but some values are 0.
        * I should convert the values to 1 in order to yScale without errors.
        * But I don't know how to do it, and the graph renders correctly anyway.
        */

        var yExtent = d3.extent(timeline, function(d) {return d.y;});

        var yScale = d3.scale.log()
            .range([svgHeight, svgMargin.bottom])
            .domain([1, yExtent[1]]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        // The class of the bars
        var htmlClass = ['pubmedTimelineBar', 'retTimelineBar'];

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
      // There's no y axis
      var yAxis = null;

      // There's a nice padding here for the text.
      var paddingLeft = 250;

      // The xAxis
      var xExtent = d3.extent(reasons, function(d) {return d.x;});

      // So... I'm gonna up the range here. I know it's not proportional,
      // But more aestethically pleasant. 
      var xScale = d3.scale.linear()
        .range([10, svgWidth - svgMargin.right - svgMargin.left - paddingLeft])
        .domain([0, xExtent[1]]);

      var xAxis = null;

      // The bar height
      var barHeight = (svgHeight - svgMargin.bottom) / reasons.length;

      // The class of the bars
      var htmlClass = ['retTimelineBar'];

      // Everything on place: clean, draw the axis and the chart.
      cleanCanvas();
      transitionAxis(xAxis, yAxis);
      drawHorizontalBarChart(reasons, xScale, paddingLeft, barHeight, htmlClass);
    });
  } else if (step === 5 || step === 6) {
    // Final Data: article info and time to retraction.
    d3.tsv("data/tidyDataset.tsv", function(error, retractions) {
      // Parse the time
      yearFormat = d3.time.format("%Y");
      dayFormat = d3.time.format("%d-%m-%Y");
      retractions.forEach(function(d) {
        d.x = yearFormat.parse(d.pubYear);
        d.yStart = dayFormat.parse(d.minPubDate);
        d.yEnd = dayFormat.parse(d.minRetDate);      
      })

      if (step === 5) {
        // There's no y Axis
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

        // Color scale for the grays on the arc.
        //var colorExtent = d3.extent(retractions, function(d) {return d.monthsToRet;});

        var colorScale = d3.scale.linear()
          .range(['#f1f1f1', '#ccc'])
          .domain([0,99]);
          //.domain(colorExtent);

        // Everything on place: clean, draw the axis and the arcs.
        cleanCanvas();

        // Create the axis because we deleted them the last time
        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + svgHeight + ")")
          .transition()
          .delay(transitionTime+1)
          .call(xAxis);

        transitionAxis(xAxis, yAxis);
        drawArcChart(retractions, xScale, colorScale);

      } else if (step === 6) {
        // Remap the data
        retractions.forEach(function(d) {
          d.y = +d.citedByCount;
        });

        // Sort the data, we only care about the top cited (y) articles.
        var retractions = retractions.sort(function(a,b) {
          if (a.y > b.y) {
            return -1;
          } else if (a.y < b.y) {
            return 1;
          }
          return 0;
        })

        // Slice the data.
        retractions = retractions.slice(0,35)

        // The y Axis
        var yExtent = d3.extent(retractions, function(d) {return d.y;});

        var yScale = d3.scale.linear()
            .range([svgHeight, svgMargin.bottom])
            .domain([1, yExtent[1]]);

        var yLegend = 'Citations';

        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(10);

        // There's no x Axis
        var xAxis = null;
        var xScale = null;

        // The bar width
        var barWidth = (svgWidth - svgMargin.left - svgMargin.right) / retractions.length;

        // The class of the bars
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
  // That's it!
}