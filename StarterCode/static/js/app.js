function buildMetadata(sample){
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata;
        // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`​
    let TP = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        TP.html("");
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        TP.append("h6").text("ID: " + result.id);
        TP.append("h6").text("ETHNICITY: " + result.ethnicity);
        TP.append("h6").text("GENDER: " + result.gender);
        TP.append("h6").text("AGE: " + result.age);
        TP.append("h6").text("LOCATION: " + result.location);
        TP.append("h6").text("BBTYPE: " + result.bbtype);
        TP.append("h6").text("WFREQ: " + result.wfreq);

    // BONUS: Build the Gauge Chart ... give this a try if you have time.  Otherwise don't add anything.
    
    });
};

function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        //   put the data into a variable
    let samples = data.samples;
          //   filter the data using 'sample'
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = sampleArray[0];
  
    let metadata = data.metadata;
    let metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    

        //   grab the first entry [0]
    let mdresult = metadataArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
      
    // Build a Bubble Chart
    let bubbleData = [{
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
        },
        hovertemplate: "%{text}<extra></extra>",
        text: otu_labels
    }];
    

    let bubbleLayout = {
        title: {
            text: "Frequency of OTU Ids"
        },
        xAxis: {
        title: "OTU Ids"
        
        },
        height: 600,
        width: 1200
    };
    //https://plotly.com/javascript/bubble-charts/
      
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
    // slice the data down to 10 items 
    //you will probably want to reverse them to get them into desc order
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
          //create trace
    let barData = [{
        x: sample_values.slice(0, 10),
        y: yticks,
        type: "bar",
        orientation: "h",
        hovertemplate: "%{text}<extra></extra>",
        text: otu_labels.slice(0, 10)
    }];
            // create layout  (title is enough)
    let barLayout = {
    title: {
        text: "Top 10 OTUs"
      },
    yaxis: {
        autorange: "reversed"
      }
    };
            // draw your plot Plotly.newPlot()
    Plotly.newPlot("bar", barData, barLayout);
    
    // the Gauge Chart
    let gaugeData =[{
        type: "indicator",
        mode: "gauge+number",
        value: mdresult.wfreq,
        title: { text: "Belly Button Washing Frequency Per Week", font: { size: 20 } },
        gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
                bar: { color: "#F7BCC0" },
                bgcolor: "white",
                steps: [
                  {range: [0, 1], color: "#C0D4C2"},
                  {range: [1, 2], color: "#EDEEDE"},
                  {range: [2, 3], color: "#C0D4C2"},
                  {range: [3, 4], color: "#EDEEDE"},
                  {range: [4, 5], color: "#C0D4C2"},
                  {range: [5, 6], color: "#EDEEDE"},
                  {range: [6, 7], color: "#C0D4C2"},
                  {range: [7, 8], color: "#EDEEDE"},
                  {range: [8, 9], color: "#C0D4C2"} 
                ],
              }
    }];
    let layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white"
        
    };
          
    Plotly.newPlot("gauge", gaugeData, layout);


    });
    
}

      
function init(){
    //use d3 to select the dropdown element ($selDataset)
    let choosen = d3.select("#selDataset").on("change", selDataset);
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        //loop through names from sample names
        sampleNames.forEach((sample) => {
            choosen
            //append option.
            .append("option")
             // use the first sample from the list to build the intial plots
            .text(sample)
            .property("value", sample);
        });
    })
    // run build charts
    buildMetadata(940);
    // run build metadata
    buildCharts(940);
}
function optionChanged(newSample){
    //Fetch new data each time a row sample is selected
    
    // run build charts
    buildMetadata(newSample)
    // run build metadata
    buildCharts(newSample);
}

init()