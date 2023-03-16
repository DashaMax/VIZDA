$.getJSON('http://127.0.0.1:8000/api/sport-objects/?format=json', function(data){

    // Отображение объектов на карте //

    let map;
    let marker;

    document.querySelector('.count span').innerHTML += data.length;

    function initMap(){
        map = new ymaps.Map('map', {
            center: [60.04, 92.9],
            zoom: 3
        });

        for(let i = 0; i < data.length; i++){
            if (data[i].coordY && data[i].coordX){

                if(data[i].action == 'строительство'){
                    marker = new ymaps.Placemark([data[i].coordY, data[i].coordX], {
                    hintContent: data[i].title,
                    balloonContentHeader: data[i].title,
                    balloonContentBody: data[i].short_description.slice(0, 100) + '...',
                    balloonContentFooter: "<p class='fs-6'><a href=" + "http://127.0.0.1:8000/sport-object/" +
                                            data[i].slug + " class=' link-secondary'>Подробнее >></a></p>"
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
                    balloonContentFooter: "<p class='fs-6'><a href=" + "http://127.0.0.1:8000/sport-object/" +
                                            data[i].slug + " class=' link-secondary'>Подробнее >></a></p>"
                    },
                    {
                        preset: 'islands#violetCircleDotIcon'
                    });
                }

                map.geoObjects.add(marker);
            }
        }
    }
    ymaps.ready(initMap);



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

    document.querySelector('.subject span').innerHTML += `${subjectList[0][0]}, ${subjectList[1][0]}, ${subjectList[2][0]}`;

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



    // Диаграмма количества объектов спортивного комплекса //

    let ctxObj = document.getElementById('objChart');
    let complex = new Object();
    let slugTypes = new Object();

    for(let i = 0; i < data.length; i++){
        if(!(data[i].type_of_sport_complex.title in complex)){
            complex[data[i].type_of_sport_complex.title] = [1, data[i].financing]
            slugTypes[data[i].type_of_sport_complex.title] = data[i].type_of_sport_complex.slug
        }
        else{
            complex[data[i].type_of_sport_complex.title][0] += 1
            complex[data[i].type_of_sport_complex.title][1] += data[i].financing
        }
    }

    let typeList = [];

    for (let type in complex) {
        typeList.push([type, complex[type][0], complex[type][1]]);
    }
    typeList.sort(function(a, b) {
        return b[1] - a[1];
    });

    document.querySelector('.complex span').innerHTML += `${typeList[0][0]}, ${typeList[1][0]}, ${typeList[2][0]}`;

    let summaOther = 0;
    let ul1 = document.querySelectorAll('.block-data ul')[0];

    for (let i = 6; i < typeList.length; i++) {
        summaOther += typeList[i][1];

        if(typeList[i][0]){
            ul1.insertAdjacentHTML("beforeend", `<li><a href=http://127.0.0.1:8000/type-of-sport-complex/${slugTypes[typeList[i][0]]} class='text-decoration-none link-dark'>${typeList[i][0]}</a></li>`)
        }
    }

    let pieLabels = typeList.slice(0, 6).map(x => x[0]);
    pieLabels.push('другое');
    let pieData = typeList.slice(0, 6).map(x => x[1]);
    pieData.push(summaOther);

    new Chart(ctxObj, {
        type: 'pie',
        data: {
              labels: pieLabels,
              datasets: [{
                data: pieData,
                backgroundColor: ["#0B092F", "#08B590", "#1910CB", "#4E19B8", "#2088E9", "#054C8F", "#C7C7C7"]
              }]
        },
        options: {
            onClick: (event) => {
                let title = event.chart.tooltip.title;
                if(title != 'другое'){
                    window.location.href="http://127.0.0.1:8000/type-of-sport-complex/" + slugTypes[title];
                }
            }
        }
    });


    // Диаграмма финансирование объектов спортивного комплекса //

    let ctxFin = document.getElementById('finChart');

    typeList.sort(function(a, b) {
        return b[2] - a[2];
    });

    let summaFinOther = 0;
    let ul2 = document.querySelectorAll('.block-data ul')[1];

    for (let i = 6; i < typeList.length; i++) {
        summaFinOther += typeList[i][2];

        if(typeList[i][0]){
            ul2.insertAdjacentHTML("beforeend", `<li><a href=http://127.0.0.1:8000/type-of-sport-complex/${slugTypes[typeList[i][0]]} class='text-decoration-none link-dark'>${typeList[i][0]}</a></li>`)
        }
    }

    pieData = typeList.slice(0, 6).map(x => x[2]);
    pieData.push(summaFinOther);

    new Chart(ctxFin, {
        type: 'pie',
        data: {
              labels: pieLabels,
              datasets: [{
                data: pieData,
                backgroundColor: ["#0B092F", "#2088E9","#08B590","#A86ED4","#054C8F", "#1910CB", "#C7C7C7"]
              }]
        },
        options: {
            onClick: (event) => {
                let title = event.chart.tooltip.title;
                if(title != 'другое'){
                    window.location.href="http://127.0.0.1:8000/type-of-sport-complex/" + slugTypes[title];
                }
            }
        }
    });

});

