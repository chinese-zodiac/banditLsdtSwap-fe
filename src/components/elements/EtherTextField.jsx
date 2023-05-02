import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import React, { useEffect, useRef, useState } from 'react';

function EtherTextField({
  decimals,
  value,
  onChange,
  renderInput,
  autofocus,
  placeholder = '0.00',
  max,
  min,
}) {
  const inputRef = useRef(null);

  const [inputValue, setInputvalue] = useState('');

  // update current value
  useEffect(() => {
    if (!value) {
      setInputvalue('');
    } else {
      let parseInputValue;

      try {
        parseInputValue = parseUnits(inputValue || '0', decimals);
      } catch {
        // do nothing
      }

      if (!parseInputValue || !parseInputValue.eq(value)) {
        setInputvalue(formatUnits(value, decimals));
      }
    }
  }, [value, decimals, inputValue]);

  React.useEffect(() => {
    if (!renderInput && autofocus && inputRef) {
      const node = inputRef.current;
      node.focus();
    }
  }, [autofocus, inputRef]);

  const updateValue = (event) => {
    const { value } = event.currentTarget;

    if (value === '') {
      onChange(value);
      setInputvalue(value);
      return;
    }

    let newValue;
    try {
      newValue = parseUnits(value, decimals);
    } catch (e) {
      // don't update the input on invalid values
      return;
    }

    const invalidValue = (min && newValue.lt(min)) || (max && newValue.gt(max));
    if (invalidValue) {
      return;
    }

    setInputvalue(value);
    onChange(newValue.toString());
  };

  const inputProps = {
    placeholder,
    onChange: updateValue,
    type: 'text',
    value: inputValue,
  };

  return renderInput ? (
    renderInput({ ...inputProps })
  ) : (
    <input {...inputProps} ref={inputRef} />
  );
}

export default EtherTextField;
