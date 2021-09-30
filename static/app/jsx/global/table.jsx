class CardTable extends React.Component {

    desc_icon = <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-sm icon-thick icon-float" width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="6 15 12 9 18 15"/></svg>;
    asc_icon = <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-sm icon-thick icon-float"
                       width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                       strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                       <polyline points="6 9 12 15 18 9"/></svg>;
    loading_bar = <tr>
        <th colSpan="8" className="p-0">
            <div className="progress progress-sm">
                <div className="progress-bar progress-bar-indeterminate"/>
            </div>
        </th>
    </tr>;


    constructor(props) {
        super(props);

        this.state = {
            page_active: 0,
        }

        this.activePageClass = this.activePageClass.bind(this);
        this.disablePageClass = this.disablePageClass.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.orderingMode = this.orderingMode.bind(this);
    }

    getPageOffset(url){
        let urlParams = new URLSearchParams(url);
        return urlParams.get('offset');
    }

    activePageClass(index){
        let active = '';
        if(index === this.state.page_active){
            active = 'active';
        }
        return `page-item ${active}`;
    }

    disablePageClass(value){
        let disable = '';
        if(value === null){
            disable = 'disabled';
        }
        return `page-item ${disable}`;
    }

    onSelectChange = e => {
        this.props.context.action('limit', e.target.value);
    }

    orderingMode = value => {
        if(value === this.props.context.active.ordering){
            value = `-${value}`;
        }else if(this.props.context.active.ordering !== null){
            value = this.props.context.active.ordering;
        }
        return value
    }

    orderingChevron(ordering, value){
        let mode = '';
        if(value === this.props.context.active.ordering){
            mode = this.desc_icon;
        }else if(`-${value}` === this.props.context.active.ordering){
            mode = this.asc_icon;
        }
        return mode
    }

    empty(){
        return <tr>
            <td colSpan="8">
                <div className="empty">
                        <div className="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                                 viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="12" cy="12" r="9"/>
                                <line x1="9" y1="10" x2="9.01" y2="10"/>
                                <line x1="15" y1="10" x2="15.01" y2="10"/>
                                <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0"/>
                            </svg>
                        </div>
                       <p className="empty-title">No results found</p>
                       <p className="empty-subtitle text-muted">
                            Try adjusting your search or filter to find what you're looking for.
                       </p>
                </div>
            </td>
        </tr>;
    }

    get renderHeaders(){
        return this.props.context.headers.map((th, index) => {
            return <th className="cursor-pointer" onClick={() => this.props.context.action('ordering', this.orderingMode(th.value))}>
                {th.label}
                {this.orderingChevron(this.props.context.active.ordering, th.value)}
            </th>
        });
    }

    paginationDisplay(){
        let offset;
        let from;
        let to;
        let page_nav;

        if(this.props.context.response.next != null){
            offset = this.getPageOffset(this.props.context.response.next)
            from = offset - this.props.context.active.limit;
            to = offset
        }else{
            from = this.props.context.response.count - this.props.context.response.results.length
            to = this.props.context.response.count
        }


        from = from < 1? 1 : from+1;

        if(from || to){
            page_nav = <><span>{from}</span> to <span>{to}</span> of </>;
        }

        return <p className="m-0 text-muted">Showing {page_nav} <span>{this.props.context.response.count}</span> {this.props.context.name}(s)</p>
    }

    get paginationLinks(){
        let offsets = [0];
        let count = this.props.context.response.count;
        let limit = Number(this.props.context.active.limit);
        let iterator;
        iterator = 0;

        while(true){
            if(count>=limit){
                iterator += limit
                count = count-limit;
                offsets.push(iterator);
            }else{
                break;
            }
        }

        return offsets.map((value, index)=>{
            return <li className={this.activePageClass(index)}>
                <button className="page-link" onClick={() =>
                {
                    this.props.context.pager(`http://example.com/?limit=${limit}&offset=${value}`);
                    this.setState({page_active: index});
                }
                }>{index+1}</button>
            </li>
        })
    }

    navigation(){
        return <>
            <div>{this.paginationDisplay()}</div>
            <ul className="pagination m-0 ms-auto">
                <li>
                    <select className="form-select p-1 pe-4 ps-3" value={this.props.context.active.limit} onChange={this.onSelectChange}>
                        <option value={10}>Per Page: 10</option>
                        <option value={50}>Per Page: 50</option>
                        <option value={100}>Per Page: 100</option>
                        <option value={500}>Per Page: 500</option>
                        <option value={1000}>Per Page: 1000</option>
                    </select>
                </li>
                <li className={this.disablePageClass(this.props.context.response.previous)}>
                  <button className="page-link"  onClick={() => {
                      this.props.context.pager(this.props.context.response.previous);
                      this.setState({page_active: this.state.page_active - 1});
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-muted
                    icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="15 6 9 12 15 18"/>
                    </svg>
                    prev
                  </button>
                </li>
                {this.paginationLinks}
                <li className={this.disablePageClass(this.props.context.response.next)}>
                  <button className="page-link" onClick={() => {
                      this.props.context.pager(this.props.context.response.next);
                      this.setState({page_active: this.state.page_active + 1});
                  }}>
                      next
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18"/></svg>
                  </button>
                </li>
            </ul>
        </>
    }

    isLoading(){
        return this.props.context.loading? this.loading_bar : '';
    }

    render() {
        let headers = <div className="card-header d-flex align-items-center">
                       {this.navigation()}
                   </div>;

        if(this.props.context.inlineAccordion !== undefined){
            headers = this.props.context.inlineAccordion(this);
        }

        return <>
                   {headers}
                   <div className="table-responsive">
                       <table className="table table-vcenter">
                         <thead>
                           <tr>
                               {this.renderHeaders}
                               <th className="w-1"/>
                           </tr>
                           {this.isLoading()}
                         </thead>
                         <tbody>
                         {this.props.context.renderItems(this)}
                         </tbody>
                       </table>
                   </div>
                   <div className="card-footer d-flex align-items-center">
                       {this.navigation()}
                   </div>
               </>
    }

}