function updateCases(districts, data) {

    let max_Vac = 0, min_Vac = 99999999999;

    let district = districts.features;
    for (let i = 0; i < district.length; i++) {
        let literacy = district[i].properties;
        let districtId = (district[i].id).toLowerCase();
        // many districts are present in the json but not present in the database
        // hence value cannot be updated for such districts
        if (data[districtId] !== undefined) {
            // vaccines will be decided by total population
            // Literacy decides vaccines required
            let population = data[districtId].population; // this will be replaced by total population
            let deceased = data[districtId].deceased;
            let recoveredCases = data[districtId].recovered;
            let totalVaccines = population - (recoveredCases + deceased)
            //console.log(totalVaccines)
            literacy.Literacy = new Array (data[districtId].confirmed_normalized, (totalVaccines / 1000000).toFixed(2), data[districtId].confirmed);
            

            //  color will be decided by normalised values of active covid
            // MaleLiteracy decides color
            literacy.MaleLiteracy = new Array (data[districtId].active_normalized, data[districtId].active);
            literacy.FemaleLiteracy = new Array (data[districtId].recovered_normalized, data[districtId].recovered);
            max_Vac = Math.max(max_Vac, data[districtId].active_normalized)
            min_Vac = Math.min(min_Vac, data[districtId].active_normalized)
        }
        else {
            literacy.Literacy = new Array (0, 0, 0);
            literacy.MaleLiteracy = new Array (0, 0);
            literacy.FemaleLiteracy = new Array (0, 0);
        }
    }

    console.log(max_Vac)
            console.log(min_Vac)

}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export default updateCases;