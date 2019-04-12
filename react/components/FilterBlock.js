import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import FilterGroup from './FilterGroup';
const optionsMinPrice = [
    { value: '0', label: '0€' },
    { value: '5', label: '5€' },
    { value: '10', label: '10€' },
    { value: '20', label: '20€' },
    { value: '30', label: '30€' },
    { value: '40', label: '40€' },
    { value: '50', label: '50€' }
];
const optionsMaxPrice = [
    { value: '0', label: '0€' },
    { value: '5', label: '5€' },
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
            maxPrice: optionsMaxPrice[optionsMaxPrice.length - 1],
            map: [],
            rest: [],
            selectedFilters: [],
            expanded: false,
            mobileFiltersActive: false,
            mobileFilterGroupActive: false
        }
    }
    handleChangeMinPrice = (selectedOption) => {
        this.setState({ minPrice: selectedOption });
        this.props.updatePrice(selectedOption.value, this.state.maxPrice.value);
    }
    handleChangeMaxPrice = (selectedOption) => {
        this.setState({ maxPrice: selectedOption });
        
        this.props.updatePrice(this.state.minPrice.value, selectedOption.value);
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

        if (type == "brand") {
            mapClicked = 'b'
        }
        else {
            let queryMap = this.getParameterByName('map', selectedOption.Link)

            map = [...this.state.map]
            mapClicked = queryMap.split(',').pop();
        }


        let indexOfRest = rest.indexOf(encodeURIComponent(selectedOption.Name))


        if (indexOfRest == -1) {
            rest.push(encodeURIComponent(selectedOption.Name))
            map.push(mapClicked)

        }
        else {
            rest.splice(indexOfRest, 1)
            map.splice(indexOfRest, 1)
        }

        

        
        this.setState({ rest, map });
        this.props.updateQuerySearch([...(this.props.map).split(','), ...map].join(','), rest.join(','))
        this.handleExpandFiltersMobile()
    }

    handleExpandFiltersMobile = (checkIfIsActive) => {
        if(this.props.mobileMode && (!checkIfIsActive || !this.state.mobileFiltersActive))
            this.setState({mobileFiltersActive: !this.state.mobileFiltersActive})
    }

    setDisplayGroup = (active) => {
        if(this.props.mobileMode)
            this.setState({mobileFilterGroupActive: active});
    }

    render() {
        const { facets, params, categoriesNotExpanded, mobileMode } = this.props



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


        if (facets && facets.CategoriesTrees[0]) {
            let categoryTree = facets.CategoriesTrees.filter(item => item.Id != 1)
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

        const { minPrice, maxPrice, mobileFilterGroupActive } = this.state;

        let categoryItems = catChildren;
        if (!this.state.expanded) {
            categoryItems = catChildren.slice(0, categoriesNotExpanded)
        }




        return (
            <div id="sideBar" className={this.state.mobileFiltersActive ? 'active' : ''}>
                <div className="block-subtitle block-subtitle--filter d-flex d-md-none" onClick={(e) => this.handleExpandFiltersMobile(true)}>
                    
                    <div className="back-icon toggleShow my-auto ml-3" onClick={e => this.setDisplayGroup(false)}>
                        {this.state.mobileFiltersActive && mobileFilterGroupActive && 
                            <i className="icon-lateral_arrow"></i>
                        }
                    </div>
                    
                    <div className="m-auto" onClick={(e) => this.handleExpandFiltersMobile()} >
                        <i className="icon-filter"></i>
                            <FormattedMessage id="toolbar.filters" />                    
                    </div>

                    <div className="my-auto mr-3" onClick={(e) => this.handleExpandFiltersMobile()}>
                        {this.state.mobileFiltersActive &&
                            <i className="icon-close"></i>    
                        }
                    </div>
                    
                    

                </div>

                <div id="filter-container" className={mobileFilterGroupActive ? 'active' : ''}>

                    <FilterGroup mobileMode={mobileMode} activeDesktop={true} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={catChildren} type="category" rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} activeDesktop={true} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={brands} type="brand" rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} activeDesktop={true} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={flags} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />


                    <div className="filter_block mb-1">
                        <div className="title"> <FormattedMessage id="toolbar.filter.price" /> </div>

                        <ol className="single-choice price-filter">
                            <li className={"d-flex"}>
                                <div className="row-wrap">
                                    <label><FormattedMessage id="toolbar.filter.pricemin" /></label>
                                    <Select
                                        value={minPrice}
                                        onChange={this.handleChangeMinPrice}
                                        options={optionsMinPrice}
                                    />
                                </div>
                                <div className="row-wrap">
                                    <label><FormattedMessage id="toolbar.filter.pricemax" /></label>
                                    <Select
                                        value={maxPrice}
                                        onChange={this.handleChangeMaxPrice}
                                        options={optionsMaxPrice}
                                    />
                                </div>

                            </li>



                        </ol>
                    </div>

                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={content_format} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={container} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    {/*<FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={main_components} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />*/}
                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={color} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={size} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={essences} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />
                    <FilterGroup mobileMode={mobileMode} mobileFilterGroupActive={mobileFilterGroupActive} setDisplayGroup={this.setDisplayGroup} filterGroup={flavours} rest={this.state.rest} handleChangeFilter={this.handleChangeFilter} />


                </div>
            </div>
        )
    }
}

export default FilterBlock