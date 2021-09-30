class ListGroup extends React.Component {
    constructor(props) {
        super(props);

        this.max_height = this.props.context.max_height || 100;
    }

    empty(){
        return <div className="empty">
            <p className="empty-title">No Data</p>
        </div>
    }

    loading(){
        let skeleton = <li className="list-group-item">
                <div className="row align-items-center">
                    <div className="col-7">
                        <div className="skeleton-line"/>
                        <div className="skeleton-line"/>
                    </div>
                    <div className="col-2 ms-auto text-end">
                        <div className="skeleton-line"/>
                        <div className="skeleton-line"/>
                    </div>
                </div>
            </li>;

        return [1, 2, 3, 4, 5].map(function (value){
            return skeleton;
        })
    }

    itemHeader(title){
        return <div className="list-group-header sticky-top">{title}</div>
    }

    item(label, value){
        return <div className="list-group-item">
                   <div className="text-truncate align-items-center">
                       <small className="d-block text-muted text-truncate mt-n1">{label}</small>
                       <div className="d-block text-inherit">{value}</div>
                   </div>
               </div>
    }

    get compileItems(){

        let instance = this;
        let items = []

        if(this.props.context.loading){
            return instance.loading();
        }

        if(this.props.context.data.length < 1){
            return instance.empty();
        }

        this.props.context.data.forEach(function(parent_val){
            items.push({'label': parent_val.label});

            if(parent_val.hasOwnProperty('fields')){
                parent_val.fields.forEach(function(child_val){
                    items.push(child_val)
                });
            }
        })


        return items.map(function (data,index){
            if(!data.hasOwnProperty('value')){
                return instance.itemHeader(data.label)
            }else{
                return data.label && data.value ? instance.item(data.label, data.value) : '';
            }
        })
    }

    render() {
        return (
            <div className="list-group list-group-flush overflow-auto" style={{maxHeight: this.max_height + 'vh'}}>
                {this.compileItems}
            </div>
        );
    }
}