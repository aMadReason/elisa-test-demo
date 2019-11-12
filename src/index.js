import React from "react";
import ReactDOM from "react-dom";
import { samples } from "./data";
import {
  calculateDilutionFactor,
  calculateDilutionSeries,
  getTimerMins,
  roundPrecision,
  timeModifier
} from "./functions";
import "./styles.css";

import SampleSelect from "./SampleSelect";

// function getPlates(sample) {
//   return Object.keys(sample.plates);
// }

// function getSubjectIds(samples) {
//   return samples.map(i => i.subject);
// }

// function getSampleBySubject(samples, subjectId) {
//   return samples.find(i => i.subject === subjectId);
// }

// const plates = getPlates(samples[0]);
// const subjectIds = getSubjectIds(samples);

// console.log(plates, subjectIds);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.samples = props.samples;
    this.plates = this.samples && Object.keys(this.samples[0].plates);
    this.logRef = null;

    this.waveLengths = {
      "450nm": "1.0",
      "520nm": "0.4",
      "544nm": "0.2",
      "590nm": "0.14",
      "645nm": "0.11"
    };

    this.state = {
      primaryEfficiencyFactor: 1.0,
      dilutionFactor: null,
      //dilutionSeries: [],
      inputVolume: 100,
      plate: null,
      //secondaryAntibody: null,
      selectedSamples: {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
        f: null,
        g: null,
        h: null
      },
      timer: null,
      timerOn: false,
      timerStamp: null,
      displayStamp: null,
      log: [],
      dilutionResults: null,
      primaryResults: null,
      phase: "primaryExposure",
      phases: {
        primaryExposure: null,
        primaryWash: null,
        secondaryExposure: null,
        secondaryWash: null
      }
    };
  }

  componentDidMount() {
    const {
      plate,
      selectedSamples,
      primaryEfficiencyFactor: pef,
      dilutionFactor: df
    } = this.state;

    const dilutionFactor = calculateDilutionFactor(this.state.inputVolume);
    const dilutionResults = this.generateAssayDilutions(
      plate,
      selectedSamples,
      df,
      pef
    );

    this.setState({
      dilutionFactor,
      dilutionResults,
      primaryResults: { ...dilutionResults }
    });
  }

  logStep(step) {
    const { log } = this.state;
    const message = {
      default: ``,
      wait: `Waited ${getTimerMins(step.displayStamp)} minutes.`,
      acid: `Acid applied.`
    }[step.action || "default"];
    log.push({ ...step, action: step.action, message });
    this.setState({ log }, () => {
      this.logRef.scrollTop = this.logRef.scrollHeight;
    });
  }

  handleWait() {
    const { timerOn, timerStamp, displayStamp } = this.state;
    const start = +new Date();

    if (timerOn === true) {
      this.logStep({ action: "wait", timerStamp, displayStamp });
      return this.setState({
        timer: clearInterval(this.state.timer),
        timerOn: false,
        displayStamp: null
      });
    }

    this.setState({
      start,
      timer: setInterval(() => this.handleCountupFast(), 150),
      timerOn: true,
      displayStamp: null
    });
  }

  handleCountupFast() {
    const {
      timerStamp,
      displayStamp,
      phase,
      phases,
      dilutionResults,
      primaryResults
    } = this.state;
    const stamp = timerStamp + 20 * 1000;
    const display = displayStamp + 20 * 1000;

    let prime = null;

    if (phase === "primaryExposure" && phases[phase] !== null) {
      prime = this.generateAssayPrimePhase(dilutionResults, phases[phase]);
    }

    console.log(prime);

    this.setState({
      timerStamp: stamp,
      displayStamp: display,
      phases: {
        ...phases,
        [phase]: stamp
      },
      primaryResults: prime || primaryResults
    });
  }

  generateAssayPrimePhase(diluteAssay, timestamp) {
    const results = { ...diluteAssay };
    Object.keys(results).map(i => {
      const cell = results[i].map(c => timeModifier(c, timestamp));
      return (results[i] = cell);
    });
    return results;
  }

  generateAssayDilutions(
    plate,
    selectedSamples = {},
    dilutionFactor,
    primaryEfficiencyFactor
  ) {
    const results = {};
    Object.keys(selectedSamples).map(i => {
      if (selectedSamples[i] && plate && dilutionFactor) {
        const value = selectedSamples[i].plates[plate];
        return (results[i] = calculateDilutionSeries(
          value,
          dilutionFactor,
          primaryEfficiencyFactor
        ));
      }
      return (results[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    return results;
  }

  handleSelectPlate(e) {
    const {
      selectedSamples,
      primaryEfficiencyFactor: pef,
      dilutionFactor: df
    } = this.state;

    const plate = e.target.value;

    const dilutionResults = this.generateAssayDilutions(
      plate,
      selectedSamples,
      df,
      pef
    );

    this.setState({ plate, dilutionResults });
  }

  handleSelectSample(key, subject) {
    const {
      plate,
      selectedSamples,
      primaryEfficiencyFactor: pef,
      dilutionFactor: df
    } = this.state;

    const sample = this.samples.find(
      i => i.subject.toString() === subject.toString()
    );
    const samples = { ...selectedSamples, [key]: sample };
    const dilutionResults = this.generateAssayDilutions(
      plate,
      samples,
      df,
      pef
    );
    this.setState({ selectedSamples: samples, dilutionResults });
  }

  handleDilutionVolume(e) {
    const {
      plate,
      selectedSamples: samples,
      primaryEfficiencyFactor: pef
    } = this.state;
    const dilutionFactor = calculateDilutionFactor(+e.target.value);
    const dilutionResults = this.generateAssayDilutions(
      plate,
      samples,
      dilutionFactor,
      pef
    );
    this.setState({
      inputVolume: +e.target.value,
      dilutionFactor,
      dilutionResults
    });
  }

  processDilutions() {
    const { dilutionResults, phase, phases } = this.state;

    //const assay = this.generateAssayDilutions(plate, samples, df, pef);

    let result = { ...dilutionResults };

    if (phase === "primaryExposure" && phases[phase] !== null) {
      result = this.generateAssayPrimePhase(result, phases[phase]);
    }

    // handle primary antibody waits

    // const primaryWaits = log.filter(i => i.action === "wait");
    // if (primaryWaits.length > 0) {
    //   const primeWait = primaryWaits.reduce(
    //     (total, curr) => total + curr.timerStamp,
    //     0
    //   );
    //   assay = this.generateAssayPrimePhase(assay, primeWait);
    // }

    // handle secondary antibody waits

    console.log(result);
    return result;

    //this.setState({ results: assay });
  }

  renderResultTable(values) {
    const keys = Object.keys(values);

    console.log("values", keys);

    return (
      <table style={{ fontSize: ".8rem" }}>
        <tbody>
          {keys.map(k => (
            <tr key={k}>
              {values[k].map((cell, idx) => (
                // <td key={idx}>{roundPrecision(cell, 2)}</td>
                <td key={idx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderTime(stamp) {
    return `${getTimerMins(stamp)} min`;
  }

  render() {
    const { plates, samples } = this;
    const {
      plate,
      selectedSamples,
      dilutionFactor,
      timerOn,
      displayStamp,
      log,
      dilutionResults,
      primaryResults
    } = this.state;
    const sampleKeys = Object.keys(selectedSamples);

    //const results = this.processDilutions(); //

    return (
      <div className="app-container">
        <fieldset>
          <legend>Developer Constants</legend>
          <label>
            Primary Efficiency Factor{" "}
            <input
              type="number"
              defaultValue={this.state.primaryEfficiencyFactor}
              onInput={e =>
                this.setState({ primaryEfficiencyFactor: e.target.value })
              }
            />
          </label>
        </fieldset>

        <div>
          <button
            // disabled={acidApplied}
            aria-pressed={timerOn}
            onClick={({ nativeEvent }) => this.handleWait(nativeEvent)}
          >
            {timerOn ? "Wait Stop" : "Wait Start"}
          </button>
          <span>{this.renderTime(displayStamp)}</span>
        </div>

        <div style={{ maxWidth: "50%" }}>
          <fieldset>
            <legend>Step 1: Select Patients</legend>
            {sampleKeys.map(i => (
              <div key={i}>
                Select Patient {i.toLocaleUpperCase()}{" "}
                <SampleSelect
                  sampleKey={i}
                  samples={samples}
                  handleSelectSample={this.handleSelectSample.bind(this)}
                />
              </div>
            ))}
          </fieldset>
        </div>

        <div style={{ maxWidth: "50%" }}>
          <fieldset>
            <legend>Step 2: Dilution</legend>
            Volume to transfer in a dilution series{" "}
            <input
              type="number"
              defaultValue={this.state.inputVolume}
              onInput={e => this.handleDilutionVolume(e)}
            />{" "}
            {dilutionFactor && <small>Dilution Factor: {dilutionFactor}</small>}
          </fieldset>

          <fieldset>
            <legend>Step 3.1: Select Plate</legend>
            <select onChange={e => this.handleSelectPlate(e)}>
              <option>Select...</option>
              {plates.map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>{" "}
            {plate || ""}
          </fieldset>
        </div>

        <fieldset>
          <legend>Step 3.2: Antibody Exposure & wash</legend>
        </fieldset>

        <hr />

        <div style={{ maxWidth: "100%" }}>
          <strong>Dilutions</strong>
          {dilutionResults && this.renderResultTable(dilutionResults)}
        </div>

        <div style={{ maxWidth: "100%" }}>
          <strong>Primary Exposure</strong>
          {primaryResults && this.renderResultTable(primaryResults)}
        </div>

        <div style={{ maxWidth: "50%" }}>
          <div className="logger" ref={me => (this.logRef = me)}>
            {log.map((step, i) => (
              <div key={`step-${i}`}>{step.message}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App samples={samples} />, rootElement);
