import React, { Component, Fragment } from 'react';
import { orderFormConsumer } from 'vtex.store/OrderFormContext'
import { ExtensionPoint, Link } from 'render'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import './global.css'
import FilterBlock from './components/FilterBlock';
import ToolbarProducts from './components/ToolbarProducts';

const WidthSwithMobileDesktop = 769;


class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            linesDescription: 2
        }
    }

    render() {

        const { searchQuery } = this.props
        const { facets } = searchQuery
        if (!facets || !facets.CategoriesTrees[0]) {
            return (<div>To Do, Maquetar no se encuentra productos/filtros</div>)
        }
        const ellipsis = (<Fragment>... <span id="seeMoreDesc" onClick={(e) => this.setState({ linesDescription: 1000 })}>ver mas</span></Fragment>)

        //console.log(catChildren)

        return (
            <ReactResizeDetector handleWidth>
                {
                    width => {
                        const mobileMode = width < WidthSwithMobileDesktop || (global.__RUNTIME__.hints.mobile && (!width || width < WidthSwithMobileDesktop))

                        return (
                            <div id="category-block" className={mobileMode ? 'mobileMode' : ''}>
                                <ExtensionPoint id="breadcrump" params={this.props.params} />
                                <div className="container">
                                    <h1>{searchQuery.titleTag}</h1>

                                    <p className="cat-desc">
                                        <Truncate lines={this.state.linesDescription} ellipsis={ellipsis}>
                                            {this.props.description}
                                        </Truncate>
                                    </p>

                                </div>

                                <ExtensionPoint id="banners" />

                                {mobileMode &&
                                    <div className="container">
                                        <ExtensionPoint id="subcategories" />
                                    </div>
                                }

                                <div id="category-main-container" className="container mt-3 d-flex flex-wrap">
                                    <FilterBlock facets={facets} />

                                    <div id="products-block">
                                        {!mobileMode &&
                                            <ExtensionPoint id="subcategories" />
                                        }

                                        <ToolbarProducts />

                                        <ExtensionPoint
                                            id="productList"
                                            products={searchQuery.products}
                                        />
                                    </div>

                                </div>
                            </div >

                        )
                    }

                }
            </ReactResizeDetector>
        )


    }
}

Index.getSchema = (props) => {
    return {
        title: 'Search Results',
        description: 'Search Results',
        type: 'object',
        properties: {
            description: {
                title: 'Category Description',
                type: 'string'
            }
        },
    }
}


export default Index
