import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FilterGroupReview extends Component {
    render() {
        const {item, rest, type, filterName, filterItemsLength} = this.props;

        return (
            <span data-text={item.Name} className={"reviewsCheck filterCheck " + (rest.some((rest) => { return (rest == encodeURIComponent(item.Name)) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, type, filterName)}>
                <span class="filter-attr-item-extra">
                </span>
                {parseInt(item.Name) != filterItemsLength && (
                    <FormattedMessage id={"toolbar.filter.ormore"} />
                )}
                <span className="filterQuantity">({item.Quantity})</span>
            </span>
        )
    }
}

export default FilterGroupReview