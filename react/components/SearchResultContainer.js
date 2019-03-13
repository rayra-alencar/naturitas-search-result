import React, { Component, Fragment } from 'react';
import { orderFormConsumer } from 'vtex.store/OrderFormContext'
import { ExtensionPoint, Link } from 'render'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import '../global.css'
import FilterBlock from './FilterBlock';
import ToolbarProducts from './ToolbarProducts';

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']
const WidthSwithMobileDesktop = 769;
const DEFAULT_MAX_ITEMS_PER_PAGE = 16

class SearchResultContainer extends Component {
    static defaultProps = {
        lol: 20,
        querySchema: {
            maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
          },
      }

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

/*SearchResultContainer.getSchema = props => {
    const querySchema = !props.searchQuery
      ? {
        querySchema: {
          title: 'editor.search-result.query',
          description: 'editor.search-result.query.description',
          type: 'object',
          properties: {
            maxItemsPerPage: {
              title: 'editor.search-result.query.maxItemsPerPage',
              type: 'number',
              default: DEFAULT_MAX_ITEMS_PER_PAGE,
            },
            queryField: {
              title: 'Query',
              type: 'string',
            },
            mapField: {
              title: 'Map',
              type: 'string',
            },
            restField: {
              title: 'Other Query Strings',
              type: 'string',
            },
          },
        },
      }
      : {}
  
    return {
      title: 'editor.search-result.title',
      description: 'editor.search-result.description',
      type: 'object',
      properties: {
        ...querySchema,
        hiddenFacets: {
          title: 'editor.search-result.hiddenFacets',
          type: 'object',
          isLayout: true,
          properties: {
            brands: {
              title: 'editor.search-result.hiddenFacets.brands',
              type: 'boolean',
              isLayout: true,
            },
            categories: {
              title: 'editor.search-result.hiddenFacets.categories',
              type: 'boolean',
              isLayout: true,
            },
            priceRange: {
              title: 'editor.search-result.hiddenFacets.priceRange',
              type: 'boolean',
              isLayout: true,
            },
            specificationFilters: {
              title: 'editor.search-result.hiddenFacets.specificationFilters',
              type: 'object',
              isLayout: true,
              properties: {
                hideAll: {
                  title:
                    'editor.search-result.hiddenFacets.specificationFilters.hideAll',
                  type: 'boolean',
                  isLayout: true,
                },
                hiddenFilters: {
                  type: 'array',
                  isLayout: true,
                  items: {
                    title:
                      'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter',
                    type: 'object',
                    isLayout: true,
                    properties: {
                      name: {
                        title:
                          'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter.name',
                        type: 'string',
                        isLayout: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }
      },
    }
}*/


export default SearchResultContainer
