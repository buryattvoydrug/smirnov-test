import React, {MouseEvent, useState} from 'react'
import { formItemI } from './Form'
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater'

type RenderOption = {
  [key: string]: string;
};

const getRenderOptions = (formItems: formItemI[]) => {
  const options: RenderOption = {};

  formItems.forEach((formItem) => {
    if (formItem.value) {
      options[formItem.variable] = formItem.value;
    }
  })

  return options;
}

export default function DocxParser({file, formItems} : {
  file: File | undefined, 
  formItems: formItemI[],
}) {

  const handleParseDocx = (e: MouseEvent) => {
    e.preventDefault();
    const reader = new FileReader();

    reader.readAsBinaryString(file!);

    reader.onload = (e) => {
      const content = e.target!.result || '';
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part) => {
            return `{${part.value}}`; 
         }          
      });

      doc.render(getRenderOptions(formItems))

      const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      
      saveAs(out, "output.docx"); 
    };

    reader.onerror = (error) => console.error(error);
  }

  return (
    <>
      <button className="btn btn-primary text-white" onClick={(e) => handleParseDocx(e)}>Получить файл</button>
    </>
  )
}
