import React, { Component, PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl'

class CatRetailRocket extends Component {
    
    componentDidMount = () => {
        if(typeof  document.getElementsByClassName("block-retail-rocket")[0] != "undefined"){
            document.getElementsByClassName("block-retail-rocket")[0].removeAttribute("initialized")

            delete retailrocket.modules.duplicates;
            retailrocket.markup.render();
        }
        
    }
    
    
    render() {
        const {categoryPath, intl} = this.props
        
        return (
            
            <div className="bg-light">
                <div className="container">
                    <div className="block-retail-rocket" data-retailrocket-markup-block={intl.formatMessage({ id: 'store/retail.categorymarkup' })} data-
                        category-path={categoryPath}></div>
                </div>
            </div>
        )
    }
}

export default injectIntl(CatRetailRocket)