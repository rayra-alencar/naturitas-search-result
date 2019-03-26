import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FilterGroup extends Component {
    static defaultProps = {
        itemsNotExpanded: 5
      }

    constructor(props){
        super(props);

        this.state = {
            expanded: false,
        }
    }


    render() {
        const { filterGroup, itemsNotExpanded } = this.props

        if(filterGroup.length <= 0) return '';

        let filterItems =  filterGroup[0].facets;
        if(!this.state.expanded){
            filterItems =  filterGroup[0].facets.slice(0,itemsNotExpanded)
        }
        
        return (
            <Fragment>
                    <div className="filter_block">
                        <div className="title"> <FormattedMessage id={"toolbar.filter." + filterGroup[0].name} /> </div>
                        <ul>
                            {filterItems.map(item =>
                                (
                                    <li>
                                        <span className={"filterCheck " + (this.props.rest.some((rest) => { return (rest == item.Name) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item)}>
                                            {item.Name.charAt(0).toUpperCase() + item.Name.slice(1)} <span className="filterQuantity">({item.Quantity})</span>
                                        </span>
                                    </li>
                                )
                            )}


                        </ul>
                        
                        {(filterGroup[0].facets.length>itemsNotExpanded) &&
                        <ul class="cont-showmore d-block">
                            <li class="amshopby-clearer">
                                <a id="amshopby-category-more" class="amshopby-more" href="#" onClick={(e) => {e.preventDefault(); this.setState({expanded: !this.state.expanded})}} >
                                    {(!this.state.expanded) 
                                        ? <FormattedMessage id={"toolbar.filter.showmore"}/>
                                        : <FormattedMessage id={"toolbar.filter.showless"}/>
                                    }
                                    
                                </a>
                            </li>
                        </ul>
                        }



                    </div>
            </Fragment>
        )
    }
}

export default FilterGroup