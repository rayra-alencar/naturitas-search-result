import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FilterGroupReview extends Component {
    render() {
        const {item, rest, type, filterName, filterItemsLength} = this.props;

        let nbStars = parseInt(item.Name)
        let restName = item.Name
        while(nbStars<5){
            nbStars++
            restName += `,${nbStars}`
            
        }

        return (
            <span data-text={item.Name} className={"reviewsCheck filterCheck " + (rest.some((rest) => { return (rest == restName) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, type, filterName)}>
                <span class="filter-attr-item-extra">
                </span>
                <div className="filterQuantityContainer">
                    {parseInt(item.Name) != filterItemsLength && (
                        <FormattedMessage id={"toolbar.filter.ormore"} />
                    )}
                    <span className="filterQuantity">({item.Quantity})</span>
                </div>
            </span>
        )
    }
}

export default FilterGroupReview