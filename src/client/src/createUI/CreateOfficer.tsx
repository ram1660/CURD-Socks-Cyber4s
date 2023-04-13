import React, { Component } from 'react'
import { Officer, ServerAnswer, createOfficer } from '../serverHandler'
import styles from '../styles/Create-UI.module.scss';

type propsTypes = {
  closeCreateUI: () => void
}

type stateTypes = {
  phoneNumber: string;
  officerId: string;
  officerName: string;
  email: string;
  answerFromServer: ServerAnswer;
}
export default class CreateOfficer extends Component<propsTypes, stateTypes> {

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
    const answer = await createOfficer(officerData);
    this.setState({ answerFromServer: answer })
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      answerFromServer: { message: '', status: '' },
      phoneNumber: '',
      officerId: '',
      officerName: '',
      email: ''
    });
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
      <div>
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
          <button className={styles['apply-button']} onClick={() => this.onSubmit()}>Create data</button>
          <div>{this.state.answerFromServer.status}: {this.state.answerFromServer.message}</div>
        </div>
      </div>
    )
  }
}
