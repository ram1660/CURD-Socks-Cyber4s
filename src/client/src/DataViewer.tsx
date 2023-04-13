import React, { Component } from 'react'
import { deleteLocation, deleteLocationHistory, deleteOfficer, deleteSocks, getIds, getLocation, getLocationHistory, getOfficers, getSocks, ServerAnswer, } from './serverHandler'
import styles from './styles/DataViewer.module.scss'
type stateTypes = {
  table: JSX.Element,
  tableHeaders: JSX.Element,
  tableBody: JSX.Element,
  messageFromServer: ServerAnswer
}

type propsTypes = {
  dataToView: string,
  showEditCB: (dataToEdit: string, id: string) => void
}

export default class DataViewer extends Component<propsTypes, stateTypes> {

  constructor(props: propsTypes) {
    super(props);
    this.state = {
      table: <></>,
      tableHeaders: <></>,
      tableBody: <></>,
      messageFromServer: { status: '', message: '' }
    };
  }

  async componentDidMount() {
    this.setState({ table: await this.generateTable(this.props.dataToView) });
  }

  private async deleteRow(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const id = (e.target as HTMLButtonElement).id;
    let serverAnswer: ServerAnswer;
    switch (this.props.dataToView) {
      case 'socks':
        serverAnswer = await deleteSocks(id);
        break;
      case 'location':
        serverAnswer = await deleteLocation(id);
        break;
      case 'location-history':
        serverAnswer = await deleteLocationHistory(id);
        break;
      case 'officers':
        serverAnswer = await deleteOfficer(id);
        break;
      default:
        break;
    }
    // After deletion pull the updated data again from the server.
    this.setState({ table: await this.generateTable(this.props.dataToView), messageFromServer: serverAnswer! });
    setTimeout(() => {
      this.setState({messageFromServer: { status: '', message: '' }});
    }, 2000);
  }

  private async generateTable(dataType: string): Promise<JSX.Element> {
    let serverData: any[] = [];
    let serverIds: string[] = [];
    switch (dataType) {
      case 'socks':
        serverData = await getSocks();
        serverIds = await getIds('socks');
        break;
      case 'officers':
        serverData = await getOfficers();
        serverIds = await getIds('officers');
        break;
      case 'location':
        serverData = await getLocation();
        serverIds = await getIds('locations');
        break;
      case 'location-history':
        serverData = await getLocationHistory();
        serverIds = await getIds('locations_history');
        break;
      default:
        break;
    }
    if (serverData!.length === 0) {
      return <div>No data available :/</div>
    }
    let tableHeader: string[] = Object.keys(serverData[0]);
    return (
      <>
        <thead>
          <tr>
            {tableHeader.map((header: string) => { return <th key={this.generateRandomId()}>{header}</th> })}
          </tr>
        </thead>
        <tbody>
          {serverData.map((row: string[], index: number) => {
            return <tr key={this.generateRandomId()}>
              {Object.values(row).map((cell) => { return <td key={this.generateRandomId()}>{cell}</td> })}
              <td><button onClick={(e) => this.deleteRow(e)} className={styles["delete"]} id={serverIds[index]}>Delete</button><button onClick={(e) => this.props.showEditCB(this.props.dataToView, (e.target as HTMLButtonElement).id)} className={styles["edit"]} id={serverIds[index]}>Edit</button></td>
            </tr>
          })}
        </tbody>
      </>
    );
  }

  private generateRandomId(): string {
    return (Math.floor(Math.random() * 10000000000)).toString();
  }

  render() {
    return (
      <>
        <div className={styles['message-from-server']}>{this.state.messageFromServer.status} {this.state.messageFromServer.message}</div>
        <table className={styles['data-table']}>
          {this.state.table}
        </table>
      </>
    )
  }
}
