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
div.innerHTML = `<h2>Аэропорт ${air.name}</h2>
    <ul>
        <li>Действующий: ${(air.flightable) ? 'Да':'Нет'}</li>
        <li>Код ИАТА: ${air.code}</li>
        <li>Местное время: ${formatTime.format(new Date())} (${formatDate.format(new Date())})</li>
    </ul>`;
result.appendChild(div)
}

countries.addEventListener('click', function () {

if(this.value != 0){
    queryParam('cities')
        .then(json => {
            
            json
                .filter(cont => { return cont.country_code === this.value})
                .sort((a, b) => (a.name > b.name) ? 1 : -1 )
                .map(elem => {
                const option = document.createElement('option');
                if (flag) {
                        option.innerText = 'Не выбрано';
                        option.setAttribute('value', 0)
                        cities.appendChild(option);
                } else {
                    if (elem.name) {
                        option.innerText = elem.name;
                        option.setAttribute('value', elem.code)
                        cities.appendChild(option);
                    }
                }
                flag = false;
                
            })
            flag = true;
            cities.closest('.form__cities').classList.add('active')
        })
}
})

cities.addEventListener('click', function () {

airports.closest('.form__airports').classList.remove('active')
if(this.value != 0){
    queryParam('airports')
        .then(json => {
            
console.log(json);

            if (!json.length) {
                error.innerHTML = "В данном городе нет Аэропортов"
                return
            } else {
                error.innerHTML = '';
                json
                    .filter(cont => { return cont.city_code === this.value})
                    .sort((a, b) => (a.name > b.name) ? 1 : -1 )
                    .map(elem => {
                        arr_airports.set(elem.name, elem)
                        const option = document.createElement('option');
                        if (flag) {
                            option.innerText = 'Не выбрано';
                            option.setAttribute('value', 0)
                            airports.appendChild(option);
                        } else {
                            if (elem.name) {
                                option.innerText = elem.name;
                                option.setAttribute('value', elem.name)
                                airports.appendChild(option);
                            }
                        }
                        flag = false;
                    })
            flag = true;
            airports.closest('.form__airports').classList.add('active')
            }
        })
}
})

airports.addEventListener('click', function () {

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