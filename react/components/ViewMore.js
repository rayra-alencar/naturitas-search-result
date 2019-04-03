import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class ViewMore extends Component {
    render() {
        return (
            <div className="toolbar-bottom">
                {this.props.products.length < this.props.recordsFiltered &&
                    <div className="toolbar-ajax">
                        <div className="count-container">
                            <div className="tool-wrap">
                                <div className="tool-line" style={{ width: this.props.products.length / this.props.recordsFiltered * 100 + "%" }}></div>
                            </div>
                            <p className="amount amount--has-pages" data-qty="18647" data-last-page="777"><FormattedMessage id="toolbar.showmore.text" values={{ view: this.props.products.length, total: this.props.recordsFiltered }} /> </p>
                        </div>
                        <div className="pages">
                            <div className="next i-next" onClick={(e) => this.props.onFetchMore()} ><FormattedMessage id="toolbar.showmore" /> </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default ViewMore