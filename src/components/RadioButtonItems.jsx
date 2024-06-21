import "../stylesheet/Radio.css";

function RadioButtonItems({ handleChange, checkedValue, items }) {
  return (
    <div className="items-container">
      {items.map((item) => (
        <label key={item.id}>
          <input
            className="radio-item"
            type="radio"
            id={item.id}
            name="item"
            value={item.item}
            checked={checkedValue === item.item}
            onChange={handleChange}
          />
          {item.item}
        </label>
      ))}
    </div>
  );
}

export default RadioButtonItems;
