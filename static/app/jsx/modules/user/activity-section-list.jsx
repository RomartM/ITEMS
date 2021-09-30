
class ActivitySectionList extends React.Component {

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
                action_flag: null,
            },
            headers:  [
                {value: 'action_time', label: 'Time'},
                {value: 'action_flag', label: 'Flag'},
                {value: 'change_message', label: 'Message'},
                {value: 'object_repr', label: 'Object'},
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
        obj['action_flag'] = localStorage.getItem('action_flag');
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

    renderMessage(data){
        try{
            data = JSON.parse(data);
            let message = data['messages']

            if(message){
                return <ul>{message.map(function (val){
                    return <li><strong>{val.field}</strong> changed from <s className="text-red">{val.old.name}</s> to <span className="text-green">{val.new.name}</span></li>
                })}</ul>
            }else{
                return '*** Admin Action Logs ***'
            }
        } catch (err){
            log('Unable to parse message')
        }
    }

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
        let badge;

        if(instance.props.context.response.results){
            if (instance.props.context.response.results.length){
                content = instance.props.context.response.results.map((value, index) => {

                            badge = 'badge ';
                            switch (value.action_flag){
                                case 1:
                                    badge += 'bg-green';
                                break;
                                case 2:
                                    badge += 'bg-yellow';
                                break;
                                case 3:
                                    badge += 'bg-red';
                                break;
                            }

                            return <tr>
                              <td width={200}>{value.action_time_formatted}</td>
                              <td width={100}><span className={badge}>{value.action_flag_name}</span></td>
                              <td width={300} className="list-deep-diff">{instance.props.context.renderMessage(value.change_message)}</td>
                              <td width={200}>{value.object_repr}</td>
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

        this.fields.active_filters['action_flag'] = localStorage.getItem('action_flag');
        this.fields.active_filters['limit'] = localStorage.getItem('limit');
        this.fields.active_filters['ordering'] = localStorage.getItem('ordering');

        this.fieldUpdate({active_filters: this.fields.active_filters}, this.loadData());
    }

    render() {
        let loading = this.state.loading ? this.loading:'';
        return (
            <>
                    <div className="row row-cards">
                        <div className="col-3">
                            <div className="mb-4">
                                <label className="form-label">Search Activity</label>
                                <div className="input-icon mb-3">
                                    <input type="text" id="search_box" className="form-control mb-4"
                                        value={this.state.value}
                                        onChange={e => this.onChangeHandler(e)}
                                        placeholder="Search…"/>
                                    <span className="input-icon-addon">
                                        {loading}
                                    </span>
                                </div>
                            </div>
                            <Filter context={
                                {
                                    'active':this.state.active_filters,
                                    'meta_data': this.props.context.filters,
                                    'action':this.doFilter,
                                }
                            }/>
                        </div>
                        <div className="col-9">
                            <div className="card">
                            <CardTable
                                context={
                                    {
                                        'active':this.state.active_filters,
                                        'headers':this.state.headers,
                                        'details_api': this.props.context.api.details,
                                        'renderMessage': this.renderMessage,
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
                            </div>
                        </div>
                    </div>
            </>
        );
    }

}