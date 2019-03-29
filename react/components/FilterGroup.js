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
        let { filterGroup, itemsNotExpanded } = this.props

        
        

        if(filterGroup.length <= 0) return '';
        
        let filterItems = []
        let filterName = ''
        let nbFilter = 0;
        
        

        if(this.props.type == 'brand'){
            filterItems = filterGroup
            nbFilter = filterGroup.length;
            filterName = 'brands'
            console.log(this.props.type)
        }
        else{
            filterItems =  filterGroup[0].facets;
            nbFilter = filterGroup[0].facets.length; 
            filterName = filterGroup[0].name
        }

        if(!this.state.expanded){
            filterItems =  filterItems.slice(0,itemsNotExpanded)
        }

        console.log(filterItems.length>itemsNotExpanded )
        console.log(filterItems.length,itemsNotExpanded )

       
        
        return (
            <Fragment>
                    <div className="filter_block">
                        <div className="title"> <FormattedMessage id={"toolbar.filter." + filterName} /> </div>
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
                        
                        {(nbFilter>itemsNotExpanded) &&
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