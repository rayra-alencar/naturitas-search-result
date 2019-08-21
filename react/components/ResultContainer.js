import React, { Component, PureComponent, Fragment } from 'react';
import { FormattedMessage , injectIntl} from 'react-intl'
import { graphql } from 'react-apollo'

import categoryNameQuery from '../queries/categoryNameQuery.gql'
import brandsQuery from '../queries/getBrands.gql'

import { ExtensionPoint, Link } from 'vtex.render-runtime'
import ReactResizeDetector from 'react-resize-detector'
import Truncate from 'react-truncate';
import '../global.css'
import FilterBlock from './FilterBlock';
import ToolbarProducts from './ToolbarProducts';
import ViewMore from './ViewMore';
import { Spinner } from 'vtex.styleguide'
import CatRetailRocket from './CatRetailRocket';

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
        if (props.params.subcategory) titleTag = this.titleTagWithAccent(props.params.subcategory, 'subcategory', props.params.department, props.params.category)
        else if (props.params.category) titleTag = this.titleTagWithAccent(props.params.category, 'category', props.params.department, null)
        else if (props.params.department) titleTag = this.titleTagWithAccent(props.params.department, 'department', null, null)
        else if (props.params.brand) titleTag = this.titleTagWithAccent(props.params.brand, 'brands', null, null)

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

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.searchQuery.titleTag && nextProps.searchQuery.titleTag !== prevState.titleTag) {
            return { titleTag: nextProps.searchQuery.titleTag };
        }

        else return null;
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.loading != this.props.loading) {
            return true;
        }
        /* TODO -> OPTIMIZAR CONDICION, NO VALE SI EL NUMERO DE PRODUCTOS ES IGUAL
             if(nextProps.products.length == this.props.products.length){
             return false;
         }*/

        return true;
    }

    updateOrderBy = (orderByField) => {
        this.props.searchQuery.refetch({ orderBy: orderByField })
        this.setState({ orderByField })
    }

    updatePrice = (minPrice, maxPrice) => {
        let query = this.state.query;
        let map = this.state.map;

        //Si el precio es diferente de 0 e infinito, metemos en la query: de-{min}-a-{max}
        if (minPrice != optionsMinPrice[0].value || maxPrice != optionsMaxPrice[optionsMaxPrice.length - 1].value) {
            query += `/de-${minPrice}-a-${maxPrice}`
            let queryArray = query.split('/')
            let mapArray = map.split(',')
            mapArray.splice(queryArray.length - 1, 0, 'priceFrom')
            map = mapArray.join(',')
        }

        this.props.searchQuery.refetch({ query, map })
        this.setState({ minPrice, maxPrice, userInteractiveWithFilters: true })
    }

    updateQuerySearch = (map, rest) => {
        this.props.searchQuery.refetch({ map, rest })
        this.setState({ map, rest, userInteractiveWithFilters: true })
    }

    titleTagWithAccent = (title,type,department,category) =>{
        let result='';
        let auxDepartment='';
        let auxCategory='';
        let auxBrand='';
        
        if(title){
            title=title.replace(/%20/g, '-')
            title=title.replace(/ /g, '-')
        } 

        if(department){
            department=department.replace(/%20/g, '-')
            department=department.replace(/ /g, '-')
        } 

        if(category){
            category=category.replace(/%20/g, '-')
            category=category.replace(/ /g, '-')
        } 
     
        let categories=this.props.data.categories;
       
        if(typeof categories != 'undefined'){
            if (type == 'department'){
                result=categories.filter(item =>this.customformatedSlug(item.slug) == this.customformatedSlug(title))
            }else if (type == 'category'){
                auxDepartment=categories.filter(item =>this.customformatedSlug(item.slug) == this.customformatedSlug(department))
                if(auxDepartment.length){
                    if(auxDepartment[0].children.length) result=auxDepartment[0].children.filter(item =>item.slug == this.customformatedSlug(title))
                }
            }else if (type == 'subcategory'){
                
                auxDepartment=categories.filter(item =>this.customformatedSlug(item.slug) == this.customformatedSlug(department))

                if(auxDepartment.length){
                    
                    if(auxDepartment[0].children.length){ 
                        
                        auxCategory=auxDepartment[0].children.filter(item =>this.customformatedSlug(item.slug) == this.customformatedSlug(category))
                        
                        if(auxCategory.length){
                            result=auxCategory[0].children.filter(item => this.customformatedSlug(item.slug) == this.customformatedSlug(title) )
                        }
                    }
                }
            }else if(type == 'brands'){
               
               auxBrand = title.replace(/-/g, ' ')
               return decodeURI(auxBrand)
            }
        }

       
        
       if(result.length){
        return result[0].name;
       }else{
        return '';
       }
       
    }  


    customformatedSlug = (slug) => {
        slug = slug.replace('--', '-');
        return ((slug).substr(-1,1) == '-') ? (slug).substr(0,slug.length -1) : slug
    }



    render() {
        const { searchQuery, notfoundimage, params, map, intl } = this.props
        const { facets } = searchQuery

        let categoryPath = ''

        if (this.props.products && this.props.products[0]) {
            if (this.props.params.subcategory) {
                categoryPath = this.props.products[0].categories[0]
            }
            else if (this.props.params.category) {
                categoryPath = this.props.products[0].categories[1]
            }
            else if (this.props.params.department) {
                categoryPath = this.props.products[0].categories[2]
            }
        }


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
                                            <p className="title"><FormattedMessage id="store/searchresult.title" /></p>
                                        </div>

                                        {mobileMode && (
                                            <Fragment>
                                                <ExtensionPoint id="whatsapp" />
                                            </Fragment>
                                        )}

                                        <div className="searchresult-subtitle-container">
                                            <p><FormattedMessage id="store/searchresult.subtitle" /></p>
                                            <p><FormattedMessage id="store/searchresult.subtitle2" /></p>
                                        </div>
                                        <div className="searchresult-tips-container">
                                            <ul>
                                                <li><FormattedMessage id="store/searchresult.tips1" /></li>
                                                <li><FormattedMessage id="store/searchresult.tips2" /></li>
                                                <li><FormattedMessage id="store/searchresult.tips3" /></li>
                                            </ul>
                                        </div>
                                    </div>

                                    
                                    <div data-retailrocket-markup-block={intl.formatMessage({ id: 'store/retail.notfoundmarkup' })} data-search-phrase={this.props.params.term}></div>
                                    

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

                                <ExtensionPoint id="topbrand" titleTag={this.state.titleTag} descriptionTag={this.props.description} />

                                <ExtensionPoint id="banners" />

                                {mobileMode &&
                                    <div className="container">
                                        <ExtensionPoint id="subcategories" />
                                    </div>
                                }

                                {mobileMode &&
                                    <div className="d-flex">
                                        <FilterBlock mobileMode={mobileMode} updatePrice={this.updatePrice} updateQuerySearch={this.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} optionsMinPrice={optionsMinPrice} optionsMaxPrice={optionsMaxPrice} />
                                        <ToolbarProducts updateOrderBy={this.updateOrderBy} updatePrice={this.updatePrice} recordsFiltered={searchQuery.recordsFiltered} />
                                    </div>
                                }

                                <div id="category-main-container" className="container mt-md-3 d-flex flex-wrap">
                                    {!mobileMode &&
                                        <FilterBlock mobileMode={mobileMode} updatePrice={this.updatePrice} updateQuerySearch={this.updateQuerySearch} map={map} searchQuery={searchQuery} facets={facets} params={params} optionsMinPrice={optionsMinPrice} optionsMaxPrice={optionsMaxPrice} />
                                    }

                                    <div id="products-block">
                                        {!mobileMode &&
                                            <Fragment>
                                                <ExtensionPoint id="subcategories" />
                                                <ToolbarProducts updateOrderBy={this.updateOrderBy} updatePrice={this.updatePrice} recordsFiltered={searchQuery.recordsFiltered} />
                                            </Fragment>
                                        }


                                        {this.state.userInteractiveWithFilters && this.props.products.length <= 0
                                            ? <div className="note-msg">
                                                <FormattedMessage id="store/searchresult.noproducts" />
                                            </div>
                                            :
                                            (this.props.products.length == 0 && this.props.loading) ? (<div className="d-flex mt-3">  <div className="text-primary mx-auto"> <Spinner color="currentColor" /></div></div>)
                                                : (
                                                    <Fragment>
                                                            
                                                        <ExtensionPoint
                                                            id="productlist"
                                                            products={this.props.products}
                                                            loading={this.props.loading}
                                                            params={this.props.params}
                                                            maxItemsPerPage={this.props.maxItemsPerPage}
                                                            variables={this.props.searchQuery.variables}
                                                        />
                                                    </Fragment>
                                                )
                                        }
                                        {mobileMode && (
                                            <Fragment>
                                                <ExtensionPoint id="whatsapp" />
                                            </Fragment>
                                        )}

                                        <ViewMore {...this.props} />


                                    </div>
                                </div>

                                {categoryPath &&
                                    <CatRetailRocket categoryPath={categoryPath}/>
                                }
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


export default injectIntl(graphql(categoryNameQuery)(ResultContainer))