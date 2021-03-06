(function() {
    d3.queue()
        .defer(d3.json, "../data/IND_adm2_Literacy.json")
        .defer(d3.json, "../data/ne_10m_admin_0_Kashmir_Occupied.json")
        .await(function(error, topoMain, topoKashmir) {
            var districts, disputed;
            if (error) throw error;

            // Features for districts and disputed areas
            districts   = topojson.feature(topoMain, topoMain.objects.IND_adm2);
            disputed    = topojson.feature(topoKashmir, topoKashmir.objects.ne_10m_admin_0_Kashmir_Occupied);

            // Radio HTML
            d3.select("#select").call(selectFilter());
            var filter  = d3.select('#select input[name="gender"]:checked').node().value;

            // Color codes for districts based on Literacy Rates
            colorCode(districts.features, filter);
            colorDisputed(disputed.features);

            // Map render
            var map     = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
            d3.select("#map").call(map);

            // On change of selection re-render
            d3.selectAll("#select input[name=gender]").on("change", function() {
                filter  = d3.select('#select input[name="gender"]:checked').node().value;
                colorCode(districts.features, filter);
                map     = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
                d3.select("#map").call(map);
            });
        });
}());

function selectFilter() {
    function render(selection) {
      selection.each(function() {
        d3.select(this).html("<form>"+
                             "<input type='radio' name='gender' value='Literacy' checked> Total<br>"+
                             "<input type='radio' name='gender' value='FemaleLiteracy'> Active<br>"+
                             "<input type='radio' name='gender' value='MaleLiteracy'> Recovered"+
                             "</form>");
      });
    } // render
return render;
} // selectFilter

function colorCode(data, filter) {
    var color = d3.scaleThreshold()
                  .domain([65, 72, 78, 85])
                  .range(["#ff9980", "#ff704d", "#ff471a", "#e62e00", "#b32400"]);
    data.forEach(function(d) { 
        if (isNaN(d.properties[filter])) { d.properties[filter] = 77; }
        d.color       = color(d.properties[filter]);
    });
}

function colorDisputed(data) {
    var color         = "#eaeafa";
    data.forEach(function(d) { 
        d.color       = color;
    });
}

function districtMap(districts, disputed) {

    var width  = 800, height = 700, scale = 1200;
    var propTag = 'Cases', ttName = 'Cases', unit = '';
    
    function render(selection) {
      selection.each(function() {

        d3.select(this).select("svg").remove();
        var svg = d3.select(this).append("svg")
                    .attr("width", width)
                    .attr("height", height);

        d3.select(this).select("#tooltip").remove();
        d3.select(this).append("div").attr("id", "tooltip").style("opacity", 0);

        var projection = d3.geoMercator()
            .center([83, 23])
            .scale(scale)
            .translate([width / 2, height / 2]);
    
        var path = d3.geoPath().projection(projection);

        svg.selectAll(".district")
            .data(districts.features)
          .enter().append("path")
            .attr("class", "district")
            .style("fill", function(d) { return d.color; })
            .attr("d", path)
          .on("mouseover", function(d) {      
                 d3.select("#tooltip").transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                 d3.select("#tooltip").html("<h3>"+(d.id)+"</h3><h4>("+(d.properties.NAME_1)+")</h4><table>"+
                          "<tr><td>"+ttName+"</td><td>"+(d.properties[propTag])+unit+"</td></tr>"+
                          "</table>")
                    .style("left", (d3.event.pageX-document.getElementById('map').offsetLeft + 20) + "px") 
                    .style("top", (d3.event.pageY-document.getElementById('map').offsetTop - 60) + "px");
          })  
          .on("mouseout", function(d) {       
                 d3.select("#tooltip").transition()        
                    .duration(500)      
                    .style("opacity", 0);   
          });
          
        svg.selectAll(".disputed")
            .data(disputed.features)
          .enter().append("path")
            .attr("class", "disputed")
            .style("fill", function(d) { return d.color; })
            .attr("d", path);

      });
    } // render
    render.height = function(value) {
            	if (!arguments.length) return height;
            	height = value;
            	return render;
        	};
    render.width = function(value) {
            	if (!arguments.length) return width;
            	width = value;
            	return render;
        	};
    render.scale = function(value) {
            	if (!arguments.length) return scale;
            	scale = value;
            	return render;
        	};
    render.propTag = function(value) {
            	if (!arguments.length) return propTag;
            	propTag = value;
            	return render;
        	};
    render.ttName = function(value) {
            	if (!arguments.length) return ttName;
            	ttName = value;
            	return render;
        	};
    render.unit = function(value) {
            	if (!arguments.length) return unit;
            	unit = value;
            	return render;
        	};
  
return render;
} // districtMap