import React, { Component } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class ToolbarProducts extends Component {
    
    render(){
        return (
            <div className="toolbar toolbar-ajax d-flex">
                <div className="toolbar-filters-item  my-auto mr-auto">
                    <a className="amshopby-attr" href="https://www.naturitas.es/suplementos/si" data-config="[]">
                        <FormattedMessage id="toolbar.enviogratis" />
                                                            <span><img src="https://cdn.naturitas.es/skin/frontend/rwd/naturitas/images/Shape.svg" alt="" /></span>
                    </a>
                </div>
        
                <div className="aside-filter d-flex my-auto">
                    <div className="pager my-auto mr-3">
                        <div className="count-container">
                            {this.props.recordsFiltered} <FormattedMessage id="toolbar.products" />
                                                                </div>
                    </div>
        
                    <div className="sorter my-auto">
                        <div className="sort-by">
                            <label>Ordenar por  </label>
                            <select title="Ordenar por" className="jcf-hidden d-none">
                                <option value="https://www.naturitas.es/suplementos?dir=asc&amp;order=created_at">
                                    Los más nuevos </option>
                                <option value="https://www.naturitas.es/suplementos?dir=asc&amp;order=price">
                                    Precio: de menor a mayor </option>
                                <option value="https://www.naturitas.es/suplementos?dir=desc&amp;order=price">
                                    Precio: de mayor a menor </option>
                                <option value="https://www.naturitas.es/suplementos?dir=asc&amp;order=rank_popularity_score" selected="selected">
                                    Popularidad </option>
                                <option value="https://www.naturitas.es/suplementos?dir=asc&amp;order=express_delivery">
                                    Envío Express </option>
                            </select><span className="jcf-select jcf-unselectable" title="Ordenar por"><span className="jcf-select-text"><span className="">
                                Popularidad </span></span><span className="jcf-select-opener"></span></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ToolbarProducts