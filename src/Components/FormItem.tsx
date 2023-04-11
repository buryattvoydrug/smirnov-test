import React from 'react'
import { formItemI } from './Form'

export default function FormItem({item, handleChange}: {
  item: formItemI, 
  handleChange: (item: formItemI) => void,
}) {
  return (
    <>
    <div className="form-item row">
      <div className="form-group my-1 col-md-5">
        <input 
          type="text" 
          className="form-control" 
          value={item.variable} 
          onChange={(e) => handleChange({
            ...item,
            variable: e.currentTarget.value, 
          })}
          placeholder="Введите название переменной"/>
      </div>
      <div className="form-group my-1 col-md-7">
        <input 
          type="text" 
          className="form-control" 
          value={item.value} 
          onChange={(e) => handleChange({
            ...item,
            value: e.currentTarget.value, 
          })}
          placeholder="Введите значение переменной"/>
      </div>
    </div>
    <hr />
    </>
  )
}
