import React, { Component } from 'react'
import style  from './styles/Title.module.scss';
export default class Title extends Component {
  render() {
    return (
      <header>
        <h1 className={style['website-title']}>The super secret socks project</h1>
      </header>
    )
  }
}
