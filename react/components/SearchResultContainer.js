import React, { Component, Fragment } from 'react';
import ResultContainer from './ResultContainer';

const WidthSwithMobileDesktop = 769;
/*NAT-405 enviar evento de categoryView para RetailRocket en v2*/ 
let flagEventDataLayer = false;
let initialCatDep = '';
let catDepActual = ''; 
/*FIN NAT-405 enviar evento de categoryView para RetailRocket en v2*/ 
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
    /*NAT-405 enviar evento de categoryView para RetailRocket en v2*/ 
    if(this.props.params.category){
      initialCatDep = this.props.params.category;      
    }else if(this.props.params.department) {
      initialCatDep = this.props.params.department;
    }   
    if(initialCatDep != catDepActual){
      flagEventDataLayer = false;
      catDepActual = initialCatDep;
    }else{
      flagEventDataLayer = true;
    }    
    if(typeof dataLayer != 'undefined' && !flagEventDataLayer){
      dataLayer.push({'event': 'categoryView',
                      'categoryRetail': catDepActual});  
      flagEventDataLayer = true;
    }
    /*FIN NAT-405 enviar evento de categoryView para RetailRocket en v2*/
    /*NAT-419 se arrastra el searchcontext para saber en que tipo de búsqueda nos encontramos para mostrar mas filtros de categorías cuando se trata de una coleccion*/  
    let searchContext = false;
    if(typeof this.props.searchContext !== 'undefined'){
      searchContext= this.props.searchContext;
    };
    /*FIN NAT-419*/
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
        tree={CategoriesTrees} 
        searchContext={searchContext}/>
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