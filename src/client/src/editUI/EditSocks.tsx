import React, { Component } from 'react'
import { getIds, ServerAnswer, Socks, TableTypes, updateSocks } from '../serverHandler';
import styles from '../styles/Create-UI.module.scss';

type propsTypes = {
    closeCreateUI: () => void,
    id: string
}

type stateTypes = {
    manufacturingDate: Date;
    size: number;
    chosenOfficerId: string;
    quantity: number;
    officerIDs: string[];
    locationIDs: string[];
    answerFromServer: ServerAnswer;
    model: string;
    chosenLocationId: string;
}

export default class EditSocks extends Component<propsTypes, stateTypes> {

    constructor(props: any) {
        super(props);
        this.state = {
            answerFromServer: { message: '', status: '' },
            chosenLocationId: '',
            chosenOfficerId: '',
            locationIDs: [],
            officerIDs: [],
            manufacturingDate: new Date('invalid date'),
            model: '',
            quantity: 0,
            size: 0
        }
    }

    async componentDidMount() {
        const locationsIds = await getIds(TableTypes.Locations);
        const officerIds = await getIds(TableTypes.Officer);
    
        this.setState({
          officerIDs: officerIds.length === 0 ? ['No officers IDs available'] : locationsIds,
          locationIDs: officerIds.length === 0 ? ['No locations IDs available'] : officerIds,
          chosenLocationId: locationsIds.length === 0 ? '-1' : locationsIds[0],
          chosenOfficerId: officerIds.length === 0 ? '-1' : officerIds[0]
        });
    }

    private onManufacturingChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ manufacturingDate: e.target.valueAsDate || new Date() });
        this.setState({ answerFromServer: { status: '', message: '' } });
    }

    private onOfficerSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({ chosenOfficerId: e.target.value });
    }

    private onLocationSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({ chosenLocationId: e.target.value });
    }

    private onModelChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ model: e.target.value });
    }
    private onQuantityChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = Number(e.target.value);
        if (value <= 0 && Number.isInteger(value)) {
            return;
        }
        this.setState({ quantity: parseInt(e.target.value, 10) });
    }
    private onSizeChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = Number(e.target.value);
        if (value <= 0 && Number.isInteger(value)) {
            return;
        }
        this.setState({ size: parseInt(e.target.value, 10) });
    }

    private async onSubmit(): Promise<void> {
        // Validates dates and ids
        if (Number.isInteger(Number(this.state.chosenLocationId)) === false || Number.isInteger(Number(this.state.chosenOfficerId)) === false ||
          isNaN(this.state.manufacturingDate.valueOf()) || this.state.model === '') {
          this.setState({ answerFromServer: { status: 'Error', message: 'Your data is not valid or fully filled please fix it.' } });
          return;
        }
        const locationHistoryData: Socks = {
          army_identity_number: this.state.chosenOfficerId,
          location_id: this.state.chosenLocationId,
          manufacturing_year: this.state.manufacturingDate,
          model: this.state.model,
          size: this.state.size,
          quantity: this.state.quantity,
    
        };
        const answer = await updateSocks(locationHistoryData, this.props.id);
        this.setState({ answerFromServer: answer });
      }

    render() {
        return (
            <div className={styles['option-container']}>
                <a href='/#' className={styles['exit-button']} onClick={() => this.props.closeCreateUI()}> </a>
                <label>Model:</label>
                <input onChange={(e) => this.onModelChange(e)} required type="text" placeholder="Model name" />
                <label>Quantity:</label>
                <input onChange={(e) => this.onQuantityChange(e)} value={this.state.quantity} required type="number" placeholder="Quantity number" />
                <label>Size:</label>
                <input onChange={(e) => this.onSizeChange(e)} value={this.state.size} required type="number" placeholder="Size number" />
                <label>Manufacturing year</label>
                <input onChange={(e) => this.onManufacturingChange(e)} required type="date"
                    placeholder="Manufacturing Year" />
                <label htmlFor="location ID">Choose location ID</label>
                <select onChange={(e) => this.onLocationSelect(e)} name="locationId" >
                    {this.state.locationIDs.map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
                <label htmlFor="officer ID">Choose officer ID</label>
                <select onChange={(e) => this.onOfficerSelect(e)} name="officerId">
                    {this.state.officerIDs.map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
                <button className={styles['apply-button']} onClick={() => this.onSubmit()}>Change socks</button>
                <div>{this.state.answerFromServer.status}: {this.state.answerFromServer.message}</div>            </div>
        )
    }
}
