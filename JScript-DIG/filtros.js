function change(el) {
    if (el.value === "Read More")
        el.value = "Read Less";
    else
        el.value = "Read More";
};

const api_url_house = "https://api.propublica.org/congress/v1/113/house/members.json"
const api_url_senate = "https://api.propublica.org/congress/v1/113/senate/members.json"
const h = {
    type: 'GET',
    datatype: 'json',
    headers: {
        'X-API-Key': 'Q9Eib0KXN0vBcLDpac5VsFUgs1SjUZfpRHg987ft',
    }
};
var api = []
var statistic
var app
var leastEng
var mostEng
var leastLoyalty
var mostLoyalty
var glance

async function llamada(api_url) {
    var datos = await fetch(api_url, h).then(res => res.json())  //funcion que agarra la respuesta del fetch y la vuelve json
    return datos.results[0].members
};

async function tablaStarted(algo) {
    app = new Vue({
        el: "#congress",
        data: {
            miembros: [],
        }
    });
    api = await llamada(algo);
    app.miembros = api

    filtroState(api);
};
function tablaDIG(miemb) {
    app.miembros = miemb
};

/*----------------------------------------------FUNCIONES DE FILTROS-------*/
function Filtros(datas) {
    var checkRepublicano = document.getElementById("fRepublicano");           //variables que contienen las ID de cada checkbox
    var checkDemocratico = document.getElementById("fDemocratico");
    var checkIndependiente = document.getElementById("fIndependiente");
    var selecEstado = document.getElementById("fEstados");

    var filtroMiembros = datas
    var filtroArray = [];
    filtroMiembros.forEach(miembro => {
        if (checkRepublicano.checked && miembro.party == checkRepublicano.value) {
            filtroArray.push(miembro);
        };
        if (checkDemocratico.checked && miembro.party == checkDemocratico.value) {
            filtroArray.push(miembro);
        };
        if (checkIndependiente.checked && miembro.party == checkIndependiente.value) {
            filtroArray.push(miembro);
        };
    });
    if (filtroArray.length == 0) {
        tablaDIG(filtroMiembros);
    } else {
        tablaDIG(filtroArray);
    };
    if (filtroArray.length == 0) {
        filtroArray = filtroMiembros;
    };
    if (selecEstado.value != 'All') {
        tablaDIG(filtroArray.filter(member => member.state == selecEstado.value))
    } else {
        tablaDIG(filtroArray)
    };
};
// INPUT CON LOS ESTADOS FILTRADOS//
function filtroState(data) {
    var estados = []
    data.forEach(member => {
        estados.push(member.state);
    });
    var estadosFiltrados = new Set(estados); //Set no permite valores repetidos
    estadosFiltrados.forEach(state => { //Indico con un forEach que recorra miembro por miembro
        document.getElementById("fEstados").innerHTML += //Con Document.getElementById llamo a la ID de mi filtro en el HTML //con .innerHTML += inserto y concateno linea 36 en html
            `<option value="${state}">${state}</option>`
    });
};

/*------------------------------------PORCENTAJES POR PARTIDO-------------*/
function cuenta(party) {
    var topPcrArray = party / 100 * 10
    return topPcrArray
};
function numDemocratas(data) {
    let democratsArray = [];
    data.forEach(obj => {
        if (obj.party === "D") {
            democratsArray.push(obj);
        }
    })
    return democratsArray.length
};
function numDemocratspct(json, numd) {
    var democratspct = 0;
    json.forEach(votes => {
        if (votes.party === "D") {
            democratspct += votes.votes_with_party_pct;
        }
    })
    let pct_votes = Number((democratspct / numd).toFixed(2));
    return pct_votes
};
function numDemocrataspct(data, numd) {
    let democratspctArray = 0
    data.forEach(obj => {
        if (obj.party === "D") {
            democratspctArray += obj.votes_with_party_pct;
        };
    });
    let pct_votes = Number((democratspctArray / numd).toFixed(2))
    return pct_votes
};
function numRepublicanos(data) {
    let republicanosArray = [];
    data.forEach(obj => {
        if (obj.party === "R") {
            republicanosArray.push(obj);
        };
    });
    return republicanosArray.length;
};
function numRepublicanospct(data, numr) {
    let republicanospctArray = 0
    data.forEach(obj => {
        if (obj.party === "R") {
            republicanospctArray += obj.votes_with_party_pct;
        };
    });
    let pct_votes = Number((republicanospctArray / numr).toFixed(2));
    return pct_votes;
};
function numIndependientes(data) {
    let independientesArray = [];
    data.forEach(obj => {
        if (obj.party === "ID") {
            independientesArray.push(obj);
        };
    });
    return independientesArray.length;
};
function numIndependientespct(data, numid) {
    let independientespctArray = 0
    data.forEach(obj => {
        if (obj.party === "ID") {
            independientespctArray += obj.votes_with_party_pct;
        }
    });
    let pct_votes = Number((independientespctArray / numid).toFixed(2));
    return pct_votes;
};
async function parecido(algo) {
    api = await llamada(algo);
    leastEng = new Vue({
        el: "#leastEng",
        data: {
            le: [],
        }
    });
    mostEng = new Vue({
        el: "#mostEng",
        data: {
            me: [],
        }
    });
    var miembrosTotales = api.length
    var filtroVotos = api.filter(aa => aa.total_votes != 0);

    leastEng.le = filtroVotos.sort(((a, b) =>
    b.missed_votes_pct - a.missed_votes_pct)).slice(0, cuenta(miembrosTotales));

    mostEng.me = filtroVotos.sort(((a, b) =>
    a.missed_votes_pct - b.missed_votes_pct)).slice(0, cuenta(miembrosTotales));

};

async function parecido2(algo) {
    api = await llamada(algo);


   leastLoyalty = new Vue({
        el: "#leastLoyaly",
        data: {
            ll: [],
        }
    });
    mostLoyalty = new Vue({
        el: "#mostLoyaly",
        data: {
            ml: [],
        }
    });

    var miembrosTotales = api.length
    var filtroVotos = api.filter(aa => aa.total_votes != 0);

    leastLoyalty.ll = filtroVotos.sort(((a, b) =>
    a.votes_with_party_pct - b.votes_with_party_pct)).slice(0, cuenta(miembrosTotales));

    mostLoyalty.ml = filtroVotos.sort(((a, b) =>
    b.votes_with_party_pct - a.votes_with_party_pct)).slice(0, cuenta(miembrosTotales));
};

async function tablasGlance(algo) {
    api = await llamada(algo);
    glance = new Vue({
        el: '#tablaGlance',
        data: {
            "nroDemocratas": [],
            "pctVotosDemocratas": [],

            "nroRepublicanos": [],
            "pctVotosRepublicanos": [],

            "nroIndependientes": [],
            "pctVotosIndependientes": [],

            "total": [],
            "pctTotal": [],
        }
    });
    glance.nroDemocratas = numDemocratas(api);
    glance.pctVotosDemocratas = numDemocrataspct(api, numDemocratas(api));

    glance.nroRepublicanos = numRepublicanos(api);
    glance.pctVotosRepublicanos = numRepublicanospct(api, numRepublicanos(api));

    glance.nroIndependientes = numIndependientes(api);
    glance.pctVotosIndependientes = numIndependientespct(api, numIndependientes(api));

    glance.total = numDemocratas(api) + numRepublicanos(api) + numIndependientes(api);

    if (numIndependientes(api) == 0) {
        glance.pctTotal = ((numDemocrataspct(api, numDemocratas(api)) + numRepublicanospct(api, numRepublicanos(api))) / 2).toFixed(2);
    }
    else {
        glance.pctTotal = ((numDemocrataspct(api, numDemocratas(api)) + numRepublicanospct(api, numRepublicanos(api)) + numIndependientespct(miembros, numIndependientes(miembros))) / 3).toFixed(2);
    };
};