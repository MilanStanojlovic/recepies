import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(el => {el.classList.remove('results__link--active')});
    
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

//'Pasta with tomato and spinach'
//acc: 0/ acc + cur.length = 0+5 / new title = ['Pasta']
//acc: 5/ acc + cur.length = 9 / new title = ['Pasta with']
//acc: 9/ acc + cur.length = 15 / new title = ['Pasta with tomato']
//acc: 15 acc + cur.length = 18 / new title = ['Pasta with tomato']
//acc: 18 acc + cur.length = 25 / new title ['Pasta with tomato']

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')}...`;
    } 
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                 <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

//type: prev or next

const createButton = (page, buttonType) => {
    return `
    <button class="btn-inline results__btn--${buttonType}" data-goto=${buttonType === 'prev' ? page -1 : page +1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${buttonType === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${buttonType === 'prev' ? page -1 : page +1}</span>
    </button>
    `;
};

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1){
        //only button to go to the next page
        button = createButton(page, 'next');

    }else if(page < pages){
        //both buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
            `;
        
    }else if(page === pages){
        //only button to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    //number of elements per page (pagination)
    //render results of current page
    const start = (page-1)*resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resultsPerPage);

};