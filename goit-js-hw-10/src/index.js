import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    // e.preventDefault();
    const nameCountries = e.target.value.trim();
    fetchCountries(nameCountries)
        .then((countries) => {
            if (countries.length > 10) {
                e.preventDefault()
               Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
            } else if (countries.length > 2 && countries.length <= 10) {
                const liElement = countries.map(({flags, name}) => {
                    return `<li class="country-list-item"><img src="${flags.svg}" alt="">${name}</li>`                            
                }).join('');
                ul.insertAdjacentHTML('afterbegin', liElement);
            } else {
                ul.innerHTML = '';
                const { name, capital, population, languages, flags } = countries[0];
                const langs = languages.map(lang => { return lang.name }).join(', ');
                const liElementsmarkup = `<li class="country-list-item"><img src="${flags.svg}" alt="">${name}</li>` 
                    ul.insertAdjacentHTML('afterbegin', liElementsmarkup);  
                const divElements = 
                        `<p class="paragraph-info">Capital: ${capital}</p>
                        <p class="paragraph-info">Population: ${population}</p>
                        <p class="paragraph-info">Languages: ${langs}</p>`;
                    div.insertAdjacentHTML('afterbegin', divElements);                
            }         
        })
        .catch(error => Notiflix.Notify.failure("Oops, there is no country with that name"));
}