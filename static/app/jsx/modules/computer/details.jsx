import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { ToastContainer, toast } from 'https://cdn.skypack.dev/react-toastify';
import AsyncCreatableSelect from 'https://cdn.skypack.dev/react-select@^3.1.0/async-creatable';

function App(){
    return(
        <>
            <div className="row">
                <div className="col-3">
                    <SectionPcInformation source={window.context['pc-information'].api.source} />
                </div>
                <div className="col-9">
                    <div className="card">
                        <ul className="nav nav-tabs" data-bs-toggle="tabs">
                            <li className="nav-item">
                                <a href="#tabs-parent-pm" className="nav-link active" data-bs-toggle="tab">Preventive Maintenance</a>
                            </li>
                            <li className="nav-item">
                                <a href="#tabs-paren-cm" className="nav-link" data-bs-toggle="tab">Corrective Maintenance</a>
                            </li>
                            <li className="nav-item">
                                <a href="#tabs-parent-history" className="nav-link" data-bs-toggle="tab">History</a>
                            </li>
                        </ul>
                        <div className="tab-content pt-2">
                            <div className="tab-pane fade active show" id="tabs-parent-pm">
                                <ul className="nav nav-tabs px-2" data-bs-toggle="tabs">
                                    <li className="nav-item">
                                        <a href="#tabs-checklist" className="nav-link active" data-bs-toggle="tab">CHECKLIST</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#tabs-pm-records" className="nav-link" data-bs-toggle="tab">RECORDS</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade active show" id="tabs-checklist">
                                        <SectionPmChecklistListComputer context={window.context['pm-checklist']} select={AsyncCreatableSelect} toast={toast}/>
                                    </div>
                                    <div className="tab-pane fade" id="tabs-pm-records">
                                        <SectionPmRecordsListComputer context={window.context['pm-record-list']}/>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tabs-paren-cm">
                                <ul className="nav nav-tabs px-2" data-bs-toggle="tabs">
                                    <li className="nav-item">
                                        <a href="#tabs-srf-records" className="nav-link active" data-bs-toggle="tab">SRF RECORDS</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#tabs-sod-records" className="nav-link" data-bs-toggle="tab">SOD RECORDS</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade active show" id="tabs-srf-records">
                                        <SectionCmRecordListComputer context={window.context['pm-record-list']}/>
                                    </div>
                                    <div className="tab-pane fade" id="tabs-sod-records">
                                        <SectionCmRecordListComputer context={window.context['pm-record-list']}/>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tabs-parent-history">
                                <ul className="nav nav-tabs px-2" data-bs-toggle="tabs">
                                    <li className="nav-item">
                                        <a href="#tabs-repair-history" className="nav-link  active" data-bs-toggle="tab">REPAIR RECORDS</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#tabs-changes-history" className="nav-link" data-bs-toggle="tab">CHANGES RECORDS</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade active show" id="tabs-repair-history">
                                        <SectionRepairHistoryListComputer context={window.context['pm-record-list']}/>
                                    </div>
                                    <div className="tab-pane fade" id="tabs-changes-history">
                                        <SectionChangesHistoryListComputer context={window.context['pm-record-list']}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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