import { useRef } from "react";

const InputText = (props) => {
  return (
    <div className="form-group">
      <h5>{props.label}</h5>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.type}
        className={`form-control ${
          props.error && props.showError ? "is-invalid" : ""
        }`}
      />
      <div className="invalid-feedback">{props.error}</div>
    </div>
  );
};

const InputSelect = (props) => {
  return (
    <div className="form-group">
      <h5>{props.label}</h5>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={`form-control ${
          props.error && props.showError ? "is-invalid" : ""
        }`}
      >
        {props.options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="invalid-feedback">{props.error}</div>
    </div>
  );
};

const InputCheckbox = (props) => {
  const changeFeatureHandler = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      const newValue = [...props.value, value];
      props.onChange(newValue);
    } else {
      const newValue = props.value.filter((x) => x !== value);
      props.onChange(newValue);
    }
  };

  return (
    <div className="form-group">
      {props.options.map((option) => (
        <div className="custom-control custom-checkbox" key={option.value}>
          <input
            type="checkbox"
            className="custom-control-input"
            id={option.value}
            value={option.value}
            onChange={changeFeatureHandler}
            checked={props.value.find((x) => x === option.value) || false}
          />
          <label className="custom-control-label" htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

const InputFile = (props) => {
  const fileRef = useRef();
  const changeHandler = (e) => {
    props.onChange(e.target.files[0]);
  };

  return (
    <div className="form-group">
      <input type="file" onChange={changeHandler} ref={props.fileRef} />
    </div>
  );
};

const InputRadio = (props) => {
  return (
    <div className="form-group">
      <h5>{props.label}</h5>
      {props.options.map((option) => (
        <div className="custom-control custom-radio" key={option.value}>
          <input
            type="radio"
            id={`radio-${option.value}-${props.name}`}
            name={props.name}
            value={option.value}
            onChange={(e) => props.onChange(e.target.value)}
            checked={props.value === option.value}
            className="custom-control-input"
          />
          <label
            className="custom-control-label"
            htmlFor={`radio-${option.value}-${props.name}`}
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

const InputTextarea = (props) => {
  return (
    <div className="form-group">
      <h5>{props.label}</h5>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.type}
        className={`form-control ${
          props.error && props.showError ? "is-invalid" : ""
        }`}
      />
      <div className="invalid-feedback">{props.error}</div>
    </div>
  );
};

const InputDoubleObject = (props) => {
  return (
    <div>
      <h5>{props.label}</h5>
      {props.form.value.length > 0 && (
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Nazwa</th>
              <th scope="col">{props.ilosc}</th>
              <th scope="col">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {props.form.value.map((alcohol, index) => (
              <tr key={index}>
                <th scope="col">{index + 1}</th>
                <th scope="col">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    id={`alcoholName-${index}`}
                    name="name"
                    value={alcohol.name}
                    onChange={(e) =>
                      props.handleInputChange(props.field, index, e)
                    }
                  />
                </th>
                <th scope="col">
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    id={`alcoholMl-${index}`}
                    name="ml"
                    value={alcohol.ml}
                    onChange={(e) =>
                      props.handleInputChange(props.field, index, e)
                    }
                  />
                </th>
                <th scope="col">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      props.handleRemoveAlcohol(props.field, index)
                    }
                  >
                    Usuń
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        type="button"
        className="btn btn-primary mb-2"
        onClick={() => props.handleAddAlcohol(props.field)}
      >
        {props.button}
      </button>
    </div>
  );
};

function Input(props) {
  switch (props.type) {
    case "select":
      return <InputSelect {...props} />;
    case "password":
      return <InputText {...props} type="password" />;
    case "email":
      return <InputText {...props} type="email" />;
    case "number":
      return <InputText {...props} type="number" />;
    case "checkbox":
      return <InputCheckbox {...props} />;
    case "file":
      return <InputFile {...props} />;
    case "radio":
      return <InputRadio {...props} />;
    case "textarea":
      return <InputTextarea {...props} />;
    case "doubleObject":
      return <InputDoubleObject {...props} />;
    default:
      return <InputText {...props} />;
  }
}

Input.defaultProps = {
  type: "text",
  isValid: false,
  showError: false,
};

export default Input;
