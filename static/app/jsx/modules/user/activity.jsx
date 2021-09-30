
function App(){
    return(
        <>
        <ActivitySectionList context={window.context.table} />
        </>
    )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);