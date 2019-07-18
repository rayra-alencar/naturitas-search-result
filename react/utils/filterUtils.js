
export function fillStars(reviews){
    for(let i = 1; i <= 5; i++){
        if(!reviews.some(item => parseInt(item.Name) == i)){
            let auxRatings = {...reviews[0]};
            auxRatings.Name = i.toString();
            auxRatings.Quantity = 0;
            reviews.push(auxRatings);
        }
    }

    return reviews
}

export function orderStars(reviews){
    reviews.sort((a, b) => (a.Name > b.Name) ? 1 : -1)

    return reviews
}

export function fillQuantityStars(reviews) {
    let auxObj = [];

    for(let i in reviews){
        let auxReview = {...reviews[i]}
        auxReview.Quantity = reviews.slice(i).reduce((acc, review) => acc + review.Quantity, 0)
        auxObj.push(auxReview);
      }
    return auxObj;
   
    /*let totalValue = 0;
    let cascadeFilter = 0;
    let auxObj = [];

    for(let i = 0; i < reviews.length; i++) {
        totalValue += reviews[i].Quantity;
    }

    for(let i = 0; i < reviews.length; i++) {
        let auxReview = {...reviews[i]};
        cascadeFilter = totalValue;
        for(let j = 0; j < i; j++) {
            cascadeFilter -= reviews[j].Quantity;
        }
        auxReview.Quantity = cascadeFilter;
        auxObj.push(auxReview)
    }

    reviews = auxObj;

    return reviews*/
}