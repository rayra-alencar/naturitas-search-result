import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import FilterGroup from './FilterGroup';
const optionsMinPrice = [
    { value: '0', label: '0€' },
    { value: '10', label: '10€' },
    { value: '20', label: '20€' },
    { value: '30', label: '30€' },
    { value: '40', label: '40€' },
    { value: '50', label: '50€' }
];
const optionsMaxPrice = [
    { value: '0', label: '0€' },
    { value: '10', label: '10€' },
    { value: '20', label: '20€' },
    { value: '30', label: '30€' },
    { value: '40', label: '40€' },
    { value: '99999', label: '50€+' }
];


class FilterBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minPrice: optionsMinPrice[0],
            maxPrice: optionsMaxPrice[optionsMaxPrice.length-1],
            map: [],
            rest : [],
            selectedFilters: []
        }
    }
    handleChangeMinPrice = (selectedOption) => {
        this.setState({ minPrice: selectedOption });
    }
    handleChangeMaxPrice = (selectedOption) => {
        this.setState({ maxPrice: selectedOption });
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        console.log(url)
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    handleChangeFilter = (selectedOption) => {
        

        let queryMap = this.getParameterByName('map', selectedOption.Link)
        let rest = [...this.state.rest]
        let map = [...this.state.map]

        let indexOfRest = rest.indexOf(selectedOption.Name) 
        
        let mapClicked = queryMap.split(',').pop();
        
        console.log(indexOfRest)
        if(indexOfRest==-1 ){
            rest.push(selectedOption.Name)
            map.push(mapClicked)
            
        }
        else{
            rest.splice(indexOfRest,1)
            map.splice(indexOfRest,1)
        }

        
        this.setState({ rest, map });
        console.log({map: [...this.props.map, ...this.state.map], rest: rest.join(',')})
        this.props.updateQuerySearch([...this.props.map, ...this.state.map], rest.join(','))
    }

    render() {
        const { facets, params } = this.props

        

        let catChildren = []
        let flags = []
        let format = []
        let brands = []
        let main_components = []
        let content_format = []
        let container = []
        let size = []
        let color = []
        let essences = []
        let flavours = []

        if (facets) {
            if (params.subcategory) {
                catChildren = facets.CategoriesTrees[0].Children[0].Children
            }
            else if (params.category) {
                catChildren = facets.CategoriesTrees[0].Children[0].Children
            }
            else {
                catChildren = facets.CategoriesTrees[0].Children
            }

            /*
                Os paso todos los campos que han de ser filtrables en VTEX.
                rich_structured_content[logical_brand]
                flavours
                essences
                color
                size
                structured_presentation[container]
                structured_presentation[content_format]
                rich_structured_content[flags]
                rich_structured_content[main_components]
            */

            flags = facets.SpecificationFilters.filter((item) => {
                return item.name == 'flags'
            })
    
            format = facets.SpecificationFilters.filter((item) => {
                return item.name == 'content_format'
            })

            flavours = facets.SpecificationFilters.filter((item) => {
                return item.name == 'flavours'
            })

            essences = facets.SpecificationFilters.filter((item) => {
                return item.name == 'essences'
            })

            color = facets.SpecificationFilters.filter((item) => {
                return item.name == 'color'
            })

            size = facets.SpecificationFilters.filter((item) => {
                return item.name == 'size'
            })

            container = facets.SpecificationFilters.filter((item) => {
                return item.name == 'container'
            })

            content_format = facets.SpecificationFilters.filter((item) => {
                return item.name == 'content_format'
            })

            main_components = facets.SpecificationFilters.filter((item) => {
                return item.name == 'main_components'
            })

            

            brands = facets.Brands
        }

        const { minPrice, maxPrice } = this.state;

        return (
            <div id="sideBar">

                {catChildren.length > 0 &&
                    <div className="filter_block mb-3">
                        <div className="title"><FormattedMessage id="toolbar.filter.category" /> </div>


                        <ul>
                            {catChildren.map(item =>
                                (
                                    <li>
                                        <Link to={item.Link.toLowerCase()}>
                                            {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>

                    </div>
                }

                <div className="filter_block">
                    <div className="title"><FormattedMessage id="toolbar.filter.brands" /></div>

                    {brands.length > 0 &&
                        <ul>
                            {brands.map(item =>
                                (
                                    <li>
                                        <Link className="filterCheck" to={item.Link.toLowerCase()}>
                                            {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    }


                </div>

                <FilterGroup filterGroup={flags} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                

                <div className="filter_block">
                    <div className="title"> <FormattedMessage id="toolbar.filter.price" /> </div>

                    <ol className="single-choice price-filter">
                        <li className={"d-flex"}>
                            <div class="row-wrap">
                                <label>Mínimo</label>
                                <Select
                                    value={minPrice}
                                    onChange={this.handleChangeMinPrice}
                                    options={optionsMinPrice}
                                />
                            </div>
                            <div class="row-wrap">
                                <label>Máximo</label>
                                <Select
                                    value={maxPrice}
                                    onChange={this.handleChangeMaxPrice}
                                    options={optionsMaxPrice}
                                />
                            </div>

                        </li>



                    </ol>
                </div>

                <FilterGroup filterGroup={content_format} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={container} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={main_components} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={color} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={size} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={essences} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                <FilterGroup filterGroup={flavours} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
                

                
            </div>
        )
    }
}

export default FilterBlock