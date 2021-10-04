class SectionPmRecordsListComputer extends React.Component {
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
                quarter: null,
                year: null,
            },
            headers:  [
                {value: 'pk', label: 'PM ID'},
                {value: 'event', label: 'Quarter'},
                {value: 'schedule', label: 'Schedule'},
                {value: 'technician', label: 'Technician'},
                {value: 'status', label: 'Status'},
            ]
        }

        this.fields = JSON.parse(JSON.stringify(this.baseState));
        this.state = JSON.parse(JSON.stringify(this.baseState));

        this.doSearch = this.doSearch.bind(this);
        this.doFilter = this.doFilter.bind(this);
        this.doPager = this.doPager.bind(this);
        this.fieldUpdate = this.fieldUpdate.bind(this);
        this.parameterBuilder = this.parameterBuilder.bind(this);
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

        obj['event'] = localStorage.getItem('event');
        obj['year'] = localStorage.getItem('year');

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

    onSelectChange = (id, e) => {

    }

    loadData(){
        this.query(`${this.parameterBuilder()}`);
    }

    renderItems(instance){
        let content = instance.empty();

        if(instance.props.context.response.results){
            if (instance.props.context.response.results.length){
                content = instance.props.context.response.results.map((value, index) => {
                            return <tr>
                              <td>{value.pk}</td>
                              <td>{value.event}</td>
                              <td>{value.schedule_formatted}</td>
                              <td>{value.technician_name}</td>
                              <td>{value.status}</td>
                            </tr>
                          })
            }
        }

        return content
    }

    inlineAccordion(instance){

        // Generate Quarter Options
        let quarter_options = '';
        if(instance.props.context.filters.quarter.length > 0){
            quarter_options = instance.props.context.filters.quarter.map(function (value){
                return <option value={value.id}>{value.name}</option>
            });
        }

        // Generate Year Options
        let year_options = '';
        if(instance.props.context.filters.year.length > 0){
            year_options = instance.props.context.filters.year.map(function (value){
                return <option value={value['schedule__year']}>{value['schedule__year']}</option>
            });
        }

        return <>
            <div className="accordion" id="accordion-pm-records">
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="heading-1">
                        <button className="accordion-button border-0 collapsed box-shadow-none" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapse-1"
                                aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-adjustments"
                                 width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" fill="none" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="6" cy="10" r="2"/>
                                <line x1="6" y1="4" x2="6" y2="8"/>
                                <line x1="6" y1="12" x2="6" y2="20"/>
                                <circle cx="12" cy="16" r="2"/>
                                <line x1="12" y1="4" x2="12" y2="14"/>
                                <line x1="12" y1="18" x2="12" y2="20"/>
                                <circle cx="18" cy="7" r="2"/>
                                <line x1="18" y1="4" x2="18" y2="5"/>
                                <line x1="18" y1="9" x2="18" y2="20"/>
                            </svg>
                            <span className="px-1">Record Filters</span>
                        </button>
                    </h2>
                    <div id="collapse-1" className="accordion-collapse collapse"
                         data-bs-parent="#accordion-pm-records">
                        <div className="accordion-body pt-0 border-bottom-1">
                            <div className="row mb-3">
                                <div className="col-3">
                                    <input type="text" id="search_box" className="form-control"
                                            value={instance.props.context.value}
                                            onChange={e => instance.props.context.onChangeHandler(e)}
                                            placeholder="Search…"/>
                                </div>
                                <div className="col-3">
                                        <select className="form-select" value={instance.props.context.active.quarter} onChange={(e)=>{
                                            instance.props.context.action('event', e.target.value)
                                        }}>
                                            <option value=''>Quarter</option>
                                            {quarter_options}
                                        </select>
                                    </div>
                                    <div className="col-3">
                                        <select className="form-select" value={instance.props.context.active.year} onChange={(e)=>{
                                            instance.props.context.action('year', e.target.value)
                                        }}>
                                            <option value=''>Year</option>
                                            {year_options}
                                        </select>
                                    </div>
                            </div>
                            <div className="hr mb-3 mt-0"/>
                            <div className="d-flex align-items-center">
                                {instance.navigation()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;
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
                            // Filters variables
                            'active':this.state.active_filters,
                            'filters': this.props.context.filters,
                            'value': this.state.value,
                            'inlineAccordion': this.inlineAccordion,
                            'action': this.doFilter,

                            // Core Variables
                            'name': 'record',
                            'headers':this.state.headers,
                            'ordering':this.state.ordering,
                            'limit':this.state.limit,
                            'loading':this.state.loading,
                            'pager':this.doPager,
                            'renderItems': this.renderItems,
                            'onChangeHandler': this.onChangeHandler,

                            // Data Variables
                            'details_api': this.props.context.api.details,
                            'response':this.state.response,
                            'const':this.const,
                        }
                    }
                />
            </>
        );
    }
}