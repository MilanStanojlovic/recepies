import axios from 'axios';
import { apiKey, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    calculateTime() {
        //calculate time for preparation based on number of ingredients
        //need 15mins for 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calculateServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            //1.Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3.Parse ingredients into count, unit and ingredient
            const arrayIngredients = ingredient.split(' ');
            const unitIndex = arrayIngredients.findIndex(el2 => units.includes(el2));

            let objIngredient;
            if (unitIndex > -1) {
                //there is a unit
                //Ex. 4 1/2 cups, arrCount is[4,12]  ---> eval('4+1/2') --> 4.5
                //Ex. 4 cups, arrCount[4]
                const arrCount = arrayIngredients.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrayIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrayIngredients[unitIndex],
                    ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrayIngredients[0], 10)) {
                //there is no unit, but 1st element is number
                objIngredient = {
                    count: parseInt(arrayIngredients[0], 10),
                    unit: '',
                    ingredient: arrayIngredients.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //there is no unit and no number in 1st position
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIngredient;
            // return ingredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}