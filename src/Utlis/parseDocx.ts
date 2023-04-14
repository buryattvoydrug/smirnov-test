import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater'
import { formItemI } from "../Components/Form";

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

export const parseDocx = (file: File, formItems: formItemI[]) => {
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
      type: "arraybuffer",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    
    saveAs(new Blob([out]), "output.docx"); 
  };

  reader.onerror = (error) => console.error(error);

}