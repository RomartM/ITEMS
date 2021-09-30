
class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let footer_content = <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Okay</button>
        </div>;
        let header_content = <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>;
        let modal_id = "modal-default";
        let modal_body_class = "modal-body ";
        let modal_config_class = "modal-dialog ";

        if(this.props.footer){
            footer_content = this.props.footer;
        }

        if(this.props.header_content){
            header_content = this.props.header_content
        }else if(!this.props.title){
            header_content = ''
        }

        if (this.props.body_class){
            modal_body_class += this.props.body_class
        }

        if(this.props.config_class){
            modal_config_class += this.props.config_class;
        }else{
            modal_config_class += "modal-dialog-centered"
        }

        if(this.props.id){
            modal_id = this.props.id
        }

        return (
            <div className="modal modal-blur fade" id={modal_id} tabIndex="-1" role="dialog"
                    aria-hidden="true">
            <div className={modal_config_class} role="document">
                <div className="modal-content">
                    {header_content}
                    <div className={modal_body_class}>
                        {this.props.body}
                    </div>
                    {footer_content}
                </div>
            </div>
        </div>
        );
    }
}