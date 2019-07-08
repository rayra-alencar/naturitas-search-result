import React, { Component, PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl'

class CatRetailRocket extends Component {
    render() {
        const {categoryPath, intl} = this.props
        console.log(intl.formatMessage({ id: 'retail.categorymarkup' }))
        return (
            
            <div className="bg-light">
                <div className="container">
                    <div data-retailrocket-markup-block={intl.formatMessage({ id: 'retail.categorymarkup' })} data-
                        category-path={categoryPath}></div>
                </div>
            </div>
        )
    }
}

export default injectIntl(CatRetailRocket)