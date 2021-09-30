
class Network {


    constructor(obj) {

        this.obtain = window.context.api.obtain;
        this.obtain_max_retries = 5; // Prevent excessive server query
        this.params = {};

        if(typeof (obj) === 'object'){
            if(obj.hasOwnProperty('obtain')){
                this.obtain = obj.obtain;
            }
            if(obj.hasOwnProperty('retries')){
                this.obtain_max_retries = obj.retries;
            }
            if(obj.hasOwnProperty('params')){
                this.params = obj.params;
            }
        }

    }

    obtain_token(){
        return new Promise(resolve=>{
            let session = sessionStorage.getItem("token")
            if (session != null){
                resolve(session)
            }else{
                fetch(this.obtain).then(response=>{
                    return response.json()
                }).then(data=>{
                    sessionStorage.setItem("token", data.token);
                    resolve(sessionStorage.getItem("token"))
                });
            }
        });
    }

    send(payload, successCallback, errorCallback, arg){
        let instance = this;
        if(typeof (payload) === 'object'){

            if(instance.obtain_max_retries <= 0){
                throw "Max retries reached";
            }

            this.obtain_token().then( token => {
                // Inject token to headers
                payload['headers'] = {'Authorization':`Token ${token}`};

                axios(payload).then((response) => {
                    successCallback(response, instance.params);
                })
                .catch(function (error) {
                    if (error.response) {
                        switch (error.response.status) {
                            case 401:
                            case 402:
                            case 403:
                                instance.obtain_max_retries -= 1;
                                sessionStorage.removeItem('token');
                                instance.send(payload, successCallback, errorCallback, arg);
                                break;
                            default:
                                errorCallback(error, instance.params);
                        }
                    }
                });
            })
        } else {
            throw "Invalid Payload, Object payload required";
        }
    }

}