let url = document.URL.split('/');

$.getJSON('http://127.0.0.1:8000/api/sport-objects/type-of-sport-complex/' + url[url.length - 2] + '/?format=json', function(data){

    // Отображение объектов на карте //

    let ul = document.querySelector('.block-data ul');
    let p = document.querySelector('.address');
    let map;
    let marker;

    function initMap(){
        map = new ymaps.Map('map', {
            center: [60.04, 92.9],
            zoom: 3
        });

        for(let i = 0; i < data.length; i++){
            map.setCenter([data[i].coordY, data[i].coordX]);

            if(i > 5){
                ul.insertAdjacentHTML("beforeend", `<li style="display: none"><a class="text-decoration-none link-dark" href="http://127.0.0.1:8000/sport-object/${data[i].slug}">${data[i].address}</a></li>`);
                p.style.display = 'block';
            }

            else{
                ul.insertAdjacentHTML("beforeend", `<li><a class="text-decoration-none link-dark" href="http://127.0.0.1:8000/sport-object/${data[i].slug}">${data[i].address}</a></li>`)
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



    // Построение диаграммы - распределение по субъектам

    let ctxSub = document.getElementById('subChart');
    let subjects = new Object();
    let slugSubjects = new Object();

    for(let i = 0; i < data.length; i++){
        if(!(data[i].subject.title in subjects)){
            subjects[data[i].subject.title] = 1
            slugSubjects[data[i].subject.title] = data[i].subject.slug
        }
        else{
            subjects[data[i].subject.title] += 1
        }
    }

    let subjectList = [];

    for (let subject in subjects) {
        subjectList.push([subject, subjects[subject]]);
    }
    subjectList.sort(function(a, b) {
        return b[1] - a[1];
    });

    new Chart(ctxSub, {
        type: 'bar',
        data: {
              labels: subjectList.map(x => x[0]),
              datasets: [{
                label: 'Количество',
                data: subjectList.map(x => x[1]),
                backgroundColor: '#1F1C5F',
              }]
        },
        options: {
            onClick: (event) => {
                let title = event.chart.tooltip.title;
                if(title){
                    window.location.href="http://127.0.0.1:8000/subject/" + slugSubjects[title];
                }
            }
        }
    });



    // Финансирование комплекса

    let finance = 0;

    for(let i = 0; i < data.length; i++){
        finance += data[i].financing;
    }

    let formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    });

    document.querySelector('.count span').innerHTML += data.length;
    document.querySelector('.finance-summa span').innerHTML += formatter.format(finance);
    document.querySelector('.finance-mean span').innerHTML += formatter.format(Math.round(finance / data.length));

});