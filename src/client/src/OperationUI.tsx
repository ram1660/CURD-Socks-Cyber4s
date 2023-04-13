import React, { Component } from 'react'
import styles from './styles/Operation-UI.module.scss';
type propsTypes = {
  isShow: boolean,
  operationType: string,
  tableToShow: string,
  showCreateCB: (dataToCreate: string) => void,
  showViewCB: (dataToView: string) => void,
  closeOperationUI: () => void,
};

type stateTypes = {
  tableToOperate: string,
};
export default class OperationUI extends Component<propsTypes, stateTypes> {

  private warningMessage: React.RefObject<HTMLDivElement>;

  constructor(props: propsTypes) {
    super(props);
    this.state = {
      tableToOperate: 'default',
    };
    this.warningMessage = React.createRef();
  }

  private onListChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ tableToOperate: e.target.value });
    if (this.warningMessage.current?.classList.contains(styles['play-attention']) === true) {
      this.warningMessage.current?.classList.remove(styles['play-attention']);
      this.warningMessage.current.style.display = 'none';
    }
  }

  private onClick(e: React.MouseEvent<HTMLButtonElement>): void {
    if (this.state.tableToOperate === 'default') {
      this.warningMessage.current!.style.display = 'block';
      this.warningMessage.current?.classList.add(styles['play-attention']);
      return;
    }
    if (this.props.operationType === 'create') {
      this.props.showCreateCB(this.state.tableToOperate);
    } else {
      this.props.showViewCB(this.state.tableToOperate);
    }
  }

  render() {
    return (
      <div className={styles['option-container']} style={this.props.isShow === true ? { display: 'flex' } : { display: 'none' }}>
        <a href='/#' className={styles['exit-button']} onClick={() => this.props.closeOperationUI()}> </a>
        <h4 className='operation-title'>What kind of data do you want to {this.props.operationType}</h4>
        <label htmlFor='data-option'>Choose from the list</label>
        <div>
          <select onChange={(e) => this.onListChange(e)} name='operations-drop-down' className='operations-options' defaultValue='default'>
            <option value='default'>Choose here</option>
            <option value='socks'>Socks</option>
            <option value='officers'>Officers</option>
            <option value='location'>Location</option>
            <option value='location-history'>Location history</option>
          </select>
          <button onClick={(e) => this.onClick(e)} className={styles['apply-create-button']}>Apply</button>
        </div>
        <div ref={this.warningMessage} className={styles['invalid-option']}>
          Invalid option.<br />
          Please choose a valid option.
        </div>
      </div>
    )
  }
}
