import React from 'react'
import '../styles/style.css'
function Button(props) {
  return (
    <button className='addTaxBtn' type={props.type} onClick={props.onClick}>{props.children}</button>
  )
}

export default Button