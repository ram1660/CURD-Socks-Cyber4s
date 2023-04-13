import React, { Component } from 'react'
import { Location, ServerAnswer, createLocation } from '../serverHandler';
import styles from '../styles/Create-UI.module.scss';

type propsTypes = {
  closeCreateUI: () => void
}

type stateTypes = {
  lat: number;
  lon: number;
  baseName: string;
  nearestCity: string;
  answerFromServer: ServerAnswer;
}

export default class CreateLocations extends Component<propsTypes, stateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      answerFromServer: { message: '', status: '' },
      lat: -1,
      lon: -1,
      baseName: '',
      nearestCity: ''
    };
  }

  private async onSubmit(): Promise<void> {
    // Validates dates and ids
    if (this.state.baseName === '' || this.state.nearestCity === '') {
      this.setState({ answerFromServer: { status: 'Error', message: 'Your data is not valid or fully filled please fix it.' } });
      return;
    }
    const locationData: Location = {
      base_name: this.state.baseName,
      lat: this.state.lat,
      lon: this.state.lon,
      nearest_city: this.state.nearestCity
    };
    const answer = await createLocation(locationData);
    this.setState({ answerFromServer: answer })
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      answerFromServer: { message: '', status: '' },
      lat: -1,
      lon: -1,
      baseName: '',
      nearestCity: ''
    });
  }

  private onLatChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (Number.isInteger(Number((e.target.value))) === false) {
      return;
    }
    this.setState({ lat: parseFloat(e.target.value) });
  }

  private onLonChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (Number.isInteger(Number((e.target.value))) === false) {
      return;
    }
    this.setState({ lon: parseFloat(e.target.value) });
  }

  private onBaseEnter(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ baseName: e.target.value });
  }

  private onCityEnter(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ nearestCity: e.target.value });
  }

  render() {
    return (
      <div>
        <div className={styles['option-container']}>
          <a href='/#' className={styles['exit-button']} onClick={() => this.props.closeCreateUI()}> </a>
          <label>Enter latitude:</label>
          <input value={this.state.lat} onChange={(e) => this.onLatChange(e)} required type="text" placeholder="lat" />
          <label>Enter longitude:</label>
          <input value={this.state.lon} onChange={(e) => this.onLonChange(e)} required type="text" placeholder="lon" />
          <label>Base name:</label>
          <input onChange={(e) => this.onBaseEnter(e)} required type="text" placeholder="Base name" />
          <label>Enter nearest city</label>
          <input onChange={(e) => this.onCityEnter(e)} required type="text" placeholder="Nearest city" />
          <button className={styles['apply-button']} onClick={() => this.onSubmit()}>Create data</button>
          <div>{this.state.answerFromServer.status}: {this.state.answerFromServer.message}</div>
        </div>
      </div>
    )
  }
}
