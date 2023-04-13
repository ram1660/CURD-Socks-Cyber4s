import React, { Component } from 'react'
import { LocationHistory, ServerAnswer, createLocationHistory, getIds, TableTypes } from '../serverHandler';
import styles from '../styles/Create-UI.module.scss';

type propsTypes = {
  closeCreateUI: () => void
}

type stateTypes = {
  arrivalDate: Date;
  departureDate: Date;
  officerIDs: string[];
  socksIDs: string[];
  answerFromServer: ServerAnswer;
  chosenSocksId: string;
  chosenLocationId: string;
}

export default class CreateLocationHistory extends Component<propsTypes, stateTypes> {

  constructor(props: any) {
    super(props);
    this.state = {
      answerFromServer: { message: '', status: '' },
      chosenLocationId: '-1',
      chosenSocksId: '-1',
      arrivalDate: new Date('invalid date'),
      departureDate: new Date('invalid date'),
      officerIDs: [],
      socksIDs: []
    };
  }

  private async onSubmit(): Promise<void> {
    // Validates dates and ids
    if (Number.isInteger(Number(this.state.chosenLocationId)) === false || Number.isInteger(Number(this.state.chosenSocksId)) === false ||
      isNaN(this.state.departureDate.getTime()) || isNaN(this.state.arrivalDate.getTime())) {
      this.setState({ answerFromServer: { status: 'Error', message: 'Your data is not valid or fully filled please fix it.' } });
      return;
    }
    const locationHistoryData: LocationHistory = {
      arrival_date: this.state.arrivalDate,
      departure_date: this.state.departureDate,
      location_id: this.state.chosenLocationId,
      sock_id: this.state.chosenSocksId
    };
    const answer = await createLocationHistory(locationHistoryData);
    this.setState({ answerFromServer: answer })
  }

  async componentDidMount(): Promise<void> {
    const locationsIds = await getIds(TableTypes.Locations);
    const socksIDs = await getIds(TableTypes.Socks);

    this.setState({
      officerIDs: locationsIds.length === 0 ? ['No officers IDs available'] : locationsIds,
      socksIDs: socksIDs.length === 0 ? ['No socks IDs available'] : socksIDs,
      chosenLocationId: locationsIds.length === 0 ? '-1' : locationsIds[0],
      chosenSocksId: socksIDs.length === 0 ? '-1' : socksIDs[0]
    });
  }

  private onArrivalChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ arrivalDate: e.target.valueAsDate || new Date() });
    this.setState({ answerFromServer: { status: '', message: '' } });

  }

  private onDepartureChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ departureDate: e.target.valueAsDate || new Date() });
    this.setState({ answerFromServer: { status: '', message: '' } });
  }

  private onSocksSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ chosenSocksId: e.target.value });
  }

  private onLocationSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ chosenLocationId: e.target.value });
  }

  render() {
    return (
      <div>
        <div className={styles['option-container']}>
          <a href='/#' className={styles['exit-button']} onClick={() => this.props.closeCreateUI()}> </a>
          <label htmlFor="arrival">Arrival date</label>
          <input onChange={(e) => { this.onArrivalChange(e) }} required type="date" placeholder="Arrival date" />
          <label htmlFor="departure">Departure date</label>
          <input onChange={(e) => { this.onDepartureChange(e) }} required type="date" placeholder="Departure date" />
          <label htmlFor="location ID">Choose location ID</label>
          <select onChange={(e) => this.onLocationSelect(e)} name="locationsId">
            {this.state.officerIDs.map((id) => <option key={id} value={id}>{id}</option>)}
          </select>
          <label htmlFor="socks ID">Choose socks ID</label>
          <select onChange={(e) => this.onSocksSelect(e)} name="socksId">
            {this.state.socksIDs.map((id) => <option key={id} value={id}>{id}</option>)}
          </select>
          <button className={styles['apply-button']} onClick={() => this.onSubmit()}>Create data</button>
          <div>{this.state.answerFromServer.status}: {this.state.answerFromServer.message}</div>
        </div>
      </div>
    )
  }
}
