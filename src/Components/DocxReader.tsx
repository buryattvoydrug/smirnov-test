import { ChangeEvent} from "react";



const DocxReader = ({handleChangeFile} : {
  handleChangeFile: (event: ChangeEvent<HTMLInputElement>) => void
}) => {

  return (
    <>
      <form>
        <div className="form-group row my-3">
          <label htmlFor="fileForm">Исходный файл</label>
          <input type="file" className="form-control-file" id="fileForm" onChange={handleChangeFile}/>
          <small id="fileFormHelp" className="form-text text-muted">Прикрепите исходный файл, который необходимо заполнить.</small>
        </div>
      </form>
    </>
  );
};

export default DocxReader;