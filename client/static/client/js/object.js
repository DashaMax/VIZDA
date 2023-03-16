let url = document.URL.split('/');

$.getJSON('http://127.0.0.1:8000/api/sport-object/' + url[url.length - 2] + '/?format=json', function(data){

    let map;
    let marker;

    function initMap(){
        map = new ymaps.Map('map', {
            center: [data.coordY, data.coordX],
            zoom: 15
        });
        marker = new ymaps.Placemark([data.coordY, data.coordX],
        {
            hintContent: data.title
        },
        {
            preset: 'islands#nightDotIcon'
        });
        map.geoObjects.add(marker);
    }
    ymaps.ready(initMap);

});