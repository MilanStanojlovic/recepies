import axios from 'axios';
import { apiKey, proxy } from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.imgage_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        }catch(error){
            console.log(error);
        }
    }

    calculateTime(){
        //calculate time for preparation based on number of ingredients
        //need 15mins for 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calculateServings(){
        this.servings = 4;
    }
}