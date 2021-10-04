import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { ToastContainer, toast } from 'https://cdn.skypack.dev/react-toastify';
import AsyncCreatableSelect from 'https://cdn.skypack.dev/react-select@^3.1.0/async-creatable';

class EditDeviceComputer extends React.Component {

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
            brand: '',
            brand_label: '',
            brand_action: '',
            brand_obj: {label:'', value:''},
            model:'',
            serial: '',
            mac_address: '',
            unit_cost: '',
            date_acquired: '',
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

        this.userQuery = this.userQuery.bind(this);
        this.userOnInputBlur = this.userOnInputBlur.bind(this);
        this.userHandleChange = this.userHandleChange.bind(this);
        this.officeQuery = this.officeQuery.bind(this);
        this.officeHandleChange = this.officeHandleChange.bind(this);
        this.brandQuery = this.brandQuery.bind(this);
        this.brandHandleChange= this.brandHandleChange.bind(this);
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

    userSuccessCallback = (response, params) => {
        let data = response.data;
        data = params.instance.fieldHandleFormat(data, {action: params.instance.const.so}, 'user');
        params.instance.fieldUpdate(data);
    }
    userErrorCallback = (response, params) => {
        toast.dark('Unable to submit form');
    }
    userQuery = val => {
        return this.query(val, 'user');
    }
    userHandleChange = (newValue, actionMeta) => this.handleChange(newValue, actionMeta, 'user', this.userSuccessCallback, this.userErrorCallback);
    userOnInputBlur = (event) => {
        if(this.fields['user_action'] === this.const.so){
            this.network.send({
                url: `${this.props['user_api']}${this.fields.user}/`,
                method: 'put',
                data: {
                    label: this.fields.user_label,
                    [event.target.name]: event.target.value
                }
            }, this.userSuccessCallback, this.userErrorCallback);
        }
    }
    get userFieldSet(){
        return (<>
                <label className="form-label">User Information</label>
                    <fieldset className="form-fieldset">
                      <div className="mb-3">
                        <label className="form-label required">Name</label>
                        <div className={this.formIsInvalid('user', 'text-black-50 ')}>
                            <AsyncCreatableSelect
                                styles={zIndex}
                                loadOptions={this.userQuery}
                                onChange={this.userHandleChange}
                                value={this.state.user_obj}
                                placeholder={'Type here..'}
                                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                                noOptionsMessage={() => null}
                            />
                        </div>
                        <div className="invalid-feedback">{this.state.errors.user}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input type="text" className={this.formIsInvalid('designation', 'form-control ')}
                               name="designation"
                               value={this.state.designation}
                               onChange={e => this.onInputChange(e)}
                               onBlur={e => this.userOnInputBlur(e)}
                        />
                        <div className="invalid-feedback">{this.state.errors.designation}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input type="text" className={this.formIsInvalid('contact_number', 'form-control ')}
                               name="contact_number"
                               value={this.state.contact_number}
                               onChange={e => this.onInputChange(e)}
                               onBlur={e => this.userOnInputBlur(e)}/>
                          <div className="invalid-feedback">{this.state.errors.contact_number}</div>
                      </div>
                    </fieldset>
                </>)
    }

    officeSuccessCallback = (response, params) => {
        let data = response.data;
        data = params.instance.fieldHandleFormat(data, {action: params.instance.const.so}, 'office');
        params.instance.fieldUpdate(data);
    }
    officeErrorCallback = (response, instance) => {
        toast.dark('Unable to submit form');
    }
    officeQuery = val => {
        return this.query(val, 'office');
    }
    officeHandleChange = (newValue, actionMeta) => this.handleChange(newValue, actionMeta, 'office', this.officeSuccessCallback, this.officeErrorCallback);
    get officeFieldSet(){
        return (
            <>
              <label className="form-label">Office Information</label>
                <fieldset className="form-fieldset">
                    <div className="mb-3">
                        <label className="form-label required">Name</label>
                        <div className={this.formIsInvalid('office', 'text-black-50 ')}>
                            <AsyncCreatableSelect
                                styles={zIndex}
                                loadOptions={this.officeQuery}
                                onChange={this.officeHandleChange}
                                value={this.state.office_obj}
                                placeholder={'Type here..'}
                                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                                noOptionsMessage={() => null}
                            />
                        </div>
                        <div className="invalid-feedback">{this.state.errors.office}</div>
                    </div>
                </fieldset>
            </>
        );
    }

    brandSuccessCallback = (response, params) => {
        let data = response.data;
        data = params.instance.fieldHandleFormat(data, {action: params.instance.const.so}, 'brand');
        params.instance.fieldUpdate(data);
    }
    brandErrorCallback = (response, params) => {
        toast.dark('Unable to submit form');
    }
    brandQuery = val => {
        return this.query(val, 'brand');
    }
    brandHandleChange = (newValue, actionMeta) => this.handleChange(newValue, actionMeta, 'brand', this.brandSuccessCallback, this.brandErrorCallback);
    equipmentTypeSelected(value){
        return this.state.equipment_type === value;
    }
    get renderEquipmentType(){
        let types = JSON.parse(this.props.equipmentTypeChoices);
        return types.map((value, index) => {
            return <label className="form-check form-check-inline">
                <input className={this.formIsInvalid('equipment_type', 'form-check-input ')} name="equipment_type" type="radio"
                       onChange={this.onInputChange}
                       value={value[0]}
                       onClick={() => this.fieldUpdate({ equipment_type: value[0] })}
                       checked={this.equipmentTypeSelected(value[0])}
                />
                <span className="form-check-label">{value[1]}</span>
            </label>
        });
    }
    get equipmentFieldSet(){
        let et_other = '';
        if(this.state.equipment_type === 'others'){
            et_other = <div className="mb-3">
            <label className="form-label required">Other</label>
            <input type="text" className={this.formIsInvalid('equipment_type_other', 'form-control ')}
                   name="equipment_type_other"
                   value={this.state.equipment_type_other}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.equipment_type_other}</div>
          </div>
        }

        return (
        <>
        <label className="form-label">Device Information</label>
        <fieldset className="form-fieldset">
          <div className="mb-3">
            <div className="form-label required">Equipment Type</div>
            <div>
                {this.renderEquipmentType}
                <div className="invalid-feedback">{this.state.errors.equipment_type}</div>
            </div>
          </div>
          {et_other}
          <div className="mb-3">
            <label className="form-label required">Brand</label>
            <div className={this.formIsInvalid('brand', 'text-black-50 ')}>
                <AsyncCreatableSelect
                    styles={zIndex}
                    loadOptions={this.brandQuery}
                    onChange={this.brandHandleChange}
                    value={this.state.brand_obj}
                    placeholder={'Type here..'}
                    components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                    noOptionsMessage={() => null}
                />
            </div>
            <div className="invalid-feedback">{this.state.errors.brand}</div>
          </div>
          <div className="mb-3">
            <label className="form-label required">Model</label>
            <input type="text" className={this.formIsInvalid('model', 'form-control ')}
                   name="model"
                   value={this.state.model}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.model}</div>
          </div>
          <div className="mb-3">
            <label className="form-label required">Serial</label>
            <input type="text" className={this.formIsInvalid('serial', 'form-control ')}
                   name="serial"
                   value={this.state.serial}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.serial}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">MAC Address</label>
            <input type="text" className={this.formIsInvalid('mac_address', 'form-control ')}
                   name="mac_address"
                   value={this.state.mac_address}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.mac_address}</div>
          </div>
          <div className="mb-3">
            <label className="form-label required">Unit Cost</label>
            <input type="text" className={this.formIsInvalid('unit_cost', 'form-control ')}
                   name="unit_cost"
                   value={this.state.unit_cost}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.unit_cost}</div>
          </div>
          <div className="mb-3">
            <label className="form-label required">Date Acquired</label>
            <input type="date" className={this.formIsInvalid('date_acquired', 'form-control ')}
                   name="date_acquired"
                   value={this.state.date_acquired}
                   onChange={e => this.onInputChange(e)}
            />
            <div className="invalid-feedback">{this.state.errors.date_acquired}</div>
          </div>
        </fieldset>
        </>);
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

    handleSubmit(event) {
        event.preventDefault();

        let url = this.props['device_api'];
        let method = 'post';

        // Check if has data attribute exists
        if(window.context.hasOwnProperty('data')){
            url = window.context['data'];
            method = 'put';
        }

        this.fieldUpdate({loading: true});


        this.network.send({
            url: url,
            method: method,
            data: this.fields
        }, this.coreSuccessCallback, this.coreErrorCallback)
    }

    retrieveData(){
        let instance = this;
        let pre_select_data = {action: "select-option", option: undefined, name: undefined}

        // Check if has data attribute exists
        if(!window.context.hasOwnProperty('data')){
            return;
        }

        this.network.send({
            url: `${window.context['data']}`
        }, function (result){
            let data = result.data;

            // Retrieve User
            instance.query_by_id(data.user, 'user').then(function (result){
                instance.handleChange(result, pre_select_data, 'user', instance.userSuccessCallback, instance.userErrorCallback);
            });

            // Retrieve Office
            instance.query_by_id(data.office, 'office').then(function (result){
                instance.handleChange(result, pre_select_data, 'office', instance.officeSuccessCallback, instance.officeErrorCallback);
            });

            // Retrieve Brand
            instance.query_by_id(data.brand, 'brand').then(function (result){
                instance.handleChange(result, pre_select_data, 'brand', instance.brandSuccessCallback, instance.brandErrorCallback);
            });

             // Retrieve Input Fields
            instance.fieldUpdate({
                equipment_type: data.equipment_type,
                equipment_type_other: data.equipment_type_other,
                model: data.model,
                serial: data.serial,
                mac_address: data.mac_address,
                unit_cost: data.unit_cost,
                date_acquired: data.date_acquired
            });

        }, function (err){
            alert('Error fetching data')
        })
    }

    componentDidMount(){
        this.retrieveData();
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
                        <div className="card-title">Edit PC Form</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-6">
                                {this.userFieldSet}
                                {this.officeFieldSet}
                            </div>
                            <div className="col-lg-6">
                                {this.equipmentFieldSet}
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
        <EditDeviceComputer
            data={window.context.data}
            equipmentTypeChoices={window.context.const.equipment_type}
            user_api={window.context.api.user}
            office_api={window.context.api.office}
            brand_api={window.context.api.brand}
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