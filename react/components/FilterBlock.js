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
    static defaultProps = {
        categoriesNotExpanded: 5
      }

    constructor(props) {
        super(props);
        this.state = {
            minPrice: optionsMinPrice[0],
            maxPrice: optionsMaxPrice[optionsMaxPrice.length-1],
            map: [],
            rest : [],
            selectedFilters: [],
            expanded: false
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
        
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    handleChangeFilter = (selectedOption, type) => {
        let mapClicked = ''
        let rest = [...this.state.rest]
        let map = [...this.state.map]

        if(type=="brand"){
            mapClicked = 'b'
        }
        else{
            let queryMap = this.getParameterByName('map', selectedOption.Link)
            
            map = [...this.state.map]
            mapClicked = queryMap.split(',').pop();
        }


        let indexOfRest = rest.indexOf(selectedOption.Name) 
        
        
        if(indexOfRest==-1 ){
            rest.push(selectedOption.Name)
            map.push(mapClicked)
            
        }
        else{
            rest.splice(indexOfRest,1)
            map.splice(indexOfRest,1)
        }

        
        this.setState({ rest, map });
        
        this.props.updateQuerySearch([...this.props.map, ...map].join(','), rest.join(','))
    }

    render() {
        const { facets, params, categoriesNotExpanded } = this.props

        

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
            let categoryTree =  facets.CategoriesTrees.filter(item => item.Id != 1 )
            if (params.subcategory) {
                catChildren = categoryTree[0].Children[0].Children
            }
            else if (params.category) {
                catChildren = categoryTree[0].Children[0].Children
            }
            else {
                catChildren = categoryTree[0].Children
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

        let categoryItems = catChildren;
        if(!this.state.expanded){
            categoryItems =  catChildren.slice(0,categoriesNotExpanded)
        }
        

        return (
            <div id="sideBar">

                {catChildren.length > 0 &&
                    <div className="filter_block mb-3">
                        <div className="title"><FormattedMessage id="toolbar.filter.category" /> </div>


                        <ul>
                            {categoryItems.map(item =>
                                (
                                    <li>
                                        <Link to={item.Link.toLowerCase()}>
                                            {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>

                        {(catChildren.length>categoriesNotExpanded) &&
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
                }

                <FilterGroup filterGroup={brands} type="brand" rest={this.state.rest} handleChangeFilter={this.handleChangeFilter}/>
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