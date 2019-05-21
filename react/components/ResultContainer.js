import React, { Component, PureComponent, Fragment } from 'react';
import {  FormattedMessage } from 'react-intl'

import { ExtensionPoint, Link } from 'render'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import '../global.css'
import FilterBlock from './FilterBlock';
import ToolbarProducts from './ToolbarProducts';
import ViewMore from './ViewMore';
import { Spinner } from 'vtex.styleguide'   

const WidthSwithMobileDesktop = 769;

const optionsMinPrice = [
    { value: '0', label: '0€' },
    { value: '5', label: '5€' },
    { value: '10', label: '10€' },
    { value: '20', label: '20€' },
    { value: '30', label: '30€' },
    { value: '40', label: '40€' },
    { value: '50', label: '50€' }
];
const optionsMaxPrice = [
    { value: '0', label: '0€' },
    { value: '5', label: '5€' },
    { value: '10', label: '10€' },
    { value: '20', label: '20€' },
    { value: '30', label: '30€' },
    { value: '40', label: '40€' },
    { value: '99999', label: '50€+' }
];


class ResultContainer extends Component {
    constructor(props) {
        super(props)

        let titleTag = ''
        if(props.params.subcategory) titleTag = props.params.subcategory
        else if(props.params.category) titleTag = props.params.category
        else if(props.params.department) titleTag = props.params.department
        else if(props.params.brand) titleTag = props.params.brand

        titleTag = titleTag.replace(/-/g, ' ')
        titleTag = titleTag.charAt(0).toUpperCase() + titleTag.slice(1)

        this.state = {
            linesDescription: 2,
            titleTag,
            query: props.query, 
            map: props.map,
            rest: props.rest,
            minPrice: optionsMinPrice[0].value,
            maxPrice: optionsMaxPrice[optionsMaxPrice.length - 1].value,
            userInteractiveWithFilters: false,
            loading: props.loading,

        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        
        if(nextProps.searchQuery.titleTag && nextProps.searchQuery.titleTag!==prevState.titleTag){
          return { titleTag: nextProps.searchQuery.titleTag};
       }
        
       else return null;
     }

    shouldComponentUpdate(nextProps){
        if(nextProps.loading != this.props.loading){
            return true;
        }
       /* TODO -> OPTIMIZAR CONDICION, NO VALE SI EL NUMERO DE PRODUCTOS ES IGUAL
            if(nextProps.products.length == this.props.products.length){
            return false;
        }*/

        return true;
    }

      updateOrderBy = (orderByField) => {
        this.props.searchQuery.refetch({orderBy: orderByField})
        this.setState({orderByField})   
      }
    
      updatePrice = (minPrice, maxPrice) => {
        let query = this.state.query;
        let map = this.state.map;

        //Si el precio es diferente de 0 e infinito, metemos en la query: de-{min}-a-{max}
        if(minPrice != optionsMinPrice[0].value || maxPrice != optionsMaxPrice[optionsMaxPrice.length - 1].value){
            query += `/de-${minPrice}-a-${maxPrice}`
            let queryArray = query.split('/')
            let mapArray = map.split(',')
            mapArray.splice( queryArray.length-1, 0, 'priceFrom')
            map = mapArray.join(',') 
        }

        this.props.searchQuery.refetch({query,map})
        this.setState({minPrice,maxPrice, userInteractiveWithFilters:true})
      }
    
      updateQuerySearch = (map, rest) => {
        this.props.searchQuery.refetch({map,rest})
        this.setState({map,rest, userInteractiveWithFilters:true})
      }

    render() {
        const { searchQuery, notfoundimage, brandcornersbackground ,brandcorner, params, map } = this.props
        const { facets } = searchQuery
        

        if (!this.state.userInteractiveWithFilters && (!facets || !facets.CategoriesTrees[0]) && !searchQuery.loading) {
            return (
                <ReactResizeDetector handleWidth>
                    {
                        width => {
                            const mobileMode = width < WidthSwithMobileDesktop || (global.__RUNTIME__.hints.mobile && (!width || width < WidthSwithMobileDesktop))
                            return (
                                <div id="page-notfound">
                                    <div className="searchresult-block content container">
                                        {notfoundimage && (<div className="searchresult-image-container"> <img src={notfoundimage} /> </div>)}
                                        <div className="searchresult-title-container">
                                            <p className="title"><FormattedMessage id="searchresult.title" /></p>
                                        </div>

                                        {mobileMode && (
                                            <Fragment>
                                                <ExtensionPoint id="whatsapp"/>
                                            </Fragment>
                                        )}

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

                                    <div className="category-block">
                                        <ExtensionPoint style="pagenotfound" id="category-block" />
                                    </div>

                                    <div className="category-block">
                                        <ExtensionPoint style="tags" id="tags-block" />
                                    </div>
                                    <div className="related-products">
                                        <ExtensionPoint id="related-products-block" />
                                    </div>

                                </div>
                            )
                        }
                    }
                </ReactResizeDetector>
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
                                { brandcornersbackground && (
                                    <div className="brandcorners-background-content">
                                        {mobileMode ? <img src={brandcornersbackground} /> : <img src={brandcornersbackground} />}
                                    </div> )}
                                { brandcorner && (
                                    <div className="searchresult-image-container container-fluid">
                                        <div className="row">
                                            <div class="col-12">
                                                <div className="brandcorners-content container">
                                                    <div className="row">
                                                        <div className="col-12 col-md-3">
                                                            <img src={brandcorner} />
                                                        </div>
                                                        <div class="col-12 col-md-9">
                                                            <h2 className="brandcorners-title my-3">Title Brand</h2>
                                                            <p className="brand-description">Lorem ipsum dolor sit amet consectetur adipiscing, elit platea egestas quam nisi suspendisse, integer ullamcorper phasellus purus rhoncus. Auctor ligula maecenas nostra integer odio habitant tempus penatibus, facilisis fusce pulvinar eu semper litora cum dictumst, porta interdum cubilia morbi porttitor imperdiet placerat. Torquent pellentesque sollicitudin fames posuere massa leo nisl quam erat, primis malesuada netus lobortis maecenas laoreet pulvinar in, arcu euismod litora non porttitor cursus venenatis tortor.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                                <div className="container">
                                    <h1>{this.state.titleTag    }</h1>

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
                                        <FilterBlock mobileMode={mobileMode} updatePrice={this.updatePrice} updateQuerySearch={this.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} optionsMinPrice={optionsMinPrice} optionsMaxPrice={optionsMaxPrice}/>
                                        <ToolbarProducts updateOrderBy={this.updateOrderBy} updatePrice={this.updatePrice} recordsFiltered={searchQuery.recordsFiltered} />
                                    </div>
                                }

                                <div id="category-main-container" className="container mt-md-3 d-flex flex-wrap">
                                    {!mobileMode &&
                                        <FilterBlock mobileMode={mobileMode}  updatePrice={this.updatePrice} updateQuerySearch={this.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} optionsMinPrice={optionsMinPrice} optionsMaxPrice={optionsMaxPrice}/>
                                    }    
                                    
                                    <div id="products-block">
                                        {!mobileMode &&
                                            <Fragment>
                                                <ExtensionPoint id="subcategories" />
                                                <ToolbarProducts updateOrderBy={this.updateOrderBy} updatePrice={this.updatePrice} recordsFiltered={searchQuery.recordsFiltered} />
                                            </Fragment>
                                        }


                                        {this.state.userInteractiveWithFilters && this.props.products.length<=0
                                         ? <div className="note-msg">
                                            <FormattedMessage id="searchresult.noproducts" />
                                            </div>
                                         : 
                                          (this.props.products.length==0 && this.props.loading) ? (<div className="d-flex mt-3">  <div className="text-primary mx-auto"> <Spinner color="currentColor"/></div></div>)
                                          : (<ExtensionPoint
                                            id="productList"
                                            products={this.props.products}
                                            loading={this.props.loading}
                                            params={this.props.params}
                                            maxItemsPerPage={this.props.maxItemsPerPage}
                                            variables={this.props.searchQuery.variables}
                                          />)
                                        }
                                        {mobileMode && (
                                            <Fragment>
                                                <ExtensionPoint id="whatsapp"/>
                                            </Fragment>
                                        )}

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