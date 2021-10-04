import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { ToastContainer, toast } from 'https://cdn.skypack.dev/react-toastify';
import AsyncCreatableSelect from 'https://cdn.skypack.dev/react-select@^3.1.0/async-creatable';

class EditSRF extends React.Component {

    constructor(props) {
        super(props);

        this.const = {
            co: 'create-option',
            so: 'select-option'
        }
        this.baseState = {
            // User Information
            user: '',
            user_label: '',
            user_action: '',
            user_obj: {label:'', value:''},
            designation: '',
            contact_number: '',

            // Office Information
            office: '',
            office_label: '',
            office_action: '',
            office_obj: {label:'', value:''},

            // Device Information
            equipment_type: '',
            equipment_type_other: '',
            brand_name: '',
            model:'',
            serial: '',
            mac_address: '',
            device_id: '',

            // SRF Data
            request_type: [],
            brief_description: '',

            errors: []
        }

        this.fields = JSON.parse(JSON.stringify(this.baseState));
        this.state = JSON.parse(JSON.stringify(this.baseState));

        this.network = new Network({
            params: {
                instance: this
            }
        });

        this.clearErrorField = this.clearErrorField.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    clearErrorField(key){
      let errors = this.state.errors;
      if (errors.hasOwnProperty(key)){
          delete errors[key];
          this.setState({errors: errors});
      }
    }

    fieldUpdate(obj){
        let instance = this;

        // Update fields
        Object.keys(obj).forEach(function(value, index){
            instance.fields[value] = obj[value];
        });
        // Update states
        this.setState(obj)
    }

    fieldDelete(to_delete, obj){
        to_delete.forEach(e => delete obj[e]);
        return obj
    }

    fieldHandleFormat(newValue, actionMeta, field_name){
        newValue[field_name] = newValue.value;
        newValue[`${field_name}_label`] = newValue.label;
        newValue[`${field_name}_action`] = actionMeta.action;
        newValue[`${field_name}_obj`] = {
            label: newValue.label,
            value: newValue.value,
        }

        return newValue
    }

    formIsInvalid(property_name, class_name){
        if (this.state.errors.hasOwnProperty(property_name)){
            class_name += ' is-invalid';
        }

        return class_name;
    }

    handleChange(newValue, actionMeta, field_name, successCallback, errorCallback){
        newValue = this.fieldHandleFormat(newValue, actionMeta, field_name);
        this.fieldUpdate(newValue);

        // If new user then create
        if(this.fields[`${field_name}_action`] === this.const.co){
            this.network.send({
                url: this.props[`${field_name}_api`],
                method: 'post',
                data: {
                    label: newValue[`${field_name}_label`]
                }
            }, successCallback, errorCallback);
        } else {
          this.fields[field_name] = newValue[field_name];
        }

        this.clearErrorField(field_name);
    }

    query(val, field_name){
        let instance = this;
        return new Promise(resolve => {
            instance.network.send({
                url: `${instance.props[`${field_name}_api`]}?search=${val}`
            }, function (response) {
                resolve(response.data);
            });
        })
    }

    query_by_id(id, field_name){
        let instance = this;
        return new Promise(resolve => {
            instance.network.send({
                url: `${instance.props[`${field_name}_api`]}${id}/`
            }, function (response) {
                resolve(response.data);
            });
        })
    }

    onInputChange(event) {
      let key = event.target.name;
      this.fieldUpdate({
        [key]: event.target.value
      });
      this.clearErrorField(key);
    }

    get deviceFieldset(){
        let placeholder = "Not provided"
        return (
            <>
              <label className="form-label">Device Information</label>
                <fieldset className="form-fieldset">
                    <div className="row g-2">
                        <div className="col-4">
                            <label className="form-label">Device ID</label>
                            <input type="text" className="form-control" name="device-id"
                                   placeholder={placeholder} value={this.state.device_id} disabled={true}/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">Brand</label>
                            <input type="text" className="form-control" name="brand"
                                   placeholder={placeholder} value={this.state.brand_name} disabled={true}/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">Model</label>
                            <input type="text" className="form-control" name="model"
                                   placeholder={placeholder} value={this.state.model} disabled={true}/>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }


    get userFieldset(){
        let placeholder = "Not provided"

        return (<>
                <label className="form-label">User Information</label>
                    <fieldset className="form-fieldset">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name"
                                   placeholder={placeholder} value={this.state.name} disabled={true}/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input type="text" className="form-control" name="designation"
                                   placeholder={placeholder} value={this.state.designation} disabled={true}/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input type="text" className="form-control" name="contact_number"
                                   placeholder={placeholder} value={this.state.contact_number} disabled={true}/>
                      </div>
                    </fieldset>
                </>)
    }


    get officeFieldset(){
        let placeholder = "Not provided"

        return (
            <>
              <label className="form-label">Office Information</label>
                <fieldset className="form-fieldset">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="office_name"
                                   placeholder={placeholder} value={this.state.office} disabled={true}/>
                    </div>
                </fieldset>
            </>
        );
    }

    requestTypeSelected(value){
        return String(this.state.request_type_selected) === String(value);
    }

    get renderRequestType(){
        return this.state.request_type.map((value) => {
            let other = <div className="mb-3">
                <label className="form-label">Please Specify Other</label>
                <input type="text" className="form-control" name="example-password-input"
                       placeholder="Input placeholder"/>
            </div>;

            if(!value.has_other){
                other = '';
            }

            return <>
                <label className={`form-selectgroup-item flex-fill ${value.enable?'':'disabled'}`} data-bs-toggle="tooltip" data-bs-placement="right" title={value.description}>
                <input type="radio" name="request_type_selected"
                       value={value.pk}
                       className={this.formIsInvalid('request_type_selected', 'form-selectgroup-input ')}
                       onChange={this.onInputChange}
                       onClick={() => this.fieldUpdate({ request_type_selected: value.pk })}
                       checked={this.requestTypeSelected(value.pk)}
                       disabled={!value.enable}/>
                <div className="form-selectgroup-label d-flex align-items-center p-3">
                    <div className="me-3">
                        <span className="form-selectgroup-check"/>
                    </div>
                    <div>
                        {value.name}
                    </div>
                </div>
                </label>
                <div>{other}</div>
                <div>{status}</div>
            </>
        });
    }

    get srfForm(){
        return <>
            <div className="mb-3">
            <label className="form-label">Request Type</label>
            <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                {this.renderRequestType}
                <div className="invalid-feedback">{this.state.errors.request_type}</div>
            </div>
        </div>
            <div className="mb-3">
            <label className="form-label">Brief Description of Request</label>
            <textarea name="brief_description" rows="5" placeholder="Type Here"
                      className={this.formIsInvalid('brief_description', 'form-control ')}
                      value={this.state.brief_description}
                      onChange={e => this.onInputChange(e)}
            />
                <div className="invalid-feedback">{this.state.errors.brief_description}</div>
        </div>
        </>
    }

    coreSuccessCallback = (response, params) => {
        switch (response.status) {
            case 201:
                toast.dark('Successfully saved!');
                params.instance.fieldUpdate(params.instance.baseState);
            break;
            case 200:
                toast.dark('Successfully updated!');
            break;
            default:
                toast.dark('Unknown Response');
        }
        params.instance.fieldUpdate({loading: false});
    }
    coreErrorCallback = (error, params) => {
        switch (error.response.status) {
            case 400:
            case 500:
                if (error.response.hasOwnProperty('data')) {
                    params.instance.fieldUpdate({errors: error.response.data});
                    toast.dark('Please resolve the issues.');
                } else {
                    toast.dark('Something went wrong submitting the form');
                }
                break;
            default:
                toast.dark('Unable to submit form');
        }
        this.fieldUpdate({loading: false});
    }

    cleanedData(){
        return {
            'device': window.context.const['device_id'],
            'user': this.fields['user'],
            'office': this.fields['office'],
            'request_type': Number(this.fields['request_type_selected']),
            'brief_description': this.fields['brief_description'],
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        let url = window.context.api['service_request'];
        let method = 'post';

        // Check if has data attribute exists
        if(window.context.hasOwnProperty('data')){
            url = window.context['data'];
            method = 'put';
        }

        this.fieldUpdate({loading: true});

        window.log(this.fields);
        window.log(this.cleanedData());

        this.network.send({
            url: url,
            method: method,
            data: this.cleanedData()
        }, this.coreSuccessCallback, this.coreErrorCallback)
    }

    retrieveData(){
        let instance = this;
        let pre_select_data = {action: "select-option", option: undefined, name: undefined}

        // Check if has computer attribute exists
        if(window.context.api.hasOwnProperty('device')){
            this.network.send({ url: `${window.context.api['device']}` }, function (result){
            let data = result.data;

            instance.fieldUpdate({
                brand_name: data.brand.name,
                model: data.model,
                device_id: data.device_id,
                office: data.office.name,
                name: data.user.name,
                designation: data.user.designation,
                contact_number: data.user.contact_number
            });

            }, function (err){
                alert('Error fetching data')
        })
        }

        // Check if has data attribute exists
        if(window.context.api.hasOwnProperty('data')){
            window.log('data attr exist')
        }
    }

    loadSRFData(){
         let instance = this;

        this.network.send({
            url: `${window.context.api['request_type']}`
        }, function (result){

            if(result.hasOwnProperty('data')){
                instance.fieldUpdate({request_type: result.data});
            }else {
                alert('No SRF Request Data Received');
            }

        }, function (err){
            alert('Error SRF fetching data');
        })
    }

    componentDidMount(){
        this.retrieveData();
        this.loadSRFData();
    }

    render() {

        let loading = '';
        let submit_button_label = 'Save';

        if(this.state.loading){
            loading = <span className="spinner-border spinner-border-sm me-2" role="status"/>
            submit_button_label = 'Saving...'
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">SRF Form</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-6">
                                {this.deviceFieldset}
                                {this.userFieldset}
                                {this.officeFieldset}
                            </div>
                            <div className="col-lg-6">
                                {this.srfForm}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" disabled={this.state.loading}>
                            {loading}
                            <span>{submit_button_label}</span>
                        </button>
                    </div>
                </div>
            </form>
        );
   }
}

function App(){
    return(
        <>
        <EditSRF
            data={window.context.data}
            user_api={window.context.api.user}
            office_api={window.context.api.office}
            device_api={window.context.api.device}
        />
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
        </>
    )
}
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);