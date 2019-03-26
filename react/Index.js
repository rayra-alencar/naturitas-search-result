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

SearchResultQueryLoader.getSchema = (props) => {
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
              type: 'string',
              widget: {
                'ui:widget': 'image-uploader',
              }
          }
      },
  }
} 


export default SearchResultQueryLoader
