import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * -Search object
 * -Current recepie object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2. New Search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        //4. Search for recipes
        await state.search.getResults();

        //5. Render Results on UI
        // console.log(state.search.result);
        //-Removing the loader
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//function that goes to page when clicked on the button
elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        //reading HTML dataset value 
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});


// RECIPE CONTROLLER

const r = new Recipe(46956);
r.getRecipe();
console.log(r);