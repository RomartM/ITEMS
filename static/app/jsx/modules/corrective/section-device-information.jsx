class SectionPcInformation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true
        }

        this.network = new Network({
            params: {
                instance: this
            }
        });
    }

    successCallback(response, params){
        params.instance.setState({
            data: response.data.information,
            loading: false
        });
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

        this.setState({loading: true});
        setTimeout(function (){
            instance.network.send({
            url: source
            }, instance.successCallback, instance.errorCallback );
        }, 1000);
    }

    componentDidMount(){
        this.loadData();
    }

    render() {
        return (
            <>
                <div className="card card-sm">
                    <div className="card-header">PC Information</div>
                    <ListGroup context={this.state}/>
                </div>
            </>
        );
    }
}