#P5 - Make an Effective Data Visualization
Create a data visualization from a data set that tells a story or allows a reader to explore trends or patterns. Use either dimple.js or d3.js to create the visualization. Your work should be a reflection of the theory and practice of data visualization, such as visual encodings, design principles, and effective communication.

##[View the final visualization](http://dataviz.bitsandgen.es)

##Summary
Biomedical research is a key factor in our fight against human diseases and aging. Hundreds of thousands of articles regarding this topic are published each year. Unfortunately, the publication pressure for funding sometimes ends with scientists publishing unfounded studies or, directly, falsifying data, with importnat scientific, economic and social consequences. In this visualization, I use data from PubMed to analyze how often, why, and which scientific impact have biomedical articles that are proven to be flawed.

##Design
In this project, I wanted to create a story regarding thetopics mentioned above. Given the complexity of the topic. I decided that the best option would be to make an interactive text with different accompanying graphs to explore the topic even further. 

I will explain the rationale between each graphic below:

* For the first three graphics, regarding the publication numbers for each year since 1959, I decided to use a vertical bar chart. I could have used a line chart as well, but I feel that the bar chart (always starting at 0) is better for visualizing the distribution and evolution of the publication numbers, which are independent from a year to the next. I choose a light gray as a plain color for the bars, with a blue (for total number of publications) and dark red (for retractions) color for contrasting with the currently selectioned item. Although a rough scale is given, exactly values of every year are available on bar hovering.
* For the chart regarding the reasons for article retraction, I finally decided that an horizontal bar chart was fitting. Similar to the anterior charts, there is no relationship between the different categories, and the objective of the chart is to compare its different values. I ditched the scales and simply indicated the values on each bar to simplify and make the chart more clear. The color choice was the same as the prior graphs.
* For the next chart, I wanted to convey the diversity of the time that elapses from the publishing of an article to its retraction. To this objective, I created a custom arc chart inspired by [BibVIz](http://bibviz.com) that connects the two times. I believe that this graph really shines at connecting different points in a scale in a clear and interesting manner. The color choices are the same as before, but in this case i diversified the basal gray to different tones agreeing to the feedback I received to make the graph more appealing.
* Finally, for the last graph I wanted to compare values from the most cited articles, and a simple bar chart does the job perfectly. The color choice is coherent with previous charts for the same reasons.

The design feedback I received was mostly regarding the arc chart, which I improved coherently. I also improved the text and instructions as well as incorpored a small description above each chart to make the purpose and interactivity of the visualization clearer.

##Feedback

###Feedback 1 ([from Udacity discussion forums](https://discussions.udacity.com/t/retractions-in-biomedical-literature-final-data-vizualization-project/37508))
'Really really well done. Very interesting and beautiful visualisation. Just a small observation. The years that appear in the legend of the bar charts do not correspond to the years in the X-axis. I mean, in the legend shows 2015, but the axis is 2014.'

I fixed the year tooltip after the feedback, changed from using the javascript function getUTCFullYear() to getFullYear().

###Feedback 2 (from a coworker):
'I like the visualization, it explores the ocurrence, reasons and consequences of article retractions in biomedicine. I specially liked the arc graph that details the article retracted and the time from publishing to retraction. However, the selected arc highlighted in red sometimes was below other arcs and couldn't see the boundaries properly.'

After this feedback, I changed the highlighting mode in the graph, from changing the selected arc color to red to appending an altogether new red path in the svg so that it is always on top.

###Feedback 3 (from a friend):
'I think the visualization it's quite clear. The accompanying text is straightforward and concise, making it easy to read and understand the purpose and meaning of the graphics.

For example, when the 2 sets of "divergent" data are presented, the explanation given on the distort of the comparison is very good. Even though, in a case like that, where the accompanying text affects so much the meaning of the graph, I would put it in a highlighted box or similar, to make sure that it's read and understood, rather than being part of the general explanation.

I also think that, taking into consideration that the text and graphs appear to be made for a generalist audience, the graphs would benefit from having a bit of explanation of what can we see when we click on them - again on a box close to the graph in addition to the main text, more education, such as: "Click on any one of the lines to see how much timeelapsed on the retraction of the articles"

Regarding formatting, I think the publication/retraction times graph would benefit from the use of a richer palette (even on the spectre of grays) to make it more appealing for interaction. Currently it looks like a mass on most places. I know that's intended, but more grays would still give that effect without making it as plain.

Also, on the 2nd graph, the supporting text says that " little more than 4000 publications have been retracted, but the rate of retractions is increasing." while the graph shows that in the last 4 years is decreasing. Of course there's a big peak vs earlier years, but it can be confusing.'

According with the feedback, I improved the arc graph giving the arc a random gray color inside a limited palette, which gives an overall better look to it without feeling overwhelming. I also made sure that the accompanying text was clearer and added a small instruction after each chart title to better explain the chart without the need for the text explanation.

##Resources
For this visualization, I have used the following resources:

- http://bost.ocks.org/mike/ (for general d3 doubts and inspiration)
- http://alignedleft.com/tutorials (for general d3 doubts and inspiration)
- http://bibviz.com/ (as inspiration for the arc graph)
- https://www.dashingd3js.com/svg-paths-and-d3js (for the arc graph)
- https://github.com/Caged/d3-tip (for the bar chart tooltips)
- https://stackoverflow.com/questions/13595175/updating-svg-element-z-index-with-d3 (for the 2nd feedback on the bar graph)
- https://necolas.github.io/normalize.css/ (as a started css point)
- http://fontawesome.io/ (for the chevron icons)
- http://europepmc.org/RestfulWebService and http://www.ncbi.nlm.nih.gov/pubmed to get the data.