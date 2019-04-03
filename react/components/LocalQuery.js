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
      rest: props.rest
    }
  }

  updateQuerySearch = (map, rest) => {
    this.setState({map,rest})
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

    const query = Object.values(params)
      .filter(s => s.length > 0)
      .join('/')

    const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    
    return (
      <Query
        query={Queries.search}
        variables={{
          query,
          map: this.state.map,
          rest: this.state.rest,
          orderBy,
          priceRange,
          from,
          to,
          withFacets: !!(map && map.length > 0 && query && query.length > 0),
        }}
        notifyOnNetworkStatusChange
        partialRefetch
      >
        {searchQueryProps => {
          const { data } = searchQueryProps
          const { search } = data || {}

          return this.props.render({
            ...this.props,
            searchQuery: {
              ...searchQueryProps,
              ...search,
            },
            searchContext: runtimePage,
            pagesPath: runtimePage,
            map,
            rest,
            orderBy,
            priceRange,
            page,
            from,
            to,
            updateQuerySearch: this.updateQuerySearch
          })
        }}
      </Query>
    )
  }
}

export default withRuntimeContext(LocalQuery)