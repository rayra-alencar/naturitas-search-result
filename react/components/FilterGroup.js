import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'
import Select from 'react-select';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FilterGroup extends Component {
    static defaultProps = {
        itemsNotExpanded: 5,
        type: 'spec'
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
            activeMobile: false
        }
    }

    handleChangeDisplayGroup = () => {
        if(this.props.mobileMode){
            this.setState({ activeMobile: !this.state.activeMobile })
            this.props.setDisplayGroup(!this.state.activeMobile)
        }
    }


    render() {
        let { filterGroup, itemsNotExpanded, mobileMode, type } = this.props

        if (filterGroup.length <= 0) return '';

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
        }
        else {
            filterItems = filterGroup[0].facets;
            nbFilter = filterGroup[0].facets.length;
            filterName = filterGroup[0].name
        }

        if (!this.state.expanded && !mobileMode) {
            filterItems = filterItems.slice(0, itemsNotExpanded)
        }

        return (
            <Fragment>
                <div className={"filter_block " + ((type=='category') ?  'mb-md-3 ' : '') + ((this.state.activeMobile) ?  'active ' : '')}>

                    {!this.state.activeMobile &&
                        <div className="title" onClick={(e) => this.handleChangeDisplayGroup()}>
                            <FormattedMessage id={"toolbar.filter." + filterName} />
                            <i className="icon-angle-down"></i>
                        </div>
                    }

                    <ul>
                        {filterItems.map((item, key) =>
                            (
                                <li key={key}>
                                    {(type == 'spec' ||  type == 'brand') &&
                                        <span className={"filterCheck " + (this.props.rest.some((rest) => { return (rest == encodeURIComponent(item.Name)) }) ? 'selected' : '')} onClick={(e) => this.props.handleChangeFilter(item, this.props.type)}>
                                            {item.Name.charAt(0).toUpperCase() + item.Name.slice(1)} <span className="filterQuantity">({item.Quantity})</span>
                                        </span>
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



                </div>
            </Fragment>
        )
    }
}

export default FilterGroup