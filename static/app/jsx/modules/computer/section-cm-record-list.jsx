class SectionCmRecordListComputer extends React.Component {
    loading = <div className="spinner-border spinner-border-sm text-muted" role="status"/>

    constructor(props) {
        super(props);

        this.const = {
            limit: 10
        }
        this.baseState = {
            loading: false,
            response: {
                results: [],
                next: '',
                previous: '',
            },
            value: '',
            active_filters: {
                brand: null,
                equipment_type: null,
                office: null,
            },
            headers:  [
                {value: 'pk', label: 'SOD NO'},
                {value: 'quarter', label: 'Technician'},
                {value: 'schedule', label: 'Issued'},
                {value: 'technician', label: 'Client'},
                {value: 'status', label: 'TSR Status'},
            ]
        }

        this.fields = JSON.parse(JSON.stringify(this.baseState));
        this.state = JSON.parse(JSON.stringify(this.baseState));

        this.doSearch = this.doSearch.bind(this);
        this.doFilter = this.doFilter.bind(this);
        this.doPager = this.doPager.bind(this);
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.parameterBuilder = this.parameterBuilder.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    doSearch = async val => {
        await this.query(this.parameterBuilder({'search': val}));
        this.fieldUpdate({value: val});
    }

    doFilter = (action, id) => {
        let old_id;
         old_id = localStorage.getItem(action);
         id = String(old_id) === String(id) ? null : id;
         localStorage.setItem(action, id);
         this.fields.active_filters[action] = id;
         this.fieldUpdate({active_filters: this.fields.active_filters}, this.loadData());
    }

    doPager = link => {
        if(link){
            let url = new URL(link);
            this.query(this.parameterBuilder(Object.fromEntries(url.searchParams)));
        }
    }

    fieldUpdate(obj, callback){
        let instance = this;

        // Update fields
        Object.keys(obj).forEach(function(value, index){
            instance.fields[value] = obj[value];
        });
        // Update states
        this.setState(obj, callback)
    }

    parameterBuilder = (obj) => {

        // Preset Data
        obj = obj || {};
        // obj['brandpk__id'] = localStorage.getItem('brand');
        // obj['equipment_type'] = localStorage.getItem('equipment_type');
        // obj['office__id'] = localStorage.getItem('office');
        obj['limit'] = localStorage.getItem('limit');
        obj['ordering'] = localStorage.getItem('ordering');

        let params = new URLSearchParams(obj);
        let keysForDel = [];
        params.forEach((v, k) => {
          if (v === 'null' || !v)
              keysForDel.push(k);
        });
        keysForDel.forEach(k => {
          params.delete(k);
        });
        return params.toString()
    }

    query = async (search_params) => {
        let instance = this;
        let url = new URL(instance.props.context.api[`source`]);
        url.search = search_params || '';
        instance.fieldUpdate({loading: true});
        const result = new Promise(resolve => {
            new Network().send({
                url: url.toString()
            }, function (response) {
                resolve(response.data);
            });
        })
        const data = await result;
        instance.fieldUpdate({response: data});
        setTimeout(()=>{
            instance.fieldUpdate({loading: false });
        }, 500);
    }

    onChangeHandler = e => {
      this.doSearch(e.target.value);
    };

    loadData(){
        this.query(`${this.parameterBuilder()}`);
    }

    renderItems(instance){
        let content = <tr><td colSpan="8"><div className="empty">
                       <div className="empty-img"><img src={window.e404_photo} height="128" alt=""/>
                       </div>
                       <p className="empty-title">No results found</p>
                       <p className="empty-subtitle text-muted">
                         Try adjusting your search or filter to find what you're looking for.
                       </p>
                     </div></td></tr>;

        if(instance.props.context.response.results){
            if (instance.props.context.response.results.length){
                content = instance.props.context.response.results.map((value, index) => {
                            return <tr>
                              <td>Dummy Data</td>
                              <td>Dummy Data</td>
                              <td>Dummy Data</td>
                              <td>Dummy Data</td>
                              <td>Dummy Data</td>
                            </tr>
                          })
            }
        }

        return content
    }

    componentDidMount(){
        let limit = localStorage.getItem('limit');

        if(limit === null){
            localStorage.setItem('limit', this.const.limit);
        }

        this.fields.active_filters['brand'] = localStorage.getItem('brand');
        this.fields.active_filters['equipment_type'] = localStorage.getItem('equipment_type');
        this.fields.active_filters['office'] = localStorage.getItem('office');
        this.fields.active_filters['limit'] = localStorage.getItem('limit');
        this.fields.active_filters['ordering'] = localStorage.getItem('ordering');

        this.fieldUpdate({active_filters: this.fields.active_filters}, this.loadData());
    }

    render() {
        return (
            <>
                <CardTable
                    context={
                        {
                            'active':this.state.active_filters,
                            'headers':this.state.headers,
                            'details_api': this.props.context.api.details,
                            'renderItems': this.renderItems,
                            'action': this.doFilter,
                            'ordering':this.state.ordering,
                            'limit':this.state.limit,
                            'loading':this.state.loading,
                            'response':this.state.response,
                            'const':this.const,
                            'pager':this.doPager,
                            'name': 'device'
                        }
                    }
                />
            </>
        );
    }
}