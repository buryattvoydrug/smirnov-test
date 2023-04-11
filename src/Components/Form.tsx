import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import FormItem from './FormItem'
import PizZip from "pizzip";
import { v4 as uuid } from 'uuid';
import DocxReader from './DocxReader';

export interface formItemI {
  id: string,
  variable: string,
  value: string,
}

export default function Form() {

  function str2xml(str: string) {
    if (str.charCodeAt(0) === 65279) {
      // BOM sequence
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  }

  function getParagraphs(content: string) {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
  
    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
  }

  const [file, setFile] = useState<any>()
  const [formItems, setFormItems] = useState<Array<formItemI>>([{
    id: uuid(),
    variable: '',
    value: '',
  }])

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      console.log(e.currentTarget.files[0])
      let reader = new FileReader();
      reader.readAsBinaryString(e.currentTarget.files[0])

      reader.onload = () => {
        // console.log(getParagraphs(reader.result))
      }

    }
  }

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


  return (
    <>
    <section className="form pb-5">
      <div className="container">
        <form>
          <div className="form-group row my-3">
            <label htmlFor="fileForm">Исходный файл</label>
            <input type="file" className="form-control-file" id="fileForm" value={file} onChange={handleChangeFile}/>
            <small id="fileFormHelp" className="form-text text-muted">Прикрепите исходный файл, который необходимо заполнить.</small>
          </div>
        </form>
        <DocxReader/>
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
            <button type="submit" className="btn btn-primary text-white">Получить файл</button>
          </div>
        </form>
      </div>
    </section>
    </>
  )
}
