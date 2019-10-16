const form = document.querySelector('.form'),
countries = document.querySelector('.select__countries'),
cities = document.querySelector('.select__cities'),
airports = document.querySelector('.select__airports'),
result = document.querySelector('.result'),
error = document.querySelector('.error'),
arr_airports = new Map()
obj_prevData = {
    countries: '',
    cities: '',
    airports: ''
};
let flag = true;

function queryParam (name) {

return fetch(`https://raw.githubusercontent.com/vovkabelov/data/master/json/${name}.json`)
    .then(resp => resp.json())
    .catch(error => {
        console.log(error)
    })

}

function resultBlock (air) {
    result.innerHTML = '';

    const optionsTime = {
        timeZone: air.time_zone,
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    }, 
    optionsDate = {
        day: '2-digit', month: '2-digit', year: '2-digit'
    },
    formatTime = new Intl.DateTimeFormat([], optionsTime),
    formatDate = new Intl.DateTimeFormat([], optionsDate),
    div = document.createElement('div');
    div.innerHTML = `<h2 class="result__title">Аэропорт ${air.name || air.name_translations.en}</h2>
        <ul class="result__list">
            <li>Действующий: ${(air.flightable) ? 'Да':'Нет'}</li>
            <li>Код ИАТА: ${air.code}</li>
            <li>Местное время: ${formatTime.format(new Date())} (${formatDate.format(new Date())})</li>
        </ul>`;
    result.appendChild(div);
}

countries.addEventListener('change', function () {

    cities.closest('.form__cities').classList.remove('active');
    cities.innerHTML = '';
    airports.closest('.form__airports').classList.remove('active');
    airports.innerHTML = '';
    result.innerHTML = '';

    if(this.value != 0 && obj_prevData.countries !== this.value){
        obj_prevData.countries = this.value;

        queryParam('cities')
            .then(json => {   
                 
                json
                    .filter(cont => { return cont.country_code === this.value})
                    .sort((a, b) => (a.name > b.name) ? 1 : -1 )
                    .map(elem => {
                    if (flag) {
                        let option = new Option('Не выбрано', 0);
                        cities.appendChild(option);
                    }

                    if (elem.name) {
                        let option = new Option(elem.name, elem.code);
                        cities.appendChild(option);
                    }
                    flag = false;
                    
                })
                flag = true;
                cities.closest('.form__cities').classList.add('active')
            })
    }
})

cities.addEventListener('change', function () {

    airports.closest('.form__airports').classList.remove('active');
    airports.innerHTML = '';
    result.innerHTML = '';

    if(this.value != 0 && obj_prevData.cities !== this.value) {
        obj_prevData.cities = this.value;
        queryParam('airports')
            .then(json => {  
                    error.innerHTML = '';
                    json
                        .filter(cont => cont.city_code === this.value)
                        .sort((a, b) => (a.name > b.name) ? 1 : -1)
                        .map(elem => {
                            if (!json.length) {
                                error.innerHTML = "В данном городе нет Аэропортов"
                                return
                            }  else { 
                                let name  = elem.name || elem.name_translations.en;
                                arr_airports.set(name, elem) 
                                if (flag) {
                                    let option = new Option('Не выбрано', 0);
                                    airports.appendChild(option);
                                }

                                let option = new Option(name, name);
                                airports.appendChild(option);
                                flag = false;
                            }
                        })
                flag = true;
                airports.closest('.form__airports').classList.add('active')
            })
    }
})

airports.addEventListener('change', function () {

    if(this.value != 0){
        resultBlock(arr_airports.get(this.value))      
    }
})


queryParam('countries')
.then(json => {
    json
        .sort((a, b) => (a.name > b.name) ? 1 : -1 )
        .map(elem => {
        const option = document.createElement('option');
        if (flag) {
            option.innerText = 'Не выбрано';
            option.setAttribute('value', 0)
            countries.appendChild(option);
        } else {
            option.innerText = elem.name;
            option.setAttribute('value', elem.code)
            countries.appendChild(option); 
        }
        flag = false;    
    })
    flag = true;
})