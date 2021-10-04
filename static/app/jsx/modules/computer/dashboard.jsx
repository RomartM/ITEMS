
function App(){
    return(
        <>
        <SectionOverviewComputer source={window.context.overview.api.source} />
        <SectionListComputer context={window.context.table} />
        </>
    )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);