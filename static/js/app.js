function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    const metadata_url = `/metadata/${sample}`;
    
    d3.json(metadata_url).then(function(data) {
    console.log(data);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    const metadata_panel = d3.select("sample-metadata")

    // Use `.html("") to clear any existing metadata
    metadata_panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key,value]) => {
        metadata_panel.append("h5").text(`${key}: ${value}`)
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
})
};
                               

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    const samples_url = `/samples/${sample}`;

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(samples_url).then(function(sampleData) {
        console.log(sampleData)
        
        const
            otu_ids = sampleData.otu_ids;
            otu_labels = sampleData.otu_labels;
            sample_values = sampleData.sample_values;
        
        const bubble = [{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Electric'
            }
        }]
        
        const bubble_layout = {
            xaxis: {title: "OTU ID"}            
        };
        
        Plotly.newPlot("bubble", bubble_data, bubble_layout, {responsive: true})
        

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    const pieData = {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
    };
    
    Plotly.newPlot("pie", [pieData]);
    
    
    })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
