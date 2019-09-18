import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FilterGroupReview extends Component {
    render() {
        const {item, index, rest, type, filterName, filterItemsLength} = this.props;

        let nbStars = parseInt(item.name)
        let restName = item.name
        while(nbStars<5){
            nbStars++
            restName += `,${nbStars}`
            
        }

        return (
            <span data-text={item.name} className={"reviewsCheck filterCheck " + (rest.some((rest) => { return (rest == restName) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, type, filterName)}>
                <span className="filter-attr-item-extra">
                </span>
                <div className="filterQuantityContainer">
                    {parseInt(index+1) != filterItemsLength && (
                        <FormattedMessage id={"store/toolbar.filter.ormore"} />
                    )}
                    <span className="filterQuantity">({item.quantity})</span>
                </div>
            </span>
        )
    }
}

export default FilterGroupReview