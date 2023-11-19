import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import Input from "../../../../components/Input/Input";
import { validate } from "../../../../helpers/validations";
import LoadingButton from "../../../../UI/LoadingButton/LoadingButton";

const DrinkForm = (props) => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: {
      value: "",
      error: "",
      showError: "",
      rules: ["required", { rule: "min", length: 4 }],
    },
    description: {
      value: "",
      error: "",
      showError: "",
      rules: ["required", { rule: "min", length: 10 }],
    },
    type: {
      value: "shot",
      error: "",
      showError: "",
      rules: ["required"],
    },
    alcohols: {
      value: [],
      error: "",
      showError: "",
      rules: ["required"],
    },
    fillers: {
      value: [],
      error: "",
      showError: "",
      rules: ["required"],
    },
    accessories: {
      value: [],
      error: "",
      showError: "",
      rules: ["required"],
    },
    image: {
      value: "",
      error: "",
      showError: "",
      rules: ["required"],
    },
    glass: {
      value: "low",
      error: "",
      showError: "",
      rules: ["required"],
    },
    method: {
      value: "shake",
      error: "",
      showError: "",
      rules: ["required"],
    },
    status: {
      value: "1",
      error: "",
      showError: "",
      rules: ["required"],
    },
    price: {
      value: 0,
      error: "",
      showError: "",
      rules: ["required"],
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      props.onSubmit({
        name: form.name.value,
        type: form.type.value,
        image: form.image.value,
        description: form.description.value,
        alcohols: form.alcohols.value,
        fillers: form.fillers.value,
        accessories: form.accessories.value,
        glass: form.glass.value,
        method: form.method.value,
        status: form.status.value,
        price: form.price.value,
        user_id: auth.userId,
        
      });
    } catch (ex) {
      alert(JSON.stringify(ex));
      setLoading(false);
    }
  };

  const changeHandler = (value, fieldName) => {
    const error = validate(form[fieldName].rules, value);
    setForm({
      ...form,
      [fieldName]: {
        ...form[fieldName],
        value,
        showError: true,
        error: error,
      },
    });
  };

  useEffect(() => {
    const newForm = { ...form };
    for (const key in props.drink) {
      newForm[key].value = props.drink[key];
    }
    setForm(newForm);
  }, [props.drink]);

  const handleInputChange = (fieldName, index, e) => {
    const { name, value } = e.target;
    const updatedAlcoholData = [...form[fieldName].value];
    updatedAlcoholData[index][name] = value;
    setForm({
      ...form,
      fieldName: {
        ...form[fieldName],
        value: updatedAlcoholData,
        showError: true,
        error: "",
      },
    });
  };

  const handleAddField = (fieldName) => {
    setForm((prevForm) => {
      const updatedValue = [...prevForm[fieldName].value, { name: "", ml: 0 }];
      return {
        ...prevForm,
        [fieldName]: {
          ...prevForm[fieldName],
          value: updatedValue,
        },
      };
    });
  };

  const handleRemoveInput = (fieldName, index) => {
    const updatedAlcoholData = [...form[fieldName].value];
    updatedAlcoholData.splice(index, 1);
    setForm({
      ...form,
      [fieldName]: {
        ...form[fieldName],
        value: updatedAlcoholData,
      },
    });
  };

  return (
    <form onSubmit={submit}>
      <Input
        label="Nazwa"
        value={form.name.value}
        onChange={(value) => changeHandler(value, "name")}
        error={form.name.error}
        showError={form.name.showError}
      />

      <Input
        label="Rodzaj drinka"
        type="select"
        value={form.type.value}
        onChange={(value) => changeHandler(value, "type")}
        options={[
          { value: "shot", label: "Shot" },
          { value: "short", label: "Short" },
          { value: "long", label: "Long" },
          { value: "premium", label: "Premium" },
        ]}
        error={form.type.error}
        showError={form.type.showError}
      />

      <Input
        label="Zdjęcie"
        type="text"
        value={form.image.value}
        onChange={(value) => changeHandler(value, "image")}
        error={form.image.error}
        showError={form.image.showError}
      />

      <Input
        label="Opis"
        type="textarea"
        value={form.description.value}
        onChange={(value) => changeHandler(value, "description")}
        error={form.description.error}
        showError={form.description.showError}
      />

      <Input
        label="Alkohole"
        button="Dodaj Alkohol"
        type="doubleObject"
        field="alcohols"
        ilosc="Mililitry"
        form={form.alcohols}
        handleInputChange={handleInputChange}
        handleAddAlcohol={handleAddField}
        handleRemoveAlcohol={handleRemoveInput}
        error={form.alcohols.error}
        showError={form.alcohols.showError}
      />

      <Input
        label="Napoje"
        button="Dodaj Napój"
        type="doubleObject"
        field="fillers"
        ilosc="Mililitry"
        form={form.fillers}
        handleInputChange={handleInputChange}
        handleAddAlcohol={handleAddField}
        handleRemoveAlcohol={handleRemoveInput}
        error={form.fillers.error}
        showError={form.fillers.showError}
      />

      <Input
        label="Dodatki"
        button="Dodaj Dodatek"
        type="doubleObject"
        field="accessories"
        ilosc="Ilość"
        form={form.accessories}
        handleInputChange={handleInputChange}
        handleAddAlcohol={handleAddField}
        handleRemoveAlcohol={handleRemoveInput}
        error={form.accessories.error}
        showError={form.accessories.showError}
      />

      <Input
        label="Szkło"
        type="radio"
        name="glass"
        value={form.glass.value}
        onChange={(value) => changeHandler(value, "glass")}
        options={[
          { value: "low", label: "Niskie" },
          { value: "high", label: "Wysokie" },
          { value: "wine", label: "Kieliszek" },
        ]}
        error={form.glass.error}
        showError={form.glass.showError}
      />

      <Input
        label="Podanie"
        type="radio"
        name="method"
        value={form.method.value}
        onChange={(value) => changeHandler(value, "method")}
        options={[
          { value: "shake", label: "Wstrząsnięte" },
          { value: "mix", label: "Zmieszane" },
        ]}
        error={form.method.error}
        showError={form.method.showError}
      />

      <Input
        label="Status"
        type="radio"
        name="status"
        value={form.status.value}
        onChange={(value) => changeHandler(value, "status")}
        options={[
          { value: "1", label: "Dostępny" },
          { value: "0", label: "Niedostępny" },
        ]}
        error={form.status.error}
        showError={form.status.showError}
      />

      <Input
        label="Cena"
        type="number"
        value={form.price.value}
        onChange={(value) => changeHandler(value, "price")}
        error={form.price.error}
        showError={form.price.showError}
      />

      <div className="text-right">
        <LoadingButton loading={loading} className="btn-success">
          {props.buttonText}
        </LoadingButton>
      </div>
    </form>
  );
};

export default DrinkForm;
