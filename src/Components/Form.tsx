import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import FormItem from './FormItem'
import PizZip from "pizzip";
import { v4 as uuid } from 'uuid';
import DocxReader from './DocxReader';
import DocxParser from './DocxParser';

export interface formItemI {
  id: string,
  variable: string,
  value: string,
}

export default function Form() {

  const [file, setFile] = useState<File | undefined>()
  const [formItems, setFormItems] = useState<Array<formItemI>>([{
    id: uuid(),
    variable: '',
    value: '',
  }])

  const handleAddFormItem = (e: MouseEvent) => {
    e.preventDefault();
    setFormItems(prev => [
      ...prev,
      {
        id: uuid(),
        variable: '',
        value: '',
      }
    ]);
  }

  const handleDeleteLastFormItem = (e: MouseEvent) => {
    e.preventDefault();
    setFormItems(prev => {
      if (formItems.length === 1) return prev;
      return prev.slice(0, -1);
    });
  }

  const handleChangeFormItem = (item: formItemI) => {
    setFormItems(prev => prev.map((prevItem) => {
      if (prevItem.id === item.id) {
        return item;
      }
      return prevItem
    }))
  }

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];
    setFile(file);
  };

  return (
    <>
    <section className="form pb-5">
      <div className="container">
        <DocxReader handleChangeFile={handleChangeFile}/>
        <form>

          {formItems.map((item) => {
            return (
              <FormItem key={item.id}
                        item={item}
                        handleChange={handleChangeFormItem}
              />
            )
          })}
          
          <div className="button-group d-flex justify-content-between">
            <div className="">
              <button className="btn btn-info me-1 text-white" onClick={(e) => handleAddFormItem(e)}>Добавить</button>
              <button className="btn btn-danger me-1 text-white" onClick={(e) => handleDeleteLastFormItem(e)}>Удалить</button>
            </div>
            <DocxParser file={file} formItems={formItems}/>
          </div>
        </form>
      </div>
    </section>
    </>
  )
}
