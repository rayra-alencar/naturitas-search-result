import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
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
            map: this.props.searchQuery.variables.map,
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
        console.log(selectedOption);

        const map = this.getParameterByName('map', selectedOption.Link)
        let rest = [...this.state.rest]
        rest.push(selectedOption.Name)
        this.setState({ rest, map });
        console.log({map, rest: rest.join(',')})
        this.props.updateQuerySearch(map, rest.join(','))
    }

    render() {
        const { facets, params } = this.props

        

        let catChildren = []
        let flags = []
        let format = []
        let brands = []

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

            flags = facets.SpecificationFilters.filter((item) => {
                return item.name == 'flags'
            })
    
            format = facets.SpecificationFilters.filter((item) => {
                return item.name == 'content_format'
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
                <div className="filter_block">
                    <div className="title"> <FormattedMessage id="toolbar.filter.flags" /> </div>

                    {flags.length > 0 &&
                        <ul>
                            {flags[0].facets.map(item =>
                                (
                                    <li>
                                        <span className={"filterCheck "+(this.state.rest.some((rest) => {return (rest==item.Name)} ) ? 'selected' : '')} onClick={(e) => this.handleChangeFilter(item)}>
                                            {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    }
                </div>

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

                <div className="filter_block">
                    <div className="title"> <FormattedMessage id="toolbar.filter.content_format" /> </div>

                    {format.length > 0 &&
                        <ul>
                            {format[0].facets.map(item =>
                                (
                                    <li>
                                        <span className={"filterCheck "+(this.state.rest.some((rest) => { return (rest==item.Name)} ) ? 'selected' : '')}>
                                            {item.Name.charAt(0).toUpperCase() + item.Name.slice(1)}
                                            <span className="filterQuantity">({item.Quantity})</span>
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    }
                </div>
            </div>
        )
    }
}

export default FilterBlock