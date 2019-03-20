import React, { Component, Fragment } from 'react';
import { orderFormConsumer } from 'vtex.store/OrderFormContext'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import { ExtensionPoint, Link } from 'render'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import './global.css'
import FilterBlock from './components/FilterBlock';
import ToolbarProducts from './components/ToolbarProducts';
import SearchResultContainer from './components/SearchResultContainer';
import LocalQuery from './components/LocalQuery';

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']
const WidthSwithMobileDesktop = 769;
const DEFAULT_MAX_ITEMS_PER_PAGE = 24

const  SORT_OPTIONS = [
    {
      value: 'OrderByTopSaleDESC',
      label: 'ordenation.sales',
    },
    {
      value: 'OrderByReleaseDateDESC',
      label: 'ordenation.release.date',
    },
    {
      value: 'OrderByBestDiscountDESC',
      label: 'ordenation.discount',
    },
    {
      value: 'OrderByPriceDESC',
      label: 'ordenation.price.descending',
    },
    {
      value: 'OrderByPriceASC',
      label: 'ordenation.price.ascending',
    },
    {
      value: 'OrderByNameASC',
      label: 'ordenation.name.ascending',
    },
    {
      value: 'OrderByNameDESC',
      label: 'ordenation.name.descending',
    },
  ]

class SearchResultQueryLoader extends Component {
    static defaultProps = {
        orderBy: SORT_OPTIONS[0].value,
        rest: '',
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
        const {querySchema} = this.props
        return (
            <LocalQuery
                {...this.props}
                {...querySchema}
                render={props => <SearchResultContainer {...props} />}
            />
            
        )
    }
}

SearchResultQueryLoader.getSchema = props => {
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
            }
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
        },
        summary: {
          title: 'editor.search-result.summary.title',
          type: 'object',
          properties: typeof ProductSummary != 'undefined' && typeof ProductSummary.getSchema(props) != 'undefined' && typeof ProductSummary.getSchema(props).properties != 'undefined' ? ProductSummary.getSchema(props).properties : false,
        }
      },
    }
}


export default SearchResultQueryLoader
