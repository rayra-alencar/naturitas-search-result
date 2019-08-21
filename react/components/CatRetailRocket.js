import React, { Component, PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl'

class CatRetailRocket extends Component {
    render() {
        const {categoryPath, intl} = this.props
        
        return (
            
            <div className="bg-light">
                <div className="container">
                    <div data-retailrocket-markup-block={intl.formatMessage({ id: 'store/retail.categorymarkup' })} data-
                        category-path={categoryPath}></div>
                </div>
            </div>
        )
    }
}

export default injectIntl(CatRetailRocket)