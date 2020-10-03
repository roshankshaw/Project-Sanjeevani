function updateCases(districts) {

    // try {

    //     fetch("http://localhost:5000/getCases/", {
    //         method: 'GET'
    //     })
    //         .then(response => response.json())

    //         // Displaying results to console 
    //         .then(function (json) {
    //             console.log(json);
    //         });

    // }
    // catch (e) {
    //     console.log(e);
    // }

    let district = districts.features;
    for (let i = 0; i < district.length; i++) {
        let literacy = district[i].properties;
        literacy.Literacy = Math.floor(Math.random() * 101);
        literacy.MaleLiteracy = Math.floor(Math.random() * 101);
        literacy.FemaleLiteracy = Math.floor(Math.random() * 101);
    }

}

export default updateCases;