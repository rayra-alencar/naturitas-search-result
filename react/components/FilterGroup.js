import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { fillStars, fillQuantityStars, orderStars } from '../utils/filterUtils';
import FilterGroupReview from './FilterGroupReview';

class FilterGroup extends Component {
    static defaultProps = {
        itemsNotExpanded: 5,
        type: 'spec',
        activeDesktop: false
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.mobileFilterGroupActive == false && prevState.activeMobile == true) {
            return { activeMobile: false };
        }
        else return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            activeMobile: false,
            activeDesktop: props.activeDesktop
        }
    }

    handleChangeDisplayGroup = () => {

        if (this.props.mobileMode) {
            this.setState({ activeMobile: !this.state.activeMobile })
            this.props.setDisplayGroup(!this.state.activeMobile)
        }
        else {
            this.setState({ activeDesktop: !this.state.activeDesktop })
        }
    }

    isSelect = (filterName) => {
        let aux = this.props.parentActive.includes(filterName);
        if (aux) {
            return true
        } else {
            return false
        }
    }

    render() {
        let { filterGroup, itemsNotExpanded, mobileMode, type } = this.props

        if (filterGroup.length <= 0) return '';


        if (filterGroup[0].name == "color") {
            filterGroup = filterGroup.filter(item => (item.Name != ""))
        }



        let filterItems = []
        let filterName = ''
        let nbFilter = 0;

        if (type == 'brand') {
            filterItems = filterGroup
            nbFilter = filterGroup.length;
            filterName = 'brands'
        }
        else if (type == 'category') {
            filterItems = filterGroup
            nbFilter = filterGroup.length;
            filterName = 'category'

            if (nbFilter == 1) {
                filterItems = []
            }

            filterItems.map(item => {
                let linksArrayAux = item.Link.replace(/^\/+|\/+$/g, '').split('/')
                //Si tiene filtro de precio se lo quitamos
                if (linksArrayAux[linksArrayAux.length - 1].indexOf('de-') >= 0) {
                    linksArrayAux.pop();
                }

                let map = ''
                let indexOfMap = linksArrayAux[linksArrayAux.length - 1].indexOf('?map=')
                // WORKARROUND para la mierda de que la API de VTEX vengan los Links al revés
                if (indexOfMap >= 0) {
                    map = linksArrayAux[linksArrayAux.length - 1].substring(indexOfMap)
                    linksArrayAux[linksArrayAux.length - 1] = linksArrayAux[linksArrayAux.length - 1].substring(0, indexOfMap);
                }

                if (linksArrayAux[linksArrayAux.length - 1] && this.props.params.department) {
                    if (linksArrayAux[linksArrayAux.length - 1].toLowerCase() == this.props.params.department.toLowerCase()) {
                        linksArrayAux.reverse();
                    }
                }

                if (linksArrayAux[linksArrayAux.length - 1] && this.props.params.brand) {
                    if (linksArrayAux[linksArrayAux.length - 1].toLowerCase() == this.props.params.brand) {
                        linksArrayAux.pop();
                        // OJO REVISAR CUANDO ESTO VA A VOLVER A FUNCIONAR QUITAR SIGUIENTE LINEA
                        linksArrayAux.reverse();
                    }
                }


                linksArrayAux = linksArrayAux.join('/')

                item.Link = "/" + (linksArrayAux.toLowerCase())


                return item;

            })
        }
        else if (type == 'review') {
            filterItems = fillStars(filterGroup[0].facets)
            filterItems = orderStars(filterItems);
            filterItems = fillQuantityStars(filterItems);

            console.log(filterItems,'filter');

            /*nbFilter = filterGroup[0].facets.length;
            filterName = filterGroup[0].name*/



            /*console.log(filterItems, "FILTERITEMS");
            console.log(nbFilter, "NB PRODUCTS")
            console.log(filterName, "FILTER NAME ")*/
        }
        else {
            filterItems = filterGroup[0].facets;
            nbFilter = filterGroup[0].facets.length;
            filterName = filterGroup[0].name
        }



        filterItems = filterItems.filter(item => (item.Name != "" && item.Name.indexOf('(') < 0 && item.Name.indexOf('Not or Bad Specified Brand')))

        if (type == 'review') {
            filterItems = filterItems.sort((a, b) => {
                if (a.Name > b.Name) return 1
                else if (a.Name < b.Name) return -1
                else return 0
            })
        }

        else{
            filterItems = filterItems.sort((a, b) => {
                if (a.Quantity > b.Quantity) {
                    return -1
                }
                else if (a.Quantity < b.Quantity) {
                    return 1
                }
                else {
                    return 0
                }
            })
        }

        if (filterItems.length <= 0) return '';


        if (!this.state.expanded && !mobileMode) {
            filterItems = filterItems.slice(0, itemsNotExpanded)
        }


        return (
            <Fragment>
                <div className={"filter_block " + ((type == 'category') ? 'mb-md-3 ' : ' mb-md-1 ') + ((this.state.activeMobile) ? 'active ' : '')}>

                    {!this.state.activeMobile &&
                        <div className={"title" + ((this.state.activeDesktop) ? ' activeDesktop ' : '') + (this.isSelect(filterName) ? ' isSelect' : ' notIsSelect')} onClick={(e) => this.handleChangeDisplayGroup()}>
                            <FormattedMessage id={"toolbar.filter." + filterName} />
                            <i className="icon-angle-down"></i>
                        </div>
                    }

                    {(this.state.activeDesktop || mobileMode) &&
                        <Fragment>
                            <ul>
                                {filterItems.map((item, key) =>
                                    (
                                        <li key={key}>
                                            {(type == 'spec' || type == 'brand') &&
                                                <span className={"filterCheck " + (this.props.rest.some((rest) => { return (rest == encodeURIComponent(item.Name)) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, this.props.type, filterName)}>
                                                    {item.Name.charAt(0).toUpperCase() + item.Name.slice(1)} <span className="filterQuantity">({item.Quantity})</span>
                                                </span>
                                            }

                                            {type == 'review' &&
                                                <FilterGroupReview item={item} rest={this.props.rest} handleChangeFilter={this.props.handleChangeFilter} type={this.props.type} filterName={filterName} filterItemsLength={filterItems.length}/>
                                            }

                                            {type == 'category' &&

                                                <Link to={item.Link.toLowerCase()}>
                                                    {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                                </Link>

                                            }
                                        </li>
                                    )
                                )}

                            </ul>

                            {(nbFilter > itemsNotExpanded) && !mobileMode &&
                                <ul className="cont-showmore d-block">
                                    <li className="amshopby-clearer">
                                        <a id="amshopby-category-more" className="amshopby-more" href="#" onClick={(e) => { e.preventDefault(); this.setState({ expanded: !this.state.expanded }) }} >
                                            {(!this.state.expanded)
                                                ? <FormattedMessage id={"toolbar.filter.showmore"} />
                                                : <FormattedMessage id={"toolbar.filter.showless"} />
                                            }

                                        </a>
                                    </li>
                                </ul>
                            }
                        </Fragment>
                    }



                </div>
            </Fragment>
        )
    }
}

export default FilterGroup