import React, { Component, Fragment } from 'react';
import { orderFormConsumer } from 'vtex.store/OrderFormContext'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import { ExtensionPoint, Link } from 'render'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import '../global.css'
import FilterBlock from './FilterBlock';
import ToolbarProducts from './ToolbarProducts';
import ViewMore from './ViewMore';

const WidthSwithMobileDesktop = 769;


class ResultContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            linesDescription: 2
        }
    }



    render() {

        const { searchQuery, notfoundimage, params, map } = this.props
        const { facets } = searchQuery


        if ((!facets || !facets.CategoriesTrees[0]) && !searchQuery.loading) {
            return (

                <div id="page-notfound">
                    <div class="searchresult-block content container">
                        {notfoundimage && (<div class="searchresult-image-container"> <img src={notfoundimage} /> </div>)}
                        <div className="searchresult-title-container">
                            <p className="title"><FormattedMessage id="searchresult.title" /></p>
                        </div>
                        <div className="searchresult-subtitle-container">
                            <p><FormattedMessage id="searchresult.subtitle" /></p>
                            <p><FormattedMessage id="searchresult.subtitle2" /></p>
                        </div>
                        <div className="searchresult-tips-container">
                            <ul>
                                <li><FormattedMessage id="searchresult.tips1" /></li>
                                <li><FormattedMessage id="searchresult.tips2" /></li>
                                <li><FormattedMessage id="searchresult.tips3" /></li>
                            </ul>
                        </div>
                    </div>

                    <div class="category-block">
                        <ExtensionPoint style="pagenotfound" id="category-block" />
                    </div>

                    <div class="category-block">
                        <ExtensionPoint style="tags" id="tags-block" />
                    </div>
                    <div class="related-products">
                        <ExtensionPoint id="related-products-block" />
                    </div>

                </div>
            )
        }
        const ellipsis = (<Fragment>... <span id="seeMoreDesc" onClick={(e) => this.setState({ linesDescription: 1000 })}>ver mas</span></Fragment>)


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

                                {mobileMode &&
                                    <div className="d-flex">
                                        <FilterBlock mobileMode={mobileMode} updateQuerySearch={this.props.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} />
                                        <ToolbarProducts recordsFiltered={searchQuery.recordsFiltered} />
                                    </div>
                                }

                                <div id="category-main-container" className="container mt-3 d-flex flex-wrap">
                                    {!mobileMode &&
                                        <FilterBlock mobileMode={mobileMode} updateQuerySearch={this.props.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} />
                                    }    
                                    
                                    <div id="products-block">
                                        {!mobileMode &&
                                            <Fragment>
                                                <ExtensionPoint id="subcategories" />
                                                <ToolbarProducts recordsFiltered={searchQuery.recordsFiltered} />
                                            </Fragment>
                                        }



                                        <ExtensionPoint
                                            id="productList"
                                            products={this.props.products}
                                        />

                                        <ViewMore {...this.props} />
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

ResultContainer.getSchema = (props) => {
    return {
        title: 'Search Results',
        description: 'Search Results',
        type: 'object',
        properties: {
            description: {
                title: 'Category Description',
                type: 'string'
            },
            notfoundimage: {
                title: 'Not found image',
                default: '',
                type: 'string',
                widget: {
                    'ui:widget': 'image-uploader',
                },
            }
        },
    }
}


export default ResultContainer