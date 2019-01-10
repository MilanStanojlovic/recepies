import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const apiKey = '5988cc83099b6998999dcc1d94d9f0db';
        try{
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
        this.result = res.data.recipes;
        //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}






