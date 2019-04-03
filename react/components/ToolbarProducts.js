import React, { Component } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import Select from 'react-select';

const orderOptions = [
    { value: 'OrderByTopSaleDESC', label: <FormattedMessage id="toolbar.OrderByTopSaleDESC" /> },
    { value: 'OrderByPriceASC', label: <FormattedMessage id="toolbar.OrderByPriceASC" /> },
    { value: 'OrderByPriceDESC', label: <FormattedMessage id="toolbar.OrderByPriceDESC" /> },
    { value: 'OrderByReleaseDateDESC', label: <FormattedMessage id="toolbar.OrderByReleaseDateDESC" /> },
];

class ToolbarProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderBy: orderOptions[0]
        }
    }

    handleOrderBy = (selectedOption) => {
        this.setState({ orderBy: selectedOption });
    }

    render() {
        const { orderBy } = this.state;
        return (
            <div className="toolbar toolbar-ajax d-flex">
                <div className="toolbar-filters-item  my-auto mr-auto px-3">
                    <span class="filterCheck" onClick="">
                        <FormattedMessage id="toolbar.enviogratis" />
                        <span className="pl-2"><img src="https://cdn.naturitas.es/skin/frontend/rwd/naturitas/images/Shape.svg" alt="" /></span>
                    </span>

                </div>

                <div className="aside-filter d-flex my-auto">
                    <div className="pager my-auto mr-3">
                        <div className="count-container">
                            {this.props.recordsFiltered} <FormattedMessage id="toolbar.products" />
                        </div>
                    </div>

                    <div className="sorter my-auto">
                        <div className="sort-by d-flex">
                            <label className="my-auto mr-2"><FormattedMessage className="pl-3" id="toolbar.orderBy"/> </label>
                            <Select
                                    className="customSelect"     
                                    value={orderBy}
                                    onChange={this.handleOrderBy}
                                    options={orderOptions}
                                />
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ToolbarProducts