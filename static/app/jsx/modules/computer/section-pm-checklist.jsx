
class StatusSelectGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    formIsInvalid(property_name, class_name){
        if (this.props.context.errors.hasOwnProperty(property_name)){
            class_name += ' is-invalid';
        }

        return class_name;
    }

    item(item){
        return <label className="form-selectgroup-item">
                <input
                    type="checkbox"
                    name={this.props.context.id}
                    value={item.const}
                    className="form-selectgroup-input"
                    checked={this.props.context.value_instance[this.props.context.id] === item.const}
                    onClick={()=>{
                        this.props.context.onClick(this.props.context.id, item.const);
                    }}
                />
                <span className="form-selectgroup-label">{item.label}</span>
        </label>
    }

    compileItems(){
        let instance = this;

        return this.props.context.data.map(function (item){
           return instance.item(item)
        });
    }

    render() {
        return (
            <>
                <div className={this.formIsInvalid(this.props.context.id, 'form-selectgroup ')}>
                    {this.compileItems()}
                </div>
                <div className="invalid-feedback">{this.props.context.errors[this.props.context.id]}</div>
            </>
        );
    }
}

class Steps extends React.Component {

    constructor(props) {
        super(props);
    }

    item(item){
        let class_name = "step-item cursor-pointer ";

        if(instance.props.context.current === item.pk){
            class_name += "active";
        }

        if(!item.enable){
            return ''
        }

        return <>
            <div className={class_name} >
                {item.name}
            </div>
        </>
    }

    compileItems(){
        let instance = this;

        return this.props.context.data.map(function (item){
            if(instance.props.context.item){
                return instance.props.context.item(item, instance);
            }else{
                return instance.item(item);
            }
        });
    }

    render() {
        let steps_class = "steps ";

        if(this.props.context.class){
            steps_class += this.props.context.class;
        }

        return (
            <div className={steps_class}>
                {this.compileItems()}
            </div>
        );
    }
}

class SectionPmChecklistListComputer extends React.Component {
    constructor(props) {
        super(props);

        // Precache remark items
        this.intervalInstance = null;
        this.sharedCache = {}
        this.cacheRef = (ref) => ref && (ref.optionsCache = this.sharedCache)

        this.const = {
            co: 'create-option',
            so: 'select-option',
        }

        this.baseState = {
            loading: false,
            data: [],
            scheduler_data: [],
            instance: {
            },
            errors: {},
            api: this.props.context.api,
            meta: this.props.context.meta
        }

        this.fields = JSON.parse(JSON.stringify(this.baseState));
        this.state = JSON.parse(JSON.stringify(this.baseState));

        this.network = new Network({
            params: {
                instance: this
            }
        });

        this.formItemStatus = this.formItemStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fieldUpdate(obj){
        let instance = this;

        // Update fields
        Object.keys(obj).forEach(function(value, index){
            instance.fields[value] = obj[value];
        });

        // Update states
        instance.setState(obj);
    }

    fieldHandleFormat(data, newValue, actionMeta, field_name){
        data[field_name] = newValue.value;
        data[`${field_name}_label`] = newValue.label;
        data[`${field_name}_action`] = actionMeta.action;
        data[`${field_name}_obj`] = {
            label: newValue.label,
            value: newValue.value,
        }

        return data
    }

    formItemStatus(name, value){
        let data = this.state.instance;
        data[name] = value;
        this.fieldUpdate({ instance: data });
        this.clearErrorField(name);
    }

    clearErrorField(key){
      let errors = this.state.errors;
      if (errors.hasOwnProperty(key)){
          delete errors[key];
          this.setState({errors: errors});
      }
    }

    handleChange(newValue, actionMeta, field_name, successCallback, errorCallback){
        newValue = this.fieldHandleFormat(this.fields.instance, newValue, actionMeta, field_name);
        this.fieldUpdate({instance: newValue});
        // If new then create
        if(this.fields.instance[`${field_name}_action`] === this.const.co){
            this.network.params.field_name = field_name;
            this.network.send({
                url: this.state.api['remark'],
                method: 'post',
                data: {
                    label: newValue[`${field_name}_label`]
                }
            }, successCallback, errorCallback);
        } else {
          this.fields.instance[field_name] = newValue[field_name];
        }

        this.clearErrorField(field_name);
    }

    query(val, field_name){
        let instance = this;
        return new Promise(resolve => {
            instance.network.send({
                url: `${instance.state.api[field_name]}?search=${val}`
            }, function (response) {
                resolve(response.data);
            });
        })
    }

    remarksSuccessCallback = (response, params) => {
        let data = response.data;

        data = params.instance.fieldHandleFormat(params.instance.fields.instance, data, {action: params.instance.const.so}, params.field_name);
        params.instance.fieldUpdate({instance: data});
    }
    remarksErrorCallback = (response, params) => {
        params.instance.props.toast.error('Unable to submit form');
    }
    remarksQuery = (val, callback) => {
        let r = this.query(val, 'remark');
        r.then(function (e) {
            callback(e.results.slice(0, 7));
        })
    }

    item(obj, props){
        return obj.map(function (item_val){

           if(!item_val.enable){
                return ''
           }

           let field_remark_id = `fr_${item_val.pk}`;
           let AsyncSelect = props.instance.props.select;
           return <div className="list-group-item">
                    <div className="row">
                        <div className="col-md-5 d-flex"><span>{item_val.name}</span></div>
                        <div className="col-md-3 mt-2 mt-md-0">
                            <StatusSelectGroup context={
                                {
                                    id: `ft_${item_val.pk}`,
                                    value_instance: props.instance.fields.instance,
                                    data: [
                                            {'label': 'OK', 'const': 'ok'},
                                            {'label': 'REPAIR', 'const': 'repair'},
                                    ],
                                    errors: props.instance.state.errors,
                                    onClick: props.instance.formItemStatus
                                }
                            }/>
                        </div>
                        <div className="col-md-4 mt-2 mt-md-0">
                            <AsyncSelect
                                id={field_remark_id}
                                styles={zIndex}
                                value={props.instance.state.instance[`${field_remark_id}_obj`]}
                                placeholder={'Type your remarks here..'}
                                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                                noOptionsMessage={() => null}
                                loadOptions={props.instance.remarksQuery}
                                 onChange={(newValue, actionMeta)=> {
                                    props.instance.handleChange(newValue, actionMeta, field_remark_id, props.instance.remarksSuccessCallback, props.instance.remarksErrorCallback);
                                }}
                            />
                        </div>
                    </div>
           </div>;
        });
    }

    doCleanData(){
        let rgx = /^[a-zA-Z]+_[0-9]+$/i; // Only acceptable format is XXn_NNn
        let rgx_errors = /^ft_[0-9]+$/i;
        let new_data = {}
        let data = this.fields.instance;
        let error_message = 'This field is required';
        let errors = this.state.errors;

        Object.keys(data).forEach((key)=>{
            if(rgx.test(key)){
                new_data[key] = data[key];
            }
            if(rgx_errors.test(key)){
                if(data[key] === ""){
                    errors[key] = error_message;
                }
            }
        });

        this.fieldUpdate({errors: errors});

        if (Object.keys(errors).length > 0){
            this.props.toast.error('Please resolve the issues');
            this.fieldUpdate({loading: false});
            return false;
        }
        return new_data;
    }

    doReset(noToast){
        let val = null;
        let data = this.fields.instance;

        Object.keys(data).forEach((value)=>{

            switch(typeof(data[value])){
                case "string":
                    val = "";
                break;
                case "object":
                    val = {}
                break;
                default:
                    val = null
            }
            data[value] = val;
        });

        this.fieldUpdate({instance: data});
        if(!noToast){
            this.props.toast.success('Form has been reset');
        }
    }

    coreSuccessCallback = (response, params) => {
        switch (response.status) {
            case 201:
                let meta = this.state.meta;

                meta.current_submitted_count += 1;
                params.instance.props.toast.success('Successfully published!');

                params.instance.fieldUpdate({meta: meta})
                this.doReset(true);
            break;
            default:
                params.instance.props.toast.error('Unknown Response');
        }
        params.instance.fieldUpdate({loading: false});
    }

    coreErrorCallback = (error, params) => {
        switch (error.response.status) {
            case 400:
            case 500:
                if (error.response.hasOwnProperty('data')) {
                    log(error.response.data)

                    if(error.response.data.hasOwnProperty('non_field_errors')){
                        let msg = error.response.data.non_field_errors || [];
                        msg.forEach(function(message){
                            params.instance.props.toast.error(message);
                        })
                    }else{
                        params.instance.props.toast.error('Please resolve the issues.');
                        params.instance.fieldUpdate({errors: error.response.data});
                    }
                } else {
                    params.instance.props.toast.error('Something went wrong submitting the form');
                }
                break;
            default:
                params.instance.props.toast.error('Unable to submit form');
        }
        this.fieldUpdate({loading: false});
    }

    handleSubmit(event){
        event.preventDefault();
        this.fieldUpdate({loading: true});
        let clean_data = this.doCleanData();

        if(clean_data){
            this.network.send({
                url: this.state.api[`data`],
                method: 'post',
                data: {
                    'device': window.context.pk,
                    'data':clean_data
                }
            }, this.coreSuccessCallback, this.coreErrorCallback)
        }
    }

    compileItems(context, instance){

        if(!context.data.enable){
            return instance.empty();
        }

        return context.data.groups.map(function (group_data){

            if(!group_data.enable){
                return ''
            }

            return <>
                {instance.itemHeader(group_data.name)}
                {instance.props.item(group_data.item, instance.props)}
            </>
        });
    }

    successCallback(response, params){
        params.instance.setState({
            data: response.data,
            loading: false
        });
        params.instance.loadFields();
    }

    errorCallback(response, params){
        switch (response.response.status){
            case 404:
                params.instance.props.toast.error('No checklist config has been found');
            break;
            default:
                params.instance.props.toast.error('Error is not identified please check console logs');
                log(response)
        }
    }

    loadFields(){
        let data = this.state.instance
        this.state.data.groups.forEach((value, index) =>{
            if(value.item && value.enable){
               value.item.forEach((item_value, index) => {
                 if(item_value.enable){
                       data[`ft_${item_value.pk}`] = '';
                       data[`fr_${item_value.pk}`] = '';
                   }
               })
            }
        });
        this.fieldUpdate({instance: data});
    }

    loadData(){
        let source = this.state.api['source'];
        let instance = this;

        if (!source){
            return null;
        }

        this.setState({loading: true});
        setTimeout(function (){
            instance.network.send({
            url: source
            }, instance.successCallback, instance.errorCallback );
        }, 1000);
    }

    successSchedulerCallback(response, params){
        params.instance.setState({
            scheduler_data: response.data,
            loading: false
        });
        params.instance.loadFields();
    }

    errorSchedulerCallback(response, params){
        switch (response.response.status){
            case 404:
                params.instance.props.toast.error('No scheduler config has been found');
            break;
            default:
                params.instance.props.toast.error('Error is not identified please check console logs');
                log(response)
        }
    }

    SchedulerItem(item, instance){
        let class_name = "step-item cursor-pointer ";
        let status = "Inactive";

        if(!item.enable || Object.keys(instance.props.context.ongoing).length < 1){
            return '';
        }

        if(instance.props.context.ongoing.event === item.pk){
            class_name += "active";
            status = "Ongoing";
        }

        if(instance.props.context.ongoing.event == null){
            if(instance.props.context.last_event === item.pk){
                class_name += "active";
                status = "Completed";
            }
        }

        if(instance.props.context.ongoing.event > item.pk){
            status = "Completed";
        }

        let modal_content = <div>
            <div className="modal-title">{item.name}</div>
            <div className="mb-3">
                <label className="form-label mb-0 text-secondary">Status:</label>
                <div className="form-control-plaintext pt-1 font-weight-bold">{status}</div>
            </div>
            <div className="mb-3">
                <label className="form-label mb-0 text-secondary">Maximum Submission:</label>
                <div className="form-control-plaintext pt-1 font-weight-bold">{item.no_items}</div>
            </div>
            <div className="mb-3">
                <label className="form-label mb-0 text-secondary">Schedule Scope:</label>
                <div className="form-control-plaintext pt-1 font-weight-bold">{item.months.map(function (val){
                    let badge_class = "badge me-1 mb-1 ";

                    if(val === instance.props.context.ongoing.month){
                        badge_class += "bg-yellow"
                    }else{
                        badge_class += "bg-teal"
                    }

                    return <span className={badge_class}>{monthNames[val-1]}</span>;
                })}</div>
            </div>
        </div>

        return <>
            <div className={class_name} data-bs-toggle="modal" data-bs-target={'#modal_'+item.pk}>
                {item.name}
            </div>
            <Modal
                id={'modal_'+item.pk}
                title={false}
                body={modal_content}
                config_class="modal-sm modal-dialog-centered"
            />
        </>
    }

    loadSchedulerData(){
        let source = this.state.api['scheduler'];
        let instance = this;

        if (!source){
            return null;
        }

        this.setState({loading: true});
        setTimeout(function (){
            instance.network.send({
            url: source
            }, instance.successSchedulerCallback, instance.errorSchedulerCallback );
        }, 1000);
    }

    componentDidMount(){
        this.loadData();
        this.loadSchedulerData();
    }

    render() {

        let loading = '';
        let submit_button_label = 'Publish';
        let data = []
        let ongoing = {}

        if(this.state.loading){
            loading = <span className="spinner-border spinner-border-sm me-2" role="status"/>
            submit_button_label = 'Publishing...'
        }

        let main_content = <>
            <AdvanceListGroup context={this.state} item={this.item} compileItems={this.compileItems} instance={this}/>
                <div className="card-footer">
                <div className="d-flex">
                        <button type="button" onClick={()=>{this.doReset()}} className="btn btn-link">Reset</button>
                        <button type="submit" className="btn btn-primary ms-auto" disabled={this.state.loading}>
                                {loading}
                                <span>{submit_button_label}</span>
                        </button>
                    </div>
                </div>
        </>;

        if(this.state.scheduler_data.events){
           data = this.state.scheduler_data.events;
        }

        if(this.state.scheduler_data.ongoing){
           ongoing = this.state.scheduler_data.ongoing;
           if(this.state.meta.current_submitted_count >= this.state.scheduler_data.ongoing.no_items){
                main_content = <div className="empty">
                    <div className="empty-img">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-lg icon-tabler-clipboard-check"
                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/>
                            <rect x="9" y="3" width="6" height="4" rx="2"/>
                            <path d="M9 14l2 2l4 -4"/>
                        </svg>
                    </div>
                    <p className="empty-title">PM Conducted</p>
                    <p className="empty-subtitle text-muted">
                        Maximum number of submission reached.
                    </p>
                </div>;
           }
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="list-group list-group-flush overflow-auto">
                    <div className="list-group-header sticky-top">{this.state.scheduler_data.name || '--'}</div>
                    <div className="list-group-item">
                        <div className="row">
                            <Steps context={{
                                class: "mt-3 mb-1",
                                data: data,
                                ongoing: ongoing,
                                last_event: this.state.meta.last_submitted_event,
                                item: this.SchedulerItem
                            }} />
                        </div>
                    </div>
                </div>
                {main_content}
            </form>
        );
    }
}