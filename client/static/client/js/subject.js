let url = document.URL.split('/');

$.getJSON('http://127.0.0.1:8000/api/objects-of-subject/' + url[url.length - 2] + '/?format=json', function(data){

    // Отображение объектов на карте //

    let ul = document.querySelector('.block-data ul');
    let p = document.querySelector('.address');
    let map;
    let marker;

    function initMap(){
        map = new ymaps.Map('map', {
            center: [55.04, 92.9],
            zoom: 5
        });

        for(let i = 0; i < data.length; i++){
            map.setCenter([data[i].coordY, data[i].coordX]);

            if(i > 5){
                ul.insertAdjacentHTML("beforeend", `<li style="display: none"><a class="text-decoration-none link-dark" href="http://127.0.0.1:8000/sport-object/${data[i].slug}">${data[i].address}</a></li>`);
                p.style.display = 'block';
            }
            else{
                ul.insertAdjacentHTML("beforeend", `<li><a class="text-decoration-none link-dark" href="http://127.0.0.1:8000/sport-object/${data[i].slug}">${data[i].address}</a></li>`);
            }

            if(data[i].action == 'строительство'){
                marker = new ymaps.Placemark([data[i].coordY, data[i].coordX], {
                    hintContent: data[i].title,
                    balloonContentHeader: data[i].title,
                    balloonContentBody: data[i].short_description.slice(0, 100) + '...',
                    balloonContentFooter: "<p class='fs-6'><a href=" + "http://127.0.0.1:8000/sport-object/" + data[i].slug + " class=' link-secondary'>Подробнее >></a></p>"
                },
                {
                    preset: 'islands#nightCircleDotIcon'
                });
            }

            else{
                marker = new ymaps.Placemark([data[i].coordY, data[i].coordX], {
                    hintContent: data[i].title,
                    balloonContentHeader: data[i].title,
                    balloonContentBody: data[i].short_description.slice(0, 100) + '...',
                    balloonContentFooter: "<p class='fs-6'><a href=" + "http://127.0.0.1:8000/sport-object/" + data[i].slug + " class=' link-secondary'>Подробнее >></a></p>"
                },
                {
                    preset: 'islands#violetCircleDotIcon'
                });
            }

            map.geoObjects.add(marker);
        }
    }
    ymaps.ready(initMap);

    p.onclick = function(){
        p.style.display = 'none';
        let liList = document.querySelectorAll('li');

        for(let i = 0; i < liList.length; i++){
            liList[i].style.display = 'list-item';
        }
    }



    // Построение диаграмм //

    let ctxSub = document.getElementById('subChart');
    let ctxObj = document.getElementById('objChart');
    let types = new Object();

    for(let i = 0; i < data.length; i++){
        if(!(data[i].type_of_sport_complex.title in types)){
            types[data[i].type_of_sport_complex.title] = [1, data[i].financing]
        }
        else{
            types[data[i].type_of_sport_complex.title][0] += 1
            types[data[i].type_of_sport_complex.title][1] += data[i].financing
        }
    }

    let typeList = [];

    for (let type in types) {
        typeList.push([type, types[type][0], types[type][1]]);
    }
    typeList.sort(function(a, b) {
        return (b[2] / b[1]) - (a[2] / a[1]);
    });

    new Chart(ctxSub, {
        type: 'bar',
        data: {
              labels: typeList.map(x => x[0]),
              datasets: [{
                label: 'Финансирование',
                data: typeList.map(x => Math.round(x[2] / x[1])),
                backgroundColor: ["#0B092F", "#08B590","#1910CB","#4E19B8","#2088E9", "#054C8F", "#A86ED4", '#206469', '#60F0FB']
              }]
        }
    });

    new Chart(ctxObj, {
        type: 'doughnut',
        data: {
              labels: typeList.map(x => x[0]),
              datasets: [{
                data: typeList.map(x => x[1]),
                backgroundColor: ["#0B092F", "#08B590","#1910CB","#4E19B8","#2088E9", "#054C8F", "#A86ED4", '#206469', '#60F0FB']
              }]
        },
    });

});