
import React, { Component } from 'react'
import CreateLocationHistory from './createUI/CreateLocationHistory';
import CreateLocations from './createUI/CreateLocations';
import CreateOfficer from './createUI/CreateOfficer';
import CreateSocks from './createUI/CreateSocks';
import DataViewer from './DataViewer';
import EditLocationHistory from './editUI/EditLocationHistory';
import EditLocations from './editUI/EditLocations';
import EditOfficer from './editUI/EditOfficer';
import EditSocks from './editUI/EditSocks';
import OperationButtons from './OperationButtons'
import OperationUI from './OperationUI'
import Title from './Title'

type stateTypes = {
  showOperation: boolean,
  showCreate: boolean,
  showEdit: boolean,
  operationType: string,
  createElement: JSX.Element,
  editElement: JSX.Element,
  dataToView: string,
  previousActiveTable: string,
  dataToEdit: unknown
};
export default class App extends Component<{}, stateTypes> {
  constructor(props: any) {
    super(props);
    this.onChoosingOperation = this.onChoosingOperation.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleShowOperation = this.handleShowOperation.bind(this);
    this.closeOperationUI = this.closeOperationUI.bind(this);
    this.closeCreateUI = this.closeCreateUI.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.state = { showEdit: false, editElement: <></>, dataToEdit: null, showCreate: false, showOperation: false, operationType: '', createElement: <></>, dataToView: '', previousActiveTable: '' };
  }

  private closeOperationUI(): void {
    this.setState({ showOperation: false, operationType: '' });
  }

  private onChoosingOperation(isCreate: string): void {
    if (this.state.operationType === '') {
      this.setState({ showOperation: true, operationType: isCreate });
    }
  }

  private handleShowOperation(dataToView: string): void {
    // Doing this is kind of stupid but it works, the table disappears and reappears because of the update of dataToView.
    this.setState({ dataToView: '' }, () => this.setState({ dataToView: dataToView }));
  }

  private closeCreateUI(): void {
    this.setState({ showCreate: false, operationType: ''});
  }

  private handleCreate(dataToView: string): void {
    switch (dataToView) {
      case 'socks':
        this.setState({ createElement: <CreateSocks closeCreateUI={this.closeCreateUI} /> });
        break;
      case 'officers':
        this.setState({ createElement: <CreateOfficer closeCreateUI={this.closeCreateUI} /> });
        break;
      case 'location':
        this.setState({ createElement: <CreateLocations closeCreateUI={this.closeCreateUI} /> });
        break;
      case 'location-history':
        this.setState({ createElement: <CreateLocationHistory closeCreateUI={this.closeCreateUI} /> });
        break;
      default:
        break;
    }
    this.setState({ showOperation: false, showEdit: false, showCreate: true, operationType: '' });
  }

  private closeEdit(): void {
    this.setState({ showEdit: false });

  }

  private handleEdit(dataToEdit: string, id: string): void {
    switch (dataToEdit) {
      case 'socks':
        this.setState({ editElement: <EditSocks id={id} closeCreateUI={this.closeEdit} /> });
        break;
      case 'officers':
        this.setState({ editElement: <EditOfficer id={id} closeCreateUI={this.closeEdit} /> });
        break;
      case 'location':
        this.setState({ editElement: <EditLocations id={id} closeCreateUI={this.closeEdit} /> });
        break;
      case 'location-history':
        this.setState({ editElement: <EditLocationHistory id={id} closeCreateUI={this.closeEdit} /> });
        break;
      default:
        break;
    }
    this.setState({ showOperation: false, showEdit: true, showCreate: false, operationType: '' });
  }

  render() {
    return (
      <div>
        <Title />
        <OperationButtons onOperationButtonClick={this.onChoosingOperation} />
        <OperationUI closeOperationUI={this.closeOperationUI} showCreateCB={this.handleCreate} showViewCB={this.handleShowOperation} isShow={this.state.showOperation} operationType={this.state.operationType} tableToShow={''} />
        {this.state.showCreate === false ? <></> : this.state.createElement}
        {this.state.showEdit === false ? <></> : this.state.editElement}
        {this.state.dataToView === '' ? <></> : <DataViewer showEditCB={this.handleEdit} dataToView={this.state.dataToView} />}
      </div>
    )
  }
}
