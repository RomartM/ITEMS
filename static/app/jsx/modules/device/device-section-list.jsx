class DeviceSectionList extends  React.Component  {
    default_col = 'col-3';

    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
        this.network = new Network({
            params: {
                instance: this
            }
        });
    }

    loading(){
        return <>
            <div className="col-3">
                <div className="card card-lg">
                    <div className="ratio ratio-21x9 card-body">
                        <div className="skeleton-image"/>
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card card-lg">
                    <div className="ratio ratio-21x9 card-body">
                        <div className="skeleton-image"/>
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card card-lg">
                    <div className="ratio ratio-21x9 card-body">
                        <div className="skeleton-image"/>
                    </div>
                </div>
            </div>
        </>
    }

    card(card_context){

        if(typeof (card_context) != 'object'){
            return '';
        }

        let col = card_context.hasOwnProperty('col')? card_context.col : this.default_col;
        let card_class = "card card-lg"

        if(!card_context.enable){
            card_class += " card-inactive"
        }

        return <div className={col}>
                    <div className={card_class}>
                        <div className="card-body text-center">
                            <object type="image/svg+xml" data={card_context.icon} className="icon-lg"/>
                            <div className="h1 m-0">{card_context.label}</div>
                            <a href={card_context.href} className="stretched-link" />
                        </div>
                    </div>
                </div>;
    }

    compileCard(){
        let instance = this;

        if(this.state.list.length < 1){
            return this.loading();
        }

        return this.state.list.map((value, index) => {
            return instance.card(value);
        });
    }

    successCallback(response, params){
        params.instance.setState({list: response.data});
    }

    errorCallback(response){
        alert('Error fetching overview data')
    }

    loadData(){
        let source = this.props['source'];
        let instance = this;

        if (!source){
            return null;
        }

        setTimeout(function (){
            instance.network.send({
            url: source
            }, instance.successCallback, instance.errorCallback );
        }, 1000);
    }

    componentDidMount(){
        this.loadData();
    }

    render(){
        return <>
            <div className="row row-cards">
                {this.compileCard()}
            </div>
        </>
    }
}