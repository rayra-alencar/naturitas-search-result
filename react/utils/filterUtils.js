
export function fillStars(reviews){
    for(let i = 1; i <= 5; i++){
        if(!reviews.some(item => parseInt(item.name) == i)){
            let auxRatings = {...reviews[0]};
            auxRatings.name = i.toString();
            auxRatings.quantity = 0;
            reviews.push(auxRatings);
        }
    }

    return reviews
}

export function orderStars(reviews){
    reviews.sort((a, b) => (a.name > b.name) ? 1 : -1)

    return reviews
}

export function fillQuantityStars(reviews) {
    let auxObj = [];

    for(let i in reviews){
        let auxReview = {...reviews[i]}
        auxReview.quantity = reviews.slice(i).reduce((acc, review) => acc + review.quantity, 0)
        auxObj.push(auxReview);
      }
    return auxObj;
   
    /*let totalValue = 0;
    let cascadeFilter = 0;
    let auxObj = [];

    for(let i = 0; i < reviews.length; i++) {
        totalValue += reviews[i].quantity;
    }

    for(let i = 0; i < reviews.length; i++) {
        let auxReview = {...reviews[i]};
        cascadeFilter = totalValue;
        for(let j = 0; j < i; j++) {
            cascadeFilter -= reviews[j].quantity;
        }
        auxReview.quantity = cascadeFilter;
        auxObj.push(auxReview)
    }

    reviews = auxObj;

    return reviews*/
}