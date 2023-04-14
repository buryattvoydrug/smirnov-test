import {MouseEvent, useState} from 'react'
import { formItemI } from './Form'
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater'
import { renderAsync } from 'docx-preview';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


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

  const [show, setShow] = useState(false);

  const parseDocx = (content: string | ArrayBuffer | null): ArrayBuffer => {
    const zip = new PizZip(content!);

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
    
    return out
  }

  const handleDownloadDocx = (e: MouseEvent) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.readAsBinaryString(file!);

    reader.onload = (e) => {
      const content = e.target!.result;
      const out = parseDocx(content)
      saveAs(new Blob([out]), "output.docx"); 
    };

    reader.onerror = (error) => console.error(error);
  }

  const handleShowPreview = (e: MouseEvent) => {
    e.preventDefault();
    setShow(true)

    const reader = new FileReader();
    reader.readAsBinaryString(file!);

    reader.onload = (e) => {
      const content = e.target!.result;
      const out = parseDocx(content)

      const renderEl = document.getElementById("container");
      renderAsync(out, renderEl!, renderEl!, {
        inWrapper: false,
        ignoreWidth: true,
        ignoreHeight: true,
      })
    };

    reader.onerror = (error) => console.error(error);
  }


  return (
    <>
      <div>
        <Button variant="primary" disabled={!!!file} className="me-1" onClick={(e) => handleDownloadDocx(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/>
          </svg>
        </Button>
        <Button variant="primary" disabled={!!!file} onClick={handleShowPreview}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
          </svg>
        </Button>

        <section className="preview">
          <Modal show={show} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Предпросмотр</Modal.Title>
            </Modal.Header>
            <Modal.Body id="container">
            </Modal.Body>
          </Modal>
        </section>

      </div>
    </>
  )
}
