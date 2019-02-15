import React, { Component, Fragment } from 'react';
import { ExtensionPoint, Link } from 'render'

class FilterBlock extends Component {
    render() {
        const { facets } = this.props

        const catChildren = facets.CategoriesTrees[0].Children

        return (
            <div id="sideBar">
                <div className="filter_block mb-3">
                    <div className="title">Categoría </div>

                    {catChildren.length > 0 &&
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
                    }

                </div>

                <div className="filter_block">
                    <div className="title">Marcas</div>

                    {facets.Brands.length > 0 &&
                        <ul>
                            {facets.Brands.map(item =>
                                (
                                    <li>
                                        <Link to={item.Link.toLowerCase()}>
                                            {item.Name} <span className="filterQuantity">({item.Quantity})</span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    }


                </div>
                <div className="filter_block">
                    <div className="title">TO DO</div>
                </div>
            </div>
        )
    }
}

export default FilterBlock