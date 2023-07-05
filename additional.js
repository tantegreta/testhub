function drawTable(data) {
    $('#suchergebnis').children().remove();
    $('#Ergebnis tbody').children().remove();
    $('#Ergebnis').dataTable().fnClearTable();
    $('#Ergebnis').dataTable().fnDestroy();
    $('#suchergebnis').append('<span class="lead a nav-link">Ihre Suche ergab ' + data.length + ' Treffer. </span></p>');
}

function drawTableContent(data) {
    for (var i = 0; i < data.length; i++) {
        var vorname = data[i].VORAP ? data[i].VORAP : '';
        var nachname = data[i].NACHAP ? data[i].NACHAP : '';
        var email = data[i].EMAILAP ? data[i].EMAILAP : '';
        var tel = data[i].TELAP ? data[i].TELAP : '';
        var kontakt = vorname + ' ' + nachname + '<br/>' + email + '<br/>' + tel;
        var link = data[i].PLINK ? '<br/><a class="badge badge-info" href="' + data[i].PLINK + '"><i class="fa fa-sitemap"></i> Zur Projektseite</a>' : '';
        var github = data[i].PQL ? '<br/><a class="badge badge-warning" href="' + dataProject[i].PQL + '"><i class="fa fa-code"></i> Zum Quellcode</a>' : '';

        $('#Ergebnis tbody').append('<tr><td>' + data[i].PTITEL + link + github + '</td><td>' + data[i].BEZ + ' ' + data[i].GEN + ' </td><td>' + data[i].PBESCHR + '</td><td>' + kontakt + '</td></tr>');
    }
    $('#Ergebnis').dataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
        },
        select: true,
        responsive: true,
        "pagingType": "simple",
        "lengthChange": false
    });
}

$('#myBundesland.selectpicker').selectpicker({
    style: '',
    size: 4,
    width: '100%',
    liveSearch: true

});
$("#myBundesland.selectpicker").selectpicker('refresh');
$("#myBundesland.selectpicker").selectpicker('render');

$('#myLandkreis.selectpicker').selectpicker({
    style: '',
    size: 4,
    width: '100%',
    liveSearch: true
});


//Projectcounter in Header ergaenzen
$.post("data/get_counter.php").done(function(data) {
    $.each(JSON.parse(data), function(i, item) {
        $('#counter').append(' <div class="masthead-subheading font-weight-light mb-0">' + item.KREISE + ' Landkreise -  ' + item.PIDS + '  Digital-Projekte</div>');
    });
});

$('#myLandkreis').on('change', function() {
    var value = $(this).find('option:selected').attr('attr_bid');
    $('#myBundesland.selectpicker').val(value);
    $('#myBundesland.selectpicker').selectpicker('refresh');

});
//Selectbox fuer Bundeslander: Auswahl eines Bundeslandes veraendert die Selectbox der Landkreise
$('#myBundesland').on('change', function() {

    // //$(".selectpicker[data-id ='myLandkreis']").addClass("disabled");
    // var value = $(this).find('option:selected').attr('id');
    // if(value != 'x') {
    //     $('#myLandkreis.selectpicker').prop('disabled', true);
    //     $('#myLandkreis.selectpicker').selectpicker('refresh');
    // } else {
    //     $('#myLandkreis.selectpicker').prop('disabled', false);
    //     $('#myLandkreis.selectpicker').selectpicker('refresh');
    // }
    //finde die ID des Bundeslandes und den Namen des Bundeslandes
    var value = $(this).find('option:selected').attr('id');
    var valueName = $(this).find('option:selected').html();

    var saveProjects = [];
    var storeSelectedKreis = [];

    //suche alle Landkreise, die mit dem AGS des Bundeslandes beginnen und speichere sie im Array (z.B. SH = 01 -> LK = 01***)

    for (var j = 0; j < dataLandkreise.length; j++) {
        if (dataLandkreise[j].SDV_RS.startsWith(value)) {
            saveProjects.push(dataLandkreise[j]);
        }
    }
    checkLayers();
    //drawLayers(esrikreise, dataKreise, onEachFeature);
    drawLayers(landkreise, saveProjects, onEachCategorie);

    $('#myLandkreis').children().remove();
    //wenn Bundesland und nicht Auswahl 'alle', dann Selectbox der Landkreise pro Bundesland neu rendern
    if (saveProjects.length > 0) {


        $('#myLandkreis.selectpicker').append('<option attr_bid="' + value + '" value="x" id= "y" data-subtext="" > --- alle in ' + valueName + ' --- </option>');

        for (var j = 0; j < saveProjects.length; j++) {
            $('#myLandkreis.selectpicker').append('<option attr_bid="' + saveProjects[j].SN_L + '" data-sdv= "' + saveProjects[j].SDV_RS + '" data-subtext="' + saveProjects[j].BEZ + '"id="' + saveProjects[j].SDV_RS + '">' + saveProjects[j].BEZ + ' ' + saveProjects[j].GEN + ' </option>');
        }
        $("#myLandkreis.selectpicker").selectpicker('refresh');
        $("#myLandkreis.selectpicker").selectpicker('render');

    } else {
        $('#myLandkreis.selectpicker').append('<option attr_bid="y" value="y" data-sdv= "0" data-subtext="" id="y"> --- alle ---  </option>');

        for (var j = 0; j < dataLandkreise.length; j++) {
            $('#myLandkreis.selectpicker').append('<option attr_bid="' + dataLandkreise[j].SN_L + '" id="' + dataLandkreise[j].SDV_RS + '">' + dataLandkreise[j].BEZ + ' ' + dataLandkreise[j].GEN + '</option>');
        }
        $("#myLandkreis.selectpicker").selectpicker('refresh');
        $("#myLandkreis.selectpicker").selectpicker('render');

    }
});


//Seite neu laden, alle Filter zuruecksetzen
$('#buttonResetFilter').on('click', function() {
    location.reload();
});