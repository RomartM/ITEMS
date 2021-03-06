class Filter extends React.Component {
    has_content = false;

    constructor(props) {
        super(props);
    }

    badge_base(badge_mode){
        return `badge ${badge_mode} ms-1 mb-1 cursor-pointer`;
    }

    badge_classes(action, id){
        if (String(this.props.context.active[action]) === String(id)){
            return this.badge_base('bg-teal')
        }
        return this.badge_base('bg-teal-lt');
    }

    get filterControls(){
        let instance = this;
        return instance.props.context.meta_data.map(function (ctrl){
            if(ctrl.filters.length === 0){
                return <></>
            }

            instance.has_content = true;

            return <>
                <div className="hr-text hr-text-left mb-3 mt-3">{ctrl.label}</div>
                <div className="filter-badges">
                    {ctrl.filters.map((value, index) => {
                        return <button onClick={() => instance.props.context.action(ctrl.id, value.id)} className={instance.badge_classes(ctrl.id, value.id)}>{value.name}</button>
                    })}
                </div>
            </>
        })
    }

    render() {
        let title = <h4>FILTER</h4>

        if(!this.has_content){
            title = <></>
        }

        return (
            <div className="filter-section">
                {title}
                <div className="filter-type-container">
                    {this.filterControls}
                </div>
            </div>
        );
    }

}