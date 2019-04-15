import React, { Component, Fragment } from 'react';
import './global.css'
import SearchResultContainer from './components/SearchResultContainer';


class SearchResultQueryLoader extends Component {
    render() {
        return <SearchResultContainer {...this.props} />
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
