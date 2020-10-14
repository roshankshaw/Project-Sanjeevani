import * as d3 from 'd3';
import React, { Component } from 'react';
import * as topojson from 'topojson';
import updateCases from '../services/update-district';
import updateCluster from '../services/update-cluster';
import axios from 'axios'
//import require from 'requirejs'


class ClusterRenderMap extends Component {

    

  componentDidMount() {

    var filter = "Literacy";
    var cluster = "MaleLiteracy";

    // d3Q.queue()
    //   .defer(d3.json, "../data/IND_adm2_Literacy.json")
    //   .defer(d3.json, "../data/ne_10m_admin_0_Kashmir_Occupied.json")
    //   .await(function (error, topoMain, topoKashmir) {
    Promise.all([
      d3.json("https://raw.githubusercontent.com/akshat-khare/datavisproject/master/IND_adm2_Literacy.json"),
      d3.json("https://raw.githubusercontent.com/akshat-khare/datavisproject/master/ne_10m_admin_0_Kashmir_Occupied.json")
    ])
      .then(async function (files) {
        let topoMain = files[0];
        let topoKashmir = files[1];
        var districts;
        var disputed;
        // if (error) throw error;

        // Features for districts and disputed areas
        districts = await topojson.feature(topoMain, topoMain.objects.IND_adm2);
        disputed = await topojson.feature(topoKashmir, topoKashmir.objects.ne_10m_admin_0_Kashmir_Occupied);

        // Radio HTML
        //await d3.select("#select").call(selectFilter());
        //var filter = await d3.select('#select input[name="gender"]:checked').node().value;
        
        let data = await axios.get("http://localhost:5000/getCases").then(response => response.data).then(data => {
          return data;
        })

        // function to update cluster color and priority
        updateCluster(districts, data);

        // Color codes for districts based on Literacy Rates
        colorCode(districts.features);
        colorDisputed(disputed.features);

        // Map render
        var map = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
        d3.select("#map").call(map);
      });

    function colorCode(data) {
      data.forEach(function (d) {
        d.color = d.properties[cluster];
      });
    }

    function colorDisputed(data) {
      var color = "#eaeafa";
      data.forEach(function (d) {
        d.color = color;
      });
    }

    function districtMap(districts, disputed) {

      var width = 800, height = 700, scale = 1200;
      var propTag = 'Cases', ttName = 'Priority', unit = '';

      function render(selection) {
        selection.each(function () {

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
            .style("fill", function (d) { return d.color; })
            .attr("d", path)
            .on("mouseover", function (d, data) {
              d3.select("#tooltip").transition()
                .duration(200)
                .style("opacity", .9);
              d3.select("#tooltip").html("<h3>" + (data.id) + "</h3><h4>(" + (data.properties.NAME_1) + ")</h4><table>" +
                "<tr><td>" + ttName + "</td><td>" + (data.properties[propTag]) + unit + "</td></tr>" +
                "</table>")
                .style("left", (d.pageX - document.getElementById('map').offsetLeft + 20-document.getElementById('sidebar-id').offsetWidth) + "px")
                .style("top", (d.pageY - document.getElementById('map').offsetTop - 60) + "px");
            })
            .on("mouseout", function (d) {
              d3.select("#tooltip").transition()
                .duration(500)
                .style("opacity", 0);
            });

          svg.selectAll(".disputed")
            .data(disputed.features)
            .enter().append("path")
            .attr("class", "disputed")
            .style("fill", function (d) { return d.color; })
            .attr("d", path);

        });
      } // render
      render.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return render;
      };
      render.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return render;
      };
      render.scale = function (value) {
        if (!arguments.length) return scale;
        scale = value;
        return render;
      };
      render.propTag = function (value) {
        if (!arguments.length) return propTag;
        propTag = value;
        return render;
      };
      render.ttName = function (value) {
        if (!arguments.length) return ttName;
        ttName = value;
        return render;
      };
      render.unit = function (value) {
        if (!arguments.length) return unit;
        unit = value;
        return render;
      };

      return render;
    }

  }

  render() {
    return (
      <div>
        <div id="demobox">
          <div id="map">
            <div id="select">
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default ClusterRenderMap;