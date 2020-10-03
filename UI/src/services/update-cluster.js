function updateCluster(districts) {

    // array with random colors
    // this will be replaced by cluster color for an individual district
    let randomCol = ["#40FF00", "#FE2E2E", "#F7FE2E", "#FF0040", "#0101DF"];

    let district = districts.features;
    for (let i = 0; i < district.length; i++) {
        let literacy = district[i].properties;

        //literacy considered as Priority
        literacy.Literacy = Math.floor(Math.random() * 101);

        //MaleLiteracy considered as cluster color
        literacy.MaleLiteracy = randomCol[Math.floor(Math.random() * 5)];
    }

}

export default updateCluster;