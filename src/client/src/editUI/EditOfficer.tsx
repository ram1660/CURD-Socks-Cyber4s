import React, { Component } from 'react'
import { Officer, ServerAnswer, updateOfficer } from '../serverHandler';
import styles from '../styles/Create-UI.module.scss';

type propsTypes = {
    closeCreateUI: () => void
    id: string
}

type stateTypes = {
    phoneNumber: string;
    officerId: string;
    officerName: string;
    email: string;
    answerFromServer: ServerAnswer;
}

export default class EditOfficer extends Component<propsTypes, stateTypes> {
    constructor(props: any) {
        super(props);
        this.state = {
            answerFromServer: { message: '', status: '' },
            phoneNumber: '',
            officerId: '',
            officerName: '',
            email: ''
        };
    }

    private async onSubmit(): Promise<void> {
        // Validates dates and ids
        if (/\S+@\S+\.\S+/.test(this.state.email) === false || Number.isInteger(Number(this.state.officerId)) === false ||
            Number.isInteger(Number(this.state.phoneNumber)) === false) {
            this.setState({ answerFromServer: { status: 'Error', message: 'Your data is not valid or fully filled please fix it.' } });
            return;
        }
        const officerData: Officer = {
            army_identity_number: this.state.officerId,
            email: this.state.email,
            name: this.state.officerName,
            phone_number: this.state.phoneNumber
        };
        const answer = await updateOfficer(officerData, this.props.id);
        this.setState({ answerFromServer: answer })
    }

    private onPhoneChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (Number.isInteger(Number(e.target.value)) === false) {
            return;
        }
        this.setState({ phoneNumber: e.target.value });
    }

    private onOfficerIdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (Number.isInteger(Number(e.target.value)) === false) {
            return;
        }
        this.setState({ officerId: e.target.value });
    }

    private onEmailEnter(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ email: e.target.value });
    }

    private onNameEnter(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ officerName: e.target.value });
    }

    render() {
        return (
            <div className={styles['option-container']}>
                <a href='/#' className={styles['exit-button']} onClick={() => this.props.closeCreateUI()}> </a>
                <label>Officer name:</label>
                <input onChange={(e) => this.onNameEnter(e)} required type="text" placeholder="Officer name" />
                <label>New officer ID:</label>
                <input onChange={(e) => this.onOfficerIdChange(e)} value={this.state.officerId} required type="text" placeholder="Army ID number" />
                <label>Enter email</label>
                <input onChange={(e) => this.onEmailEnter(e)} required type="text" placeholder="Email" />
                <label>Enter phone number</label>
                <input onChange={(e) => this.onPhoneChange(e)} value={this.state.phoneNumber} required type="text" placeholder="Officer phone number" />
                <button className={styles['apply-button']} onClick={() => this.onSubmit()}>Change officer</button>
                <div>{this.state.answerFromServer.status}: {this.state.answerFromServer.message}</div>
            </div>
        )
    }
}
