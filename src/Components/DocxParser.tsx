import React, {MouseEvent, useState} from 'react'
import { formItemI } from './Form'
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater'
import Preview from './Preview';

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
      // console.log(doc.getFullText())

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
      <div className="">
        <button className="btn btn-primary text-white me-1" onClick={(e) => handleParseDocx(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/>
          </svg>
        </button>
        <Preview file={file}/>
      </div>
    </>
  )
}
