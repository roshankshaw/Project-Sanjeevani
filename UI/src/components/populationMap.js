import * as d3 from 'd3';
import React, { Component } from 'react';
import * as topojson from 'topojson';
import updateCases from '../services/update-district';
//import require from 'requirejs'


class PopRenderMap extends Component {

  componentDidMount() {

    // d3Q.queue()
    //   .defer(d3.json, "../data/IND_adm2_Literacy.json")
    //   .defer(d3.json, "../data/ne_10m_admin_0_Kashmir_Occupied.json")
    //   .await(function (error, topoMain, topoKashmir) {
    Promise.all([
      d3.json("https://raw.githubusercontent.com/akshat-khare/datavisproject/master/IND_adm2_Literacy.json"),
      d3.json("https://raw.githubusercontent.com/harshsri2208/Covid-Dash-UI/master/public/data/ne_10m_admin_0_Kashmir_Occupied.json?token=AI3AZSOVLFA5POK36ECQEIS7PVRJI")
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
        await d3.select("#select").call(selectFilter());
        var filter = await d3.select('#select input[name="gender"]:checked').node().value;
        

        // Color codes for districts based on Literacy Rates
        colorCode(districts.features, filter);
        colorDisputed(disputed.features);

        // Map render
        var map = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
        d3.select("#map").call(map);

        // On change of selection re-render
        d3.selectAll("#select input[name=gender]").on("change", function () {
          filter = d3.select('#select input[name="gender"]:checked').node().value;
          colorCode(districts.features, filter);
          map = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
          d3.select("#map").call(map);
        });
      });

    function selectFilter() {
      function render(selection) {
        selection.each(function () {
          d3.select(this).html("<form>" +
            "<input type='radio' name='gender' value='Literacy' checked> Total<br>" +
            "<input type='radio' name='gender' value='FemaleLiteracy'> Active<br>" +
            "<input type='radio' name='gender' value='MaleLiteracy'> Recovered" +
            "</form>");
        });
      } // render
      return render;
    }

    function colorCode(data, filter) {
      var color = d3.scaleThreshold()
        .domain([65, 70, 75, 80, 85, 90, 95, 100])
        .range(d3.schemeReds[8]);
      data.forEach(function (d) {
        if (isNaN(d.properties[filter])) { d.properties[filter] = 0; }
        d.color = color(d.properties[filter]);
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
      var propTag = 'Cases', ttName = 'Cases', unit = '';

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
                .style("left", (d.pageX - document.getElementById('map').offsetLeft + 20) + "px")
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

export default PopRenderMap;