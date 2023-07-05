var bundeslaender;
var landkreise;
var dataKreise;
var databoundaries = [];
var esrikreise;
var storeAllProjects = [];
var dataProject = [];
var dataLandkreise = [];
var anz = [];


function getFeatures(data) {
    var storeData = [];
    for (var j = 0; j < data.length; j++) {
        for (var i = 0; i < dataKreise.features.length; i++) {
            if (String(dataKreise.features[i].properties.SDV_RS) === String(data[j].SDV_RS)) {
                storeData.push(dataKreise.features[i]);
            } else {}
        }
    }
}

/*fuegt den Layer zur Karte hinzu
layername: der gewuenschte layername
dataLayer: die benoetigen Daten zum Zeichnen
feature: layout
*/
function drawLayers(layername, dataLayer, feature) {
    layername = L.geoJSON(dataLayer, {
        onEachFeature: feature
    });
    layername.addTo(map);
    layername.bringToFront();
}


/** wenn bereits ein Layer vorhanden: diesen entfernen */
function checkLayers(layername) {

    //  if(map.hasLayer(landkreise)){
    //    console.info("hat bundesland");
    //   map.removeLayer(landkreise);
    //  }
    //map.removeLayer(layername)
}



$(document).ready(function() {
    //Selectbox mit Selectpicker fuer Bundeslaender-Auswahl initialisieren 
    var projects = $.ajax({
        url: "data/get_all_projects.php",
        dataType: "json",
        type: "POST",
        error: function(xhr) {},
        success: function(data) {
            dataLandkreise = data;
            //Landkreis-Selectbox fuellen
            $('#myLandkreis.selectpicker').append('<option attr_bid="y" value="y" id="y">--- alle --- </option>');
            for (var j = 0; j < data.length; j++) {
                $('#myLandkreis.selectpicker').append('<option attr_bid="' + data[j].SN_L + '" id="' + data[j].SDV_RS + '">' + data[j].BEZ + ' ' + data[j].GEN + '</option>');
            }
            $("#myLandkreis.selectpicker").selectpicker('refresh');
            $("#myLandkreis.selectpicker").selectpicker('render');
        }
    });


    var tableprojects = $.ajax({
        url: "data/get_all_projects3.php",
        dataType: "json",
        type: "POST",
        error: function(xhr) {},
        success: function(data) {
            dataProject = data;
            for (var i = 0; i < dataProject.length; i++) {
                var vorname = dataProject[i].VORAP ? dataProject[i].VORAP : '';
                var nachname = dataProject[i].NACHAP ? dataProject[i].NACHAP : '';
                var email = dataProject[i].EMAILAP ? dataProject[i].EMAILAP : '';
                var tel = dataProject[i].TELAP ? dataProject[i].TELAP : '';
                var kontakt = vorname + ' ' + nachname + '<br/>' + email + '<br/>' + tel;
                var link = dataProject[i].PLINK ? '<br/><a class="badge badge-info" href="' + dataProject[i].PLINK + '"><i class="fa fa-sitemap"></i> Zur Projektseite</a>' : '';
                var github = dataProject[i].PQL ? '<br/><a class="badge badge-warning" href="' + dataProject[i].PQL + '"><i class="fa fa-code"></i> Zum Quellcode</a>' : '';
                $('#Ergebnis tbody').append('<tr><td>' + dataProject[i].PTITEL + link + github + '</td><td>' + dataProject[i].BEZ + ' ' + dataProject[i].GEN + ' </td><td>' + dataProject[i].PBESCHR + '</td><td>' + kontakt + '</td></tr>');
            }
            /*  $('#Ergebnis').dataTable({
               "language": {
                 "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
               },
               select: true,
               responsive: true
             }); */
            drawTable(dataProject);
            drawTableContent(dataProject);
        }
    });

    var boundaries = $.ajax({
        url: "data/germany.geojson",
        //url: "https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Kreisgrenzen_2017/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,RS,SDV_RS,GEN,BEZ,Shape__Area,Shape__Length,Shape__Area_2,Shape__Length_2&outSR=4326&f=json",
        //url:"https://opendata.arcgis.com/datasets/248e105774144a27aca2dfbfe080fc9d_0.geojson",
        dataType: "json",
        type: "POST",
        error: function(xhr) {
            alert(xhr.statusText);
        },
        success: function(data) {
            databoundaries = data;
            //OpenData-Arcgis-Daten in dataKreise speichern             
            //drawLayers(esrikreise, dataKreise, onEachFeature);
            drawLayers(bundeslaender, databoundaries, onEachFeature);
        }
    });

    //Landkreisgrenzen aus Opendata-Argis laden und mit Projekten aus der DB verknuepfen. Dann beide Layer einzeichen und Tabelle mit Werten fuellen
    var counties = $.ajax({
        url: "data/landkreise_simplify200.geojson",
        //url: "https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Kreisgrenzen_2017/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,RS,SDV_RS,GEN,BEZ,Shape__Area,Shape__Length,Shape__Area_2,Shape__Length_2&outSR=4326&f=json",
        //url:"https://opendata.arcgis.com/datasets/248e105774144a27aca2dfbfe080fc9d_0.geojson",
        dataType: "json",
        type: "POST",
        error: function(xhr) {
            alert(xhr.statusText);
        },
        success: function(data) {
            dataKreise = data;


            //OpenData-Arcgis-Daten in dataKreise speichern         
            if (dataProject.length > 0) {
                for (var j = 0; j < dataProject.length; j++) {
                    for (var i = 0; i < dataKreise.features.length; i++) {
                        if (String(dataKreise.features[i].properties.SDV_RS) === String(dataProject[j].SDV_RS)) {
                            anz.push(dataProject[j].SDV_RS);
                            storeAllProjects.push(dataKreise.features[i]);
                        }
                    }
                }
                drawLayers(esrikreise, dataKreise, onEachFeature);
                drawLayers(bundeslaender, storeAllProjects, onEachCategorie);
            }

            // bundeslaender = L.geoJSON(storeAllProjects, {
            //   onEachFeature: onEachCategorie
            // }); 
            // bundeslaender.addTo(map);    

        }
    });
});



$('#buttonFilter').on('click', function() {

    var valueBundesland = $('#myBundesland').find('option:selected').attr('id');
    var valueLandkreis = $('#myLandkreis').find('option:selected').attr('id');
    var valueStichwortBefore = $('#myStichwort').val();
    var valueRadio = $("input[name=radio]:checked").val();


    if (valueRadio === 'OS') {
        valueRadio = 1;
    } else {
        valueRadio = '';
    }
    var regex = /( |<([^>]+)>)/ig;
    valueStichwort = valueStichwortBefore.replace(regex, "");
    //var valueOpenSource = $('#myOpenSource').find('option:selected').attr('id');

    var filter = $.ajax({
        url: "data/get_all_projects3.php",
        dataType: "json",
        type: "POST",
        data: {
            'lk': valueLandkreis,
            'bu': valueBundesland,
            'sw': valueStichwort,
            'os': valueRadio
        },
        error: function(xhr) {

        },
        success: function(data) {
            dataProject = data;
            drawTable(dataProject);

            //Vergleiche, ob SDV_RS aus der Projekte DB in OpenData-Arcgis enthalten sind. Wenn ja, dann OpenData-Arcgis-Features in storeAllProjects speichern
            var storeFilter = []
            if (dataKreise) {
                if (dataProject.length > 0) {
                    drawTableContent(dataProject);


                    for (var j = 0; j < dataProject.length; j++) {
                        //Stichwoerter/Suchbegriff im Text hervorheben
                        if (valueStichwort) {
                            //var b = '<mark>' + valueStichwort + '</mark>';
                            //var y = dataProject[j].PBESCHR.replace(valueStichwort, b);
                            //var z = dataKreise[j].PTITEL.replace(valueStichwort, b);
                            // dataProject[j].PTITEL = z;
                            // dataProject[j].PBESCHR = y;
                        }
                        for (var i = 0; i < dataKreise.features.length; i++) {
                            if (String(dataKreise.features[i].properties.SDV_RS) === String(dataProject[j].SDV_RS)) {
                                storeFilter.push(dataKreise.features[i]);
                            } else {}
                        }
                    }
                } else {

                }
            }

            //Layer fuer alle Landkreise zeichnen

            checkLayers(bundeslaender);
            //drawLayers(bundeslaender, dataKreise, onEachFeature);
            //Layer fuer Projekte zeichnen
            drawLayers(bundeslaender, storeFilter, onEachCategorie);

        }
    })
});