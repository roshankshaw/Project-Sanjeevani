function updateFilter(districts, data) {

    let district = districts.features;
    let numClusters = 4;
    let top=100,itr=0;
    for (let i = 0; i < district.length; i++) {
        let literacy = district[i].properties;
        let districtId = (district[i].id).toLowerCase();
        if (data[districtId] !== undefined) {
            // priority considered color till columns corrected
            //console.log(lum);
            let clusterColor,priority;
            if(data[districtId]['index']<top){
                clusterColor = "#EC0101";
                itr=itr+1;
            }
            else{
                clusterColor = "#F1F3DE";
            }    
            priority = 1 + data[districtId].priority;
            // literacy and maleliteracy considered as priority and color
            literacy.Literacy = priority;
            literacy.MaleLiteracy = clusterColor;
        }
        else {
            // literacy and maleliteracy considered as priority and color
            literacy.Literacy = "NA";
            literacy.MaleLiteracy = "#EAEAFA";
        }
    }

}


export default updateFilter;