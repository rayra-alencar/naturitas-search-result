import React, { Component, Fragment } from 'react';
import ResultContainer from './ResultContainer';

const WidthSwithMobileDesktop = 769;


class SearchResultContainer extends Component {
  static defaultProps = {
    showMore: false,
  }

  state = {
    fetchMoreLoading: false,
  }

  _fetchMoreLocked = false

  handleFetchMore = () => {
    if (this._fetchMoreLocked) {
      return
    }
    this._fetchMoreLocked = true

    const {
      maxItemsPerPage,
      searchQuery: {
        products
      }
    } = this.props
  
    const to = maxItemsPerPage + products.length - 1

    this.setState({
      fetchMoreLoading: true,
    })
    
    this.props.searchQuery.fetchMore({
      variables: {
        from: products.length,
        to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        this.setState({
          fetchMoreLoading: false,
        }, () => {
          this._fetchMoreLocked = false
        })

        // backwards compatibility
        if (prevResult.search) {
          return {
            search: {
              ...prevResult.search,
              products: [
                ...prevResult.search.products,
                ...fetchMoreResult.search.products,
              ],
            },
          }
        }

        return {
          ...prevResult,
          productSearch: {
            ...prevResult.productSearch,
            products: [
              ...prevResult.productSearch.products,
              ...fetchMoreResult.productSearch.products,
            ],
          },
        }
      },
    })
  }

  render() {
    const {
      searchQuery: {
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
          CategoriesTrees,
        } = {},
        products = [],
        recordsFiltered = 0,
        loading,
        variables: {
          query,
        },
      },
      pagination,
    } = this.props


    return (
      <ResultContainer {...this.props}
        breadcrumbsProps={this.breadcrumbsProps}
        getLinkProps={this.getLinkProps}
        onFetchMore={this.handleFetchMore}
        fetchMoreLoading={this.state.fetchMoreLoading}
        query={query}
        loading={loading}
        recordsFiltered={recordsFiltered}
        products={products}
        brands={Brands}
        specificationFilters={SpecificationFilters}
        priceRanges={PriceRanges}
        tree={CategoriesTrees} />
    )

  }
}

SearchResultContainer.getSchema = (props) => {
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
        type: 'string'
      }
    },
  }
}

export default SearchResultContainer