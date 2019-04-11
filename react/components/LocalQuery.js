import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { withRuntimeContext } from 'render'
import { Queries } from 'vtex.store'

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
  

const DEFAULT_PAGE = 1



class LocalQuery extends Component {
  static defaultProps = {
    orderByField: SORT_OPTIONS[0].value,
  }

  constructor(props){
    super(props)
    this.state = {
      map: props.map,
      rest: props.rest,
      minPrice: 0,
      maxPrice: 9999,
      userInteractiveWithFilters: false,
      orderByField: SORT_OPTIONS[0].value
    }
  }

  updateOrderBy = (orderByField) => {
    this.setState({orderByField})
  }

  updatePrice = (minPrice, maxPrice) => {
    this.setState({minPrice,maxPrice, userInteractiveWithFilters:true})
  }

  updateQuerySearch = (map, rest) => {
    
    this.setState({map,rest, userInteractiveWithFilters:true})
  }

  render() {
    let {
      maxItemsPerPage,
      queryField,
      mapField,
      rest,
      orderByField,
      params,
      map,
      query: {
        order: orderBy = orderByField,
        page: pageQuery,
        priceRange
      },
      runtime: { page: runtimePage },
    } = this.props

    let query = Object.values(params)
      .filter(s => s.length > 0)
      .join('/')

    const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    query = query+`/de-${this.state.minPrice}-a-${this.state.maxPrice}`

    let queryArray = query.split('/');

    let mapArray = this.state.map.split(',');

    mapArray.splice( queryArray.length-1, 0, 'priceFrom')



    
    return (
      <Query
        query={Queries.search}
        variables={{
          query,
          map: mapArray.join(','),
          rest: this.state.rest,
          orderBy: this.state.orderByField,
          priceRange,
          from,
          to,
          withFacets: !!(map && map.length > 0 && query && query.length > 0),
        }}
        notifyOnNetworkStatusChange={true}
        partialRefetch
        networkStatus
      >
        {searchQueryProps => {
          
          const { data,error, loading } = searchQueryProps
          const { search } = data || {}

          if(error){
            console.error(error)
          }
          
          return this.props.render({
            ...this.props,
            searchQuery: {
              ...searchQueryProps,
              ...search,
            },
            error: error,
            loading: loading,
            searchContext: runtimePage,
            pagesPath: runtimePage,
            map,
            rest,
            orderBy: this.state.orderByField,
            priceRange,
            page,
            from,
            to,
            updateQuerySearch: this.updateQuerySearch,
            updatePrice: this.updatePrice,
            userInteractiveWithFilters: this.state.userInteractiveWithFilters,
            updateOrderBy: this.updateOrderBy
          })
        }}
      </Query>
    )
  }
}

export default withRuntimeContext(LocalQuery)