import React from 'react'
import T from 'prop-types'
import Navigator from '../Navigator'
import withChildRoutes from '../../decorators/withChildRoutes'
import withStyles from '../../decorators/withStyles'
import style from './ContentWrapper.css'

const ContentWrapper = props =>
  (
    <div className={style.container}>
      <Navigator.Upper location={props.location} />
      <div className={style.content}>
        {props.children}
      </div>
    </div>
  )

ContentWrapper.propTypes = {
  location: T.object.isRequired,
  children: T.element.isRequired,
}

export default withChildRoutes(withStyles(style)(ContentWrapper))
