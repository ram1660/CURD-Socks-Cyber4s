import React, { Component } from 'react'
import style from './styles/Operation-Buttons.module.scss';

export default class OperationButtons extends Component<{ onOperationButtonClick: (isCreate: string) => void }, {}> {

  render() {
    return (
      <div className={style['buttons-container']}>
        <button className={style['operation-btn']} onClick={
          (e) => this.props.onOperationButtonClick('create')
        }>Create new data</button>
        <button className={style['operation-btn']} onClick={(e) => this.props.onOperationButtonClick('view')
        }>View data</button>
      </div>
    )
  }
}
