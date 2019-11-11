import React from "react";

function SampleSelect(props) {
  return (
    <select
      onChange={e => props.handleSelectSample(props.sampleKey, e.target.value)}
    >
      <option>Select...</option>
      {props.samples.map(i => (
        <option key={i.subject} value={i.subject}>
          {i.subject}
        </option>
      ))}
    </select>
  );
}

export default SampleSelect;
