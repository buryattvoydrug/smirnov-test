import { ChangeEvent, MouseEvent, useState } from 'react'
import FormItem from './FormItem'
import { v4 as uuid } from 'uuid';
import DocxReader from './DocxReader';
import DocxParser from './DocxParser';
import { Button } from 'react-bootstrap';

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
            <div>
              <Button className="me-1" variant="info" onClick={(e) => handleAddFormItem(e)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </Button>
              <Button className="me-1" variant="danger" onClick={(e) => handleDeleteLastFormItem(e)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                </svg>
              </Button>
            </div>
            <DocxParser file={file} formItems={formItems}/>
          </div>
        </form>
      </div>
    </section>
    
    </>
  )
}
