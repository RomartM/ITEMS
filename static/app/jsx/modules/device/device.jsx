import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';

function App(){
    return(
        <>
            <DeviceSectionList source={window.context.device.api.source} />
        </>
    )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);