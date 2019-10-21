import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'vtex.render-runtime'
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

    handleChangeDisplayGroup = (e) => {

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
        let { filterGroup, itemsNotExpanded, mobileMode, type, searchContext } = this.props

        if (filterGroup.length <= 0) return '';


        if (filterGroup[0].name == "color") {
            filterGroup = filterGroup.filter(item => (item.name != ""))
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
            /*NAT-419 este if es para saber si nos encontramos en un departamento/categoria/subcategoria y si no mostrar filtros de categoria*/
            if(searchContext && (searchContext.indexOf('department') > -1 || searchContext.indexOf('category') > -1 || searchContext.indexOf('subcategory') > -1)){
                if (nbFilter == 1) {
                    filterItems = []
                }
            }

            filterItems.map(item => {
                let linksArrayAux = item.link.replace(/^\/+|\/+$/g, '').split('/')
                //Si tiene filtro de precio se lo quitamos
                if (linksArrayAux[linksArrayAux.length - 1].indexOf('de-') >= 0 && linksArrayAux[linksArrayAux.length - 1].indexOf('-a-') >= 0) {
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
                        //linksArrayAux.reverse();
                    }
                }

                linksArrayAux = linksArrayAux.splice(0,3)
                linksArrayAux = linksArrayAux.join('/')

                item.link = "/" + (linksArrayAux.toLowerCase())


                return item;

            })
        }
        else if (type == 'review') {
            filterItems = filterGroup[0].facets
            //filterItems = fillStars(filterItems)
            filterItems = orderStars(filterItems);
            filterItems = fillQuantityStars(filterItems);

            filterName = 'reviews_score'
            nbFilter = filterItems.length;
        }
        else {
            filterItems = filterGroup[0].facets;
            nbFilter = filterGroup[0].facets.length;
            filterName = filterGroup[0].name
        }



        filterItems = filterItems.filter(item => (item.name != "" && item.name.indexOf('(') < 0 && item.name.indexOf('Not or Bad Specified Brand')))

        if (type == 'review') {
            filterItems = filterItems.sort((a, b) => {
                if (a.name > b.name) return 1
                else if (a.name < b.name) return -1
                else return 0
            })
        }

        else{
            filterItems = filterItems.sort((a, b) => {
                if (a.quantity > b.quantity) {
                    return -1
                }
                else if (a.quantity < b.quantity) {
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
                        <div className={"title" + ((this.state.activeDesktop) ? ' activeDesktop ' : '') + (this.isSelect(filterName) ? ' isSelect' : ' notIsSelect')} onClick={(e) => this.handleChangeDisplayGroup(e)}>
                            <FormattedMessage id={"store/toolbar.filter." + filterName} />
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
                                                <span className={"filterCheck " + (this.props.rest.some((rest) => { return (rest == encodeURIComponent(item.name)) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, this.props.type, filterName)}>
                                                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)} <span className="filterQuantity">({item.quantity})</span>
                                                </span>
                                            }

                                            {type == 'review' &&
                                                <FilterGroupReview item={item} index={key} rest={this.props.rest} handleChangeFilter={this.props.handleChangeFilter} type={this.props.type} filterName={filterName} filterItemsLength={filterItems.length}/>
                                            }

                                            {type == 'category' &&

                                                <Link to={item.link.toLowerCase()}>
                                                    {item.name} <span className="filterQuantity">({item.quantity})</span>
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
                                                ? <FormattedMessage id={"store/toolbar.filter.showmore"} />
                                                : <FormattedMessage id={"store/toolbar.filter.showless"} />
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