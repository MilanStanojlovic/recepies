import { elements } from './base';

export const toggleLikeBtn = isliked => {
    //icons.svg#icon-heart-outlined
    const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};